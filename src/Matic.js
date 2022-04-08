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
    const balance = await web3.eth.getBalance(accounts[0]);
    console.log("balance", balance.toString());
  }
  async function getPair() {
    const contract = new web3.eth.Contract(
      CONFIG.PolygonABI,
      CONFIG.PolygonFactory
    ).methods;
    console.log("Contract", contract);
    const pair = await contract
      .getPair(
        "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
      )
      .call();
    //   const pair = await contract.allPairs(3000).call()
    //   const pair = await contract.allPairsLength().call()
    console.log("Pair address", pair);
    const date = new Date().getTime();
    console.log("Date", date / 1000);
  }
  // getPair();
  const approval = async (amount, address) => {
    var BN = web3.utils.BN;
    const decimals = 10 ** 18;
    const amountTokenIn = (amount * decimals).toLocaleString("fullwide", {
      useGrouping: false,
    });
    // var number = web3.utils.toHex(amountTokenIn).toString()
    var number = new BN(amountTokenIn).toString();
    const coin = new web3.eth.Contract(CONFIG.ABI, address); //address Token
    console.log("methods", coin.methods);
    // const routerAddress = await limitOrderMethods.getRouterAddress().call();
    console.log("Number", amountTokenIn)
    await coin.methods
      .approve(
        // "0x51f351BDF06dC09698F449A0fb35EdaA5B6D1cCD", //router
        // routerAddress,
        "0x7E343dE902aE23c87B4Ff6f764316A29377f025D",
        // "0xd8b932d65BE873553bD8CCE93105f9746cF85A3E",
        // "0x5Cf64B07D59685DAF53Dcd3b9a3D28C13520eCAa", //router
        number
      )
      .send({
        from: account,
      })
      .then((rep) => console.log("SUCCESS!", rep));
  };
  const shouldFulfiled = async () => {
    const bool = new web3.eth.Contract([
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "status",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "swapType",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "pair",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "tokenIn",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "tokenOut",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amountIn",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "priceExecute",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "minAmountOut",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          }
        ],
        "name": "OrderCancelled",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "status",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "swapType",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "pair",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "tokenIn",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "tokenOut",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amountIn",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "priceExecute",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "minAmountOut",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          }
        ],
        "name": "OrderFulfilled",
        "type": "event"
      },
      {
        "inputs": [
          {
            "components": [
              {
                "internalType": "address",
                "name": "owner",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "status",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "swapType",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "pair",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "tokenIn",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "tokenOut",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "amountIn",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "priceExecute",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "minAmountOut",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
              }
            ],
            "internalType": "struct LimitOrders.Order",
            "name": "ord",
            "type": "tuple"
          }
        ],
        "name": "ExecuteCustomOrder",
        "outputs": [
          {
            "internalType": "bool",
            "name": "filled",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "ORDER_EXPIRY",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "ORDER_TIMESTAMP",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "USDC",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "WMATIC",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "WMATIC_USDC",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "components": [
              {
                "internalType": "address",
                "name": "owner",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "status",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "swapType",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "pair",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "tokenIn",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "tokenOut",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "amountIn",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "priceExecute",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "minAmountOut",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
              }
            ],
            "internalType": "struct LimitOrders.Order",
            "name": "ord",
            "type": "tuple"
          }
        ],
        "name": "cancelOrder",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "factory",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "amountIn",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "pair",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "tokenIn",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "tokenOut",
            "type": "address"
          }
        ],
        "name": "getAmountOut",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "amountOut",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "tokenIn",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "tokenOut",
            "type": "address"
          }
        ],
        "name": "getPair",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "pair",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "tokenA",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "tokenB",
            "type": "address"
          }
        ],
        "name": "getReserves",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "reserveA",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "reserveB",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getRouterAddress",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "orders",
        "outputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "status",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "swapType",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "pair",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "tokenIn",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "tokenOut",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amountIn",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "priceExecute",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minAmountOut",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "components": [
              {
                "internalType": "address",
                "name": "owner",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "status",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "swapType",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "pair",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "tokenIn",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "tokenOut",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "amountIn",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "priceExecute",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "minAmountOut",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
              }
            ],
            "internalType": "struct LimitOrders.Order",
            "name": "ord",
            "type": "tuple"
          }
        ],
        "name": "shouldFulfilOrder",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "tokenA",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "tokenB",
            "type": "address"
          }
        ],
        "name": "sortTokens",
        "outputs": [
          {
            "internalType": "address",
            "name": "token0",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "token1",
            "type": "address"
          }
        ],
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "token",
            "type": "address"
          }
        ],
        "name": "symbolFor",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "stateMutability": "payable",
        "type": "receive"
      }
    ],"0x7C4fB997584DB4B7885eD6228Ed73d57c5Be9c3C").methods
    const test = await bool.shouldFulfilOrder(["0xc0091C37A375dC8EfDa13204A28dFD33e6AF89DD",0,0,"0x604229c960e5CACF2aaEAc8Be68Ac07BA9dF81c3","0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270","0xc2132D05D31c914a87C6611C10748AEb04B58e8F","100000000000000000",1,0x00,1647597635]).call()
    
    const gasLimit = await bool.ExecuteCustomOrder(["0xc0091C37A375dC8EfDa13204A28dFD33e6AF89DD",0,0,"0x604229c960e5CACF2aaEAc8Be68Ac07BA9dF81c3","0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270","0xc2132D05D31c914a87C6611C10748AEb04B58e8F","100000000000000000",1,0x00,1647597635]).estimateGas({from: account, value: "100000000000000000"})
    console.log('gas', gasLimit)
    // const test = await bool.ExecuteCustomOrder(["0xc0091C37A375dC8EfDa13204A28dFD33e6AF89DD",0,0,"0x604229c960e5CACF2aaEAc8Be68Ac07BA9dF81c3","0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270","0xc2132D05D31c914a87C6611C10748AEb04B58e8F","100000000000000000",1,0x00,1647597635]).send({from: account, value: "100000000000000000"})
    console.log("test", test)
    console.log("Bool", bool);
  };

  useEffect(async () => {
    const contract = new web3.eth.Contract(
      CONFIG.LimitOrdersABI,
      CONFIG.LimitOrdersPolygon
    ).methods;
    console.log("LimitORder", contract);
    setMethods(contract);
  }, []);

  useEffect(async () => {
    Login();
    account && shouldFulfiled();
    // approval(100, "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063");

    // console.log("account", account);
    // console.log();
  }, [account]);

  useEffect(() => {
    getPair();
  }, []);

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
