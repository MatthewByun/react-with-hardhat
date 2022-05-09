import { BigNumber, ethers } from "ethers";
import React from 'react';
import Web3 from "web3";
import * as Mutical from "../abi/ABIMuticall";
import * as ABI from "../abi/ABI_MATIC";
import * as PairUniV2 from "../abi/uniswapv2/pair";


function GetPrice_3() {
    const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com")
    const wallet = new ethers.Wallet('2345330bc8694d23d915453b6f3bf06fda0652b6c90b2d0f9041a6e7bc212ca3', provider)
    const token = {
        //ethereum
        // WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        // USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",

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
        // BUSD: "0xdAb529f40E671A1D4bF91361c21bf9f0C9712ab7",
        // FRAX: "0x45c32fA6DF82ead1e2EF74d17b76547EDdFaFF89",
        // FTM: "0xC9c1c1c20B3658F8787CC2FD702267791f224Ce1",
        // TUSD: "0x2e1AD108fF1D8C782fcBbB89AAd783aC49586756",
        // PAX: "0x6F3B3286fd86d8b47EC737CEB3D0D354cc657B3e",
    }
    const getAllReserves = async (tokenIn, tokenOut) => {
        console.time()
        const tokensWhiteList = await Promise.all(Object.entries(whiteList).map(async (items) => {
            let reserveA_Mid = await getReserves(tokenIn, items[1])
            let reserveMid_B = await getReserves(items[1], tokenOut)
            return {
                tokenIn,
                tokenMid: items[1],
                tokenOut,
                reserveA_Mid,
                reserveMid_B
            }
        }))
        let a = tokensWhiteList.map(item => {
            if (item.reserveA_Mid.length != 0 && item.reserveMid_B.length != 0) return item
            return
        })
        let filerA = a.filter(item => item != undefined)
        console.log("All Reserves a  => ", filerA)
        console.timeEnd()
        return filerA
    }
    const getReserves = async (tokenIn, tokenOut) => {
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
        listExchange = listExchange.filter((_item, index) => reserveDatas[index] != '0x')

        const filteredReserve = reserveDatas.filter((item, _index) => {
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
            let reserveInConvert = res0 / (10 ** decimalDecodeDatas[0][0])
            let reserveOutConvert = res1 / (10 ** decimalDecodeDatas[1][0])
            let K = getK(reserveInConvert, reserveOutConvert)
            return {
                reserveInConvert,
                reserveOutConvert,
                K,
                exchange: listExchange[index].exchange,
                fee: listExchange[index].data.fee
            }
        })

        return reserves
    }
    const calculateAmountOut = (amountIn, reserveIn, reserveOut, fee) => {
        if (amountIn <= 0 || reserveIn <= 0 || reserveOut <= 0) return "Undefined";
        let amountInWithFee = Number(amountIn) * fee;
        let numerator = amountInWithFee * reserveOut;
        let denominator = reserveIn + amountInWithFee;
        let amountOut = numerator / denominator;
        return amountOut
    }
    const calculateNewReserves = (amountIn, oldReserveIn, oldReserveOut, fee) => {
        let amountInWithFee = Number(amountIn) * fee;
        let newReserveIn = Number(oldReserveIn) + Number(amountInWithFee)
        let newReserveOut = Number(oldReserveOut) * Number(oldReserveIn) / Number(newReserveIn)
        return { newReserveIn, newReserveOut };
    }
    const getK = (reservesIn, reservesOut) => {
        return reservesIn * reservesOut
    }
    const getTokenContract = (address) => {
        const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com")
        const factory = new ethers.Contract(address, PairUniV2.abi, provider)
        return factory;
    };
    const getMidPrice = async (number, reserves, prevData) => {
        let a = await Promise.all(reserves.map(item => {
            let price = calculateAmountOut(number, item.reserveInConvert, item.reserveOutConvert, item.fee)
            let reserves = calculateNewReserves(number, item.reserveInConvert, item.reserveOutConvert, item.fee)
            return {
                exchange: item.exchange,
                fee: item.fee,
                price,
                oldReserveInConvert: item.reserveInConvert,
                newReserveInConvert: reserves.newReserveIn,
                oldReserveOutConvert: item.reserveOutConvert,
                newReserveOutConvert: reserves.newReserveOut
            }
        }))

        let aSort = sortByPrice(a)
        if (prevData == undefined) return aSort

        if (aSort[0].exchange === prevData.exchange) {
            let oldReserveInConvert = prevData.newReserveInConvert
            let oldReserveOutConvert = prevData.newReserveOutConvert
            let reserves = calculateNewReserves(number, oldReserveInConvert, oldReserveOutConvert, prevData.fee)
            let price = calculateAmountOut(number, oldReserveInConvert, oldReserveOutConvert, prevData.fee)
            aSort[0] = {
                exchange: aSort[0].exchange,
                fee: aSort[0].fee,
                price,
                oldReserveInConvert,
                newReserveInConvert: reserves.newReserveIn,
                oldReserveOutConvert,
                newReserveOutConvert: reserves.newReserveOut
            }
            let result = sortByPrice(aSort)
            return result
        } else {
            return aSort
        }
    }
    // ==>
    const getMidPriceA_Mid = async (number, reserves, prevData) => {
        let data = await Promise.all(reserves.map(async (items) => {
            console.log('items', items)
            console.log('prevData', prevData)
            let a = await Promise.all(items.reserveA_Mid.map(item => {
                let price = calculateAmountOut(number, item.reserveInConvert, item.reserveOutConvert, item.fee)
                let reserves = calculateNewReserves(number, item.reserveInConvert, item.reserveOutConvert, item.fee)
                return {
                    exchange: item.exchange,
                    fee: item.fee,
                    price,
                    oldReserveInConvert: item.reserveInConvert,
                    newReserveInConvert: reserves.newReserveIn,
                    oldReserveOutConvert: item.reserveOutConvert,
                    newReserveOutConvert: reserves.newReserveOut
                }
            }))
            let aSort = sortByPrice(a)
            if (prevData == undefined) return { tokenMid: items.tokenMid, data: aSort }
            if (aSort[0].exchange === prevData.exchange) {
                let oldReserveInConvert = prevData.newReserveInConvert
                let oldReserveOutConvert = prevData.newReserveOutConvert
                let reserves = calculateNewReserves(number, oldReserveInConvert, oldReserveOutConvert, prevData.fee)
                let price = calculateAmountOut(number, oldReserveInConvert, oldReserveOutConvert, prevData.fee)
                aSort[0] = {
                    exchange: aSort[0].exchange,
                    fee: aSort[0].fee,
                    price,
                    oldReserveInConvert,
                    newReserveInConvert: reserves.newReserveIn,
                    oldReserveOutConvert,
                    newReserveOutConvert: reserves.newReserveOut
                }
                let result = sortByPrice(aSort)
                return { tokenMid: items.tokenMid, data: result }
            } else {
                return { tokenMid: items.tokenMid, data: aSort }
            }
        }))
        return data
    }
    // ----
    const getMidPriceMid_B = async (number, reserves, prevData) => {
        let data = await Promise.all(reserves.map(async (items) => {
            let a = await Promise.all(items.reserveMid_B.map(item => {
                let price = calculateAmountOut(number, item.reserveInConvert, item.reserveOutConvert, item.fee)
                let reserves = calculateNewReserves(number, item.reserveInConvert, item.reserveOutConvert, item.fee)
                return {
                    exchange: item.exchange,
                    fee: item.fee,
                    price,
                    oldReserveInConvert: item.reserveInConvert,
                    newReserveInConvert: reserves.newReserveIn,
                    oldReserveOutConvert: item.reserveOutConvert,
                    newReserveOutConvert: reserves.newReserveOut
                }
            }))
            let aSort = sortByPrice(a)
            if (prevData == undefined) return { tokenMid: items.tokenMid, data: aSort }
            if (aSort[0].exchange === prevData.exchange) {
                let oldReserveInConvert = prevData.newReserveInConvert
                let oldReserveOutConvert = prevData.newReserveOutConvert
                let reserves = calculateNewReserves(number, oldReserveInConvert, oldReserveOutConvert, prevData.fee)
                let price = calculateAmountOut(number, oldReserveInConvert, oldReserveOutConvert, prevData.fee)
                aSort[0] = {
                    exchange: aSort[0].exchange,
                    fee: aSort[0].fee,
                    price,
                    oldReserveInConvert,
                    newReserveInConvert: reserves.newReserveIn,
                    oldReserveOutConvert,
                    newReserveOutConvert: reserves.newReserveOut
                }
                let result = sortByPrice(aSort)
                return { tokenMid: items.tokenMid, data: result }
            } else {
                return { tokenMid: items.tokenMid, data: aSort }
            }
        }))
        return data
    }
    // <==
    const sortByK = async (tokenIn, tokenOut) => {
        let reserves = await getReserves(tokenIn, tokenOut)
        let data = reserves.sort((a, b) => b.K - a.K)
        console.log("data", data)
    }
    const sortByPrice = (data) => {
        return data.sort((a, b) => b.price - a.price)
    }

    const handleReserves = (stamp, dataReserves, prevData) => {
        let data = []
        dataReserves.map(item => {
            if (item.exchange == prevData.exchange) {
                let reserves = calculateNewReserves(stamp, item.reserveInConvert, item.reserveOutConvert, item.fee)
                data.push({
                    reserveInConvert: reserves.newReserveIn,
                    reserveOutConvert: reserves.newReserveOut,
                    K: reserves.newReserveIn * reserves.newReserveOut,
                    exchange: item.exchange,
                    fee: item.fee
                })
            } else {
                data.push(item)
            }
        })
        return data
    }

    const getBestPrice = async (tokenIn, tokenOut) => {
        console.log('waiting....')
        let reserves = await getReserves(tokenIn, tokenOut)
        let amountIn = document.querySelector('#amountIn').value
        let stamp = Number(amountIn / 50)
        console.time()
        let reservesA_Mid_B = await getAllReserves(tokenIn, tokenOut)
        console.log("reservesA_Mid_B", reservesA_Mid_B)

        let index = 0
        let cloneReservesA_B = reserves
        let cloneReserA_Mid_B = reservesA_Mid_B
        let resultData = []
        let lastSolutions = {
            A_B: [],
            A_Mid: [],
            Mid_B: [],
        }

        while (index < 50) {
            let listAmountOut = await Promise.all(reservesA_Mid_B.map(async (items, idx) => {
                let solutions = {
                    A_B: [],
                    A_Mid: [],
                    Mid_B: []
                }
                let amountOut = 0
                let a, b, c, prevDataA_B, prevDataA_Mid, prevDataMid_B
                // token A -> tokenB
                a = await getMidPrice(stamp, cloneReservesA_B, prevDataA_B)
                //tokenA -> token Mid
                b = await getMidPrice(stamp, cloneReserA_Mid_B[idx].reserveA_Mid, prevDataA_Mid)
                //tokenMid -> tokenB
                c = await getMidPrice(b[0].price, cloneReserA_Mid_B[idx].reserveMid_B, prevDataMid_B)

                if (a[0].price > c[0].price) {
                    prevDataA_B = a[0]
                    amountOut += prevDataA_B.price
                    solutions.A_B.push({
                        exchange: prevDataA_B.exchange,
                        tokenIn: items.tokenIn,
                        amountIn: stamp,
                        tokenOut: items.tokenOut,
                        amountOut: prevDataA_B.price,
                        reservesA_B: cloneReservesA_B
                    })
                    return { amountIn: stamp, amountOut, solutions }
                } else {
                    prevDataA_Mid = b[0]
                    prevDataMid_B = c[0]
                    amountOut += prevDataMid_B.price
                    solutions.A_Mid.push({
                        exchange: prevDataA_Mid.exchange,
                        tokenIn: items.tokenIn,
                        amountIn: stamp,
                        tokenOut: items.tokenMid,
                        amountOut: prevDataA_Mid.price,
                        reserves: cloneReserA_Mid_B[idx].reserveA_Mid
                    })
                    solutions.Mid_B.push({
                        exchange: prevDataMid_B.exchange,
                        tokenIn: items.tokenMid,
                        amountIn: prevDataA_Mid.price,
                        tokenOut: items.tokenOut,
                        amountOut: prevDataMid_B.price,
                        reserves: cloneReserA_Mid_B[idx].reserveMid_B
                    })
                    // console.log("amountOut => ", solutions)
                    return { amountIn: stamp, amountOut, solutions, idx }
                }
            }))

            let result = listAmountOut.sort((a, b) => b.amountOut - a.amountOut)[0]


            if (result.solutions.A_B.length > 0) {
                cloneReservesA_B = handleReserves(stamp, cloneReservesA_B, result.solutions.A_B[0])
                resultData.push({ type: 'A_B', data: result.solutions.A_B })
            } else {
                if (result.solutions.A_Mid.length > 0) {
                    cloneReserA_Mid_B[result.idx].reserveA_Mid = handleReserves(stamp, cloneReserA_Mid_B[result.idx].reserveA_Mid, result.solutions.A_Mid[0])
                    cloneReserA_Mid_B[result.idx].reserveMid_B = handleReserves(result.solutions.A_Mid.amountOut, cloneReserA_Mid_B[result.idx].reserveMid_B, result.solutions.Mid_B[0])
                    resultData.push({ type: 'A_MID_B', data: [...result.solutions.A_Mid, ...result.solutions.Mid_B] })
                }
            }
            index += 1
        }

        console.log("reresultData", resultData)

        let dataA_B = resultData.filter(item => item.type == "A_B")
        let dataA_Mid_B = resultData.filter(item => item.type == "A_MID_B")
        console.log("dataA_B", dataA_B)
        console.log("dataA_Mid_B", dataA_Mid_B)
        // return dataA_B

        let resultA_B = await convertDataA_B(dataA_B)
        let resultA_Mid_B = await convertDataA_Mid_B(dataA_Mid_B)

        console.log("result A_B =>>>>>>", resultA_B)
        console.log("result A_Mid_B =>>", resultA_Mid_B)



        let totalAmountIn = 0
        let amountOut = 0
        // if (lastSolutions.A_B.length > 0) {
        //     for (let i of lastSolutions.A_B) {
        //         totalAmountIn += i.amountIn
        //         amountOut += i.amountOut
        //     }
        // }
        // if (lastSolutions.A_Mid.length > 0) {
        //     for (let i of lastSolutions.A_Mid) {
        //         totalAmountIn += i.amountIn
        //     }
        //     for (let i of lastSolutions.Mid_B) {
        //         amountOut += i.amountOut
        //     }
        // }

        let result = { amountIn: totalAmountIn, amountOut, solutions: { ...lastSolutions } }
        console.log("result => ", result)
        console.timeEnd()
        return result
    }
    const convertDataA_B = async (props) => {
        if (props.length == 0) return
        let sortA_B = props.sort(function (a, b) {
            if (a.data[0].exchange < b.data[0].exchange) {
                return -1;
            }
            if (a.data[0].exchange > b.data[0].exchange) {
                return 1;
            }
            return 0;
        })
        let arrayData = []
        let prevEx
        if (sortA_B.length == 1) return arrayData.push(sortA_B[0].data[0])
        for (let i = 0; i < sortA_B.length; i++) {
            if (arrayData.length == 0) {
                prevEx = sortA_B[i].data[0]
                arrayData.push(prevEx)
                i++;
            }
            if (prevEx.exchange == sortA_B[i].data[0].exchange && prevEx.tokenOut == sortA_B[i].data[0].tokenOut) {
                let idx = arrayData.length - 1
                prevEx = sortA_B[i].data[0]
                arrayData[idx] = {
                    ...arrayData[idx],
                    amountIn: arrayData[idx].amountIn + prevEx.amountIn,
                    amountOut: arrayData[idx].amountOut + prevEx.amountOut,
                }
            } else {
                prevEx = sortA_B[i].data[0]
                arrayData.push(prevEx)
            }
        }
        return arrayData
    }
    const convertDataA_Mid_B = async (props) => {
        if (props.length == 0) return
        let sortA_Mid_B = props.sort(function (a, b) {
            if (a.data[0].exchange < b.data[0].exchange) {
                return -1;
            }
            if (a.data[0].exchange > b.data[0].exchange) {
                return 1;
            }
            return 0;
        })
        let arrayData = []
        let prevEx
        if (sortA_Mid_B.length == 1) return arrayData = sortA_Mid_B[0].data
        for (let i = 0; i < sortA_Mid_B.length; i++) {
            if (arrayData.length == 0) {
                prevEx = sortA_Mid_B[i].data
                arrayData.push(prevEx)
                i++;
            }
            if (prevEx[0].exchange == sortA_Mid_B[i].data[0].exchange && prevEx[0].tokenOut == sortA_Mid_B[i].data[0].tokenOut) {
                let idx = arrayData.length - 1
                prevEx = sortA_Mid_B[i].data
                arrayData[idx][0] = {
                    ...arrayData[idx][0],
                    amountIn: arrayData[idx][0].amountIn + prevEx[0].amountIn,
                    amountOut: arrayData[idx][0].amountOut + prevEx[0].amountOut,
                }
                console.log("prevEx =.>>>>>>", prevEx)
                if (arrayData[idx][1].exchange == prevEx[1].exchange) {
                    arrayData[idx][1] = {
                        ...arrayData[idx][1],
                        amountIn: arrayData[idx][1].amountIn + prevEx[1].amountIn,
                        amountOut: arrayData[idx][1].amountOut + prevEx[1].amountOut,
                    }
                } else {
                    arrayData[idx].push(prevEx[1])
                }
            } else {
                prevEx = sortA_Mid_B[i].data
                arrayData.push(prevEx)
            }
        }
        return arrayData
    }


    const getDecimal = async (address) => {
        const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com")
        const contract = new ethers.Contract(address, PairUniV2.abi, provider)
        // let data = new web3.eth.Contract(pair.abi, address).methods;
        return await contract.decimals();
    };

    const buildDataSwapUniswapV2 = async (data, router, tokenIn, tokenOut) => {
        const methodName = "swapTokensForExactTokens";
        const path = [tokenIn, tokenOut]
        const multicall = "0xBEFC7EEC04bffE123dCe655093AD82817C0A6c08"
        const deadline = 1751959782
        const slippagePercent = 50
        const decimalTokenFrom = await getDecimal(
            tokenIn
        );
        const decimalTokenTo = await getDecimal(
            tokenOut
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
        console.log("decimalTokenFrom", decimalTokenFrom)
        console.log("decimalTokenTo", decimalTokenTo)
        const amountIn = BigNumber.from(test).toHexString();
        const args = [
            amountOut, //amountOut
            amountIn, //amountIn
            path, //[tokenIn, tokenOut]
            multicall, //0xBEFC7EEC04bffE123dCe655093AD82817C0A6c08
            deadline
        ];
        console.log("params >>>", Number(amountOut), Number(amountIn), path, multicall, deadline)
        const contract = getRouterV2Web3Contract(router);
        const txnEncode = contract.interface.encodeFunctionData(methodName, args);

        return {
            exchangeTarget: router,
            swapData: txnEncode,
            addressToApprove: router,
            tokenIn: tokenIn,
            tokenOut: tokenOut
        }
    };

    const buildDataSwapUniswapV2Mid_B = async (data, router, tokenIn, tokenOut) => {
        const methodName = "swapExactTokensForTokens";
        const path = [tokenIn, tokenOut]
        const multicall = "0xBEFC7EEC04bffE123dCe655093AD82817C0A6c08"
        const deadline = 1751959782
        const slippagePercent = 50
        const decimalTokenFrom = await getDecimal(
            tokenIn
        );
        const decimalTokenTo = await getDecimal(
            tokenOut
        );
        const a = data.amountIn
        const amountOutMin = data.amountOut / (1 + slippagePercent / 10000)
        const test = ethers.utils.parseUnits(
            a.toFixed(decimalTokenFrom).toString(),
            decimalTokenFrom
        )
        // const amountOutMinimum = ethers.utils.parseUnits(a.toFixed(decimalTokenTo).toString(), decimalTokenTo).toHexString()
        const amountOut = ethers.utils
            .parseUnits(
                amountOutMin.toFixed(decimalTokenTo).toString(),
                decimalTokenTo
            )
            .toHexString();
        console.log("decimalTokenFrom", decimalTokenFrom)
        console.log("decimalTokenTo", decimalTokenTo)
        const amountIn = BigNumber.from(test).toHexString();
        const args = [
            amountIn, //amountIn
            amountOut, //amountOut
            path, //[tokenIn, tokenOut]
            multicall, //0xBEFC7EEC04bffE123dCe655093AD82817C0A6c08
            deadline
        ];
        console.log("params >>>", Number(amountOut), Number(amountIn), path, multicall, deadline)
        const contract = getRouterV2Web3Contract(router);
        const txnEncode = contract.interface.encodeFunctionData(methodName, args);

        return {
            exchangeTarget: router,
            swapData: txnEncode,
            addressToApprove: router,
            tokenIn: tokenIn,
            tokenOut: tokenOut
        }
    };


    function getRouterV2Web3Contract(address) {
        const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com")
        const contract = new ethers.Contract(address, ABI.QuickSwap.router.abi, provider)
        return contract;
        // const web3 = new Web3(Web3.givenProvider);
        // const contract = new web3.eth.Contract(ABI.QuickSwap.router.abi, address);
        // return contract;
    }
    const handleSwapData = async (data) => {
        let result = []
        if (data.length > 0) {
            let a = await Promise.all(data.map(async (item) => {
                let router = ABI[item.exchange].router.adr
                let args = await buildDataSwapUniswapV2(item, router, item.tokenIn, item.tokenOut)
                return args
            }))
            result.push(...a)
        }
        return result
    }

    const swapTokens = async (tokenIn, tokenOut) => {
        console.log("waiting.....")
        try {
            const contract = new ethers.Contract(Mutical.address, Mutical.abi)
            const dataSwap = await getBestPrice(tokenIn, tokenOut)
            console.log("data =>", dataSwap)
            let result = []
            if (dataSwap.solutions.A_B.length > 0) {
                let dataA_B = await Promise.all(dataSwap.solutions.A_B.map(async (item) => {
                    let router = ABI[item.exchange].router.adr
                    // console.log("item A_B", item)
                    let args = await buildDataSwapUniswapV2(item, router, item.tokenIn, item.tokenOut)
                    return args
                }))
                result.push(...dataA_B)
            }
            if (dataSwap.solutions.A_Mid.length > 0) {
                let dataA_Mid = await Promise.all(dataSwap.solutions.A_Mid.map(async (item) => {
                    // console.log("item A_MID", item)
                    let router = ABI[item.exchange].router.adr
                    let args = await buildDataSwapUniswapV2(item, router, item.tokenIn, item.tokenOut)
                    return args
                }))
                result.push(...dataA_Mid)
            }
            if (dataSwap.solutions.Mid_B.length > 0) {
                let dataMid_B = await Promise.all(dataSwap.solutions.Mid_B.map(async (item) => {
                    // console.log("item Mid_ B", item)
                    let router = ABI[item.exchange].router.adr
                    let args = await buildDataSwapUniswapV2Mid_B(item, router, item.tokenIn, item.tokenOut)
                    return args
                }))
                result.push(...dataMid_B)
            }

            const decimalTokenFrom = await getDecimal(tokenIn)
            const a = (Number(dataSwap.amountIn) * (100 + 50 / 100)) / 100
            const amountIn = ethers.utils.parseUnits(
                a.toFixed(decimalTokenFrom).toString(),
                decimalTokenFrom
            ).toHexString()
            const multicall = "0xBEFC7EEC04bffE123dCe655093AD82817C0A6c08"
            const recipient = "0xc0091C37A375dC8EfDa13204A28dFD33e6AF89DD"
            const ETH = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
            console.log("result", result)
            console.log("amountIn", amountIn)

            const web3 = new Web3(Web3.givenProvider)
            const contractWeb3 = new web3.eth.Contract(Mutical.abi, Mutical.address).methods
            console.log('pending...')
            let gasEstimate = await contractWeb3.aggregate(
                // ETH,
                // tokenOut,
                tokenIn,
                ETH,
                amountIn,
                recipient,
                result
            ).estimateGas({
                from: "0xc0091C37A375dC8EfDa13204A28dFD33e6AF89DD"
                // , value: amountIn
            })
            await contractWeb3.aggregate(
                // ETH,
                // tokenOut,
                tokenIn,
                ETH,
                amountIn,
                recipient,
                result
            ).send({
                from: "0xc0091C37A375dC8EfDa13204A28dFD33e6AF89DD"
                // , value: amountIn
            })
            console.log('Successfull.....', gasEstimate)

            // const aggregateData = contract.interface.encodeFunctionData('aggregate', [ETH, tokenOut, amountIn, recipient, result])
            // const gasPrice = 40e9
            //     const tx = {
            //         data: aggregateData,
            //         from: recipient,
            //         to: multicall,
            //         // gasPrice
            //     }
            // console.log('pending...')            
            // const gasLimit = await wallet.estimateGas(tx)
            // console.log('Successfull.....')
        }
        catch (err) {
            console.log('loi roi nha :>>>>>', err)
        }
    }

    const approveToken = async (number, decimals, addressUser, addressToken, addressTarget) => {
        try {
            const contract = new ethers.Contract(addressToken, PairUniV2.abi)
            number = ethers.utils.parseUnits(number.toString(), decimals)
            const approveData = contract.interface.encodeFunctionData('approve', [addressTarget, number])
            const gasPrice = 35e9
            const tx = {
                data: approveData,
                from: addressUser,
                to: addressToken,
                gasPrice
            }
            console.log('approving...')
            const call = await wallet.sendTransaction(tx)
            await call.wait()
            console.log('approved!!!')
        }
        catch (err) {
            console.log('loi roi ne!!!!!!', err)
        }
    }


    // const getBestPrice = async (tokenIn, tokenOut) => {
    //     let reserves = await getReserves(tokenIn, tokenOut)
    //     let amountIn = document.querySelector('#amountIn').value
    //     let stamp = Number(amountIn / 100)
    //     let index = 0
    //     let amountOut = 0
    //     let a, prevData
    //     console.time()
    //     let cloneReserves = reserves
    //     while (index < amountIn) {
    //         if (index === stamp) {
    //             index += stamp
    //             a = await getMidPrice(stamp, cloneReserves, prevData)
    //             prevData = a[0]
    //             let data = []
    //             cloneReserves.map(item => {
    //                 if (item.exchange == a[0].exchange) {
    //                     let reserves = calculateNewReserves(stamp, item.reserveInConvert, item.reserveOutConvert, item.fee)
    //                     data.push({
    //                         reserveInConvert: reserves.newReserveIn,
    //                         reserveOutConvert: reserves.newReserveOut,
    //                         K: reserves.newReserveIn * reserves.newReserveOut,
    //                         exchange: item.exchange,
    //                         fee: item.fee
    //                     })
    //                 } else {
    //                     data.push(item)
    //                 }
    //             })
    //             console.log("data", data)
    //             console.log("data Exchange", prevData.exchange)
    //             cloneReserves = data
    //             amountOut += a[0].price
    //             console.log("amountOut", amountOut)
    //         }
    //         else {
    //             index += stamp
    //             a = await getMidPrice(stamp, cloneReserves, prevData)
    //             prevData = a[0]
    //             let data = []
    //             cloneReserves.map(item => {
    //                 if (item.exchange == a[0].exchange) {
    //                     let reserves = calculateNewReserves(stamp, item.reserveInConvert, item.reserveOutConvert, item.fee)
    //                     data.push({
    //                         reserveInConvert: reserves.newReserveIn,
    //                         reserveOutConvert: reserves.newReserveOut,
    //                         K: reserves.newReserveIn * reserves.newReserveOut,
    //                         exchange: item.exchange,
    //                         fee: item.fee
    //                     })
    //                 } else {
    //                     data.push(item)
    //                 }
    //             })
    //             console.log("data", data)
    //             console.log("data Exchange", prevData.exchange)
    //             cloneReserves = data
    //             amountOut += a[0].price
    //             console.log("amountOut", amountOut)
    //        }
    //     }

    //     console.log("amountOut", amountOut)
    //     console.timeEnd()
    // }


    return (
        <div>
            <h1>ECAPS TIBROF 3</h1>
            <div>
                <input type="text" id='amountIn' />
            </div>
            <div>
                {/* <button onClick={() => getAllReserves(token.WMATIC, token.USDC)}>Get All Reserves</button> */}
                {/* <button onClick={() => getReserves(token.WMATIC, token.USDC)}>Get Reserves</button> */}
                <button onClick={() => getBestPrice(token.WMATIC, token.USDC)}>Get getBestPrice</button>
                {/* <button onClick={() => convertDataA_B()}>Get test</button> */}
            </div>
            <div>
                <button onClick={() => swapTokens(token.WMATIC, token.USDC)}>Swap</button>
                {/* <button onClick={() => approveToken(2, 18, "0xc0091C37A375dC8EfDa13204A28dFD33e6AF89DD", token.WMATIC, "0xBEFC7EEC04bffE123dCe655093AD82817C0A6c08")}>Approve</button> */}
            </div>
        </div>
    )
}

export default GetPrice_3