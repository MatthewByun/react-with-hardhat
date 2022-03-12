import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { Box, Center, Input, Button } from "@chakra-ui/react";
import * as CONFIG from "./config";

const Matic = () => {
  const [account, setAccount] = useState();
  const [methods, setMethods] = useState();

  const web3 = new Web3(Web3.givenProvider);

  async function Login() {
    const accounts = await web3.eth.requestAccounts();
    setAccount(accounts[0]);
    const balance = await web3.eth.getBalance(accounts[0])
    console.log("balance", balance.toString())

  }

  async function getPair() {
      const contract = new web3.eth.Contract(CONFIG.PolygonABI, CONFIG.PolygonFactory).methods
      console.log("Contract", contract)
      const pair = await contract.getPair("0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270").call()
    //   const pair = await contract.allPairs(3000).call()
    //   const pair = await contract.allPairsLength().call()
      console.log("Pair address", pair)
      const date = new Date().getTime()
      console.log("Date", date/1000)
  }
  const shouldFulfiled = async() => {
    const bool = await methods.shouldFulfilOrder(1).call()
    console.log("Bool", bool)
  }


useEffect(async() => {
    const contract = new web3.eth.Contract(CONFIG.LimitOrdersABI, CONFIG.LimitOrdersPolygon).methods
    console.log("LimitORder", contract)
    setMethods(contract)
},[])


  useEffect(async () => {
    Login();
    account && getPair()
    console.log("account", account);
    console.log()
  }, [account]);
  
  useEffect(()=>{
    
  })




  return (
    <div>
      <Center>Hello {account ? account : ""}</Center>

      <Center>
        <Box
          p={8}
          maxWidth="500px"
          borderWidth={1}
          borderRadius={8}
          boxShadow="lg"
        >
          <h1>Limit order</h1>
          <Input />
          <Input />
          <Box>
            <Center>
              <Button>Place Order</Button>
            </Center>
          </Box>
        </Box>
      </Center>
    </div>
  );
};

export default Matic;
