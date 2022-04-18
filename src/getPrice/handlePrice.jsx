import React, { useEffect } from "react";
import Web3 from "web3";
import * as RouterUniV2 from "../abi/uniswapv2/router";
import * as PairUniV2 from "../abi/uniswapv2/pair";
import * as FactoryUniV2 from "../abi/uniswapv2/factory";
import * as RouterLinkSwap from "../abi/linkswap/router";
import * as PairLinkSwap from "../abi/linkswap/pair";
import * as FactoryLinkSwap from "../abi/linkswap/factory";
import * as RouterCrodefiswap from "../abi/crodefiswap/router";
import * as PairCrodefiswap from "../abi/crodefiswap/pair";
import * as FactoryCrodefiswap from "../abi/crodefiswap/factory";
import * as ABI from "../abi/ABI"

const HandlePrice = () => {
  const web3 = new Web3(Web3.givenProvider);
  const token = {
    WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  };
  const getDecimal = async (address, pair) => {
    let data = new web3.eth.Contract(pair.abi, address).methods;
    return await data.decimals().call();
  };
  var listMidPrice = []
  var listReserve = []
  const handlePrice = async (
    exchange,
    factory,
    router,
    pair,
    tokenIn,
    tokenOut
  ) => {
    const factoryMethods = new web3.eth.Contract(factory.abi, factory.adr)
      .methods;
    const pairAddress = await factoryMethods.getPair(tokenIn, tokenOut).call();
    const pairMethods = new web3.eth.Contract(pair.abi, pairAddress).methods;
    // const routerMethods = new web3.eth.Contract(router.abi, router.adr)
    //   .methods;
    const reserves = await pairMethods.getReserves().call();
    let reserveIn, reserveOut
    if (tokenIn < tokenOut) {
      reserveIn = reserves[0];
      reserveOut = reserves[1];
    } else {
      reserveIn = reserves[1];
      reserveOut = reserves[0];
    }

    let tokenInDecimals = await getDecimal(tokenIn, pair);
    let tokenOutDecimals = await getDecimal(tokenOut, pair);

    let reserveInConvert = divDecimals(reserveIn,tokenInDecimals)
    let reserveOutConvert = divDecimals(reserveOut,tokenOutDecimals)
    
    console.log(" ----------------- ")
    // console.log("Amount in ==>> ", amountIn)
    console.log("exchange ==>> ", exchange)
    
    let amountInConvert = Math.round(reserveInConvert / 1000 / 10) // 0.01% Reserve In
    // let amountInConvert = Math.round(33) // 0.01% Reserve In
    if(amountInConvert < 1) amountInConvert =  Math.round(reserveInConvert / 1000)
    console.log("Amount in ==>> ", amountInConvert)

    let amountOut = calculateAmountOut(amountInConvert, tokenOutDecimals, reserveInConvert, reserveOutConvert)

    console.log("amountOut => " ,amountOut)
    let amountOutConvert = divDecimals(amountOut, tokenOutDecimals)
    console.log("Price ==>> ",amountOutConvert / amountInConvert)
    
    getPriceImpact(amountInConvert, reserveInConvert)
    listMidPrice.push(reserveOutConvert/reserveInConvert)
    listReserve.push(reserveInConvert)
  };
  const calculateAmountOut = (amountIn,tokenOutDecimals, reserveIn, reserveOut) => {
    if (amountIn <= 0 || reserveIn <= 0 || reserveOut <= 0) return "Undefined";
    let amountInWithFee = amountIn * 997; //  1* 997
    let numerator = amountInWithFee * reserveOut; // 997 * 66.7334000667334
    let denominator = reserveIn * 1000 + amountInWithFee; //  1.5 * 1000 + 997
    let amountOut = numerator / denominator;
    return amountOut*(10**tokenOutDecimals);
  }
  const handleNumber = (amount, decimals) => {
    var BN = web3.utils.BN;
    const amountTokenIn = (amount * (10 ** decimals)).toLocaleString("fullwide", {
      useGrouping: false,
    });
    let number = new BN(amountTokenIn).toString();
    return number;
  };
  const getPriceImpact = (amountIn, reservesA) => {
    let fee = 0.03;
    let amountWithFee = amountIn * (1 - fee);
    let priceImpact = (amountWithFee / (reservesA + amountWithFee) *100).toFixed(2);
    console.log("Price Impact:" ,priceImpact)
  }

  const divDecimals = (number, decimals) => {
    return number / (10**decimals)
  }
  const mulDecimals = (number, decimals) => {
    return number * (10**decimals)
  }

  const PriceImpact = async(amountIn, amountOut, reserveInConvert, reserveOutConvert) => {
    const amountInConvert = amountIn * 997 / 1000
    const amountOutConvert = amountOut * 995 / 1000
    const deltaReserveIn = amountInConvert / Number(reserveInConvert)
    const deltaReserveOut = amountOutConvert / Number(reserveOutConvert)
  
    const priceImpact = Math.min(deltaReserveIn, deltaReserveOut)
  
    const result = (priceImpact * 100).toFixed(2)
    console.log('Price impact =>>>', result, '%');
  }
  const getMidPrice = () => {

  }
  const test = async() =>{
    await handlePrice("UniswapV2",ABI.UniV2.factory, ABI.UniV2.router,PairUniV2,token.WETH,token.USDC);
    await handlePrice("Sushi",ABI.Sushi.factory, ABI.Sushi.router, PairUniV2,token.WETH, token.USDC);
    await handlePrice("CrodefiSwap",ABI.Crodefi.factory, ABI.UniV2.router, PairCrodefiswap,token.WETH, token.USDC);
  }

  useEffect(async() => {
    await test()
    // handlePrice("LinkSwap",ABI.LinkSwap.factory, ABI.UniV2.router, PairLinkSwap,token.WETH, token.USDC, 1000);
    console.log("mid price", listMidPrice)
    console.log("listReserve", listReserve)
    let amountIn = 100
    for(let i =0 ; i < amountIn; i++){

    }
    listMidPrice[0] = 1
    console.log("mid price", listMidPrice)


  });
  return (
    <div>
      HandlePrice
      {/* <button onClick={() => test()}>CLick</button> */}
    </div>
  );
};

export default HandlePrice;
