const puppeteer = require("puppeteer");
const getDividendAndShares = require("./divsShares");
const getPrice = require("./price");
const scrapeLastestBalanceSheet = require("./balanceSheet");
const scrapeIncomeStatement = require("./incomeStatement");
const computation = require("./computation");
const { writeToDb, existsInDb } = require("./dbConnect");
const getTickers = require("./getAllUSTickers");

const overwriteMode = false;
if (overwriteMode) console.log("Overwrite mode");
if (!overwriteMode) console.log("Complete mode");

async function constructLastestData(symbol, page) {
  const income = await scrapeIncomeStatement(symbol, page);

  let lastResult = {};
  try{
  Object.keys(income).forEach((key) => {
    let last = income[key][income[key].length - 1];
    lastResult[key] = last.value;
  });
  }catch(error){
    console.log('data processing #1 error, scraper.js ', error)
  }
  const balance = await scrapeLastestBalanceSheet(symbol, page);

  try{
  Object.keys(balance).forEach((key) => {
    last = balance[key][balance[key].length - 1];
    lastResult[key] = last.value;
  });
  }catch(error){
    console.log('data processing #2 error, scraper.js ', error)
  }
  const divsShares = await getDividendAndShares(symbol, page);
  lastResult = { ...lastResult, ...divsShares };

  const price = await getPrice(symbol, page);
  lastResult = { _id: symbol, ...lastResult, price: price };

  lastResult = computation(lastResult);
  return lastResult;
}

async function puppetPageInit() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  return page;
}

async function scrapeSymbols() {
  symbols = await getTickers();
  const page = await puppetPageInit();
  for (symbol of symbols) {
    console.log(symbol)
    if (!overwriteMode) {
      if (await existsInDb(symbol)) {
        console.log('SKIPPED ', symbol )
        continue;
      } else {
        writeToDb(await constructLastestData(symbol, page));
      }
    } else {
      writeToDb(await constructLastestData(symbol, page));
    }
  }
}

scrapeSymbols();
