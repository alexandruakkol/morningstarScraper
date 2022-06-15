const puppeteer = require("puppeteer");

async function scrapeIncomeStatement(symbol) {
  let url = `http://financials.morningstar.com/income-statement/is.html?t=${symbol}&region=usa&culture=en-US`;
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });
    const data = await page.evaluate(() => {
      let periods = [];
      for (
        let i = 0;
        i < document.querySelector("#Year").childNodes.length;
        i++
      ) {
        periods.push(
          document
            .querySelector("#Year")
            .childNodes[i].innerHTML.replace("<br>", "")
        );
      }

      const codes = [
        { i1: "revenues" },
        { i6: "costOfRevenues" },
        { i10: "grossProfit" },
        { i30: "operatingIncome" },
        { i51: "interestExpense" },
        { i80: "netIncome" },
        { i90: "ebitda" },
      ];
      let tempArray = [];
      let resultObj = {};
      for (let code of codes) {
        for (
          let i = 0;
          i <
          document.querySelector(`#data_${Object.keys(code)[0]}`).childNodes
            .length;
          i++
        ) {
          tempArray.push({
            period: periods[i],
            value: document
              .querySelector(`#data_${Object.keys(code)[0]}`)
              .childNodes[i].getAttribute("rawvalue"),
          });
        }
        resultObj[Object.values(code)[0]] = tempArray;
        tempArray = [];
      }
      console.log("incomeStatement pull successful");

      return resultObj;
    });
    await browser.close();
    return data;
  } catch (err) {
    console.error(err);
  }
}

//this scrapes the 'annual' tab for the historical data
async function scrapeBalanceSheet(symbol) {
  const url = `http://financials.morningstar.com/balance-sheet/bs.html?t=${symbol}&region=usa&culture=en-US`;
  try {
    const browser = await puppeteer.launch();
    const [page] = await browser.pages();

    await page.goto(url, { waitUntil: "networkidle0" });
    const data = await page.evaluate(() => {
      let periods = [];

      for (
        let i = 0;
        i < document.querySelector("#Year").childNodes.length;
        i++
      ) {
        periods.push(
          document
            .querySelector("#Year")
            .childNodes[i].innerHTML.replace("<br>", "")
        );
      }

      const codes = [
        { ttgg1: "cash" },
        { ttg1: "currentAssets" },
        { ttg2: "longtermAssets" },
        { tts1: "totalAssets" },
        { ttgg5: "currentLiabilities" },
        { ttgg6: "longtermLiabilities" },
        { ttg5: "totalLiabilities" },
        { ttg8: "totalStockEquity" },
      ];
      let tempArray = [];
      let resultObj = {};
      for (let code of codes) {
        for (
          let i = 0;
          i <
          document.querySelector(`#data_${Object.keys(code)[0]}`).childNodes
            .length;
          i++
        ) {
          tempArray.push({
            period: periods[i],
            value: document
              .querySelector(`#data_${Object.keys(code)[0]}`)
              .childNodes[i].getAttribute("rawvalue"),
          });
        }
        resultObj[Object.values(code)[0]] = tempArray;
        tempArray = [];
      }
      return resultObj;
    });
    await browser.close();
    return data;
  } catch (err) {
    console.error(err);
  }
}

