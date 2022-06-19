
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