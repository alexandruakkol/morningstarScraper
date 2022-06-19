const fetch = require("node-fetch");

async function getTickers() {
  var out = undefined;
  await fetch(
    "https://raw.githubusercontent.com/rreichel3/US-Stock-Symbols/main/all/all_tickers.txt"
  )
    .then((res) => res.text())
    .then((data) => {
      out = Array.from(data.split("\n"));
    })
    .catch((err) => console.log("US symbols fetch error", err));

  return out;
}

module.exports = getTickers;
