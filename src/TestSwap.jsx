import React, { useState } from 'react'
// import { Address} from "cluster"
import { ethers } from "ethers";
import { Pool } from "@uniswap/v3-sdk";
import { Token } from "@uniswap/sdk-core";
import { IUniswapV3PoolABI, QuoterABI } from "./config"
import { Route } from "@uniswap/v3-sdk";
import { Trade } from "@uniswap/v3-sdk";
import { CurrencyAmount, TradeType } from "@uniswap/sdk-core";
import {factoryABI,factoryAddress} from "./abi/factory"
function TestSwap() {

    // const provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/f8f5470e381444698ffbac03c45b428f")
    const provider = new ethers.providers.JsonRpcProvider("https://speedy-nodes-nyc.moralis.io/3c16c7c0bc8468563143a59c/eth/ropsten")
    // const poolAddress = "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8";
    const poolAddress = "0xC79ed5C13ff304784d76a762e59a9868C3E65e26";
    const poolContract = new ethers.Contract(
        poolAddress,
        IUniswapV3PoolABI,
        provider
    );

    console.log("factory", poolContract.factory().then(rep => console.log(rep)))
    console.log("pool contract", poolContract.token0().then(rep=> console.log(rep)))
    const quoterAddress = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6"
    const quoterContract = new ethers.Contract(quoterAddress,QuoterABI, provider)


    // console.log("test", quoterContract)
    const getpool = async () => {
        const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] =
            ([
                poolContract.factory(),
                poolContract.token0(),
                poolContract.token1(),
                // poolContract.fee(),
                3000, //fee
                60, //tickSpacing
                11505743598341114571880798222544994 //maxLiquidityPerTick
                // poolContract.tickSpacing(),
                // poolContract.maxLiquidityPerTick(),
            ])


        // fee: 3000
        //tickspacing: 60
        // maxliquidityperTick: 11505743598341114571880798222544994
        return {
            factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick
        }
        // console.log(factory) 
        // console.log(token0) 
        // console.log(token1) 
        // console.log(fee) 
        // console.log(tickSpacing) 
        // console.log((maxLiquidityPerTick).toString()) 
    }
    console.log("getpool", getpool())
    const getPoolState = async () => {
        const [liquidity, slot] = await Promise.all([
            poolContract.liquidity(),
            poolContract.slot0()
        ])
        return {
            liquidity, slot
        }
        // console.log("slot", slot[0].toString())
        // console.log("slot", slot[1])
        // console.log("slot", liquidity.toString())
    }
    // getPoolState().then(rep => console.log("rep", rep))

    const createPool = async () => {
        const [immutables, states] = ([
            getpool(),
            getPoolState()
        ])

        console.log(states.liquidity.toString())
        console.log(immutables.token0)
        const tokenA = new Token(3, "0x85f13db811c1d8e22679cf56ca91931562d837b2", 18, "SLT", "Sleepy Tokens Coin");

        const tokenB = new Token(3, "0x28afeecc16ef8c3cba817b1b91277b00d01ee9f6", 18, "SS", "Space Sentinels Coin");
        console.log("tokenA", tokenA)
        console.log("tokenB",tokenB)
        // console.log("SQRTX96" , states.slot[0].toString())
        // console.log("liquidity" , states.liquidity.toString())
        // console.log("tick" , states.slot[1])
        const poolTest = new Pool(
            tokenA,
            tokenB,
            immutables.fee,
            states.slot[0].toString(),
            states.liquidity.toString(),
            states.slot[1]
        );
        console.log("Pool", poolTest)

        // const amountIn = 1500
        // const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
        //     // immutables.token0,
        //     tokenA,
        //     // immutables.token1,
        //     tokenB,
        //     immutables.fee,
        //     amountIn.toString(),
        //     0
        //   );
        // const swapRoute = new Route([poolTest],tokenA,tokenB)
        // console.log('asdasd', swapRoute)
        // const uncheckedTradeExample = await Trade.createUncheckedTrade({
        //     route: swapRoute,
        //     inputAmount: CurrencyAmount.fromRawAmount(tokenA, amountIn.toString()),
        //     outputAmount: CurrencyAmount.fromRawAmount(
        //       tokenB,
        //       quotedAmountOut.toString()
        //     ),
        //     tradeType: TradeType.EXACT_INPUT,
        //   });
        
          // print the quote and the unchecked trade instance in the console
        //   console.log("The quoted amount out is", quotedAmountOut.toString());
        //   console.log("The unchecked trade object is", uncheckedTradeExample);
        // console.log("price1", poolTest.token0Price)
        // console.log("price2", poolTest.token1Price)
        // return poolTest
    }
    // createPool()
    return (
        <div>
            HELLO
            <br />
            <button onClick={getpool}>CLick</button>
            <br />
            <button onClick={getPoolState}>Clicked</button>
            <button onClick={createPool}>Create Pool</button>
        </div>
    )
}

export default TestSwap