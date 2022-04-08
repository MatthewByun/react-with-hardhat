import React, { useEffect, useState } from "react";
import axios from "axios";
const Market = require("./json/exchange.json");

function ChartData() {
  const [candleChart, setCandleChart] = useState([]);
  const [totalMarket, setTotalMarket] = useState([]);
  const api = "c95uvi2ad3i9atdkpbv0";
  const handleChart = async (symbols, min, timeStampFrom, timeStampTo) => {
    await axios({
      method: "get",
      url: `https://finnhub.io/api/v1/crypto/candle?symbol=${symbols}&resolution=${min}&from=${timeStampFrom}&to=${timeStampTo}&token=${api}`,
    }).then((res) => setCandleChart((data) => [...data, res.data]));
  };
  const getMarket = async (tkI, tkO, min, from, to) => {
    var tokenIn = tkI;
    var tokenOut = tkO;
    var tokens = tokenIn.toUpperCase() + "/" + tokenOut.toUpperCase();

    let result = Market.filter((item) => item.displaySymbol == `${tokens}`);
    console.log("Market", result);
    setTotalMarket(result);

    var arr = result.map((item) => item.symbol);
    arr.map(async (val) => {
      await handleChart(val, min, from, to);
      console.log("SUCEESS");
    });

    // await handleChart("BINANCE:ETHUSDT", min, from, to);
    // console.log("SUCEESS");
  };

  useEffect(() => {
    // nodata return
    if (!candleChart) return;
    if (totalMarket.length < 1) return console.log("NO DATA");

    // 1 market => return market
    if (totalMarket.length == 1) return console.log("1 Array");
    if (candleChart.length < totalMarket.length) return;

    //example data
    const candleDataChart = candleChart;

    // remove arr has no data and sort arr
    console.log("candle", candleDataChart);
    var timeMin = 60 * 60 * 24;

    let filterArr = candleDataChart.filter(
      (val) => val.t.length > 0 || val.s != "no_data" || val.c ==null
    );

    // console.log("Data Filter", filterArr);

    filterArr.sort(function (a, b) {
      return b.t.length - a.t.length;
    });

    // push all data to arrCandleChartData
    var arrCandleChartData = [];

    filterArr.map((val, index) =>
      val.t.map((item, idx) =>
        arrCandleChartData.push({
          open: val.o[idx],
          high: val.h[idx],
          low: val.l[idx],
          close: val.c[idx],
          time: val.t[idx],
        })
      )
    );

    // filter time of candle data ()
    let arrTime = [];
    arrCandleChartData.map((value) =>
      arrTime.includes(value.time)
        ? console.log("DA CO ROI")
        : arrTime.push(value.time)
    );


    arrTime.sort(function (a, b) {
      return a - b;
    });
    console.log("arr", arrTime);

    let falseTimeArr = [];
    let prev
    arrTime.map((item, idx) => {
        if(idx == 0) {
            prev=item
            falseTimeArr.push(prev)
        } 
        if(item - prev >= timeMin) {
            prev = item
            falseTimeArr.push(prev)
        }
    });

    let finalResult = [];

    //handle data => average Data
    falseTimeArr.map((val) => {
      let dataAtTime;
      dataAtTime = arrCandleChartData.filter((itm) => itm.time == val);

      let closetTime = filterArr.filter(
        (itm) =>
          itm.time - val > 0 && itm.time - val < timeMin / 3 && itm.time != val
      );
      console.log("closet time", closetTime);

      let datafilterAtTime = dataAtTime.concat(closetTime);
      console.log("data", datafilterAtTime);

      let open = datafilterAtTime
        .map((val) => val.open)
        .reduce((prev, cur) => (prev + cur) / 2);
      let high = datafilterAtTime
        .map((val) => val.high)
        .reduce((prev, cur) => (prev + cur) / 2);
      let low = datafilterAtTime
        .map((val) => val.low)
        .reduce((prev, cur) => (prev + cur) / 2);
      let close = datafilterAtTime
        .map((val) => val.close)
        .reduce((prev, cur) => (prev + cur) / 2);
      finalResult.push({
        open: open,
        high: high,
        low: low,
        close: close,
        time: val,
      });
    });

    console.log("final Result Arr", finalResult);
  }, [candleChart]);

  return (
    <div>
      ChartData
      <br />
      <button
        onClick={() => getMarket("1INCH", "USDT", "D", 1648789200, 1649385000)}
      >
        Get Market
      </button>
      {/* <button
        onClick={() =>
          handleChart("BINANCE:ETHUSDT", 5, 1648789200, 1649394000)
        }
      >
        Get value
      </button> */}
    </div>
  );
}
export default ChartData;
