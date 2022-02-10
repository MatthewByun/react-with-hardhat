// import React from "react";
// import {useState} from "react"
// const Moralis = require("moralis");
// // import { useMoralis } from "react-moralis"
// // const { Moralis } = useMoralis()

// function TestSwap({web3}) {
//   const [listTokens, setListTokens] = useState({})

//   const login = async () => {
//     Moralis.authenticate().then(function (user) {
//       console.log(user.get("ethAddress"));
//     });
//     // const serverURL = "https://ng4jhobvofeu.usemoralis.com:2053/server";
//     // const appID = "zRLPmB6Ye35qe3jvVxJDrSdx6uwFY9lHRfTeoCF3";
//     // console.log(serverURL);
//     // console.log(appID);
//     // Moralis.start({ serverURL, appID });
//   };

//   const getListToken = async () => {
//     const options = {
//       address: "0xa52487f75f4E4554914810877a78fF9574A98275",
//       chain: "ropsten",
//     };
//     const Test = Moralis.Web3API.account.getTokenBalances(options)
//     .then(receipt => {
//       console.log(receipt)
//       setListTokens(receipt)
//     });
//     // console.log("Web3 API: ", await Moralis.Web3API.token)
//     console.log("Test List", Test);
//   };

//   const transferNative = async () => {
//     let amountToken = document.querySelector("#amountToken").value;
//     let contractAddress = document.querySelector("#contractAddress").value;
//     let receiver = document.querySelector("#receiver").value;

//     const options = {
//       type: "erc20",
//       amount: Moralis.Units.Token(amountToken, "18"), //sending 10 tokens with 18 decima
//       receiver: receiver, //address receiver
//       contractAddress: contractAddress, //token address
//     };
//     let result = await Moralis.transfer(options);
//     console.log("Result transfer: ", result);
//   };

//   const SwapETH_native = () => {};

//   const SwapNative_eth = () => {};

//   return (
//     <div>
//       <h1>Transfer ERC20 Token</h1>
//       <button onClick={login}>Change Current Account</button>
//       <br />

//       <br />
//       Transfer ERC20 Tokens:
//       <input type="text" id="amountToken" placeholder="Amount" />
//       <input type="text" id="contractAddress" placeholder="Token address" />
//       <input type="text" id="receiver" placeholder="to Address Receiver" />
//       <button onClick={transferNative}>Transfer Native</button>
//       <br />
//       <br />
//       <button onClick={getListToken}>Get Tokens from Wallet!</button>
//       {listTokens.length && listTokens.map((list,index) => (
//         <div key={index}>
//           <h1>{list.name}</h1>
//           <p>{web3.utils.fromWei(list.balance,"ether")} {list.symbol}</p> 
          
//         </div>
//       ))}

//     </div>
//   );
// }

// export default TestSwap;
