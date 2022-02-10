// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");


// require('dotenv').config();
// const UniswapV2Router02 = artifacts.require('UniswapV2Router02');
// const { WETH } = require('../constant');

// module.exports = async function(deployer) {
//   try {
//     await deployer.deploy(
//       UniswapV2Router02,
//       '0xEd23423FF552c10d1beDe08aA7FB36d56934dd40' /* Replace your factory address at here */,
//       WETH,
//       {
//         gas: 8000000,
//         from: process.env.OPERATOR_ADDRESS,
//       }
//     );
//   } catch (err) {
//     console.log(err);
//   }
// };

async function main() {
  const MyContract = await ethers.getContractFactory("UniswapV2Router02");
  const contract = await MyContract.deploy(
    "0xEd23423FF552c10d1beDe08aA7FB36d56934dd40", //factory address
    "0xc778417E063141139Fce010982780140Aa0cD5Ab" // weth address
  );
  console.log("deploy here");

  await contract.deployed();
  console.log("contract deployed to:", contract.address);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
