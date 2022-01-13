import "./App.css";
import Web3 from "web3";
import { useEffect, useState } from "react";
import { ABI, ADDRESS } from "./config";



// const App = () => {
//   return(
//     <div className="container">
//       Hello
//     </div>
//   )
// }










const App = () => {
  const [account, setAccount] = useState();
  const [balance, setBalance] = useState();
  const [count, setCount] = useState(0);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [listABI, setListABI] = useState({});
  const [lstEthValue, setLstEthValue] = useState({});
  const [getWeb3,setGetWeb3] = useState("")


  useEffect(() => {
    loadBlockChain();
  }, []);

  const loadBlockChain = async () => {
    const web3 = new Web3(Web3.givenProvider || "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
    setGetWeb3(web3)

    const account =
      (await web3.eth.getAccounts()) && (await web3.eth.requestAccounts());
    setAccount(account[0]);
    setAccount(account[0]);
    console.log(account);


    const listEthvalue = await web3.utils.unitMap;
    setLstEthValue(listEthvalue);
    console.log(web3.utils.unitMap);


    const checkAddress = await web3.utils.checkAddressChecksum(
      "0x431cdC162aFFfBCC9b71593Eb96F74D53c335655"
    );
    console.log(checkAddress);

    const balance = await web3.eth.getBalance(account[0]);
    setBalance(balance);

    console.log(balance);

    const getListABI = new web3.eth.Contract(ABI, ADDRESS);
    setListABI(getListABI);

    console.log(getListABI);
    // console.log("getList", getListABI);

    const taskCount = await getListABI.methods.taskCount().call();
    setCount(taskCount);

    for (var i = 1; i <= taskCount; i++) {
      // call the contacts method to get that particular contact from smart contract
      const contact = await getListABI.methods.tasks(i).call();
      setContacts((contacts) => [...contacts, contact]);
      setLoading(false);

      console.log("contact", contact);

      // add recently fetched contact to state variable.
    }

    // console.log("cccc", taskCount);
    // for(i = 0; i<= taskCount.length; i++) {
    //   const task = await getListABI.methods.task(i).call()

    // }
  };

  // const handleClick = (e) => {
  //   e.preventDefault();
  //   console.log("name: " + name, " + content: " + content);
  //   console.log("getLi123213213st", listABI);
  // };

  const handleName = (e) => {
    setName(e.target.value);
  };
  const handleContent = (e) => {
    setContent(e.target.value);
  };

  const createTask = (listABI, name, content, account) => {
    setLoading(true);
    // console.log("listABI,", listABI);
    listABI.methods
      .createTask(name, content)
      .send({ from: account })
      .once("receipt", (receipt) => {
        console.log(receipt);
        // console.log("Mã giao dịch : " , receipt.transactionHash);
        // console.log("gasUsed: ", receipt.gasUsed);
        setLoading(false);
        window.location.reload();
      });
  };

  const handleValue = (getWeb3) => {
    const ethValue = document.querySelector("#etherValue").value;
    const nbValue = document.querySelector('#numberValue').value;
    const addressReceive = document.querySelector('#addressReceive').value
    // console.log(value);

      getWeb3.eth
      .sendTransaction({
        to: addressReceive,
        from: account,
        value: nbValue * ethValue,
      })
      .then(function (receipt) {

        console.log(receipt);
        receipt && alert("Done!!!!!")
        setTimeout(() => {
          window.location.reload()
        }, 3000)

      });
  };

  return (


    // <div className="container">
    //   Helelfoawifkjayfiuaghfiuagh
    // </div>



    <div className="container">
      
      loading ? (
        <div>Loading.....</div>
      ) : 
      {(
        <div className="header">
          <h1>Welcome to MetaMask!!!</h1>
          <h3>Your Account: </h3> {account}
          <h3>Task Count: {count}</h3>
          <h3>Balance: {balance}</h3>
          <h3>Name: </h3>
          <h1>Contracts</h1>
          <ul>
            <div className="input-transfer">
              Transfer: <br />
              Transactions to address: <input type="text" id="addressReceive" /> <br />
              Value: <input type="text" id="numberValue"/> <br />
              <label htmlFor="etherValue">Ether Value: </label>
              <select name="etherValue" id="etherValue">
                <option value={lstEthValue.Gwei}>Gwei</option>
                <option value={lstEthValue.Kwei}>Kwei</option>
                <option value={lstEthValue.Mwei}>Mwei</option>
                <option value={lstEthValue.babbage}>babbage</option>
                <option value={lstEthValue.ether}>ether</option>
                <option value={lstEthValue.femtoether}>femtoether</option>
                <option value={lstEthValue.finney}>finney</option>
                <option value={lstEthValue.gether}>gether</option>
                <option value={lstEthValue.grand}>grand</option>
                <option value={lstEthValue.gwei}>gwei</option>
                <option value={lstEthValue.kether}>kether</option>
                <option value={lstEthValue.kwei}>kwei</option>
                <option value={lstEthValue.lovelace}>lovelace</option>
                <option value={lstEthValue.mether}>mether</option>
                <option value={lstEthValue.micro}>micro</option>
                <option value={lstEthValue.microether}>microether</option>
                <option value={lstEthValue.milli}>milli</option>
                <option value={lstEthValue.milliether}>milliether</option>
                <option value={lstEthValue.mwei}>mwei</option>
                <option value={lstEthValue.nano}>nano</option>
                <option value={lstEthValue.nanoether}>nanoether</option>
                <option value={lstEthValue.noether}>noether</option>
                <option value={lstEthValue.picoether}>picoether</option>
                <option value={lstEthValue.shannon}>shannon</option>
                <option value={lstEthValue.szabo}>szabo</option>
                <option value={lstEthValue.tether}>tether</option>
                <option value={lstEthValue.wei}>wei</option>
              </select>
              <button onClick={() => handleValue(getWeb3)}>Confirm!</button>
            </div>

            <br />
            <br />
            <br />

            <div className="input">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createTask(listABI, name, content, account);
                }}
              >
                <input
                  type="text"
                  onChange={handleName}
                  value={name}
                  placeholder="Name..."
                />
                <input
                  type="text"
                  onChange={handleContent}
                  value={content}
                  placeholder="Content..."
                />
                <button
                  onClick={() => {
                    createTask(listABI, name, content, account);
                  }}
                >
                  Confirm!
                </button>
              </form>
            </div>

            {contacts.map((contact, index) => (
              <div className="content" key={index}>
                <span>
                  {" "}
                  <input type="checkbox" />
                  {index + 1}. Name : {contact.getname}
                </span>
                <p>Content: {contact.content}</p>
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>


  );
};

export default App;
