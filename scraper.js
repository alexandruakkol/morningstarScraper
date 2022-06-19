const puppeteer = require("puppeteer");
const getDividendAndShares = require("./divsShares");
const getPrice = require("./price");
const scrapeLastestBalanceSheet = require("./balanceSheet");
const scrapeIncomeStatement = require("./incomeStatement");
const computation = require("./computation");

async function constructLastestData(symbol, page) {
  const income = await scrapeIncomeStatement(symbol, puppeteer, page);

  let lastResult = {};
  Object.keys(income).forEach((key) => {
    let last = income[key][income[key].length - 1];
    lastResult[key] = last.value;
  });

  const balance = await scrapeLastestBalanceSheet(symbol, puppeteer, page);

  Object.keys(balance).forEach((key) => {
    last = balance[key][balance[key].length - 1];
    lastResult[key] = last.value;
  });

  const divsShares = await getDividendAndShares(symbol, puppeteer, page);
  lastResult = { ...lastResult, ...divsShares };

  const price = await getPrice(symbol, puppeteer, page);
  lastResult = { symbol: symbol, ...lastResult, price: price };

  //deconstructing
  const { currentAssets, totalLiabilities, shares } = lastResult;

  //netNet calc
  let netNet = "N/A";
  if (currentAssets && totalLiabilities && shares && price) {
    console.log("df");
    netNet = price / ((currentAssets - totalLiabilities) / shares);
  }
  lastResult = { ...lastResult, netNet: netNet };

  console.log(lastResult);
}

let symbol = "AAPL";

async function puppetPageInit() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  return page
};

(async () => {
  constructLastestData(symbol, await puppetPageInit())
})()
//scrapeBalanceSheet(symbol);
//scrapeIncomeStatement(symbol);
//scrapeLastestBalanceSheet(symbol);
//getPrice(symbol)
//getDividendAndShares(symbol);

