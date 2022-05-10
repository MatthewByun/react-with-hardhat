// import { MoralisProvider } from "react-moralis";
// import secret from "./svMoralis.json";
// import SwapToken from "./SwapToken";
// import Space from "./space";
// import TestSwap from "./TestSwap";
// import BackgroundTest from "./LimitOrderTest";
// import Matic from "./Matic";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import LinkSwap from "./getPrice/LinkSwap";
import DefiSwap from "./getPrice/CroDefiSwap";
import UniswapV2 from "./getPrice/UniswapV2";
import HandlePrice from "./getPrice/handlePrice";
import MaticV3 from "./test/MaticV3";
import GetPrice from "./getPrice/handlePrice_2";
import GetPrice_3 from "./getPrice/handlePrice_3";
import HandlePriceee from "./getPrice/saved";
import ABC from "./getPrice/saved2";
import Curve from "./getPrice/Curve";
function getLibrary(provider) {
  return new Web3Provider(provider);
}

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div>
        {/* <LinkSwap /> */}
        {/* <DefiSwap /> */}
        {/* <UniswapV2 /> */}
        {/* <HandlePrice /> */}
        {/* <GetPrice /> */}
        {/* <GetPrice_3/> */}
        <ABC />
        {/* <Curve /> */}
        {/* <br /> */}
        {/* <HandlePriceee /> */}
        {/* <MaticV3 /> */}
      </div>
    </Web3ReactProvider>
  );
}

export default App;
