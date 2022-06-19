function computation (lastResult){
    //deconstructing input
    const { currentAssets, totalLiabilities, shares, price, totalStockEquity, netIncome } = lastResult;

    let result = {};
    let netNet = "N/A";
    let mcap = "N/A";
    let divy = "N/A";
    let roe = "N/A";
    let pe = "N/A";
    let ebitdamg = "N/A";
    let de = "N/A";
    let interestrate = "N/A";

    //netNet
    if (currentAssets && totalLiabilities && shares && price) {
      netNet = (price / ((currentAssets - totalLiabilities) / shares)).toFixed(2);
    }

    //MCap
    if (price && shares) {
        mcap = price*shares;
      }

    //roe
    if (totalStockEquity && netIncome) {
        roe = (netIncome/totalStockEquity).toFixed(2);
      }


    result = {...lastResult, 'netNet':netNet, mcap:mcap, roe:roe};
    return result
}

module.exports = computation;