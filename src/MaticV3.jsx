import React, { useEffect, useState } from 'react'
import Web3 from "web3";
import * as CONFIG from "./config";

const MaticV3 = () => {

    const web3 = new Web3(Web3.givenProvider)

    const login = async() => {
        // const account = new web3.eth.requestAccounts()
        const contract = new web3.eth.Contract(CONFIG.UniV3ABI,CONFIG.UniV3Factory).methods
        console.log("contract", contract)
        const getPool = await contract.getPool("0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",500)
    }

    useEffect(() => {
        login()
    },[]);

  return (

    <div>
        Hello World!!!!
    </div>
  )
}

export default MaticV3;