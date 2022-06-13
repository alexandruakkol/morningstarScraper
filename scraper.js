const puppeteer = require("puppeteer");

async function scrapeIncomeStatement(symbol) {
  let url = `http://financials.morningstar.com/income-statement/is.html?t=${symbol}&region=usa&culture=en-US`;
  console.log("Getting income statement for", symbol);
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

async function scrapeBalanceSheet(symbol) {
  const url = `http://financials.morningstar.com/balance-sheet/bs.html?t=${symbol}&region=usa&culture=en-US`
  try {
    const browser = await puppeteer.launch();
    const [page] = await browser.pages();

    await page.goto(url, { waitUntil: 'networkidle0' });
    const data = await page.evaluate(() => {
      
      const codes = [
      {'ttgg1':'cash'},
      {'ttg1':'currentAssets'},
      {'ttg2':'longtermAssets'},
      {'tts1':'totalAssets'},
      {'ttgg5':'currentLiabilities'},
      {'ttgg6':'longtermLiabilities'},
      {'ttg5':'totalLiabilities'},
      {'ttg8':'totalStockEquity'},

    ]
    let tempArray = [];
    let resultObj = {};
    for (let code of codes){

      for (let i=0; i<document.querySelector(`#data_${Object.keys(code)[0]}`).childNodes.length; i++){
        tempArray.push(document.querySelector(`#data_${Object.keys(code)[0]}`).childNodes[i].innerHTML)
      }
      resultObj[Object.values(code)[0]] = tempArray;
      tempArray = [];
    }
    return resultObj});

    console.log(data);

    await browser.close();
  } catch (err) {
    console.error(err);
  }
}

async function scrapeLastestBalanceSheet(symbol) {
  const url = `https://financials.morningstar.com/balance-sheet/bs.html?t=${symbol}&region=usa&culture=en-US`
  try {
    const browser = await puppeteer.launch({headless: true});
    const [page] = await browser.pages();

    page.on('console', message => {return console.log(message)})

    await page.goto(url, { waitUntil: 'networkidle0' });

    await page.evaluate(() => SRT_stocFund.ChangeFreq(3,'Quarterly'))
    await page.waitForTimeout(1600); 
    
    const data = await page.evaluate(() => {
      let periods = [];
      
      for (let i=0; i<document.querySelector('#Year').childNodes.length; i++){
        periods.push(document.querySelector('#Year').childNodes[i].innerHTML.replace('<br>',''))}

      const codes = [
      {'ttgg1':'cash'},
      {'ttg1':'currentAssets'},
      {'ttg2':'longtermAssets'},
      {'tts1':'totalAssets'},
      {'ttgg5':'currentLiabilities'},
      {'ttgg6':'longtermLiabilities'},
      {'ttg5':'totalLiabilities'},
      {'ttg8':'totalStockEquity'},
    ]
    let tempArray = [];
    let resultObj = {};
    for (let code of codes){

      for (let i=0; i<document.querySelector(`#data_${Object.keys(code)[0]}`).childNodes.length; i++){
        tempArray.push({"period":periods[i], "value":document.querySelector(`#data_${Object.keys(code)[0]}`).childNodes[i].innerHTML })
      }
      resultObj[Object.values(code)[0]] = tempArray;
      tempArray = [];
    }
    return resultObj});

    console.log(data);

    await browser.close();
  } catch (err) {
    console.error(err);
  }
}
symbol = "AAPL";
//scrapeBalanceSheet(symbol);
//scrapeIncomeStatement(symbol);
scrapeLastestBalanceSheet(symbol)
