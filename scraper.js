const puppeteer = require('puppeteer')


symbol = 'AAPL';
let url = `http://financials.morningstar.com/income-statement/is.html?t=${symbol}&region=usa&culture=en-US`;


async function scrape(url){
    console.log(url);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const data = await page.evaluate(() => document.querySelector('#data_i1').childNodes[0].innerHTML);
    await browser.close();
    console.log(data); 
  };

scrape(url);
