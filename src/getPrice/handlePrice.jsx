import React, { useEffect } from "react";
import Web3 from "web3";
import * as PairUniV2 from "../abi/uniswapv2/pair";
import * as ABI from "../abi/ABI"

const HandlePrice = () => {
  const web3 = new Web3(Web3.givenProvider);
  const token = {
    WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  };


  const getDecimal = async (address, pair) => {
    let data = new web3.eth.Contract(pair.abi, address).methods;
    return await data.decimals().call();
  };
  var listMidPrice = []
  var pricebaseAmountOut = []
  const handlePrice = async (
    factory,
    pair,
    tokenIn,
    tokenOut,
    amountIn,
    bool,
    prevValue,
    newResIn,
    newResOut
  ) => {
    const factoryMethods = new web3.eth.Contract(factory.abi, factory.adr).methods;
    const pairAddress = await factoryMethods.getPair(tokenIn, tokenOut).call();
    const pairMethods = new web3.eth.Contract(pair.abi, pairAddress).methods;
    const reserves = await pairMethods.getReserves().call();
    let reserveIn, reserveOut
    //sort token
    if (tokenIn < tokenOut) {
      reserveIn = reserves[0];
      reserveOut = reserves[1];
    } else {
      reserveIn = reserves[1];
      reserveOut = reserves[0];
    }


    let tokenInDecimals = await getDecimal(tokenIn, pair);
    let tokenOutDecimals = await getDecimal(tokenOut, pair);

    let reserveInConvert, reserveOutConvert, newReserveIn, newReserveOut
    // reserveInConvert = divDecimals(reserveIn, tokenInDecimals)
    //  reserveOutConvert = divDecimals(reserveOut, tokenOutDecimals)

    //  let amountOut = calculateAmountOut(amountIn, reserveInConvert, reserveOutConvert)
    //  getPriceImpact(amountIn, reserveInConvert)

    //  listMidPrice.push(reserveOutConvert / reserveInConvert)
    //  pricebaseAmountOut.push(amountOut)
    //  console.log("prevValue", prevValue)

    //  newReserveIn = reserveInConvert + Number(amountIn) 
    //  newReserveOut = reserveOutConvert * reserveInConvert / Number(newReserveIn)

    //  return { amountOut, newReserveIn, newReserveOut }


    if (bool == false) {
      reserveInConvert = divDecimals(reserveIn, tokenInDecimals)
      reserveOutConvert = divDecimals(reserveOut, tokenOutDecimals)

      let amountOut = calculateAmountOut(amountIn, reserveInConvert, reserveOutConvert)
      getPriceImpact(amountIn, reserveInConvert)

      listMidPrice.push(reserveOutConvert / reserveInConvert)
      pricebaseAmountOut.push(amountOut)
      console.log("prevValue", prevValue)

      newReserveIn = Number(reserveInConvert) + Number(amountIn)
      newReserveOut = Number(reserveOutConvert) * Number(reserveInConvert) / Number(newReserveIn)

      return { amountOut, newReserveIn, newReserveOut, oldReserveIn: reserveInConvert, oldReserveOut: reserveOutConvert }

    } else {

      //old res
      reserveInConvert = Number(newResIn)
      reserveOutConvert = Number(newResOut)

      newReserveIn = Number(newResIn)
      newReserveOut = Number(newResOut)

      let amountOut = calculateAmountOut(amountIn, newReserveIn, newReserveOut)
      getPriceImpact(amountIn, newReserveIn)

      listMidPrice.push(newReserveOut / newReserveIn)
      pricebaseAmountOut.push(amountOut)

      newReserveIn = Number(newReserveIn) + Number(amountIn)
      newReserveOut = Number(newReserveOut) * Number(newReserveIn) / Number(newReserveIn)

      return { amountOut, newReserveIn, newReserveOut, oldReserveIn: reserveInConvert, oldReserveOut: reserveOutConvert }
    }
  };




  const calculateAmountOut = async (amountIn, reserveIn, reserveOut) => {
    if (amountIn <= 0 || reserveIn <= 0 || reserveOut <= 0) return "Undefined";
    let amountInWithFee = amountIn * 997; //  1* 997
    let numerator = amountInWithFee * reserveOut; // 997 * 66.7334000667334
    let denominator = reserveIn * 1000 + amountInWithFee; //  1.5 * 1000 + 997
    let amountOut = numerator / denominator;

    let newReserveIn = Number(reserveIn) + Number(amountIn)
    let newReserveOut = Number(reserveIn) * Number(reserveOut) / Number(newReserveIn)
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
    let amountWithFee = amountIn * (1 - fee);
    let priceImpact = (amountWithFee / (reservesA + amountWithFee) * 100).toFixed(2);
    // console.log("Price Impact:", priceImpact)
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

  const splitAmountIn = async () => {
    let amountIn = document.querySelector('#amountIn').value
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
    let min = fixedNumber(amountIn / 10)
    let Array = splitAmount(amountIn, 0, 0, min, [])

    let Arr = Array.map(val => val.split(","))
    console.log("splited", Arr)

    return Arr
  }

  const getReserves = async (factory, pair, tokenIn, tokenOut) => {
    const factoryMethods = new web3.eth.Contract(factory.abi, factory.adr).methods;
    const pairAddress = await factoryMethods.getPair(tokenIn, tokenOut).call();
    const pairMethods = new web3.eth.Contract(pair.abi, pairAddress).methods;
    const reserves = await pairMethods.getReserves().call();
    let reserveIn, reserveOut
    //sort token
    if (tokenIn < tokenOut) {
      reserveIn = reserves[0];
      reserveOut = reserves[1];
    } else {
      reserveIn = reserves[1];
      reserveOut = reserves[0];
    }

    let tokenInDecimals = await getDecimal(tokenIn, pair);
    let tokenOutDecimals = await getDecimal(tokenOut, pair);

    let reserveInConvert = divDecimals(reserveIn, tokenInDecimals)
    let reserveOutConvert = divDecimals(reserveOut, tokenOutDecimals)
    return {
      reserveInConvert, reserveOutConvert
    }
  }

  const getAllReserve = async () => {
    let list = []
    await Promise.all(Object.entries(ABI).map(async (val) => {
      let lstReverse = await getReserves(val[1].factory, PairUniV2, token.WETH, token.USDC)
      list.push({ name: val[0], ...lstReverse })
    }))
    console.log("list reserve", list)
    return list
  }

  const getAmountOut = async () => {
    let lstAmountIn = await splitAmountIn()
    let lstReverse = await getAllReserve()

    console.log("list reserve", lstReverse)
    let filterArray = await Promise.all(lstAmountIn.map(async (val) => val.filter(item => Number(item) > 0)))


    let lstAmountOut = []
    let filter = await Promise.all(filterArray.map(async (Array, id) => {
      let cloneReserve = { ...lstReverse }
      let cloneList = []
      await Promise.all(Array.map(async (item, idx) => {
        // console.log("===================>>>> ", item, idx)
        let arrAmountOut = []
        await lstReverse.map(async (exchange, index) => {
          let getAmountOut
          if (idx == 0) {
            getAmountOut = await calculateAmountOut(item, exchange.reserveInConvert, exchange.reserveOutConvert)
            console.log("idddd ===========> ", id)
            console.log("Amount In ===========> ", item)
            console.log("Amount out ==========>", getAmountOut.amountOut)
            console.log("clone index before get at 0==================>>>>>", cloneReserve[index])
            cloneReserve[index] = { name: exchange.name, reserveInConvert: getAmountOut.newReserveIn, reserveOutConvert: getAmountOut.newReserveOut }
            console.log("clone index after get at 0==================>>>>>", cloneReserve[index])
            console.log(" ")

            arrAmountOut.push({ id, number: idx, exchange: exchange.name, amountIn: item, ...getAmountOut })
            // return
          }

          if (idx == 1) {
            await cloneReserve[index].reserveInConvert
            // console.log("reserveInConvert ===========> ", cloneReserve[index].reserveInConvert)
            getAmountOut = await calculateAmountOut(item, cloneReserve[index].reserveInConvert, cloneReserve[index].reserveOutConvert)
            console.log("idddd ===========> ", id)
            console.log("Amount In ===========> ", item)
            console.log("Amount out ==========>", getAmountOut.amountOut)
            console.log("clone index before get at 1==================>>>>>", cloneReserve[index])
            cloneReserve[index] = { name: exchange.name, reserveInConvert: getAmountOut.newReserveIn, reserveOutConvert: getAmountOut.newReserveOut }
            console.log("clone index 1 after ==================>>>>>", cloneReserve[index])
            console.log(" ")
            arrAmountOut.push({ id, number: idx, exchange: exchange.name, amountIn: item, ...getAmountOut })

            // return
          }
          if (idx == 2) {

            await cloneReserve[index].reserveInConvert
            // console.log("reserveInConvert ===========> ", cloneReserve[index].reserveInConvert)
            getAmountOut = await calculateAmountOut(item, cloneReserve[index].reserveInConvert, cloneReserve[index].reserveOutConvert)
            console.log("idddd ===========> ", id)
            console.log("Amount In ===========> ", item)
            console.log("Amount out ==========>", getAmountOut.amountOut)
            console.log("clone index before get at 2==================>>>>>", cloneReserve[index])
            cloneReserve[index] = { name: exchange.name, reserveInConvert: getAmountOut.newReserveIn, reserveOutConvert: getAmountOut.newReserveOut }
            console.log("clone index 1 after ==================>>>>>", cloneReserve[index])
            console.log(" ")
            arrAmountOut.push({ id, number: idx, exchange: exchange.name, amountIn: item, ...getAmountOut })
          }

          // return
        })
        console.log("Array amount Out =>", arrAmountOut)
        arrAmountOut.sort((a,b) => b.amountOut - a.amountOut)

        lstAmountOut.push({id,"highestValue": arrAmountOut})
      }))
    }))

    // console.log("List amount Out =================>", lstAmountOut)
    
     lstAmountOut.map((val) => 
       val.highestValue.sort((a,b) => b.amountOut - a.amountOut)
     )

    //  console.log("sort ===> ", lstAmountOut)

    
    let listHighestVal = lstAmountOut.map(val => val.highestValue[0])
    

    let finalResult = []

    await Promise.all(filterArray.map(async(val, index) => {
      let list = listHighestVal.filter(val => val.id == index)
      // console.log("filter arr==========>" , val)
      let amountOut = 0
      let lstExchange = []
      // console.log("filter 123==========>" , list)
      await Promise.all(list.map(async(item, idx) => {
          // console.log(item, item.amountOut)
          // console.log("exchange ",item.exchange)
          amountOut += item.amountOut
          lstExchange.push(item.exchange)
      }))

      finalResult.push(amountOut, lstExchange)
    }))
    

    console.log("final", finalResult)
  }
  // const handleAmountOut = async () => {

  //   let amountInSplited = await splitAmountIn()
  //   console.log("Divided Amount in: ========>>", amountInSplited)

  //   var lstAmountOut = []

  //   //handle divided amount in to get highest amount out
  //   await Promise.all(amountInSplited.map(async (val, index) => {
  //     let amountOut = 0
  //     let market = []
  //     let testArr = []
  //     let filterArr = val.filter(itm => Number(itm) > 0)
  //     console.log("filterArr", filterArr)

  //     await Promise.all(filterArr.map(async (itm, idx) => {
  //       let arrVal = []
  //       let exchange = Object.entries(ABI)
  //       // console.log("exhcange =>>>", exchange)
  //       let res = 0


  //       await Promise.all(Object.entries(ABI).map(async (val, items) => {
  //         let getAmountOut = await handlePrice(val[1].factory, PairUniV2, token.WETH, token.USDC, itm, false, 0, 0, 0)
  //         // if(idx == 0 && items ==0){
  //         //   console.log("-------------idx", idx, "ex:", val[0], "items", items)
  //         //   res = 1
  //         // }
  //         // if(idx == 1 && items == 1){
  //         //   console.log("-------------idx", idx, "ex:", val[0], "items", items, "res", res)
  //         // }
  //         // arrVal.push({ name: val[0], amountIn: itm, amountOut: getAmountOut.amountOut, newReserveIn: getAmountOut.newReserveIn, newReserveOut: getAmountOut.newReserveOut })
  //         // arrVal.push({ name: val[0], amountIn: itm, amountOut: getAmountOut.amountOut, newReserveIn: getAmountOut.newReserveIn, newReserveOut: getAmountOut.newReserveOut })
  //         arrVal.push({ name: val[0], amountIn: itm, ...getAmountOut })
  //       }))

  //       let highestVal = arrVal.sort(function (a, b) {
  //         return b.amountOut - a.amountOut
  //       })[0]

  //       console.log(" ")
  //       console.log("indexxxxxx", index, idx)
  //       testArr.push(arrVal)


  //       amountOut == 0 ? amountOut = arrVal[0].amountOut : amountOut += arrVal[0].amountOut
  //       lstAmountOut.push({ dataIndex: arrVal[0], highestAmountOut: amountOut, index })

  //       // market.push({ name: highestVal.name, value: itm, newRes: { newReserveIn: highestVal.newReserveIn, newReserveOut: highestVal.newReserveOut }, amountOut: arrVal[0].amountOut, data: arrVal })
  //       market.push({ ...highestVal, data: arrVal })
  //       // console.log("amount Out =>>>>>>>>>>", highestVal)
  //       console.log("highestVal =>>>>>>>>>>", highestVal)
  //       console.log("market =>>>>>>>>>>", market[market.length - 1])
  //       // console.log("name =>>>>>>>>>>", market[market.length-1].name == highestVal.name)
  //     }))
  //     console.log("market  ==========> ", market)

  //     let resultMaket = []
  //     let newMarket = await Promise.all(market.map(async (val, idx) => {
  //       // console.log("resmarket =======+>>>>>>>" ,resultMaket)
  //       let getAmountOut
  //       if (resultMaket.includes(val.name) == true) {
  //         //get amount out with new reserves

  //         getAmountOut = await
  //           handlePrice(ABI[val.name].factory, PairUniV2, token.WETH, token.USDC, val.amountIn, true, market[idx - 1].amountIn, market[idx - 1].newReserveIn, market[idx - 1].newReserveOut)
  //         console.log(" ")

  //         // console.log("market  ==========> ",market)
  //         console.log("trueeeeee | index ==========> ", idx)
  //         console.log("prev amount in at idx ", "======>>>>>>", market[idx - 1].amountIn)
  //         console.log("amount in at idx ", "======>>>>>>", val.amountIn)

  //         console.log("amount Out at idx ", "======>>>>>>", getAmountOut)
  //         console.log("new amount out =======>", getAmountOut.amountOut)
  //         console.log("2rd amount out =======>", val.data[1].amountOut)
  //         // console.log("prev data =======>", val.data)
  //         // console.log("val  ======>>>>>>", getAmountOut.amountOut )
  //         console.log("data [1] ======>>>>>>", { ...val.data[1] })


  //         if (getAmountOut.amountOut < val.data[1].amountOut) {
  //           console.log("CHANGE EXCHANGE ======>", val.data[1].amountOut)
  //           market[idx] = { ...val.data[1] }
  //           resultMaket.push(val.data[1].name)
  //         } else {
  //           console.log("SAME EXCHANGE ======>", getAmountOut.amountOut)
  //           market[idx] = { name: val.name, amountIn: val.amountIn, ...getAmountOut }
  //           console.log("val 1  ======>>>>>>", market[idx])
  //         }


  //         // console.log("new valueeee ===========>" ,getAmountOut.amountOut )

  //         // val.data.shift()
  //         // val.data.push({name: val.name,amountIn: val.amountIn, ...getAmountOut})

  //         // val.newReserveIn = getAmountOut.newReserveIn
  //         // val.newReserveOut = getAmountOut.newReserveOut
  //         console.log(" ---- ")
  //         console.log("new data =======>", market)
  //         console.log(" ")

  //         resultMaket.push(val.name)

  //         // amountOut.amountOut < val.data[1].amountOut ? console.log("newval value" , val.data[1].amountOut) : console.log("old val, ", amountOut.amountOut) 

  //       }
  //       else {
  //         resultMaket.push(val.name)
  //       }
  //       // console.log("resultMaket ========>" , resultMaket)

  //       return (
  //         val.data
  //       )
  //     }))

  //     // console.log("resmarket =======+>>>>>>>" ,resultMaket)
  //     // console.log("newMarket  =>>>>>>>>>>", newMarket)
  //     // console.log("data =>>>>>>>>>>", testArr)

  //     return
  //   }))

  //   // console.log("List Amount Out ===============> ", lstAmountOut)
  //   let highestVal = lstAmountOut.sort((a, b) => b.highestAmountOut - a.highestAmountOut)[0]
  //   console.log("Best Amount Out ===============>", highestVal.highestAmountOut)

  //   let resultIndex = highestVal.index
  //   console.log('result Index', resultIndex)

  //   let bestSolution = lstAmountOut.filter(val => val.index == resultIndex).map(val => val.dataIndex)
  //   console.log("Data at Index ========> ", bestSolution)
  // }

  // useEffect(async() => {
  //   await test()
  //   // handlePrice("LinkSwap",ABI.LinkSwap.factory, ABI.UniV2.router, PairLinkSwap,token.WETH, token.USDC, 1000);
  //   console.log("mid price", listMidPrice)
  //   console.log("pricebaseAmountOut", pricebaseAmountOut)

  // });

  return (
    <div>
      <input type="text" id="amountIn" />
      <button onClick={() => splitAmountIn()}>Split Amount In</button>
      <button onClick={() => getAllReserve()}>Get Reserves</button>
      <button onClick={() => getAmountOut()}>Get AmountOut</button>
    </div>
  );
};

export default HandlePrice;
