import { MoralisProvider } from "react-moralis";
import "./App.css";
import SwapToken from "./SwapToken";
import secret from "./svMoralis.json"

const App = () => {
  return(
  <div className="container">
    <MoralisProvider appId={secret.appID} serverUrl={secret.severURL}>
    <SwapToken />
    </MoralisProvider>
    
  </div>
)}

export default App;
