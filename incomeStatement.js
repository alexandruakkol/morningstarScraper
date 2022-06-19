
async function scrapeIncomeStatement(symbol, puppeteer, page) {
    let url = `http://financials.morningstar.com/income-statement/is.html?t=${symbol}&region=usa&culture=en-US`;
    try {
     
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
      return data;
    } catch (error) {
      console.error(symbol,'incomeStatement',error);
    }
  }
module.exports =  scrapeIncomeStatement;

 