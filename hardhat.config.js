
// SPDX-License-Identifier: MIT
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-web3")
require("@nomiclabs/hardhat-etherscan")

let secret = require("./secret.json");

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
// module.exports = {
//   solidity: "0.8.4",
//   networks: {
//     ropsten:{
//       url: secret.url,
//       accounts: [secret.priKey]
//     },
//     etherscan: {
//       apiKey: process.env.ETHERSCAN_API_KEY,
//     }
//   }
// };
module.exports = {
  solidity: {
    version:"0.8.4",
    settings:{
      optimizer:{
        enabled: true,
        runs: 1
      }
    },
      // ropsten: {
      //   url: process.env.ROPSTEN_URL || "",
      //   accounts:
      //     process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      // ,
    },
    networks: {
      ropsten: {
        url: secret.url,
        accounts: [secret.priKey]
      },
      matic: {
        url: "https://polygon-rpc.com",
        accounts: [secret.priKey]
      },
      
      // gasReporter: {
        //   enabled: process.env.REPORT_GAS !== undefined,
        //   currency: "USD",
        // },
        // etherscan: {
          //   apiKey: process.env.ETHERSCAN_API_KEY,
          // },
        },
        etherscan: {
          apiKey: "5RVYDTQ1N3STJ8DGHR4SE4JVTAAWWV2TJY"
        }
}

