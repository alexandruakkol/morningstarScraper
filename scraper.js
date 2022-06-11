const puppeteer = require("puppeteer");

async function scrapeIncomeStatement(symbol) {
  let url = `http://financials.morningstar.com/income-statement/is.html?t=${symbol}&region=usa&culture=en-US`;
  console.log("Getting revenues for", symbol);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const data = await page.evaluate(() => {
    let tempArray = [];
    let resultObj = {};
    let codes = ['i1', 'i6'];
    for (let code of codes){

      for (let i=0; i<=5; i++){
        tempArray.push(document.querySelector(`#data_${code}`).childNodes[i].innerHTML)
      }
      resultObj[code] = tempArray;
      tempArray = [];
    }
    return resultObj
    
  });

  await browser.close();
  console.log(data);
}

symbol = "AAPL";
scrapeIncomeStatement(symbol);
