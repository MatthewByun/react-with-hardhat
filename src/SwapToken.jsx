import React from "react";
import Web3 from "web3";
import { useEffect, useState } from "react";
import {
  ABI,
  contractAddress,
  tokenDark,
  tokenDoggun,
  tokenSSF,
  tokenWETH,
  tokenSLT,
  SLTABI,
} from "./config";
import TestSwap from "./TestSwap";
// const Moralis = require('moralis');
import {
  ContractAPI_SwapToken,
  ContractAddress_SwapToken,
} from "./abi/abi_swapToken";

import { PairABI, PairAddress } from "./abi/pair";
import { factoryABI, factoryAddress } from "./abi/factory";
import { RouterABI, RouterAddress } from "./abi/router";

const SwapToken = () => {
  const [account, setAccount] = useState();
  const [balance, setBalance] = useState();

  const [ethBalance, setEthBalance] = useState(0);
  const [dugBalance, setDugBalance] = useState(0);
  const [vclBalance, setVclBalance] = useState(0);
  const [ssfBalance, setSSFBalance] = useState(0);
  // const [count, setCount] = useState(0);
  // const [contacts, setContacts] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [name, setName] = useState("");
  // const [content, setContent] = useState("");
  // const [listABI, setListABI] = useState({});
  const [getPairs, setGetPairs] = useState();
  const [lstEthValue, setLstEthValue] = useState({});
  const [getWeb3, setGetWeb3] = useState("");

  useEffect(() => {
    loadBlockChain();
  }, []);

  const loadBlockChain = async () => {
    const web3 = new Web3(Web3.givenProvider);
    setGetWeb3(web3);

    const account =
      (await web3.eth.getAccounts()) && (await web3.eth.requestAccounts());
    setAccount(account[0]);
    console.log("Account: ", account);

    const listEthvalue = await web3.utils.unitMap;
    setLstEthValue(listEthvalue);
    // console.log(web3.utils.unitMap);

    // const checkAddress = await web3.utils.checkAddressChecksum(
    //   "0x431cdC162aFFfBCC9b71593Eb96F74D53c335655"
    // );
    // console.log(checkAddress);

    const balance = await web3.eth.getBalance(account[0]);
    setEthBalance(web3.utils.fromWei(balance, "ether"));

    // balance DarkCoin
    const darkCoin = new web3.eth.Contract(ABI, tokenDark);
    const balanceDark = await darkCoin.methods
      .balanceOf(contractAddress)
      .call();
    setVclBalance(web3.utils.fromWei(balanceDark, "ether"));

    // balance DUG
    const dogCoin = new web3.eth.Contract(ABI, tokenDoggun);
    const balanceDog = await dogCoin.methods.balanceOf(contractAddress).call();
    setDugBalance(web3.utils.fromWei(balanceDog, "ether"));

    // balance SSF from contract
    const ssfCoin = new web3.eth.Contract(
      ABI,
      "0x28AFeECc16EF8C3cbA817B1B91277b00d01eE9F6"
    );
    console.log("SSF", ssfCoin.methods);
    const balanceSSF = await ssfCoin.methods.balanceOf(contractAddress).call();
    setSSFBalance(web3.utils.fromWei(balanceSSF, "ether"));

    //balance Eth from contract
    const abc = await web3.eth.getBalance(
      "0x47473956a4101854aB80321A31E0a407F6A97Bf3"
    );
    console.log("Max Ether", web3.utils.fromWei(abc, "ether"));

    //balance SSF from contract
    const test = new web3.eth.Contract(
      ABI,
      "0x28afeecc16ef8c3cba817b1b91277b00d01ee9f6"
    );
    const balanceTest = await test.methods
      .balanceOf("0x47473956a4101854aB80321A31E0a407F6A97Bf3")
      .call();
    console.log("Max SSF", web3.utils.fromWei(balanceTest, "ether"));

    // const symbol = await dogCoin.methods.symbol().call();
    // console.log("symbol", symbol);

    // create Pair token
    // const pair = new web3.eth.Contract(
    //   CreatePairTokensABI,
    //   "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
    // )

    // console.log(await pair.methods)
    // const getPair = await pair.methods
    // .getPair(
    //   tokenSSF,
    //   tokenDoggun
    // ).call()
    // console.log("Address", getPair)

    // const myFactory = new web3.eth.Contract(
    //   factoryABI,
    //   factoryAddress
    // )

    // console.log("my factory", myFactory.methods)
    // const factory = await myFactory.methods.createPair(
    //   tokenSSF,
    //   tokenDoggun
    // ).call()
    // .then(rep => console.log("rep: " , rep))

    // console.log("factory" , await factory)

    // // const approveSSFCoin = await ssfCoin.methods.approve(
    // //   RouterAddress,
    // //   10000
    // // ).send({
    // //   from: account[0]})
    // // .then(rep => console.log("approve ssf", rep))
    // // console.log(approveSSFCoin)

    // // const approveDugCoin = await dogCoin.methods.approve(
    // //   RouterAddress,
    // //   10000
    // // ).send({
    // //   from:account[0]
    // // })
    // // .then(rep => console.log("approve DUG", rep))
    // // console.log(approveDugCoin)

    // const myRouter = new web3.eth.Contract(
    //   RouterABI,
    //   RouterAddress
    // )
    // console.log("my Router" , myRouter)
    // const router = await myRouter.methods
    // .addLiquidity(
    //   tokenDoggun,
    //   tokenSSF,
    //   10000,
    //   10000,
    //   10000,
    //   10000,
    //   account[0],
    //   Math.floor(Date.now() / 1000) + 60 * 10
    // ).call().then(rep => console.log('something: ' ,rep))
    // console.log("router: ", router)

    //   const testAppro = new web3.eth.Contract(
    //     UniSwapV2ABI,
    //     "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
    //   )

    //   console.log("test appro" , testAppro)

    //  const swapTest = await testAppro.methods
    //  .swapTokensForExactTokens(
    //    10,
    //    20,
    //    ["0x6ec4411ba59b8cfa5e9facfdc0a704f4e3e74cd3","0xc778417e063141139fce010982780140aa0cd5ab"],
    //    account[0],
    //    1000,
    //  ).send({
    //    from: account[0]
    //  })
    //  .then(rep => console.log(rep))

    // const ApproveEth = await testAppro.methods
    // .approve(
    //   "0x28AFeECc16EF8C3cbA817B1B91277b00d01eE9F6",
    //   1000000000000
    // ).send({
    //   from: account[0]
    // })
    // console.log(ApproveEth)

    // const transferTest = await testAppro.methods
    // .transfer(
    //   tokenSSF,
    //   1000000000000000
    // ).send({
    //   from:account[0],
    // })
    // .then(rep => console.log(rep))

    // // console.log(createPair)

    // const unitest = new web3.eth.Contract(
    //   UniSwapV2ABI,
    //   getPair
    // )

    // console.log("test", unitest.methods)
    // const uniAddLiquidity = await unitest.methods
    // .addLiquidity(
    //   tokenDoggun, //tokenA:
    //   tokenSSF, //tokenB:
    //   50, //amountADesired:
    //   20, //amountBDesired:
    //   3, //amountAMin:
    //   1, //amountBMin:
    //   getPair,//toAddress:
    //   Date.now() + 100000// deadline
    // ).send({
    //   from: account[0]
    // })
    // .then(receipt => console.log(receipt))
    // console.log("Uni test: ", unitest)
    // console.log("Addliquidity ", uniAddLiquidity)

    // const addLiquidityETH = await unitest.methods.addLiquidityETH(
    //   tokenSSF,
    //   10,
    //   10,
    //   5,
    //   "0xaC0Aea88627AB792447DBBd7A58804569525728c",
    //   1
    // ).send({
    //   from: account[0]
    // })
    // console.log("test" , addLiquidityETH)
  };

  function getAmountOut(amountIn, reserveIn, reserveOut) {
    if (amountIn <= 0 || reserveIn <= 0 || reserveOut <= 0) return "Undefined";
    let amountInWithFee = amountIn * 997; //  1* 997
    let numerator = amountInWithFee * reserveOut; // 997 * 66.7334000667334
    let denominator = reserveIn * 1000 + amountInWithFee; //  1.5 * 1000 + 997
    let amountOut = numerator / denominator;
    return amountOut;
  }

  function getPriceImpact(fee, amountTrade, reservesA) {
    let amount = amountTrade * (1 - fee);
    return amount / (reservesA + amount);
  }

  const handleFactory = async (getWeb3) => {
    const factory = new getWeb3.eth.Contract(factoryABI, factoryAddress);
    console.log("Test factory", await factory.methods);
    const getPair = await factory.methods.getPair(tokenSSF, tokenSLT).call();
    console.log("get pair", getPair);
  };
  const addLiquidity = async (getWeb3) => {
    // var BN = getWeb3.utils.BN
    const router = new getWeb3.eth.Contract(RouterABI, RouterAddress);
    const factory = new getWeb3.eth.Contract(factoryABI, factoryAddress);

    var amount1Desired = (50 * 10 ** 18).toString();
    var amount2Desired = (10 * 10 ** 18).toString();
    var amount1Min = (5 * 10 ** 18).toString();
    var amount2Min = (1 * 10 ** 18).toString();
    var deadline = (2 * 10 ** 15).toString();

    // console.log(getAmountOut(1, 1, 1));
    // console.log((amountDesired),"10000000")
    console.log(router.methods);
    // await asdasd
    const ssfCoin = new getWeb3.eth.Contract(ABI, tokenSSF);
    const dogCoin = new getWeb3.eth.Contract(ABI, tokenDoggun);

    const getpair = await factory.methods.getPair(tokenSSF, tokenSLT).call();
    if (getpair == "0x0000000000000000000000000000000000000000") {
      await factory.methods
        .createPair(tokenSLT, tokenSSF)
        .send({ from: account })
        .then((rep) =>
          rep != "0x0000000000000000000000000000000000000000"
            ? setGetPairs(rep)
            : console.log(rep)
        );
    }
    console.log(
      "Pair",
      await factory.methods.getPair(tokenSSF, tokenSLT).call()
    );
    console.log("getPairs", getPairs);
    console.log("get pair for",  )
    var amountDesired = (500 * 10 ** 18).toString();
    var amountMin = (0.5 * 10 ** 18).toString();
    var amountETHMin = (1 * 10 ** 18).toString();
    // approve
    // await ssfCoin.methods
    //   .approve(getPairs.to, 100000000)
    //   .send({ from: account })
    //   .then((rep) => console.log(rep));
    // const sltCoin = new getWeb3.eth.Contract(SLTABI, tokenSLT);
    // await sltCoin.methods
    //   .approve(getPairs.to, 1000000000)
    //   .send({ from: account })
    //   .then((rep) => console.log(rep));
      console.log("getpairfor", await router.methods.getPairFor(tokenSLT, tokenSSF).call());

    // await router.methods
    //         .addLiquidityETH(
    //           tokenSLT,/*  */
    //           amountDesired,
    //           amountMin,
    //           amountETHMin,
    //           contractAddress,
    //           deadline
    //         )
    //         .send({
    //           from: account,
    //           value: amountETHMin
    //         })
    //         .then((rep) => console.log("Receipt: ", rep));
    // await dogCoin.methods
    //   .approve(RouterAddress, amountDesired)
    //   .call({from: account})
    //   .then(rep => console.log("apprroSucces",rep));
    // await ssfCoin.methods
    //     .approve("0x68B7B3b59eD37ebF80787a1ADC7331bEA79F10a7", amountDesired)
    //     .call({from: account})
    //     .then(rep => console.log(rep));
    // add
    await router.methods
          .addLiquidity(
            tokenSSF,
            tokenSLT,
            amount1Desired,
            amount2Desired,
            amount1Min,
            amount2Min,
            contractAddress,
            deadline
          )
          .send({from: account, value: amountETHMin})
          .then(rep => console.log(rep))

    //add
  };

  const handleRouter = async (getWeb3) => {
    // const BN = getWeb3.utils.BN
    // // console.log(BN)
    const router = new getWeb3.eth.Contract(RouterABI, RouterAddress);

    console.log(await router.methods);
    // const amountETH =1
    // const reserveETH =1.5
    // const reserveSSF =66.7334000667334
    // console.log("1",getAmountOut(1, 0, 100))
    // console.log("2",getAmountOut(amountETH, reserveETH, reserveSSF))
  };

  const handlePair = async (getWeb3) => {
    const pair = new getWeb3.eth.Contract(
      PairABI,
      "0x9a06A5C3077982676Cc6A8A0d7Fd3c556C42C962"
    );
    // console.log("Pair ", await test.methods);
    const getReserves = await pair.methods.getReserves().call();
    var reserveETH;
    var reserveSSF;
    if (tokenSLT < tokenSSF) {
      reserveETH = getReserves[0];
      reserveSSF = getReserves[1];
    } else {
      reserveETH = getReserves[1];
      reserveSSF = getReserves[0];
    }
    console.log("reservesETH", reserveETH / 10 ** 18);
    console.log("reservesSSF", reserveSSF / 10 ** 18);
    // const Pair = new getWeb3.eth.Contract(PairABI, PairAddress);
    // console.log("Pair ", await Pair.methods);
    // const getReserves = await Pair.methods.getReserves().call();
    // var reserveETH;
    // var reserveSSF;
    // if (tokenWETH < tokenSSF) {
    //   reserveETH = getReserves[0];
    //   reserveSSF = getReserves[1];
    // } else {
    //   reserveETH = getReserves[1];
    //   reserveSSF = getReserves[0];
    // }
    // console.log("reservesETH", reserveETH/(10**18));
    // console.log("reservesSSF", reserveSSF/(10**18));
    // console.log(
    //   "2 ETH - ",
    //   getAmountOut(2 * 10 ** 18, reserveETH, reserveSSF)/(10**18),
    //   "priceImpact: ",
    //   getPriceImpact(0.125, 1, reserveETH/(10**18))*100
    // );
  };

  const handleValue = (getWeb3) => {
    const ethValue = document.querySelector("#etherValue").value;
    const nbValue = document.querySelector("#numberValue").value;
    const addressReceive = document.querySelector("#addressReceive").value;
    // console.log(value);

    getWeb3.eth
      .sendTransaction({
        to: addressReceive,
        from: account,
        value: nbValue * ethValue,
      })
      .then(function (receipt) {
        console.log(receipt);
        receipt && alert("Done!!!!!");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      });
  };

  const handleBalance = () => {
    const value = document.querySelector("#balance").value;
    const List = {
      eth: ethBalance,
      dug: dugBalance,
      vcl: vclBalance,
      ssf: ssfBalance,
    };

    value == "eth" ? setBalance(List.eth) : console.log();
    value == "dug" ? setBalance(List.dug) : console.log();
    value == "vcl" ? setBalance(List.vcl) : console.log();
    value == "ssf" ? setBalance(List.ssf) : console.log();

    // setBalance(value)
  };
  const sendEthtoContract = async (getWeb3, account) => {
    const contract = new getWeb3.eth.Contract(
      ContractAPI_SwapToken,
      ContractAddress_SwapToken
    );
    const amount = document.querySelector("#sendToContract").value;
    await contract.methods
      .sendEth()
      .send({
        from: account,
        value: amount * 1000000000000000000,
      })
      .then((receipt) => console.log(receipt));
  };

  const buyEthwithNativeToken = async (getWeb3, account) => {
    const amount = document.querySelector("#swapvalue_ssf").value;

    const contract = new getWeb3.eth.Contract(
      ContractAPI_SwapToken,
      ContractAddress_SwapToken
    );
    const nativeToken = new getWeb3.eth.Contract(ABI, tokenSSF);
    await nativeToken.methods
      .approve(ContractAddress_SwapToken, `${amount}000000000000000000`)
      .send({
        from: account,
      })
      .then((receipt) => console.log(receipt));

    await contract.methods
      .sellToken(`${amount}000000000000000000`)
      .send({
        from: account,
      })
      .then((receipt) => console.log(receipt));
  };

  const buyNativeTokenwithEth = async (getWeb3, account) => {
    const amount = document.querySelector("#swapvalue_eth").value;
    const contract = new getWeb3.eth.Contract(
      ContractAPI_SwapToken,
      ContractAddress_SwapToken
    );

    await contract.methods
      .buyToken()
      .send({
        from: account,
        value: amount * 1000000000000000000, // change to ether value
      })
      .then((receipt) => console.log("Success!!!", receipt));
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Welcome to Space Byun!!!</h1>
        <h3>Your Account: </h3> {account}
        {/* <h3>Task Count: {count}</h3> */}
        <h3>Balance: {balance}</h3>
        <label htmlFor="balance"> Balance: </label>
        <select name="balance" id="balance">
          <option value="eth">ETH</option>
          <option value="dug">Doggun</option>
          <option value="vcl">DarkCoin</option>
          <option value="ssf">Secret Space Fintech</option>
        </select>
        <button onClick={() => handleBalance()}>Get</button>
        <h1>Transfer ETH: </h1>
        <div className="input-transfer">
          {/* Transfer: <br /> */}
          Transactions to address: <input
            type="text"
            id="addressReceive"
          />{" "}
          <br />
          Value: <input type="text" id="numberValue" /> <br />
          <label htmlFor="etherValue">Ether Value: </label>
          <select name="etherValue" id="etherValue">
            <option value={lstEthValue.Gwei}>Gwei</option>
            <option value={lstEthValue.Kwei}>Kwei</option>
            <option value={lstEthValue.Mwei}>Mwei</option>
            <option value={lstEthValue.babbage}>babbage</option>
            <option value={lstEthValue.ether}>ether</option>
            <option value={lstEthValue.femtoether}>femtoether</option>
            <option value={lstEthValue.finney}>finney</option>
            <option value={lstEthValue.gether}>gether</option>
            <option value={lstEthValue.grand}>grand</option>
            <option value={lstEthValue.gwei}>gwei</option>
            <option value={lstEthValue.kether}>kether</option>
            <option value={lstEthValue.kwei}>kwei</option>
            <option value={lstEthValue.lovelace}>lovelace</option>
            <option value={lstEthValue.mether}>mether</option>
            <option value={lstEthValue.micro}>micro</option>
            <option value={lstEthValue.microether}>microether</option>
            <option value={lstEthValue.milli}>milli</option>
            <option value={lstEthValue.milliether}>milliether</option>
            <option value={lstEthValue.mwei}>mwei</option>
            <option value={lstEthValue.nano}>nano</option>
            <option value={lstEthValue.nanoether}>nanoether</option>
            <option value={lstEthValue.noether}>noether</option>
            <option value={lstEthValue.picoether}>picoether</option>
            <option value={lstEthValue.shannon}>shannon</option>
            <option value={lstEthValue.szabo}>szabo</option>
            <option value={lstEthValue.tether}>tether</option>
            <option value={lstEthValue.wei}>wei</option>
          </select>
          <button onClick={() => handleValue(getWeb3)}>Confirm!</button>
        </div>
        <br />
        <h1>Swap Token</h1>
        <br />
        Send ETH to contract:
        <input type="text" id="sendToContract" placeholder="Amount value" />
        <button onClick={() => sendEthtoContract(getWeb3, account)}>
          Test
        </button>
        <br />
        <br />
        <br />
        Change SSF Token to ETH:
        <input type="text" id="swapvalue_ssf" placeholder="1 SSF -> 0.01 ETH" />
        <button onClick={() => buyEthwithNativeToken(getWeb3, account)}>
          Change!
        </button>
        <br />
        <br />
        Change ETH to SSF Token:
        <input type="text" id="swapvalue_eth" placeholder="1 ETH -> 100 SSF" />
        <button onClick={() => buyNativeTokenwithEth(getWeb3, account)}>
          Change!
        </button>
        <br />
        <br />
        Test Factory:
        <button onClick={() => handleFactory(getWeb3)}>Test Factory</button>
        <br />
        Test Router:
        <button onClick={() => handleRouter(getWeb3)}>Test Router</button>
        <br />
        Test Pair:
        <button onClick={() => handlePair(getWeb3)}>Pair</button>
        {/* <div className="input">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createTask(listABI, name, content, account);
                }}
              >
                <input
                  type="text"
                  onChange={handleName}
                  value={name}
                  placeholder="Name..."
                />
                <input
                  type="text"
                  onChange={handleContent}
                  value={content}
                  placeholder="Content..."
                />
                <button
                  onClick={() => {
                    createTask(listABI, name, content, account);
                  }}
                >
                  Confirm!
                </button>
              </form>
            </div> */}
        {/* {contacts.map((contact, index) => (
              <div className="content" key={index}>
                <span>
                  {" "}
                  <input type="checkbox" />
                  {index + 1}. Name : {contact.getname}
                </span>
                <p>Content: {contact.content}</p>
              </div>
            ))} */}
      </div>
      <TestSwap web3={getWeb3} />
      <br />
      AddLiquidityETH:{" "}
      <button onClick={() => addLiquidity(getWeb3)}>Test</button>
    </div>
  );
};

export default SwapToken;
