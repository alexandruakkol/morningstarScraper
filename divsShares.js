async function getDividendAndShares(symbol, puppeteer, page) {
  try{
  const url = `http://financials.morningstar.com/ratios/r.html?t=${symbol}&region=usa&culture=en-US`;
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
            parseInt((document.querySelector("#i7").parentNode.childNodes[
              document.querySelector("#i7").parentNode.childNodes.length - 1
            ].innerHTML).replace(',',''))*1000000;
        } else {
          return "N/A";
        } //returns n/a if there's no Mil in the span
      } else {
        resultObj.shares = "N/A";
      }
      console.log(resultObj);
      return resultObj;
    });
    //await browser.close();
    return data;
  } catch(error){
    console.log(symbol,'divs&shares',error);
  }
}

module.exports = getDividendAndShares;