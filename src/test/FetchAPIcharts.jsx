import React, { useState, useEffect } from "react";
import axios from "axios";
const dataTokens = require('./dataTokens.json')

const Fetchapicharts = () => {
    const [market, setMarket] = useState([]);
    const [priceCloseCharts, setPriceCloseCharts] = useState();
    const [newDataa, setNewData] = useState();
    const [chartCandle, setChartCandle] = useState({});
    const [getAllData, setAllData] = useState();
    const [arrTokenIO, setArrTokenIO] = useState([])
    const [arrTokenOI, setArrTokenOI] = useState([])
    const getData = async () => {
        const data = await axios({
            method: "get",
            url: `http://api.cryptowat.ch/markets/prices`,
            headers: {
                "X-CW-API-Key": "BH0RGNG6WDIJUXDFJGXE",
            },
        })
        setAllData(data)
        console.log("allll data", data)
        
        console.log("allll dataasdasd", getAllData) 
    };

    const getAllPairs = async() => {
        var arrayy =[]
        var pairsUSDC = []
        var pairsUSDT = []
        if (!getAllData) return
        const data = getAllData.data.result;
        console.log("data", data);
        const dataArr = Object.entries(data);
        dataArr.map(arr => {
            if (
                arr[0].substring(arr[0].length - 4,arr[0].length) == "usdc"){
                for (let i = 0; i < arr[0].split("").length; i++) {
                    
                    if (arr[0].split("")[i] == ":") arrayy.push(i);
                    if (arrayy.length == 2) {
                        const market = arr[0].substring(arrayy[1] + 1, arr[0].length);
                        // console.log("arr", market);
                        pairsUSDC.push(market)
                        arrayy = [];
                    }
                }
            }
            if (
                arr[0].substring(arr[0].length - 4,arr[0].length) == "usdt"){
                for (let i = 0; i < arr[0].split("").length; i++) {
                    
                    if (arr[0].split("")[i] == ":") arrayy.push(i);
                    if (arrayy.length == 2) {
                        const market = arr[0].substring(arrayy[1] + 1, arr[0].length);
                        // console.log("arr", market);
                        pairsUSDT.push(market)
                        arrayy = [];
                    }
                }
            }

        })

        var arrPairs = []
        var filterArrPairs =[]

        var filterArrUSDC = []


        filterArrUSDC = pairsUSDC.filter(function (item) {
            // console.log("item", item)
            // console.log("item", item.length)
            // console.log("item1", item.substring(0,item.length - 4))
            arrPairs.push(item.substring(0,item.length - 4))
            return filterArrUSDC.includes(item) ? '' : filterArrUSDC.push(item)
          })


        filterArrPairs = arrPairs.filter(function (item) {
            // if(arrPairs.includes(item.substring(0,item.length - 4))) {
                //     arrPairs.push(item)
                // }
                return filterArrPairs.includes(item) ? '' : filterArrPairs.push(item)
            })
            console.log("filterArrPairs", filterArrPairs)
        

        var filterArrUSDT = []
        
        filterArrUSDT = pairsUSDT.filter(function (item) {
                
                // if(filterArrPairs.includes(item.substring(0,item.length - 4))) {
                //     // filterArrPairs.push(item.substring(0,item.length - 4))
                //     console.log("asdasd" , item.substring(0,item.length - 4))
                // }
                return filterArrUSDT.includes(item) ? '' : filterArrUSDT.push(item)
            })
        
        var tokens = filterArrUSDT.map(item => item.substring(0,(item.length-4)))
        console.log("All tokens / USDT", tokens)
        
        tokens = filterArrPairs.filter( function (item) {

            console.log("item", item)
            return tokens.includes(item) ? '' : tokens.push(item)
        })

        console.log("All tokens / USDT- USDC", tokens)

        // console.log("arrPairs", arrPairs)
        // console.log("filterArrPairs 1 1 1", filterArrPairs)

        // console.log("pairsUSDC", pairsUSDC)
        console.log("pairs USDC", filterArrPairs)
        // console.log("pairsUSDT", pairsUSDT)
        console.log("pairs USDT", filterArrUSDT)

    }

    const handleData = async (symb) => {
        // const getAllData = await getData()
        // console.log("all data", getAllData)
        if (!getAllData) return
        const data = getAllData.data.result;
        console.log("data", data);
        const dataArr = Object.entries(data);
        console.log("data", dataArr[0]);
        const symTokenIn = symb;
        const tokenUSDC = "USDC";
        const tokenUSD = "USD";
        const symTokenInUSDC = symTokenIn.concat(tokenUSDC).toLowerCase();
        const symTokenInUSD = symTokenIn.concat(tokenUSD).toLowerCase();

        console.log("symTokenInUSDC", symTokenInUSDC);
        console.log("symTokenInUSD", symTokenInUSD);
        // const lengthsymbol = symTokenInUSDC.length
        var priceTokenUSDC = 0;
        // var count = 0
        var arr = [];
        var preValue = 0;
        var max, min;
        const valueArr = dataArr.map((data) => {
            if (
                data[0].substring(data[0].length - symTokenInUSDC.length,data[0].length) == symTokenInUSDC
                // ||
                // data[0].substring(data[0].length - symTokenInUSD.length, data[0].length) == symTokenInUSD
            ) {
                preValue == 0 ? (preValue = data[1]) : preValue - data[1] > 0
                        ? (max = preValue)
                        : (max = data[1]);
                        // console.log("Max", max)
                preValue == 0
                    ? (preValue = data[1])
                    : preValue - data[1] < 0
                        ? (min = preValue)
                        : (min = data[1]);
                        // console.log("Min", min)
                priceTokenUSDC == 0 ? (priceTokenUSDC = data[1]) : (priceTokenUSDC = (data[1] + priceTokenUSDC) / 2);
                // console.log("data filter", data[1])
                console.log('price', priceTokenUSDC)
                setPriceCloseCharts(priceTokenUSDC);
                // count+=1
                // console.log("count", count)

                // const valueChart = ({high: max, low: min, price: priceTokenUSDC})
                // console.log("Market", data[0].split(""))
                for (let i = 0; i < data[0].split("").length; i++) {
                    if (data[0].split("")[i] == ":") arr.push(i);
                    if (arr.length == 2) {
                        const market = data[0].substring(arr[0] + 1, arr[1]);
                        console.log("market", market);
                        
                        setMarket((data) => [...data, market]);
                        arr = [];
                    }
                }
                
                setChartCandle({ high: max, low: min, price: priceTokenUSDC });
                // data = {high: max, low: min, price: priceTokenUSDC}
                // console.log('res ', res)
                // return data
            }
            
        } 
        );
        return valueArr
    };

    


    const sendData = async (symb) => {
        if (!newDataa) return;
        const symbolTokens = symb;
        const timestamp = 300;
        const chainId = 1;
        await axios({
            method: "post",
            url: `http://20.20.20.131:5000/chartsdata/candle?symbolTokens=${symbolTokens}&time=${timestamp}&network=${chainId}`,
            data: {
                chartData: newDataa,
            },
        })
            .then((data) => console.log("successsssss", data))
            .catch((err) => console.log("err", err));
    };

    const sendDataaaaa  = async () => {
        // console.log("ada" ,arrTokenIO)
        if (arrTokenIO.length < 60) return;
        console.log("ada1" ,arrTokenIO)
        
        const symbolTokens = arrTokenIO[0].symbol;
        const timestamp = 300;
        const chainId = 1;

        await axios({
            method: "post",
            url: `http://20.20.20.131:5000/chartsdata/candle?symbolTokens=${symbolTokens}&time=${timestamp}&network=${chainId}`,
            data: {
                chartData: arrTokenIO,
            },
        })
            .then((data) => console.log("successsssss", data))
            .catch((err) => console.log("err", err));
    };
    

    const getTokenTokenPrice = async (tokenIn, tokenOut) => {
        const timestamp = 300
        const chainId = 1
        const dataTokenIn = await axios({
            method: "get",
            url: `http://20.20.20.131:5000/chartsdata/candle?symbolTokens=${tokenIn.toUpperCase()}USDC&time=${timestamp}&network=${chainId}`
        }).catch(err => (console.log("Error token in", err)))
        const dataTokenOut = await axios({
            method: "get",
            url: `http://20.20.20.131:5000/chartsdata/candle?symbolTokens=${tokenOut.toUpperCase()}USDC&time=${timestamp}&network=${chainId}`
        }).catch(err => (console.log("Error token out", err)))

        console.log("dataTokenIn",dataTokenIn)
        console.log("dataTokenOut",dataTokenOut)
        
        for (let i = 0; i<= 59; i++){
            // if(dataTokenIn.data[i].time != dataTokenOut.data[i].time) return console.log("WRONG")
            const priceInOut = (dataTokenIn.data[i].close / dataTokenOut.data[i].close)
            const priceOutIn = (dataTokenOut.data[i].close / dataTokenIn.data[i].close)
            const priceHighInOut = (dataTokenIn.data[i].high / dataTokenOut.data[i].high)
            const priceHighOutIn = (dataTokenOut.data[i].high / dataTokenIn.data[i].high)
            const priceLowInOut = (dataTokenIn.data[i].low / dataTokenOut.data[i].low)
            const priceLowOutIn = (dataTokenOut.data[i].low / dataTokenIn.data[i].low)
            setArrTokenIO(data => [...data, {time: dataTokenIn.data[i].time, price: priceInOut, high: priceHighInOut, low: priceLowInOut}])
            setArrTokenOI(data => [...data, {time: dataTokenOut.data[i].time, price: priceOutIn, high: priceHighOutIn, low: priceLowOutIn}])
        }        

        // console.log("data -- - - -1", dataTokenIn.data[0].close)
        // console.log("data -- - - -2", dataTokenOut.data)
    };

    useEffect(async () => {
        // if(!priceCloseCharts) return
        // const tokenIn = "MATIC"
        // const tokenOut = "USDC"

        // const tokens = (tokenIn.concat(tokenOut)).toLowerCase()
        // console.log("tokens", tokens)

        await axios({
            method: "get",
            // https://spaceapi.org/v1/charts/candle?from=0x6B175474E89094C44Da98b954EedeAC495271d0F&to=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&time=300&networks=1
            //0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE
            url: `https://spaceapi.org/v1/charts/candle?from=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&to=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&time=300&networks=1`,
        }).then((res) => {
            // console.log("res", res.data)
            const newData = res.data;
            const prevHigh = res.data[59].high;
            const prevLow = res.data[59].low;
            const prevClose = res.data[59].close;
            const date = new Date();
            const timeChart = (date.getTime() / 1000).toFixed();
            if (!priceCloseCharts) return;
            newData.push({
                time: Number(timeChart),
                open: prevClose,
                high: priceCloseCharts - prevHigh > 0 ? priceCloseCharts : prevHigh,
                low: priceCloseCharts - prevLow < 0 ? priceCloseCharts : prevClose,
                close: priceCloseCharts,
            });
            newData.shift();
            // console.log("newData ", newData)
            setNewData(newData);
        });
        // console.log("newdata", newData)

        // console.log("newData ", newData)
    }, [priceCloseCharts]);
    // https://api.cryptowat.ch/markets/bitfinex/btcusd/ohlc?periods=300

    // await axios({
    //     method: 'post',
    // })
    useEffect(async() => {
        // await getTokenTokenPrice("DAI", "ETH")
        if(arrTokenIO.length < 60 || arrTokenOI.length < 60) return
        
        // sendData(arrTokenOI[0].symbol, arrTokenOI)
        
        console.log("DATA IO", arrTokenIO)
        console.log("DATA OI", arrTokenOI)
        await axios({
            method: "post",
            url: `http://20.20.20.131:5000/chartsdata/candle?symbolTokens=${arrTokenIO[0].symbol}&time=${300}&network=${1}`,
            data: {
                chartData: arrTokenIO,
            },
        })
            .then((data) => console.log("successsssss", data))
            .catch((err) => console.log("err", err));
    },[arrTokenIO, arrTokenOI])

    useEffect(() =>{
        // console.log("teest", dataTokens.tokens[0].symbol)
        var ethereum = [], avalanche = [], bnbchain = [], polygon = []
        dataTokens.tokens.map(item => {
            if(item.chainId == 1) ethereum.push(item.symbol)
            if(item.chainId == 56) bnbchain.push(item.symbol)
            if(item.chainId == 137) polygon.push(item.symbol)
            else avalanche.push(item.symbol)
        })

        console.log("1",ethereum)
        console.log("2",bnbchain)
        console.log("3",polygon)
        console.log("4",avalanche)
    },[])

    return (
        <div>
            <button onClick={() => getData()}>Get All Data</button>
            <br />
            <button onClick={() => handleData("matic")}>get Price DAI / USDC </button>
            <br />
            <button onClick={() => handleData("ETH")}>get Price ETH / USDC </button>
            <br />
            <button onClick={() => sendData("DAIUSDC")}>Send Data DAI / USDC</button>
            <br />
            <button onClick={() => sendData("ETHUSDC")}>Send Data ETH / USDC</button>
            <br />
            <button onClick={() => sendDataaaaa()}>AJSKHDKJASHDKJAHSD</button>
            <br />
            <button onClick={() => getAllPairs()}> TEST </button>
            <br />

            <button onClick={() => getTokenTokenPrice("DAI", "ETH")}>
                Get Price DAI ETH
            </button>
            <br />
            {/* {market &&
                market.map((mkr) => {
                    return <h1>{mkr}</h1>;
                })} */}
        </div>
    );
};

export default Fetchapicharts;
