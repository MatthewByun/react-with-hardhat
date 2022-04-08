// import { MoralisProvider } from "react-moralis";
// import secret from "./svMoralis.json";
// import SwapToken from "./SwapToken";
import { ChakraProvider } from "@chakra-ui/react";
// import Space from "./space";
// import TestSwap from "./TestSwap";
// import BackgroundTest from "./LimitOrderTest";
// import Matic from "./Matic";
import MaticV3 from "./MaticV3";
import TestWS from "./TestWS";
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from "@ethersproject/providers";
import Space from "./space";
import ChartsReact from "./eChartsReact";
import Fetchapicharts from "./FetchAPIcharts";
import ChartData from "./ChartsData.jsx";

function getLibrary(provider) {
  return new Web3Provider(provider);
}

function App() {
  return (
  
      <Web3ReactProvider getLibrary={getLibrary}>
      {/* <TestWS /> */}
      {/* <MaticV3 /> */}
      {/* <Fetchapicharts /> */}
      {/* <ChartsReact /> */}
      <ChartData />

      {/* <MoralisProvider serverUrl='https://shty726ustzl.usemoralis.com:2053/server' appId='SBqQ6TLoKDzDMw9v5yh9HrsCgGR14CGIashsxcZ9'>
      <Space />
      </MoralisProvider> */}
      </Web3ReactProvider>

    
  );
}

export default App;
