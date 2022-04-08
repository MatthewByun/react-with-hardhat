// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  const MyContract = await ethers.getContractFactory("LimitOrderMTC");
  const contract = await MyContract.deploy(
    // "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32",
    "0xa52487f75f4E4554914810877a78fF9574A98275"
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
