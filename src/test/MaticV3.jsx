import React, { useEffect, useState } from "react";
import Web3 from "web3";

// import { ethers } from "ethers";

import * as CONFIG from "./config";

const MaticV3 = () => {
  const web3 = new Web3(Web3.givenProvider);

  async function login() {
    const account = await web3.eth.requestAccounts()

  }
  login()
  const sigUtil = require("eth-sig-util");
  // const ethUtil = require("ethereumjs-util");
  const [signature, setSignature] = useState()

  const contract = new web3.eth.Contract(CONFIG.hashTypeABI, CONFIG.hashTypeArd).methods
  console.log("contract", contract)
  const approval = async (amount, addressToken, addressRouter) => {
    var BN = web3.utils.BN;
    const decimals = (10 ** 18);
    const amountTokenIn = (amount * decimals).toLocaleString("fullwide", {
      useGrouping: false,
    });
    var number = new BN(amountTokenIn).toString();
    const coin = new web3.eth.Contract(CONFIG.ABI, addressToken); //address Token
    console.log("methods", coin.methods);
    console.log("Number", amountTokenIn)
    await coin.methods
      .approve(
        addressRouter,
        number
      )
      .send({
        from: "0xa52487f75f4E4554914810877a78fF9574A98275",
      })
      .then((rep) => console.log("SUCCESS!", rep));
  };
  const getHashMSG = async () => {
    // const test = await contract.hashType(["0xd5Efdda1C139e29A2dcdb2592812D55eb3D65Fc1", 0, 0, "0x1c5DEe94a34D795f9EEeF830B68B80e44868d316","0xc778417E063141139Fce010982780140Aa0cD5Ab","0xaD6D458402F60fD3Bd25163575031ACDce07538D","1000000000000000000","340000000000000000000","320000000000000000000","1647584777"]).call()
    // console.log("Byte32", test)
    console.log("Router", await contract.getRouterAddress().call())
    // const test = await contract.shouldFulfilOrder(["0xa52487f75f4E4554914810877a78fF9574A98275","0","0x59153f27eeFE07E5eCE4f9304EBBa1DA6F53CA88","0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063","0xc2132D05D31c914a87C6611C10748AEb04B58e8F","1000000000000000000","995988","0x00","1648188309","2424252552"],"0xb55b45bc0959003a7050f5d4119666cffeebc38dd92de9b54c6211c5dd3da30d0afa5fef883f5d4b59d820ddcc59ee84735477b7103bd82464a6a3a9010fe5e21b")
    // .call()
    // console.log("test", test)
    // const testCancel = await contract.cancelOrder(["0xa52487f75f4E4554914810877a78fF9574A98275",0,0,"0x604229c960e5CACF2aaEAc8Be68Ac07BA9dF81c3","0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270","0xc2132D05D31c914a87C6611C10748AEb04B58e8F","100000000000000000","1","0x00","1647597637","127964217846512"]).call()
    // console.log("test1", testCancel)
    // const adrcancel = await contract.addressOrderCancel().call()
    // console.log("adr", adrcancel)
    // const signature = "0xc79c84ea81b3609362c2a3e86d5da8a33c73454f73e1052ade9c2e942621ee723635052646c8bec4d495528128df93f952bd7fd67cc28b975b21867e285b7fae1b"
    // const Execute = await contract.ExecuteCustomOrder(["0xa52487f75f4E4554914810877a78fF9574A98275",0,0,"0x604229c960e5CACF2aaEAc8Be68Ac07BA9dF81c3","0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270","0xc2132D05D31c914a87C6611C10748AEb04B58e8F","100000000000000000","1","0x00","1647597637",salt],signature).estimateGas({from: "0xa52487f75f4E4554914810877a78fF9574A98275", value: "100000000000000000"})
    // console.log("Execute", Execute)

  }
  const msgParams = JSON.stringify({
    domain: {
      chainId: 4,
      name: "forbitspace Limit Order Protocol",
      verifyingContract: "0xECb3580d9ce42589FF6Eabc74761b0fAa0b805F1",
      version: "1.0.0"
    },
    message: {
      owner: "0xa52487f75f4E4554914810877a78fF9574A98275",
      status: "0",
      tokenIn: "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa",
      tokenOut: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
      amountIn: "1000000000000000000000",

      priceExecute: "0",
      minAmountOut: "0",
      deadline: "1689597635",
      salt: "123456"

      // ["0xa52487f75f4E4554914810877a78fF9574A98275",0,"0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270","0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174","10039583417873241", "0",0,"1689597635","1579"]
      // ["0xa52487f75f4E4554914810877a78fF9574A98275",0,"0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa","0xc778417E063141139Fce010982780140Aa0cD5Ab","1000000000000000000000", "10000",0,"1689597635","1579"]
      // message: {
      //   tokenIn: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      //   tokenOut: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      //   status: 0,
      //   fee: 3000,
      //   recipient: "0xa52487f75f4E4554914810877a78fF9574A98275",
      //   amountIn: "1000000",
      //   amountOutMinimum: 0,
      //   priceExecute: "100",
      //   deadline: "1648855792",
      //   sqrtPriceLimitX96: 0,
      //   salt: 1579
    },
    primaryType: "Order",
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" }
        // { name: "salt", type: "bytes32" },
      ],
      Order: [
        { name: "owner", type: "address" },
        { name: "status", type: "uint256" },
        { name: "tokenIn", type: "address" },
        { name: "tokenOut", type: "address" },
        { name: "amountIn", type: "uint256" },
        { name: "priceExecute", type: "uint256" },
        { name: "minAmountOut", type: "uint256" },
        { name: "deadline", type: "uint256" },
        { name: "salt", type: "uint256" }
      ]
    },
  });

  const hashType = async () => {
    const test = new web3.eth.Contract([{ "inputs": [{ "internalType": "address", "name": "_factory", "type": "address" }, { "internalType": "address", "name": "_feeAddress", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "components": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "status", "type": "uint256" }, { "internalType": "address", "name": "tokenIn", "type": "address" }, { "internalType": "address", "name": "tokenOut", "type": "address" }, { "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "priceExecute", "type": "uint256" }, { "internalType": "uint256", "name": "minAmountOut", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "uint256", "name": "salt", "type": "uint256" }], "internalType": "struct LimitOrders.Order", "name": "ord", "type": "tuple" }, { "internalType": "bytes", "name": "_signature", "type": "bytes" }], "name": "ExecuteCustomOrder", "outputs": [{ "internalType": "bool", "name": "result", "type": "bool" }, { "internalType": "string", "name": "message", "type": "string" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "components": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "status", "type": "uint256" }, { "internalType": "address", "name": "tokenIn", "type": "address" }, { "internalType": "address", "name": "tokenOut", "type": "address" }, { "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "priceExecute", "type": "uint256" }, { "internalType": "uint256", "name": "minAmountOut", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "uint256", "name": "salt", "type": "uint256" }], "internalType": "struct LimitOrders.Order", "name": "ord", "type": "tuple" }], "name": "cancelOrder", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "factory", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "address", "name": "tokenIn", "type": "address" }, { "internalType": "address", "name": "tokenOut", "type": "address" }], "name": "getAmountOut", "outputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_messageHash", "type": "bytes32" }], "name": "getEthSignedMessageHash", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "components": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "status", "type": "uint256" }, { "internalType": "address", "name": "tokenIn", "type": "address" }, { "internalType": "address", "name": "tokenOut", "type": "address" }, { "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "priceExecute", "type": "uint256" }, { "internalType": "uint256", "name": "minAmountOut", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "uint256", "name": "salt", "type": "uint256" }], "internalType": "struct LimitOrders.Order", "name": "ord", "type": "tuple" }], "name": "getMessageHash", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenIn", "type": "address" }, { "internalType": "address", "name": "tokenOut", "type": "address" }], "name": "getPair", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "pair", "type": "address" }, { "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }], "name": "getReserves", "outputs": [{ "internalType": "uint256", "name": "reserveA", "type": "uint256" }, { "internalType": "uint256", "name": "reserveB", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getRouterAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "components": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "status", "type": "uint256" }, { "internalType": "address", "name": "tokenIn", "type": "address" }, { "internalType": "address", "name": "tokenOut", "type": "address" }, { "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "priceExecute", "type": "uint256" }, { "internalType": "uint256", "name": "minAmountOut", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "uint256", "name": "salt", "type": "uint256" }], "internalType": "struct LimitOrders.Order", "name": "ord", "type": "tuple" }], "name": "isNotCancelledOrder", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "name": "msgHashOrderCancel", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "components": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "status", "type": "uint256" }, { "internalType": "address", "name": "tokenIn", "type": "address" }, { "internalType": "address", "name": "tokenOut", "type": "address" }, { "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "priceExecute", "type": "uint256" }, { "internalType": "uint256", "name": "minAmountOut", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "uint256", "name": "salt", "type": "uint256" }], "internalType": "struct LimitOrders.Order", "name": "ord", "type": "tuple" }, { "internalType": "bytes", "name": "_signature", "type": "bytes" }], "name": "recoverSigner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "components": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "status", "type": "uint256" }, { "internalType": "address", "name": "tokenIn", "type": "address" }, { "internalType": "address", "name": "tokenOut", "type": "address" }, { "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "priceExecute", "type": "uint256" }, { "internalType": "uint256", "name": "minAmountOut", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "uint256", "name": "salt", "type": "uint256" }], "internalType": "struct LimitOrders.Order", "name": "ord", "type": "tuple" }, { "internalType": "bytes", "name": "_signature", "type": "bytes" }], "name": "shouldFulfilOrder", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }], "name": "sortTokens", "outputs": [{ "internalType": "address", "name": "token0", "type": "address" }, { "internalType": "address", "name": "token1", "type": "address" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }], "name": "symbolFor", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }]
      , "0x07a846a1f0456A3f74AAC722AB3C7EBf7D3FBaA8").methods
    console.log("Contract", test)
    const hashTypes = await test.getMessageHash(
      ["0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa", "0xc778417E063141139Fce010982780140Aa0cD5Ab", 0, 3000, "0xa52487f75f4E4554914810877a78fF9574A98275", "1000000000000000000000", 0, "553631496811669", "1647855792", 0, 1579])
      .call()
    console.log("hashType", hashTypes)
  }
  const sign = async () => {
    var from = "0xa52487f75f4E4554914810877a78fF9574A98275";
    var params = ["0xff93179af26775c80938d3369bf73e572856c21927b2175d68f7eb2cf0cfff66", from];
    var method = "personal_sign";
    window.ethereum.sendAsync(
      {
        method,
        params,
        from,
      },
      function (err, result) {
        if (err) return console.dir(err);
        if (result.error) {
          alert(result.error.message);
        }
        if (result.error) return console.error("ERROR", result);
        const hash = (result.result);
        setSignature(hash)
        console.log("TYPED SIGNED:" + hash);
        console.log("result:", result);
      }
    );
  };
  const signV4 = async () => {
    var from = "0xa52487f75f4E4554914810877a78fF9574A98275";
    var params = [from, msgParams];
    var method = "eth_signTypedData_v4";
    window.ethereum.send(
      {
        method,
        from,
        params,
      },
      function (err, result) {
        if (err) return console.dir(err);
        if (result.error) {
          alert(result.error.message);
        }
        if (result.error) return console.error("ERROR", result);
        const hash = (result.result);
        setSignature(hash)
        console.log("TYPED SIGNED:" + hash);
        console.log("result:", result);
      }
    )
    // .then(sign());
  };
  console.log("window", window.ethereum)
  const recover = async () => {
    if (!signature) return
    console.log("hash", signature)
    const recovered = sigUtil.recoverTypedSignature_v4({
      data: JSON.parse(msgParams),
      sig: signature,
    });
    console.log("Address", recovered)
    console.log("test", JSON.parse(msgParams))
  };

  useEffect(() => {
    // getHashMSG()
    // console.log("web3", web3)
  }, []);

  return (
    <div>
      {/* Hello {`${account}`}!!!! */}
      <button onClick={() => sign()}>Sign</button>
      <br />
      <button onClick={() => signV4()}>Sign V4</button>
      <br />
      <button onClick={() => hashType()}>HashType</button>
      <br />
      <button onClick={() => recover()}>recover</button>
      <br />
      <button onClick={() => approval("1", "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", "0xBEFC7EEC04bffE123dCe655093AD82817C0A6c08")}>Approval</button>
    </div>
  );
};

export default MaticV3;
