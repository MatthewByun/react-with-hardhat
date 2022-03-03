// import { MoralisProvider } from "react-moralis";
// import secret from "./svMoralis.json";
// import SwapToken from "./SwapToken";
import { ChakraProvider } from "@chakra-ui/react";
import Space from "./space";
import TestSwap from "./TestSwap";
import BackgroundTest from "./LimitOrderTest";
// let svMoralis = require("./svMoralis.json")

function App() {
  return (
    // <MoralisProvider serverUrl={svMoralis.url} appId={svMoralis.id}>
    <ChakraProvider>
      {/* <Space /> */}
      <BackgroundTest />
      {/* <TestSwap /> */}
    </ChakraProvider>
    // </MoralisProvider>
  );
}

export default App;
