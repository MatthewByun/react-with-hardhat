import React, {useEffect} from 'react'
import Web3 from 'web3'
import * as RouterV2abi from '../abi/linkswap/router'
import * as Pair from '../abi/linkswap/pair'
import * as Factory from '../abi/linkswap/factory'
function HandleAmountOut() {
    const web3 = new Web3(Web3.givenProvider)
    const token = {
      WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    }

    const factory = new web3.eth.Contract(Factory.abi,Factory.address).methods
    
    const linkSwap = async() => {
        const pairAddress = await factory.getPair(token.WETH, token.USDC).call()
        const router = new web3.eth.Contract(RouterV2abi.abi, RouterV2abi.address).methods
        const pair = new web3.eth.Contract(Pair.abi, pairAddress).methods
        const reserves = await pair.getReserves().call()
        console.log("Reserves", reserves)

        const getAmountOut = await router.getAmountOut(
          1e18.toString(),
          reserves._reserve1,
          reserves._reserve0,
          "1000"
        ).call()
        console.log("amount out", getAmountOut/(1e6))
    }
    useEffect(() => {
        linkSwap()
    })
  return (
    <div>
        LinkSwap
    </div>
  )
}

export default HandleAmountOut