//this scrapes the 'quarterly' tab for the lastest data
async function scrapeLastestBalanceSheet(symbol) {
  const url = `https://financials.morningstar.com/balance-sheet/bs.html?t=${symbol}&region=usa&culture=en-US`;
  try {
    const browser = await puppeteer.launch({ headless: true });
    const [page] = await browser.pages();

    //page.on('console', message => {return console.log(message)})

    await page.goto(url, { waitUntil: "networkidle0" });

    await page.evaluate(() => SRT_stocFund.ChangeFreq(3, "Quarterly"));
    //TODO variable timeout
    await page.waitForTimeout(1600);

    const data = await page.evaluate(() => {
      let periods = [];

      for (
        let i = 0;
        i < document.querySelector("#Year").childNodes.length;
        i++
      ) {
        periods.push(
          document
            .querySelector("#Year")
            .childNodes[i].innerHTML.replace("<br>", "")
        );
      }

      const codes = [
        { ttgg1: "cash" },
        { ttg1: "currentAssets" },
        { ttg2: "longtermAssets" },
        { tts1: "totalAssets" },
        { ttgg5: "currentLiabilities" },
        { ttgg6: "longtermLiabilities" },
        { ttg5: "totalLiabilities" },
        { ttg8: "totalStockEquity" },
      ];
      let tempArray = [];
      let resultObj = {};
      for (let code of codes) {
        for (
          let i = 0;
          i <
          document.querySelector(`#data_${Object.keys(code)[0]}`).childNodes
            .length;
          i++
        ) {
          tempArray.push({
            period: periods[i],
            value: document
              .querySelector(`#data_${Object.keys(code)[0]}`)
              .childNodes[i].getAttribute("rawvalue"),
          });
        }
        resultObj[Object.values(code)[0]] = tempArray;
        tempArray = [];
      }
      console.log("balanceSheet pull successful");
      return resultObj;
    });
    await browser.close();
    return data;
  } catch (err) {
    console.error(err);
  }
}

async function getPrice(symbol) {
  const url = `http://performance.morningstar.com/stock/performance-return.action?t=${symbol}&region=usa&culture=en-US`;
  try {
    const browser = await puppeteer.launch({ headless: true });
    const [page] = await browser.pages();

    //page.on('console', message => {return console.log(message)})

    await page.goto(url, { waitUntil: "networkidle0" });

    const data = await page.evaluate(() => {
      return document.getElementById("last-price-value").innerHTML;
    });
    console.log("price pull successful");
    await browser.close();
  } catch (err) {
    console.error(err);
  }
}

async function getDividendAndShares(symbol) {
  const url = `http://financials.morningstar.com/ratios/r.html?t=${symbol}&region=usa&culture=en-US`;
  try {
    const browser = await puppeteer.launch({ headless: true });
    const [page] = await browser.pages();

    //page.on('console', message => {return console.log(message)})

    await page.goto(url, { waitUntil: "networkidle0" });

    const data = await page.evaluate(() => {
      resultObj = {};
      if (
        document
          .querySelector("#i6")
          .parentNode.childNodes[0].innerHTML.includes("Dividends")
      ) {
        resultObj.dividend =
          document.querySelector("#i6").parentNode.childNodes[
            document.querySelector("#i6").parentNode.childNodes.length - 1
          ].innerHTML;
      } else {
        resultObj.dividend = "N/A";
      }

      if (
        document
          .querySelector("#i7")
          .parentNode.childNodes[0].innerHTML.includes("Shares")
      ) {
        if (
          document.querySelector("#i7").children[0].innerHTML.includes("Mil")
        ) {
          resultObj.shares =
            document.querySelector("#i7").parentNode.childNodes[
              document.querySelector("#i7").parentNode.childNodes.length - 1
            ].innerHTML;
        } else {
          return "N/A";
        } //returns n/a if there's no Mil in the span
      } else {
        resultObj.shares = "N/A";
      }

      return resultObj;
    });

    console.log("dividend&shares pull successful");
    await browser.close();
    return data
  } catch (err) {
    console.error(err);
  }
}

async function constructLastestData(symbol) {
  const income = await scrapeIncomeStatement(symbol);
  let lastResult = {};
  Object.keys(income).forEach((key) => {
    let last = income[key][income[key].length - 1];
    lastResult[key] = last.value;
  });

  const balance = await scrapeLastestBalanceSheet(symbol);

  console.log(balance);
  Object.keys(balance).forEach((key) => {
    last = balance[key][balance[key].length - 1];
    lastResult[key] = last.value;
  });

  //console.log(lastResult);
}
let symbol = "AAPL";
//scrapeBalanceSheet(symbol);
//scrapeIncomeStatement(symbol);
//scrapeLastestBalanceSheet(symbol);
//getPrice(symbol)
//getDividendAndShares(symbol);
constructLastestData(symbol);
