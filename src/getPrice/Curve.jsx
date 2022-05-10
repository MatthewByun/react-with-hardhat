import React from 'react'
import { BigNumber, ethers } from 'ethers'
import * as curve from '../abi/ABI_Curve'
import * as PairUniV2 from "../abi/uniswapv2/pair";
import Web3 from 'web3'
const Curve = () => {
    const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com")
    const web3 = new Web3(Web3.givenProvider)
    const token = {
        //matic
        WMATIC: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        AAVE: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
        USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        USDT: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
        DAI: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    }
    const whiteList = {
        USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
        UST: "0x692597b009d13C4049a947CAB2239b7d6517875F",
        WETH: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
        DAI: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        miMATIC: "0xa3Fa99A148fA48D14Ed51d610c367C61876997F1"
    }
    // const getFactory = async (address) => {
    //     // const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com")
  
    //     const contract = new web3.eth.Contract(curve.Polygon.abi, address).methods
    //     console.log("Contract", contract)
    //     await contract.get_dy_underlying(
    //         1,
    //         0,
    //         amountIn
    //     ).call().then(res => console.log('res', res))
    //     await contract.pool().call().then(data => console.log("data", data))
    // }
    const toHexNumber = (number,decimal) => {
        const a = ethers.utils.parseUnits(
            number.toString(),
            decimal
        ).toHexString()
        return a
    }
    const findPool = async (tokenIn, tokenOut) => {
        const contract = new web3.eth.Contract(curve.findPoolPolygon.abi, curve.findPoolPolygon.address).methods
        try {
            const a = await contract.find_pool_for_coins(
                tokenIn,
                tokenOut
            ).call()
            return a
        } catch (error) {
            console.log('Loi roi ne ====>', error)
        }
    }
    const getDecimal = async (addressToken) => {
        const contract = new ethers.Contract(addressToken, PairUniV2.abi, provider)
        return await contract.decimals();
    };
    const getIndexCoins = (addressToken) => {
        const listUnderlyingTokens = [
            '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
            '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
            '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
            '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
            '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
        ]
        let a = listUnderlyingTokens.findIndex(item => item == addressToken)
        return a
    } 

    const getAmountOut = async (tokenIn, tokenOut) => {
        const amountIn = 550
        //
        const poolAddress = await findPool(tokenIn, tokenOut)
        if(!poolAddress) return
        console.log("poolAddress", poolAddress)
        const contract = new web3.eth.Contract(curve.abi, poolAddress).methods
        const decimalTokenIn = await getDecimal(tokenIn)
        const decimalTokenOut = await getDecimal(tokenOut)
        const amountInConvert = toHexNumber(amountIn, decimalTokenIn)
        let indexTokenIn = getIndexCoins(tokenIn)
        let indexTokenOut = getIndexCoins(tokenOut)
        console.log("contract => ", contract)
        console.log("index => ", indexTokenIn, indexTokenOut)
        console.log("amountIn convert => ", amountInConvert)
        const amountOut = await contract.get_dy_underlying(
            indexTokenIn,
            indexTokenOut,
            amountInConvert
        ).call()
        console.log("amount out =>", amountOut/(10**decimalTokenOut))
    }


    return (
        <div>Curve
            <div>
                <h1>Factory</h1>
                <button onClick={() => getAmountOut(whiteList.USDC, whiteList.DAI)}>Click!!!!</button>
            </div>
        </div>
    )
}

export default Curve