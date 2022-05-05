import React, { useEffect } from "react";
import Web3 from "web3";
import { BigNumber } from "ethers";
import { ethers } from "ethers";
import * as PairUniV2 from "../abi/uniswapv2/pair";
// import * as ABI from "../abi/ABI"
import * as ABI from "../abi/ABI_MATIC"
import * as Mutical from "../abi/ABIMuticall"
const HandlePrice = () => {
  const web3 = new Web3(Web3.givenProvider);
  const token = {
    //ethereum
    // WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    // USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",

    //matic
    WMATIC: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    AAVE: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
    USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    USDT: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"
  };
  const whiteList = {
    USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    UST: "0x692597b009d13C4049a947CAB2239b7d6517875F",
    WETH: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
    // BUSD: "0xdAb529f40E671A1D4bF91361c21bf9f0C9712ab7",
    DAI: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    // FRAX: "0x45c32fA6DF82ead1e2EF74d17b76547EDdFaFF89",
    // FTM: "0xC9c1c1c20B3658F8787CC2FD702267791f224Ce1",
    // TUSD: "0x2e1AD108fF1D8C782fcBbB89AAd783aC49586756",
    // PAX: "0x6F3B3286fd86d8b47EC737CEB3D0D354cc657B3e",
    miMATIC: "0xa3Fa99A148fA48D14Ed51d610c367C61876997F1"
  }



  const calculateAmountOut = (amountIn, reserveIn, reserveOut, fee) => {
    if (amountIn <= 0 || reserveIn <= 0 || reserveOut <= 0) return "Undefined";
    let amountInWithFee = amountIn * fee; //  1* 997
    let numerator = amountInWithFee * reserveOut; // 997 * 66.7334000667334
    let denominator = reserveIn + amountInWithFee; //  1.5 * 1000 + 997
    let amountOut = numerator / denominator;

    let newReserveIn = Number(reserveIn) + Number(amountInWithFee)
    // let newReserveOut = Number(reserveIn) * Number(reserveOut) / Number(newReserveIn)
    let newReserveOut = Number(reserveOut) * Number(reserveIn) / Number(newReserveIn)
    return { amountOut, newReserveIn, newReserveOut };
  }

  const handleNumber = (amount, decimals) => {
    var BN = web3.utils.BN;
    const amountTokenIn = (amount * (10 ** decimals)).toLocaleString("fullwide", {
      useGrouping: false,
    });
    let number = new BN(amountTokenIn).toString();
    return number;
  };
  const getPriceImpact = (amountIn, reservesA) => {
    let fee = 0.03;
    let amountWithFee = Number(amountIn) * (1 - fee);
    return Number((amountWithFee / (Number(reservesA) + amountWithFee) * 100).toFixed(2))
  }

  const divDecimals = (number, decimals) => {
    return number / (10 ** decimals)
  }
  const mulDecimals = (number, decimals) => {
    return number * (10 ** decimals)
  }

  const PriceImpact = async (amountIn, amountOut, reserveInConvert, reserveOutConvert) => {
    const amountInConvert = amountIn * 997 / 1000
    const amountOutConvert = amountOut * 995 / 1000
    const deltaReserveIn = amountInConvert / Number(reserveInConvert)
    const deltaReserveOut = amountOutConvert / Number(reserveOutConvert)

    const priceImpact = Math.min(deltaReserveIn, deltaReserveOut)

    const result = (priceImpact * 100).toFixed(2)
    // console.log('Price impact =>>>', result, '%');
  }

  function fixedNumber(number) {
    return Number((number).toFixed(4))
  }
  const splitPercentAmount = async (number, stamp) => {
    let array = []
    const splitPercent = (number, val, temp) => {
      number > temp ?
        splitPercent(fixedNumber(number - temp), fixedNumber(val + temp), temp)
        : console.log()
      array.includes([number, val].sort().toString()) ? console.log() : array.push([number, val].sort().toString())
      return array
    }
    let min = fixedNumber(number / stamp)
    let Array = splitPercent(number, 0, min)
    let Result = Array.map(item => item.split(","))
    return Result
  }
  const splitAmountIn = async (number, stamp) => {
    let amountIn = number
    let arr = []
    const splitAmount = (firstVal, secondVal, thirdVal, stamp) => {
      (firstVal > stamp)
        ? (secondVal > stamp)
          ? splitAmount(firstVal, fixedNumber(secondVal - stamp), fixedNumber(thirdVal + stamp), stamp)
          : splitAmount(fixedNumber(firstVal - stamp), fixedNumber(secondVal + stamp), thirdVal, stamp)
        : console.log()
      arr.includes([firstVal, secondVal, thirdVal].sort().toString()) ? console.log() : arr.push([firstVal, secondVal, thirdVal].sort().toString())
      return arr
    }
    let min = fixedNumber(amountIn / stamp)
    let Array = splitAmount(amountIn, 0, 0, min)

    let Arr = Array.map(val => val.split(","))
    return Arr
  }

  const filterArray = (data) => {
    return data.map(val => {
      return val.filter((item) => item != 0)
    })
  }

  const handleAmoutOut = async (tokenIn, tokenOut) => {
    const number = document.querySelector('#amountIn').value
    const divStamp = 20
    const divPercent = 20
    console.time("--")
    const listReserves = await getAllReserve(tokenIn, tokenOut)
    const listPercentAmountIn = await splitPercentAmount(number, divPercent)
    let result = []
    let data = filterArray(listPercentAmountIn)
    
    console.log("data", data)
    await Promise.all(data.map(async (item, index) => {
      let value0 = await splitAmountIn(Number(item[0]), divStamp)
      let filterA = filterArray(value0)
      let dataA_B_0 = await getAmountOut(filterA, listReserves)
      let dataA_mid_B_0 = await getPriceWhiteList(filterA, tokenIn, tokenOut, divStamp)
      let data_0
      dataA_B_0.totalAmountOut > dataA_mid_B_0.totalAmountOut ? data_0 = dataA_B_0 : data_0 = dataA_mid_B_0

      if (item[1]) {
        let b = await splitAmountIn(Number(item[1]), divStamp)
        let filterB = filterArray(b)
        let dataA_B_1 = await getAmountOut(filterB, listReserves)
        let dataA_mid_B_1 = await getPriceWhiteList(filterB, tokenIn, tokenOut, divStamp)
        let total_0 = dataA_B_0.totalAmountOut + dataA_mid_B_1.totalAmountOut
        let total_1 = dataA_B_1.totalAmountOut + dataA_mid_B_0.totalAmountOut
        total_0 > total_1 ?
          result.push({ totalValue: Number(item[0]) + Number(item[1]), totalAmountOut: total_0, value0: item[0], dataA_B_0, value1: item[1], dataA_mid_B_1 }) :
          result.push({ totalValue: Number(item[0]) + Number(item[1]), totalAmountOut: total_1, value0: item[0], dataA_B_1, value1: item[1], dataA_mid_B_0 })
        return result
      } else {
        return result.push({ totalValue: Number(item[0]), totalAmountOut: data_0.totalAmountOut, value0: item[0], data_0 })
      }
    }))
    let b = result.sort((a, b) => b.totalAmountOut - a.totalAmountOut)
    console.timeEnd("--")

    console.log('Result =>', b)
  }

  const getTokenContract = (address) => {
    const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com")
    const factory = new ethers.Contract(address, PairUniV2.abi, provider)
    return factory;
  };

  const getDecimal = async (address, pair) => {
    // const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com")

    // const factory = new ethers.Contract(address, PairUniV2.abi,provider)
    let data = new web3.eth.Contract(pair.abi, address).methods;
    return await data.decimals();
  };

  const getAllReserve = async (tokenIn, tokenOut) => {
    let listExchange = Object.entries(ABI).map((item) => {
      return {
        exchange: item[0],
        data: item[1]
      }
    })
    const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com")
    const multicall = new ethers.Contract(Mutical.adrData, Mutical.abiData, provider);
    const factoryInterface = new ethers.utils.Interface(ABI.Ape.factory.abi)
    const pairEncodeDatas = Object.entries(ABI).map((item) => {
      const factory = new ethers.Contract(item[1].factory.adr, item[1].factory.abi)
      return {
        target: item[1].factory.adr,
        callData: factory.interface.encodeFunctionData('getPair', [tokenIn, tokenOut])
      }
    })

    const [, pairDatas] = await multicall.callStatic.aggregate(pairEncodeDatas)
    const pairs = pairDatas.map(item => factoryInterface.decodeFunctionResult('getPair', item))
    const pairContracts = pairs.map(item => new ethers.Contract(item[0], PairUniV2.abi, provider))
    const reserveEncodeDatas = pairContracts.map((contract, index) => {
      return {
        target: pairs[index][0],
        callData: contract.interface.encodeFunctionData('getReserves', [])
      }
    })

    const [, reserveDatas] = await multicall.callStatic.aggregate(reserveEncodeDatas)
    const pairInterface = new ethers.utils.Interface(PairUniV2.abi)
    listExchange = listExchange.filter((item, index) => reserveDatas[index] != '0x')

    const filteredReserve = reserveDatas.filter((item, index) => {
      return item != "0x"
    })

    const tokenInContract = getTokenContract(tokenIn)
    const tokenOutContract = getTokenContract(tokenOut)

    const decimalEncodeData = [{
      target: tokenIn,
      callData: tokenInContract.interface.encodeFunctionData('decimals', []),
    },
    {
      target: tokenOut,
      callData: tokenOutContract.interface.encodeFunctionData('decimals', [])
    }]
    const [, decimalDatas] = await multicall.callStatic.aggregate(decimalEncodeData)

    const decimalDecodeDatas = decimalDatas.map((item, index) => {
      return [tokenInContract, tokenOutContract][index].interface.decodeFunctionResult('decimals', item)
    })

    const reserves = filteredReserve.map((item, index) => {
      let res0, res1
      if (tokenIn < tokenOut) {
        res0 = Number(pairInterface.decodeFunctionResult('getReserves', item)[0])
        res1 = Number(pairInterface.decodeFunctionResult('getReserves', item)[1])
      } else {
        res0 = Number(pairInterface.decodeFunctionResult('getReserves', item)[1])
        res1 = Number(pairInterface.decodeFunctionResult('getReserves', item)[0])
      }
      return {
        reserveInConvert: res0 / (10 ** decimalDecodeDatas[0][0]),
        reserveOutConvert: res1 / (10 ** decimalDecodeDatas[1][0]),
        exchange: listExchange[index].exchange,
        fee: listExchange[index].data.fee
      }
    })
    console.log("Reserves =>", reserves)
    return reserves
  }


  const getAmountOut = async (filterArray, listReserves) => {
    if(listReserves.length == 0) return
    console.log("filterArray",filterArray)
    console.log("listReserves =>",listReserves)
    let lstAmountOut = []
    await Promise.all(filterArray.map(async (Array, id) => {
      let cloneReserve = [...listReserves]
      let cloneList = []
      await Promise.all(Array.map(async (item, idx) => {
        let arrAmountOut = []
        await listReserves.map(async (items, index) => {
          // if(!items.reserveInConvert ) return
          let getAmountOut
          if (idx == 0) {
            getAmountOut = calculateAmountOut(item, items.reserveInConvert, items.reserveOutConvert, items.fee)
            cloneReserve[index] = { exchange: items.exchange, amountOut: getAmountOut.amountOut, oldReserveIn: cloneReserve[index].reserveInConvert, newReserveIn: getAmountOut.newReserveIn, newReserveOut: getAmountOut.newReserveOut, oldReserveOut: cloneReserve[index].reserveOutConvert }
            arrAmountOut.push({ id, number: idx, exchange: items.exchange, amountIn: item, ...getAmountOut, newReserves: cloneReserve[index] })
            cloneList = await arrAmountOut
          }
          if (idx == 1) {
            await cloneReserve[index].newReserveIn
            let d = cloneList.sort(function (a, b) {
              return b.amountOut - a.amountOut
            })
            
            if (items.exchange === cloneList[0].exchange) {
              getAmountOut = calculateAmountOut(item, cloneReserve[index].newReserveIn, cloneReserve[index].newReserveOut, items.fee)
              cloneReserve[index] = { exchange: items.exchange, amountOut: getAmountOut.amountOut, oldReserveIn: cloneReserve[index].newReserveIn, newReserveIn: getAmountOut.newReserveIn, newReserveOut: getAmountOut.newReserveOut, oldReserveOut: cloneReserve[index].newReserveOut }
            } else {
              getAmountOut = calculateAmountOut(item, cloneReserve[index].oldReserveIn, cloneReserve[index].oldReserveOut, items.fee)
              cloneReserve[index] = { exchange: items.exchange, amountOut: getAmountOut.amountOut, oldReserveIn: cloneReserve[index].oldReserveIn, newReserveIn: getAmountOut.newReserveIn, newReserveOut: getAmountOut.newReserveOut, oldReserveOut: cloneReserve[index].oldReserveOut }
            }
            arrAmountOut.push({ id, number: idx, exchange: items.exchange, amountIn: item, ...getAmountOut, newReserves: cloneReserve[index] })
            cloneList = await arrAmountOut
          }
          if (idx == 2) {
            await cloneReserve[index].newReserveIn
            await cloneList
            let list = cloneList.sort(function (a, b) {
              return b.amountOut - a.amountOut
            })
            if (items.exchange === cloneList[0].exchange) {
              getAmountOut = calculateAmountOut(item, cloneReserve[index].newReserveIn, cloneReserve[index].newReserveOut, items.fee)
              cloneReserve[index] = { exchange: items.exchange, amountOut: getAmountOut.amountOut, oldReserveIn: cloneReserve[index].newReserveIn, newReserveIn: getAmountOut.newReserveIn, newReserveOut: getAmountOut.newReserveOut, oldReserveOut: cloneReserve[index].newReserveOut }
            } else {
              getAmountOut = calculateAmountOut(item, cloneReserve[index].oldReserveIn, cloneReserve[index].oldReserveOut, items.fee)
              cloneReserve[index] = { exchange: items.exchange, amountOut: getAmountOut.amountOut, oldReserveIn: cloneReserve[index].oldReserveIn, newReserveIn: getAmountOut.newReserveIn, newReserveOut: getAmountOut.newReserveOut, oldReserveOut: cloneReserve[index].oldReserveOut }
            }
            cloneReserve[index] = { exchange: items.exchange,amountOut: getAmountOut.amountOut, oldReserveIn: cloneReserve[index].oldReserveIn, newReserveIn: getAmountOut.newReserveIn, newReserveOut: getAmountOut.newReserveOut, oldReserveOut: cloneReserve[index].oldReserveOut  }
            arrAmountOut.push({ id, number: idx, exchange: items.exchange, amountIn: item, ...getAmountOut, newReserves: cloneReserve[index] })
            cloneList = await arrAmountOut
          }
        })
        arrAmountOut.sort((a, b) => b.amountOut - a.amountOut)
        lstAmountOut.push({ id, "highestValue": arrAmountOut })
      }))
    }))
    let b = lstAmountOut.map((val) =>
      val.highestValue.sort((a, b) => b.amountOut - a.amountOut)
    )
    let listHighestVal = lstAmountOut.map(val => val.highestValue[0])
    let finalResult = []
    await Promise.all(filterArray.map(async (val, index) => {
      let list = listHighestVal.filter(val => val && val.id == index)
      let amountOut = 0
      let lstExchange = []
      await Promise.all(list.map(async (item, idx) => {
        amountOut += item.amountOut
        lstExchange.push({ exchange: item.exchange, amountIn: Number(val[idx]), amountOut: item.amountOut, newReserves: item.newReserves })
      }))
      finalResult.push({ totalAmountIn: Number(filterArray[filterArray.length - 1][0]), totalAmountOut: amountOut, data: lstExchange })
    }))
    let a = finalResult.sort((a, b) => b.totalAmountOut - a.totalAmountOut)[0]
    return a
  }

  const getPriceTokenToken = async (number, tokenIn, tokenOut) => {
    const amount = number
    const result = await getAmountOut(amount, tokenIn, tokenOut)
    console.log("result A -> C =>", result)
    const a = result.data.sort((a, b) => b.amountIn - a.amountIn)[0]
    console.log("a", a)
    // const splitA = await getAmountOut(a.amountIn,tokenIn,tokenOut)
    // console.log("result splitA =>", splitA)
    // const splitAMid = await getPriceWhiteList(a.amountIn,tokenIn,tokenOut)
    // console.log("result splitA_Mid", splitAMid)
  }

  const getPriceWhiteList = async (data, tokenIn, tokenOut, stamp) => {
    let list = Object.entries(whiteList)
    let a = []
    let filterDataA = filterArray(data)

    await Promise.all(list.map(async (val) => {
      if (val[1] === tokenOut) return
      let reservesIn_B = await getAllReserve(tokenIn, val[1])
      let reservesB_Out = await getAllReserve(val[1], tokenOut)

      if(reservesIn_B.length>0 && reservesB_Out.length>0){
      
        let tokenIn_B = await getAmountOut(filterDataA, reservesIn_B)
        if(fixedNumber(tokenIn_B.totalAmountOut) == 0) return
        let min = fixedNumber(tokenIn_B.totalAmountOut / stamp)
        let dataB = await splitAmountIn(tokenIn_B.totalAmountOut, min)
        let filterDataB = filterArray(dataB)
        let B_tokenOut = await getAmountOut(filterDataB, reservesB_Out)
        // let amountOut = tokenIn_B.totalAmountOut * (B_tokenOut.totalAmountOut / B_tokenOut.totalAmountIn)
        let amountOut = B_tokenOut.totalAmountOut
        a.push({ tokenB: val[0], tokenIn_B, B_tokenOut, totalAmountOut: amountOut })
      }
    }))
    let result = a.sort((a, b) => b.totalAmountOut - a.totalAmountOut)
    return result[0]
  }

  const getPrice = async (tokenIn, tokenOut) => {
    const number = document.querySelector('#amountIn').value
    await getPriceTokenToken(number, tokenIn, tokenOut)
    await getPriceWhiteList(number, tokenIn, tokenOut)
  }



  const getData = async (tokenIn, tokenOut) => {
    let data = await getAmountOut(tokenIn, tokenOut)
    let result = []
    console.log("data =======>", data)
    await Promise.all(data.data.map(async (val) => {
      console.log(val)
      let router = ABI[val.exchange].router.adr
      let args = await buildDataSwapUniswapV2(val, router, tokenIn, tokenOut)
      result.push(...args)
    }))

    console.log("result =>", result)
  }

  const buildDataSwapUniswapV2 = async (data, router, tokenIn, tokenOut) => {
    const methodName = "swapTokensForExactTokens";
    const path = [tokenIn, tokenOut]
    const multicall = "0xBEFC7EEC04bffE123dCe655093AD82817C0A6c08"
    const deadline = 1651959782
    const slippagePercent = 50
    const decimalTokenFrom = await getDecimal(
      tokenIn, PairUniV2
    );
    const decimalTokenTo = await getDecimal(
      tokenOut, PairUniV2
    );
    const a = (data.amountIn * (100 + slippagePercent / 100)) / 100;
    const test = ethers.utils.parseUnits(
      a.toFixed(decimalTokenFrom).toString(),
      decimalTokenFrom
    )
    // const amountOutMinimum = ethers.utils.parseUnits(a.toFixed(decimalTokenTo).toString(), decimalTokenTo).toHexString()
    const amountOut = ethers.utils
      .parseUnits(
        data.amountOut.toFixed(decimalTokenTo).toString(),
        decimalTokenTo
      )
      .toHexString();
    const amountIn = BigNumber.from(test).toHexString();
    const args = [
      amountOut, //amountOut
      amountIn, //amountIn
      path, //[tokenIn, tokenOut]
      multicall, //0xBEFC7EEC04bffE123dCe655093AD82817C0A6c08
      deadline
    ];
    const contract = getRouterV2Web3Contract(router);
    const txnEncode = contract.methods[methodName](...args).encodeABI();
    return {
      exchangeTarget: router,
      swapData: txnEncode,
      addressToApprove: router,
      tokenIn: tokenIn,
      tokenOut: tokenOut
    }
  };

  function getRouterV2Web3Contract(router) {
    const web3 = new Web3(Web3.givenProvider);
    const contract = new web3.eth.Contract(ABI.QuickSwap.router.abi, router);
    return contract;
  }

  const dataContract = async (tokenIn, tokenOut) => {
    const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com")
    // const provider = new ethers.getDefaultProvider()
    const contract = new ethers.Contract(Mutical.adrData, Mutical.abiData, provider)
    const listReserve = await getAllReserve(tokenIn, tokenOut)
    console.log("listReserve", listReserve)

    const dataEncode = [
      {
        target: listReserve,
        //getAllReserve(tokenIn, tokenOut)
        callData: contract.interface.encodeFunctionData('aggregate', [])
      }
    ]
    const [, data] = await contract.callStatic.aggregate(dataEncode)

    // const dataDecode = {
    //   listReserve: contract.interface.decodeFunctionData("Reserves", [data])
    // }
    console.log("contract", data)
  }


  const testSwap = async (tokenIn, tokenOut) => {
    const contract = new web3.eth.Contract(Mutical.abi, Mutical.address).methods
    console.log("contract => ", contract)
    let data = await getAmountOut(tokenIn, tokenOut)
    let result = []
    console.log("data =======>", data)
    await Promise.all(data.data.map(async (val) => {
      console.log(val)
      let router = ABI[val.exchange].router.adr
      let args = await buildDataSwapUniswapV2(val, router, tokenIn, tokenOut)
      result.push(args)
    }))
    console.log("result =>", result)
    const decimalTokenFrom = await getDecimal(
      token.USDC, PairUniV2
    );
    const a = (data.totalAmountIn * (100 + 60 / 100)) / 100
    const amountIn = ethers.utils.parseUnits(
      a.toString(),
      decimalTokenFrom
    ).toHexString()

    const recipient = "0xc0091C37A375dC8EfDa13204A28dFD33e6AF89DD"

    console.log('amountIn', amountIn)
    const ETH_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    console.log(tokenIn)
    // if (tokenIn == ETH_ADDRESS) {
    //   await contract.aggregate(
    //     ETH_ADDRESS,
    //     tokenOut,
    //     amountIn,
    //     recipient,
    //     result
    //   ).send({ from: recipient, value: amountIn })
    // } else {
    //   await contract.aggregate(
    //     tokenIn,
    //     tokenOut,
    //     amountIn,
    //     recipient,
    //     result
    //   ).send({ from: recipient })
    // }
    const gasLimit = await contract.aggregate(
      tokenIn,
      tokenOut,
      amountIn,
      recipient,
      result
    ).estimateGas({from: recipient,value: amountIn})

  }

  return (
    <div>
      <input type="text" id="amountIn" />
      {/* <button onClick={() => splitPercentAmount(12, 10)}>Split Amount In</button> */}
      <button onClick={() => handleAmoutOut(token.WMATIC, token.AAVE)}>Get Price</button>
      <button onClick={() => getAllReserve(token.WMATIC, token.USDC)}>Get Reserve</button>
      
    </div>
  );
};

export default HandlePrice;
