const puppeteer = require("puppeteer");
const getDividendAndShares = require("./divsShares");
const getPrice = require("./price");
const scrapeLastestBalanceSheet = require("./balanceSheet");
const scrapeIncomeStatement = require("./incomeStatement");
const computation = require("./computation");
const writeToDb = require("./dbConnect");
const getTickers = require('./getAllUSTickers')

async function constructLastestData(symbol, page) {
  const income = await scrapeIncomeStatement(symbol, page);

  let lastResult = {};
  Object.keys(income).forEach((key) => {
    let last = income[key][income[key].length - 1];
    lastResult[key] = last.value;
  });

  const balance = await scrapeLastestBalanceSheet(symbol, page);

  Object.keys(balance).forEach((key) => {
    last = balance[key][balance[key].length - 1];
    lastResult[key] = last.value;
  });

  const divsShares = await getDividendAndShares(symbol, page);
  lastResult = { ...lastResult, ...divsShares };

  const price = await getPrice(symbol, page);
  lastResult = { _id: symbol, ...lastResult, price: price };

  //processing data via computation.js
  lastResult = computation(lastResult);
  //console.log(lastResult);
  return lastResult;
}

async function puppetPageInit() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  return page;
}


async function scrapeSymbols(){
  symbols = await getTickers();
  for(symbol of symbols){
    writeToDb(await constructLastestData(symbol, await puppetPageInit()));
  }
};

scrapeSymbols()

