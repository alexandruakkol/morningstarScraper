const puppeteer = require("puppeteer");

async function scrapeIncomeStatement(symbol) {
  let url = `http://financials.morningstar.com/income-statement/is.html?t=${symbol}&region=usa&culture=en-US`;
  console.log("Getting revenues for", symbol);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const data = await page.evaluate(() => {
    const codes = [
      {'i1':'revenues'},
      {'i6':'costOfRevenues'},
      {'i10':'grossProfit'},
      {'i30':'operatingIncome'},
      {'i51':'interestExpense'},
      {'i80':'netIncome'},
      {'i90':'ebitda'}
    ]
    let tempArray = [];
    let resultObj = {};
    for (let code of codes){

      for (let i=0; i<=5; i++){
        tempArray.push(document.querySelector(`#data_${Object.keys(code)[0]}`).childNodes[i].innerHTML)
      }
      resultObj[Object.values(code)[0]] = tempArray;
      tempArray = [];
    }
    return resultObj
    
  });

  await browser.close();
  console.log(data);
}

symbol = "AAPL";
scrapeIncomeStatement(symbol);
