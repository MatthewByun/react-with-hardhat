const { ethers } = require('ethers');

module.exports = async () => {
  try {
    const { SWAP_EXACT_ETH_FOR_TOKENS, WETH } = require('../constant');
    const UniswapV2Router02 = artifacts.require('UniswapV2Router02');
    const UniswapV2Pair = artifacts.require('IUniswapV2Pair');

    if (process.argv[5] !== 'ropsten') {
      throw new Error('Invalid Network ID!');
    }

    if (process.argv[6] !== 'ssf') {
      throw new Error('Invalid token name!');
    }

    let tokenAddress = SWAP_EXACT_ETH_FOR_TOKENS[process.argv[6]].address;
    let amountETH = SWAP_EXACT_ETH_FOR_TOKENS[process.argv[6]].amountETH;

    const uniswapV2Router02Instance = await UniswapV2Router02.deployed();
    let pairAddress = await uniswapV2Router02Instance.getPairFor(tokenAddress, WETH);
    let pairInstance = await UniswapV2Pair.at(pairAddress);

    let reserves = await pairInstance.getReserves();
    let reserveETH;
    let reserveDAI;

    // console.log("reserveETH: ", reserves)
    if (WETH < SWAP_EXACT_ETH_FOR_TOKENS[process.argv[6]].address) {
      reserveETH = reserves[0];
      reserveDAI = reserves[1];
    } else {
      reserveETH = reserves[1];
      reserveDAI = reserves[0];
    }
    console.log("amount ETH", amountETH)
  //  console.log("reserveETH", reserveETH)
  //  console.log("reserveSSF", reserveDAI)
    console.log("reser ETH" , (Number(reserveETH).toString()))
    console.log("reser SSF" , (Number(reserveDAI).toString()))
    // console.log("reser SSF" , Number(reserveDAI)/(10**18))
    let result = parseInt(
      await uniswapV2Router02Instance.getAmountOut(amountETH, reserveETH, reserveDAI)
    );


    // console.log("result" ,result);
    console.log("Result: SSF" , result / (10**18));

    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
