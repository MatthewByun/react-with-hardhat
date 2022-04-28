// import { MoralisProvider } from "react-moralis";
// import secret from "./svMoralis.json";
// import SwapToken from "./SwapToken";
import { ChakraProvider } from "@chakra-ui/react";
// import Space from "./space";
// import TestSwap from "./TestSwap";
// import BackgroundTest from "./LimitOrderTest";
// import Matic from "./Matic";
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from "@ethersproject/providers";
import LinkSwap from "./getPrice/LinkSwap";
import DefiSwap from "./getPrice/CroDefiSwap";
import UniswapV2 from "./getPrice/UniswapV2";
import HandlePrice from "./getPrice/handlePrice";
import MaticV3 from "./test/MaticV3"
function getLibrary(provider) {
  return new Web3Provider(provider);
}

function App() {
  return (
  
      <Web3ReactProvider getLibrary={getLibrary}>
      {/* <LinkSwap /> */}
      {/* <DefiSwap /> */}
      {/* <UniswapV2 /> */}
      <HandlePrice />
      {/* <MaticV3 /> */}
      </Web3ReactProvider>

    
  );
}

export default App;
