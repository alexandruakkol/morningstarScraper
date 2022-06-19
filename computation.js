function computation(lastResult) {
  //deconstructing input
  const {
    currentAssets,
    totalLiabilities,
    shares,
    price,
    totalStockEquity,
    netIncome,
    dividend,
    ebitda,
    revenues,
    interestExpense,
    longtermLiabilities,
  } = lastResult;

  let result = {};
  let netNet = "N/A";
  let mcap = "N/A";
  let divy = "N/A";
  let roe = "N/A";
  let pe = "N/A";
  let ebitdaMg = "N/A";
  let de = "N/A";
  let interestRate = "N/A";

  //netNet
  if (currentAssets && totalLiabilities && shares && price) {
    netNet = (price / ((currentAssets - totalLiabilities) / shares)).toFixed(2);
  }

  //MCap
  if (price && shares) {
    mcap = price * shares;
  }

  //roe
  if (totalStockEquity && netIncome) {
    roe = (netIncome / totalStockEquity).toFixed(2);
  }

  //divy
  if (dividend && price) {
    divy = (dividend / price).toFixed(4);
  }

  //pe
  if (mcap && netIncome) {
    pe = (mcap / netIncome).toFixed(2);
  }

  //ebitdaMg
  if (ebitda && revenues) {
    ebitdaMg = (ebitda / revenues).toFixed(2);
  }

  //de
  if (totalLiabilities && totalStockEquity) {
    de = (totalLiabilities / totalStockEquity).toFixed(2);
  }

  //interestRate
  if (interestExpense && longtermLiabilities) {
    interestRate = (interestExpense / longtermLiabilities).toFixed(2);
  }

  result = {
    ...lastResult,
    netNet: netNet,
    mcap: mcap,
    roe: roe,
    divy: divy,
    pe: pe,
    ebitdaMg: ebitdaMg,
    de:de,
    interestRate:interestRate
  };
  return result;
}

module.exports = computation;
