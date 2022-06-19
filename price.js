async function getPrice(symbol, puppeteer, page) {
    const url = `http://performance.morningstar.com/stock/performance-return.action?t=${symbol}&region=usa&culture=en-US`;
      try{
      //page.on('console', message => {return console.log(message)})
  
      await page.goto(url, { waitUntil: "networkidle0" });
  
      const data = await page.evaluate(() => {
        return document.getElementById("last-price-value").innerHTML;
      });
      return data;
    } catch(error){
      console.log(symbol,'price',error);
    }
  }

module.exports =  getPrice;