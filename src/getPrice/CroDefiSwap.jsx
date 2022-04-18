import React, {useEffect} from 'react'
import Web3 from 'web3'
import * as Router from '../abi/crodefiswap/router'
import * as Pair from '../abi/crodefiswap/pair'
import * as Factory from '../abi/crodefiswap/factory'
function HandleAmountOut() {
    const web3 = new Web3(Web3.givenProvider)
    const token = {
      WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    }
    const factory = new web3.eth.Contract(Factory.abi, Factory.address).methods
    const defiswap = async() => {
        const addressPair = await factory.getPair(token.ETH, token.USDC).call()
        const pair = new web3.eth.Contract(Pair.abi, addressPair).methods
        const router = new web3.eth.Contract(Router.abi, Router.address).methods
        const reserves = await pair.getReserves().call()
        // console.log("Reserves", reserves)

        // console.log("router", router)
        const getAmountOut = await router.getAmountOut(
          1e20.toString(),
          reserves._reserve1,
          reserves._reserve0
        ).call()
        console.log("amount out", getAmountOut/(1e6))

    }
    useEffect(() => {
        defiswap()
    })
  return (
    <div>
        DefiSwap
    </div>
  )
}

export default HandleAmountOut