const { expect } = require("chai");
const { web3 } = require("hardhat");

describe("Token contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");

    // console.log("Get accounts: ", await web3.eth.getAccounts());
    // web3.eth.defaultAccount = '0xa52487f75f4E4554914810877a78fF9574A98275';
    // console.log("Default account:", web3.eth.defaultAccount )

    // web3.eth.getBalance()


    const hardhatToken = await Token.deploy();


    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
  });
});