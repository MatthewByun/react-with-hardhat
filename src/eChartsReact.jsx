import React, { useState, useEffect } from "react";
import * as echarts from "echarts";
import ReactEcharts from "echarts-for-react";
import axios from "axios";
const exchange = require("./json/exchange.json");
const testtime = require("./json/test.json");
const ChartsReact = () => {
  const [candleChart, setCandleChart] = useState([]);
  const api = "c95uvi2ad3i9atdkpbv0";
  const handleChart = async (symbols, min, timeStampFrom, timeStampTo) => {
    await axios({
      method: "get",
      url: `https://finnhub.io/api/v1/crypto/candle?symbol=${symbols}&resolution=${min}&from=${timeStampFrom}&to=${timeStampTo}&token=${api}`,
    }).then((res) => setCandleChart((data) => [...data, res.data]));
  };

  const getMarket = async (tkI, tkO, from, to) => {
    var tokenIn = tkI;
    var tokenOut = tkO;
    var tokens = tokenIn + "/" + tokenOut;
    var min = 5;
    // var timeStampFrom = 1649138400
    var timeStampFrom = from;
    // var timeStampTo = 1649179400
    var timeStampTo = to;
    // console.log("tokens", tokens)
    // // console.log("exchange", exchange[0].symbol)
    const result = exchange.filter((item) => item.displaySymbol == `${tokens}`);
    console.log("res", result);
    var arr = result.map((item) => item.symbol);
    for (let i = 0; i < arr.length; i++) {
      await handleChart(arr[i], min, timeStampFrom, timeStampTo);
      console.log("SUCCESS!!");
    }
  };

  const filterArr = (array) => {
    var arrFilter = [];
    let o = [];
    let h = [];
    let c = [];
    let l = [];
    let t = [];
    for (let i = 1; i < array.t.length; i++) {
      // console.log("asdasd", candleChart[0])
      if (
        array.t[i - 1] >= 1649138400
        // && array.t[i] - array.t[i - 1] == 300
      ) {
        if (array.t[i] - array.t[i - 1] == 300) {
          o.push(array.o[i]);
          h.push(array.h[i]);
          l.push(array.l[i]);
          c.push(array.c[i]);
          t.push(array.t[i]);
        } else {
          console.log("fakasjfhasjkfhakjfhakjfhakjf,", i);
        }
        // arrFilter.push({
        //   o: array.o[i],
        //   h: array.h[i],
        //   l: array.l[i],
        //   c: array.c[i],
        //   t: array.t[i - 1],
        // });
      } else {
        if(array.t[i] == 1649138400){
          o.push(array.o[i]);
          h.push(array.h[i]);
          l.push(array.l[i]);
          c.push(array.c[i]);
          t.push(array.t[i]);
        }
      }
    }

    arrFilter = {
      o: o,
      h: h,
      l: l,
      c: c,
      t: t,
    };
    return arrFilter;
  };

  const handlecandledata = () => {
    if (!candleChart) return;
    const candle = candleChart.map((val) =>
      // console.log("----",val.t)
      val.t.filter((value) => value >= 1649138400)
    );

    console.log("ava---", candleChart);
    candle.sort((a, b) => b.length - a.length);
    const filterCharts = candleChart.filter((val) => val.c.length > 0);

    const mapFilter = filterCharts.map((val) =>
      // console.log("----",val.t)
      val.t.filter((value) => value >= 1649138400)
    );
    filterCharts.sort((a, b) => a.length - b.length);
    console.log("MAP FILTER", mapFilter);
    console.log("FILTER CHARTS", filterCharts);
    // console.log("RESULT CHARTS", resultChart)

    var resultChart = [];
    var averageCandle = [];
    var prevChart = [];

    for (let k = 1; k < filterCharts.length; k++) {
      console.log("FILTER CHARTS AT K", filterCharts[k]);
      console.log("FILTER CHARTS AT K", k);
      if (filterCharts[k].c.length == filterCharts[k - 1].c.length) {
        //length arr1 vs arr0
        // console.log("true",mapFilter[k-1].length)
        let prevO = [];
        let prevH = [];
        let prevL = [];
        let prevC = [];
        let prevT = [];
        for (let i = 0; i < mapFilter[k - 1].length; i++) {
          // console.log("safasgfasfasg")
          if (!resultChart || resultChart.length < mapFilter[k].length) {
            if (filterCharts[k].t[i] == filterCharts[k - 1].t[i]) {
              console.log("trueeeeee");
              // console.log("time", filterCharts[k].t[i] , i, " = i",filterCharts[k].t[i]);
              // console.log("time  - 1", filterCharts[k - 1].t[i] , i, " = i");
              // console.log("Value o",(filterCharts[k].o[i]), "K = ", k , filterCharts[k - 1].o[i] , "value =>  ", (filterCharts[k].o[i] + filterCharts[k - 1].o[i]) / 2)
              // resultChart.push({
              //   "o": (filterCharts[k].o[i] + filterCharts[k - 1].o[i]) / 2,
              //   "h": (filterCharts[k].h[i] + filterCharts[k - 1].h[i]) / 2,
              //   "l": (filterCharts[k].l[i] + filterCharts[k - 1].l[i]) / 2,
              //   "c": (filterCharts[k].c[i] + filterCharts[k - 1].c[i]) / 2,
              //   "t": filterCharts[k - 1].t[i]
              // });

              let oo = (filterCharts[k].o[i] + filterCharts[k - 1].o[i]) / 2;
              let hh = (filterCharts[k].h[i] + filterCharts[k - 1].h[i]) / 2;
              let ll = (filterCharts[k].l[i] + filterCharts[k - 1].l[i]) / 2;
              let cc = (filterCharts[k].c[i] + filterCharts[k - 1].c[i]) / 2;
              let tt = filterCharts[k - 1].t[i];

              // console.log("o", oo)
              // resultChart.push({o: oo, h: hh, l: ll, c: cc, t: tt})
              prevO.push(oo);
              prevH.push(hh);
              prevL.push(ll);
              prevC.push(cc);
              prevT.push(tt);
              // console.log("res chart", prevO)
            }
            
          } 
          else {
            // console.log("result Chart1 ", resultChart);
            
            // console.log("test K-1", resultChart[i])
            // console.log("test filter chart",k, i, filterCharts[k].o[i])
            // console.log("test result chart", resultChart[i].o)
            // console.log("result o",((filterCharts[k].o[i] + resultChart[i].o) / 2))
            // console.log("false", k);

            prevO.push((filterCharts[k].o[i] + resultChart.o[i]) / 2);
            prevH.push((filterCharts[k].o[i] + resultChart.h[i]) / 2);
            prevL.push((filterCharts[k].o[i] + resultChart.l[i]) / 2);
            prevC.push((filterCharts[k].o[i] + resultChart.c[i]) / 2);
            prevT.push(filterCharts[k].t[i]);
          }


          // console.log("121321312312")
          // console.log("result Chart1 ", resultChart);
        }
        resultChart = {
          o: prevO,
          h: prevH,
          l: prevL,
          c: prevC,
          t: prevT,
        };
        console.log("result Chart", resultChart);



      } else {  
        // resultChart = {
        //   o: prevO,
        //   h: prevH,
        //   l: prevL,
        //   c: prevC,
        //   t: prevT,
        // };
        console.log("result Chart", resultChart);

        console.log("false arr length");
        // let candleFilter = filterArr(filterCharts[k]);
        let candleFilter = (filterCharts[k]);
        let prevCandle =
          resultChart.length == 0
            ? filterArr(filterCharts[k - 1])
            : resultChart;

        // if (resultChart.length == 0) resultChart = candleFilter

        console.log("prevCandle", prevCandle);
        console.log("current candle filter", candleFilter);
        let avgO = [];
        let avgH = [];
        let avgL = [];
        let avgC = [];
        let avgT = [];

        let falseTime = [];
        let countTrue = 0;
        for (let i = 0; i <= prevCandle.c.length; i++) {
          // console.log(prevCandle.c.length)
          // console.log(i)
          for (let j = 0; j < candleFilter.c.length; j++) {
            // console.log("i = ", i, " j = " ,j)
            if (
              prevCandle.t[i] == candleFilter.t[j] ||
              (prevCandle.t[i] - candleFilter.t[j] < 150) || (candleFilter.t[j] - prevCandle.t[i] < 150)
            ) {
              // console.log("timemmememememme",prevCandle.t[i], candleFilter.t[j] ,prevCandle.t[i] - candleFilter.t[j] )

              let o = (prevCandle.o[i] + candleFilter.o[j]) / 2;
              let h = (prevCandle.h[i] + candleFilter.h[j]) / 2;
              let l = (prevCandle.l[i] + candleFilter.l[j]) / 2;
              let c = (prevCandle.c[i] + candleFilter.c[j]) / 2;
              let t = prevCandle.t[i];

              avgO.push(o);
              avgH.push(h);
              avgL.push(l);
              avgC.push(c);
              avgT.push(t);

              // console.log("time", t, candleFilter[j].t)
              // console.log("o", candleFilter[j].o)
              // console.log("c", candleFilter[j].c)
              countTrue += 1;

              i++;
              // return
            } else {
              // if (j > i) {
              // (candleFilter[j].t == prevCandle[0].t[i])
              falseTime.length > 0
                ? falseTime.includes(i) == true
                  ? (falseTime = [...falseTime])
                  : // (candleFilter[j].t != prevCandle[0].t[i]) ?
                    (falseTime = [...falseTime, i])
                : falseTime.push(i);

              console.log("falslselselse", i);
              // console.log("falseeeeeeee i", i)
              // console.log("falseeeeeeee j", candleFilter[j].t)
              // }

              // console.log("falseeeeeeekjahsfkjahsfkjhasfjk")
              // return
            }
          }

          // if(falseTime){
          //   for(let i =0; i < falseTime.length; i++){
          //     console.log("falsetime", prevCandle.c[falseTime[i]])
          //   }
          // }

          averageCandle = {
            o: avgO,
            h: avgH,
            l: avgL,
            c: avgC,
            t: avgT,
          };

          resultChart = averageCandle;
        }

        console.log("falseeeee", falseTime);

        if (falseTime)
          for (let val of falseTime) {
            // console.log("falsetime c ", prevCandle.c[val])
            averageCandle.c.push(prevCandle.c[val - 1]);
            // console.log("falsetime h ", prevCandle.h[val])
            averageCandle.h.push(prevCandle.h[val - 1]);
            // console.log("falsetime l ", prevCandle.l[val])
            averageCandle.l.push(prevCandle.l[val - 1]);
            // console.log("falsetime o ", prevCandle.o[val])
            averageCandle.o.push(prevCandle.o[val - 1]);
            // console.log("falsetime t ", prevCandle.t[val])
            averageCandle.t.push(prevCandle.t[val - 1]);
          }
        // console.log("O length", prevCandle.c.length);
        // console.log("h length", avgH.length);
        // console.log("c length", avgC.length);
        // console.log("l length", avgL.length);
        // console.log("t length", avgT.length);
        console.log("average Cnadle", averageCandle);
      }
    }
    console.log("avearr", averageCandle);
    
    var resultArray = [];
    for (let i = 0; i < averageCandle.c.length; i++) {
      resultArray.push({
        o: averageCandle.c[i],
        h: averageCandle.h[i],
        l: averageCandle.l[i],
        c: averageCandle.c[i],
        t: averageCandle.t[i],
      });
    }
    resultArray.sort((a, b) => a.t - b.t);
    console.log("resultArray---", resultArray);
    console.log("final result", resultChart);
  };

  useEffect(async () => {}, []);

  return (
    <div>
      <h1>Charts</h1>
      <button onClick={() => getMarket("MATIC", "USDT", 1649138400, 1649311200)}>
        GetMarket
      </button>
      <button onClick={() => handlecandledata()}>Test</button>
    </div>
  );
};

export default ChartsReact;
