import React, { useState, useEffect } from "react";
import Web3 from "web3";
import {
  Button,
  Flex,
  Spacer,
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
  Divider,
} from "@chakra-ui/react";
import { tokenSSF, tokenSLT, tokenDoggun, tokenWETH } from "./config";
import { useMoralis } from "react-moralis";
import { RouterABI, RouterAddress } from "../abi/linkswap/router";
import { factoryABI, factoryAddress } from "../abi/test/factory";
const Space = () => {
  const { Moralis } = useMoralis();
  const [account, setAccount] = useState();
  const [balance, setBalance] = useState();
  const [listBalance, setListBalance] = useState([]);
  const [listPair, setListPair] = useState([]);
  const [tokensListPair, setTokensListPair] = useState([]);
  const [lengthPair, setLengthPair] = useState(0);
  const web3 = new Web3(Web3.givenProvider);

  useEffect(async () => {
    const account =
      (await web3.eth.getAccounts()) && (await web3.eth.requestAccounts());
    setAccount(account[0]);
    console.log("account", account);
    const balanceEth = await web3.eth.getBalance(account[0]);
    setBalance(web3.utils.fromWei(balanceEth, "ether"));
    await Moralis.Web3API.account
      .getTokenBalances({
        address: account[0],
        chain: "ropsten",
      })
      .then((receipt) => {
        setListBalance(receipt);
      });

    const contract = new web3.eth.Contract(factoryABI, factoryAddress);
    const length = await contract.methods
      .allPairsLength()
      .call()
      .then((rep) => {
        for (let i = 0; i < rep; i++) {
          contract.methods
            .allPairs(i)
            .call()
            .then((rep) => {
              setListPair((pairs) => [...pairs, rep]);
              Moralis.Web3API.account
                .getTokenBalances({
                  address: rep,
                  chain: "ropsten",
                })
                .then((receipt) => {
                  setTokensListPair((pair) => [...pair, receipt]);
                  console.log("tokenslistpair", receipt);
                });
            });
        }
        console.log("s12213123", rep);
        setLengthPair(rep.length);
      });
    // await getTokensPair();

    // console.log("----", tokensListPair)
    // listPair.map((list) => {
    //   Moralis.Web3API.account
    //     .getTokenBalances({
    //       address: list,
    //       chain: "ropsten",
    //     })
    //     .then((receipt) => {
    //       setTokensListPair((rep) => [...rep, receipt]);
    //       console.log("tokenslistpair", receipt);
    //       console.log("saldkaasdslkdsalkd ", tokensListPair);
    //     });
    // });
  }, []);
  // const login = async () => {
  //   const account =
  //     (await web3.eth.getAccounts()) && (await web3.eth.requestAccounts());
  //   setAccount(account[0]);
  //   console.log("account", account);
  //   const balanceEth = await web3.eth.getBalance(account[0]);
  //   setBalance(web3.utils.fromWei(balanceEth, "ether"));
  //   await Moralis.Web3API.account
  //     .getTokenBalances({
  //       address: account[0],
  //       chain: "ropsten",
  //     })
  //     .then((receipt) => {
  //       setListBalance(receipt);
  //     });

  //     await getAllPair();
  //     await getTokensPair();

  //   // console.log("listPairrrr", listPair);
  //   // listPair.map((list) => {
  //   //   Moralis.Web3API.account
  //   //     .getTokenBalances({
  //   //       address: list,
  //   //       chain: "ropsten",
  //   //     })
  //   //     .then((receipt) => {
  //   //       setTokensListPair(receipt);
  //   //       console.log("---", receipt);
  //   //     });
  //   // });
  // };

  // async function getListTokens(add) {
  //   const options = {
  //     address: add,
  //     chain: "ropsten",
  //   };
  //   await Moralis.Web3API.account.getTokenBalances(options).then((receipt) => {
  //     setTokensListPair(receipt);
  //     // return receipt
  //   });
  // }
  function addLiquidity() {
    const contract = new web3.eth.Contract(RouterABI, RouterAddress);
    console.log(contract.methods);
    return contract.methods
      .getPairFor(tokenSSF, tokenSLT)
      .call()
      .then((rep) => console.log("Result", rep));
  }
  async function getAllPair() {
    console.log("1231231231231");
    const contract = new web3.eth.Contract(factoryABI, factoryAddress);
    const length = await contract.methods
      .allPairsLength()
      .call()
      .then((rep) => {
        for (let i = 0; i < rep; i++) {
          contract.methods
            .allPairs(i)
            .call()
            .then((rep) => {
              setListPair((pairs) => [...pairs, rep]);
              setLengthPair(length);
            });
        }
      });
  }

  async function getTokensPair() {
    console.log("List", listPair);
    listPair.map((list) => {
      Moralis.Web3API.account
        .getTokenBalances({
          address: list,
          chain: "ropsten",
        })
        .then((receipt) => {
          setTokensListPair((rep) => [...rep, receipt]);
          console.log("tokenslistpair", receipt);
        });
    });
  }

  const handleAddLiquidity = async () => {
    !account ? alert("Not Login!") : addLiquidity();
  };

  return (
    <div>
      <Flex p="2">
        SPACEEEEE
        <Spacer />
        {account}
        <Spacer />
        <Button
          colorScheme="twitter"
          variant="outline"
          // onClick={login}
        >
          Log In
        </Button>
      </Flex>
      {account ? (
        <Table mt="24">
          <Thead>
            <Tr>
              <Th>Token</Th>
              <Th>Token Address</Th>
              <Th isNumeric>Balance</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr key="1">
              <Td>ETH</Td>
              <Td></Td>
              <Td isNumeric>{balance} Ether</Td>
            </Tr>
            {listBalance.length
              ? listBalance.map((bal, index) => {
                  return (
                    <Tr key={index}>
                      <Td>{bal.symbol}</Td>
                      <Td>{bal.token_address}</Td>
                      <Td isNumeric>
                        {web3.utils.fromWei(bal.balance, "ether")} Ether
                      </Td>
                    </Tr>
                  );
                })
              : null}
          </Tbody>
        </Table>
      ) : null}

      {listPair.length ? (
        <Table mt="24">
          <Thead>
            <Tr>
              <Th>Address Pairs</Th>
              <Th>Tokens</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                {listPair.length
                  ? listPair.map((pair, index) => {
                      return (
                        <Tr key={index}>
                          <Td>{pair}</Td>
                        </Tr>
                      );
                    })
                  : null}
              </Td>
              <Td>
                {tokensListPair.length > 0 &&
                tokensListPair.length >= lengthPair 
                    ? tokensListPair.map((tokens, i) => {           
                        return (
                         (
                          <Tr key={i}>
                            <Td>
                              {/* {tokens[0].symbol} |{tokens[0].token_address}  & {tokens[1].symbol} |{tokens[1].token_address} */}
                            </Td>
                          </Tr>
                        ))
                      })
                  : null}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      ) : null}

      <Divider />
      {/* <Button mt="20" colorScheme="twitter" onClick={handleAddLiquidity}>
        Test
      </Button> */}
      
    </div>
  );
};

export default Space;
