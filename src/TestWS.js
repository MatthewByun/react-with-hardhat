import React, { useEffect } from "react";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";
import { BscConnector } from '@binance-chain/bsc-connector'

import "./TestWS.css";
function ConnectWallet() {

  const { library, active, chainId, account } = useWeb3React();
  const { activate, deactivate } = useWeb3React();

  const CoinbaseWallet = new WalletLinkConnector({
    url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
    appName: "Web3-react Demo",
    supportedChainIds: [1, 3, 4, 5, 42],
  });

  const WalletConnect = new WalletConnectConnector({
    rpcUrl: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
    bridge: "https://bridge.walletconnect.org",
    qrcode: true,
  });
  const BinanceConnect = new BscConnector({
    supportedChainIds: [1,56,97],
  });

  

  const Injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 137],
  });

  const handleNetwork = async () => {
    const network = document.querySelector("#network").value;

    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x" + Number(network).toString(16) }],
      });
    } catch (error) {
      console.error(error);
    }
  };
  const getJokes = async ({ firstName, lastName }) => {
    const Jokes = await fetch(
      `http://api.icndb.com/jokes/random?firstName=${firstName}&lastName=${lastName}`
    ).then((res) => res.json());
    document.getElementById("jokes").innerHTML = Jokes.value.joke;
    // console.log("JOKE", Jokes.value.joke)
  };
  console.log("status", active);


  

  return (
    <div className="container">
      <div className="network-list">
        <div
          onClick={() => {
            activate(CoinbaseWallet);
          }}
        >
          <span id="network-name">COINBASE WALLET</span>
        </div>

        <div
          onClick={() => {
            activate(WalletConnect);
          }}
        >
          <span id="network-name">WALLET CONNECT</span>
        </div>

        <div
          onClick={() => {
            getJokes({ firstName: "Elon", lastName: "Musk" });
            activate(Injected);
          }}
        >
          <span id="network-name">METAMASKS</span>
        </div>
        <div
          onClick={() => {
            activate(BinanceConnect);
          }}
        >
          <span id="network-name">BINANCE WALLET</span>
          {/* <span id="network-name">{account}</span> */}
        </div>
      </div>

      {account && (
        <div>
          <div id="jokes"></div>

          {/* <div id="text">
            Connection Status: {active ? "Connected" : "Not Connect"}
          </div> */}
          <div id="text">Hello {account}</div>
          <div id="text">Network ID: {chainId}</div>
          

          <div id="text">
            <label htmlFor="Network"></label>
            <select name="network" id="network">
              <option value="1">Ethereum</option>
              <option value="3">Ropsten</option>
              <option value="4">Rinkeby</option>
              <option value="5">Goerli</option>
              <option value="137">Polygon</option>
            </select>
            <button onClick={handleNetwork}>Switch</button>
          </div>
          <div className="btn-logout" id="text" onClick={deactivate}>
            Log Out
          </div>
        </div>
      )}
    </div>
  );
}

export default ConnectWallet;
