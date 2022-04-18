import React, { useEffect } from "react";
import Web3 from "web3";
import * as Router from "../abi/uniswapv2/router";
import * as Pair from "../abi/uniswapv2/pair";
import * as Factory from "../abi/uniswapv2/factory";

const UniswapV2 = () => {
  const web3 = new Web3(Web3.givenProvider);
  const token = {
    WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  };
  const factory = new web3.eth.Contract(Factory.abi, Factory.address).methods;
  console.log("factory", factory)
  const uniswap = async () => {
    const pairAddress = await factory.getPair(token.WETH, token.USDC).call();
    const pair = new web3.eth.Contract(Pair.abi, pairAddress).methods;
    const router = new web3.eth.Contract(Router.abi, Router.address).methods;
    const reserves = await pair.getReserves().call();
    const getAmountOut = await router.getAmountOut(
        (1e18).toString(),
         reserves._reserve1,
        reserves._reserve0
        ).call();
    console.log("amount out", getAmountOut / 1e6);
    // console.log("router", router);
  };
  useEffect(() => {
    uniswap();
  });
  return <div>UniswapV2</div>;
};

export default UniswapV2;
