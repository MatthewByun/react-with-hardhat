import React, { useState, useEffect } from 'react'
import "./background.css"
import { Flex, Spacer, Box, Center, Input, Button, Select, Table, Thead, Tbody, Tr, Th, Td, Collapse, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react'
import Web3 from 'web3'
// import { useMoralis } from 'react-moralis'
import * as unipair from './abi/iuniv2Pair'
// import { RouterABI, RouterAddress } from './abi/router'
import * as Config from "./config"
import * as rout from "./abi/router"


const BackgroundTest = () => {
    const web3 = new Web3(Web3.givenProvider)
    // const { Moralis } = useMoralis()
    const [account, setAccount] = useState()
    const [balanceETH, setBalanceETH] = useState()
    const [listBal, setListBal] = useState([])
    const [balToken, setBalTokens] = useState(balanceETH)
    const [tokensAddress, setTokensAddress] = useState()
    const [tokensFrom, setTokensFrom] = useState('0xc778417E063141139Fce010982780140Aa0cD5Ab') // Weth default
    const [tokensTo, setTokensTo] = useState("595665917939301680816") // amountOut
    const [amountOut, setAmountOut] = useState(0)
    const [executePriceETHDai, setExecutePriceETHDai] = useState()
    const [executePriceDAIETH, setExecutePriceDAIETH] = useState()
    const [listOrders, setListOrders] = useState()
    const [toggle, setToggle] = useState(false)
    //login
    async function login() {
        const loginAccount =
            (await web3.eth.getAccounts()) && (await web3.eth.requestAccounts());
        setAccount(loginAccount[0]);
        const balance = await web3.eth.getBalance(loginAccount[0])
        setBalanceETH(balance.toString())
        // setBalTokens(web3.utils.fromWei(balance, "ether"))
        setBalTokens(balance.toString())

        //get all tokens balance

        getBalanceAddress(loginAccount[0])
        getReserve(unipair.pairdress)

        // await Moralis.Web3API.account.getTokenBalances({
        //     address: loginAccount[0],
        //     chain: "ropsten"
        // }).then(rep => {
        //     setListBal(rep)
        //     rep.map((bal => (
        //         setTokensAddress(prev => [...prev, [bal.symbol, bal.token_address]])
        //     )
        //     ))
        // })
    }

    const getBalanceAddress = async (account) => {
        const tokenAddress = [
            "0xad6d458402f60fd3bd25163575031acdce07538d", //dai
            "0x85f13db811c1d8e22679cf56ca91931562d837b2", //Slt
            "0xa2d9cbf13b177dddb08347d4220a4bc8fbbfe190", //dug
            "0x28afeecc16ef8c3cba817b1b91277b00d01ee9f6", //ssf
            "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", //uni
            "0x9a06a5c3077982676cc6a8a0d7fd3c556c42c962", //uniV2
        ]
        const wallet = await account
        const balanceETH = await web3.eth.getBalance(wallet)
        console.log("eth", balanceETH)
        var list = []
        var listTokenAdr = []
        for (let tokenAdr of tokenAddress) {
            let symb
            const contract = new web3.eth.Contract(Config.ERC20ABI, tokenAdr)
            //get symbol
            await contract.methods.symbol().call().then(rep => {
                symb = rep
            }
            )
            listTokenAdr.push([symb, tokenAdr])

            //get balance token
            await contract.methods.balanceOf(wallet).call().then(rep =>
                list.push([symb, rep, tokenAdr])
            )
            // console.log("tokenAdr", tokenAdr)
            console.log("Symbol", symb)
        }
        setTokensAddress(listTokenAdr)
        setListBal(list)
        console.log("list-token-balance", list)
        console.log("list-token-address", listTokenAdr)
    }

    // handle balance + get token address from 
    const handleBalance = async (e) => {
        // setBalTokens(web3.utils.fromWei(e.target.value, "ether"))
        setBalTokens(e.target.value)
        console.log("Baltoken", e.target.value)
        // set balance of tokens From
        var mylist = document.getElementById('listTokens')
        var name = mylist.options[mylist.selectedIndex].text
        for (let i = 0; i <= tokensAddress.length; i++) {
            if (name == "ETH") return setTokensFrom('0xc778417E063141139Fce010982780140Aa0cD5Ab')
            if (name == tokensAddress[i][0]) {
                return setTokensFrom(tokensAddress[i][1])
                // set address token From
            }
        }
    }

    const handleInput = async (e) => {
        if (!account) return
        // var amountIn = e.target.value
        var amountIn = document.getElementById("amountIn").value
        var decimal = (10 ** 18)
        console.log("Address token from,", tokensFrom)
        console.log("address token To", tokensTo)

        if (!amountIn && !tokensTo && !tokensFrom) return


        //getPair
        const pair = await getPair(tokensFrom, tokensTo)
        console.log("adddress Pair", pair)
        //getReserve
        if (pair == "0x0000000000000000000000000000000000000000") return alert("Pair doesn't exits!!!")
        // await getReserve
        const reserve = await getReserve(pair, amountIn, Config.DAI)
        console.log("reserve-----", reserve)
        setAmountOut(reserve)
        console.log("----reserve1", executePriceDAIETH)
        console.log("----reserve2", executePriceETHDai)


        // const contract = new web3.eth.Contract(RouterABI, RouterAddress)
        // contract.methods.getAmountOut((amountIn * decimal).toString(), balToken.toString(), tokensTo).call().then(rep => setAmountOut(rep))

    }




    const getAmountOut = async (e) => {
        setTokensTo(e.target.value)
        console.log("Amount out", amountOut)
        console.log("adr", e.target.value)
    }

    // ******************************************************

    // approve
    const approval = async (address) => {
        const coin = new web3.eth.Contract(Config.ABI, address) //address Token 
        console.log("methods", coin.methods)
        await coin.methods.approve(
            "0x51f351BDF06dC09698F449A0fb35EdaA5B6D1cCD", //router
            // "0x5Cf64B07D59685DAF53Dcd3b9a3D28C13520eCAa", //router
            "100000000000000000000000000000000000000"
        ).send({
            from: account
        }).then(rep => console.log("SUCCESS!", rep))
    }

    const allowanceToken = async (address) => {
        const coin = new web3.eth.Contract(Config.ABI, address) //address Token 
        var value
        await coin.methods.allowance(
            account,
            "0x5Cf64B07D59685DAF53Dcd3b9a3D28C13520eCAa" //router
        ).call().then(rep => console.log("RESULT", value = rep))
        return value
    }

    //test placeETHTokenOrder
    const testLO = async () => {
        const contract = new web3.eth.Contract(Config.LimitOrdersABI, Config.LimitOrdersFactory)
        console.log("contract", contract)
        // await contract.methods.orders(5).call().then(rep => console.log("PENDING ORDER", rep))
        await contract.methods.placeETHTokenOrder(
            "0xaD6D458402F60fD3Bd25163575031ACDce07538D",
            "394963396130237445005",
            "394963396130237445005"
        ).send({
            from: account,
            value: "1000000000000000000"
        }).then(rep => console.log("DONE!", rep))
    }

    //getReserve
    const getReserve = async (addressPair, amount) => {
        const contract = new web3.eth.Contract(unipair.unipair, addressPair)
        // console.log(contract.methods)

        var token0, token1

        // await contract.methods.token0().call().then(rep => rep)

        await contract.methods.getReserves().call().then(rep =>

            (rep.reserve0 < rep.reserve1) ? ((token0 = rep.reserve0) & (token1 = rep.reserve1)) : ((token0 = rep.reserve1) & (token1 = rep.reserve0))
        )



        // console.log("reserveDai", token1) //dai //ss
        // console.log("reserveEth", token0) //eth //slt
        const getAmountOut = new web3.eth.Contract(rout.RouterABI, rout.RouterAddress)
        // console.log("sadasd", getAmountOut.methods)
        var value, value1

        await getAmountOut.methods.getAmountOut(
            (amount * (10 ** 18)).toString(),
            token0,
            token1
        ).call().then(rep => (value = rep));
        // console.log("value", value)
        // console.log("1 ETH = ", value / (10 ** 18) + "DAI")
        setExecutePriceETHDai(value)

        await getAmountOut.methods.getAmountOut(
            (amount * (10 ** 18)).toString(),
            token1,
            token0
        ).call().then(rep => (value1 = rep));
        // console.log("eth", value*(10**18))
        // console.log("dai", 500)
        // console.log("dai", (100*(10**18)))
        setExecutePriceDAIETH(value1)


        return [value, value1]
    }

    const getPair = async (token0, token1) => {
        var address
        const contract = new web3.eth.Contract(Config.factoryUniv2Abi, Config.factoryUniv2Adr).methods
        // console.log(contract)
        // // await contract.allPairs(100).call().then(rep => console.log("All pair", rep))
        await contract.getPair(token0, token1).call().then(rep => address = rep)
        return address
    }


    // *******************************

    const getAllOrders = async () => {
        var listIndexOrder = []
        var listOrder = []
        const contract = new web3.eth.Contract(Config.LimitOrdersABI, Config.LimitOrdersFactory).methods
        await contract.getOrdersForAddress(account).call().then(rep => listIndexOrder = rep)
        console.log(listIndexOrder)

        for (let i = 1; i <= listIndexOrder.length; i++) {
            var obj = {}
            await contract.orders(i).call().then(rep => obj = rep)
            console.log("OBJ", obj)
            listOrder.push(obj)
        }

        console.log("ALL Order", listOrder)
        setListOrders(listOrder)
    }

    const getPendingOrders = async () => {
        var listIndexOrder = []
        var listOrder = []
        const contract = new web3.eth.Contract(Config.LimitOrdersABI, Config.LimitOrdersFactory).methods
        await contract.getPendingOrders().call().then(rep => listIndexOrder = rep)
        console.log(listIndexOrder)

        for (let i of listIndexOrder) {
            var obj = {}
            await contract.orders(i).call().then(rep => obj = rep)
            console.log("OBJ", obj)
            listOrder.push(obj)
        }

        console.log("ALL Order", listOrder)
        setListOrders(listOrder)
        return listOrder
    }


    const placeOrder = async () => {
        if (!tokensFrom && !tokensTo) return
        const decimal = (10 ** 18)
        const targetAmountOut = document.getElementById("targetAmount").value
        const amountIn = document.getElementById("amountIn").value
        console.log("target", targetAmountOut)
        console.log("amountIn", amountIn)

        amountOut && console.log("Price Execute", amountOut)

        var swapType
        (tokensFrom == Config.tokenWETH) ? swapType = "ETH_TOKEN" :
            (tokensTo == Config.tokenWETH) ? swapType = "TOKEN_ETH" : swapType = "TOKEN_TOKEN"
        console.log("swapType", swapType)

        const contract = new web3.eth.Contract(Config.LimitOrdersABI, Config.LimitOrdersFactory).methods
        console.log("contract", contract)

        // if (allowanceToken(tokensFrom) == 0) approval(tokensFrom)
        console.log("Token From", tokensFrom)
        console.log("Token To", tokensTo)

        switch (swapType) {
            case "ETH_TOKEN": {
                await contract.placeETHTokenOrder(
                    tokensTo,//address token Out 
                    amountOut[0],//priceExecute
                    targetAmountOut//targetAmountOut
                )
                    .send({
                        from: account,
                        value: (amountIn*(decimal)).toString()
                    }).then(
                        rep => console.log("SUCCESS ORDER ETH_TOKEN", rep)
                    )
                console.log("ETH_TOKEN")
                break;
            }
            case "TOKEN_ETH": {
                await contract.placeTokenETHOrder(
                    tokensFrom,//address tokenIn
                    (amountIn * decimal).toString(),//amountIn
                    amountOut[1],//priceExecute
                    targetAmountOut//targetAmountOut
                ).send({
                    from:account
                }).then(rep => console.log("SUCCESS ORDER TOKEN_ETH", rep))
                console.log("TOKEN_ETH")

                break;
            }

            default: {
                // await contract.placeTokenTokenOrder(
                //     tokensFrom,//address tokeniN
                //     (amountIn * decimal).toString(),//amountIn
                //     tokensTo,//address tokenOut
                //     amountOut[0],//priceExecute
                //     targetAmountOut//targetAmountOut
                // ).call().then(rep => console.log("SUCCESS ORDER TOKEN_TOKEN", rep))
                break;
            }
        }

    }

    const executionOrders = async () => {
        const contract = new web3.eth.Contract(Config.LimitOrdersABI, Config.LimitOrdersFactory).methods
        const pendingOrder = await getPendingOrders()
        for (var i = 0; i < pendingOrder.length; i++) {
            if (pendingOrder[i].amountIn > 0) {
                // const pair = await getPair(pendingOrder[i].tokenIn, pendingOrder[i].tokenOut)
                // const reserve = await getReserve(pair, pendingOrder[i].amountIn)
                pendingOrder[i].target <= amountOut[1] &&
                    await contract.executeOrder(pendingOrder[i].orderID).send({
                        from: account
                    }).then(rep => console.log("EXECUTE SUCCESS", rep))
            }
        }
    }

    function handleOnClickPrice() {
        setToggle(!toggle)
    }

    const testRouter = async() => {

    }




    useEffect(() => {
        tokensAddress && console.log("Update!")
    }, [tokensAddress])
    // useEffect(() => {
    //     if (!account) return
    //     console.log("token Address To", tokensTo)
    //     handleInput()
    // }, [balToken])

    useEffect(() => {
        if (!account) return
        console.log("token Address To", tokensTo)
        handleInput()
    }, [tokensTo, balToken])

    // useEffect(async () => {
    //     const contract = new web3.eth.Contract(RouterABI, RouterAddress)
    //     await tokensTo && console.log("token Address To", tokensTo)
    //     console.log("contract", contract)
    //     await contract.methods.getAmountOut().call().then(rep => console.log("res", rep))

    // }, [amountIn])


    return (
        <div className='container'>
            <div id='header'>
                <Flex>
                    <Box p='2' >
                    forbitspace
                    </Box>
                    <Spacer />
                    <Box p='2' className='rightContent'>
                        <span>
                            Ethereum
                        </span>
                        <span>
                            <button onClick={() => login()}>
                                Connect Wallet
                            </button>
                        </span>

                    </Box>
                </Flex>
            </div>
            <Flex>
                <Spacer />
                <Box p='2'>
                    {account}
                </Box>
            </Flex>
            <Center id='header' color='teal'>Limit Order</Center>
            <Center >
                <div className='limitTable'>
                    <Flex>
                        <p>From</p>
                        <Spacer />
                        <p>Balance: {!balToken ? "0" : balToken / (10 ** 18)}</p>
                    </Flex>
                    <Flex>
                        <Input id="amountIn" placeholder='0' onChange={handleInput} defaultValue={1} />
                        <Select id="listTokens" onChange={handleBalance}>
                            <option value={balanceETH}>ETH</option>
                            {listBal && listBal.map((bal, index) => {
                                return (
                                    <option id={index} value={bal[1]}>{bal[0]}</option>

                                )
                            })}
                        </Select>
                    </Flex>
                    <Flex>
                        <p>Price</p>
                        <Spacer />
                        <div>
                            <Input value={!toggle ? executePriceETHDai : executePriceDAIETH} variant="ghost" onChange={getReserve} />
                        </div>
                    </Flex>
                    <Flex>
                        <p>Execution Price</p>
                        <Spacer />
                        <div onClick={handleOnClickPrice}>
                            {account ?
                                !toggle ? `${document.getElementById("amountIn").value} ETH  =  ${executePriceETHDai / (10 ** 18)} DAI` : `${document.getElementById("amountIn").value} DAI  =  ${executePriceDAIETH / (10 ** 18)} ETH` :
                                "null"}
                            {/* {!toggle ? `${document.getElementById("amountIn").value} ETH  =  ${executePriceETHDai/(10**18)} DAI` : `${document.getElementById("amountIn").value} DAI  =  ${executePriceDAIETH/(10**18)} ETH` } */}
                            {/* {executePriceETHDai ? `1  =  ${executePriceETHDai/(10**18)} ` : ""} */}
                        </div>
                    </Flex>


                    <p>To</p>
                    <Flex>
                        <Input placeholder={amountOut / (10 ** 18).toString()} id="targetAmount" />
                        <Select onChange={getAmountOut}
                        >
                            {/* <option value="0x28afeecc16ef8c3cba817b1b91277b00d01ee9f6">SS</option> */}
                            {listBal && listBal.map((bal, index) => {
                                // console.log("adr",bal[2])
                                // console.log("index",index)
                                return (
                                    <option id={`value${index}`} value={bal[2]}>{bal[0]}</option>
                                )
                            })}
                            <option value="0xc778417E063141139Fce010982780140Aa0cD5Ab">ETH</option>

                        </Select>
                    </Flex>
                    <Center>
                        <Button w='20rem' onClick={() => placeOrder()}>Place Order</Button>
                    </Center>
                </div>
            </Center>
            <Center>
                <span>
                    <button onClick={() => approval(Config.DAI)} style={{ marginRight: "1rem" }}>
                        Approval
                    </button>
                </span>
                {/* <span>
                    <button onClick={testLO} style={{ marginRight: "1rem" }}>
                        Test
                    </button>
                </span>

                <span>
                    <button onClick={getReserve} style={{ marginRight: "1rem" }} >
                        Reverse
                    </button>
                </span>

                <span>
                    <button onClick={getBalanceAddress} style={{ marginRight: "1rem" }}>
                        Get Balance Address
                    </button>
                </span> */}
                <span>
                    <button onClick={getAllOrders} style={{ marginRight: "1rem" }}>
                        Get All Orders
                    </button>
                </span>
                <span>
                    <button onClick={getPendingOrders} style={{ marginRight: "1rem" }}>
                        Get Pending Orders
                    </button>
                </span>
                {/* <span>
                    <button onClick={executionOrders} style={{ marginRight: "1rem" }}>
                        executionOrders
                    </button>
                </span>
                <span>
                    <button onClick={allowanceToken} style={{ marginRight: "1rem" }}>
                        Allowance
                    </button>
                </span> */}
            </Center>
            <Accordion defaultIndex={[0]} allowMultiple>
                {listOrders ?
                    listOrders.map((ord, index) => {
                        return (
                            <AccordionItem>
                                <h2>
                                    <AccordionButton>
                                        <Box flex='1' textAlign='left'>
                                            OrderID : {ord.orderID}
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    <Table>

                                        <Tbody>
                                            <Tr>
                                                <Td>Token In </Td>
                                                <Td>{(ord.tokenIn)} </Td>
                                            </Tr>
                                            <Tr>
                                                <Td>Amount In </Td>
                                                <Td>{ord.amountIn} </Td>
                                            </Tr>
                                            <Tr>
                                                <Td>Token Out </Td>
                                                <Td>{ord.tokenOut} </Td>
                                            </Tr>
                                            <Tr>
                                                <Td>Min Amount Out </Td>
                                                <Td>{ord.minAmountOut} </Td>
                                            </Tr>
                                            <Tr>
                                                <Td>Current Price </Td>
                                                <Td>{ord.priceExecuted} </Td>
                                            </Tr>
                                            <Tr>
                                                <Td>Status </Td>
                                                <Td>{(ord.status < 1) ? "PENDING" :
                                                    ord.status < 2 ? "FILLED" : "CANCELLED"} </Td>
                                            </Tr>
                                            <Tr>
                                                <Td>Timestamp </Td>
                                                <Td>{ord.timestamp} </Td>
                                            </Tr>
                                        </Tbody>
                                    </Table>
                                </AccordionPanel>
                            </AccordionItem>


                        )
                    }
                    )

                    : null}
            </Accordion>


        </div>
    )
}

export default BackgroundTest