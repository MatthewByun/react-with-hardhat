const TOKENS = {
  slt:{
    address: '0x85f13db811c1d8e22679cf56ca91931562d837b2',
    amountDesired: (500 * 10 ** 18).toString(),
    amountMin: (50 * 10 ** 18).toString(),
    amountETHMin: (1 * 10 ** 18).toString(),
  },
  ssf: {
    address: '0x28AFeECc16EF8C3cbA817B1B91277b00d01eE9F6',
    amountDesired: (100 * 10 ** 18).toString(),
    amountMin: (50 * 10 ** 18).toString(),
    amountETHMin: (1 * 10 ** 18).toString(),
  },
};

const SWAP_EXACT_ETH_FOR_TOKENS = {
  slt:{
    address: '0x85f13db811c1d8e22679cf56ca91931562d837b2',
    amountETH: (1 * 10 ** 18).toString(),
  },
  ssf: {
    address: '0x28AFeECc16EF8C3cbA817B1B91277b00d01eE9F6',
    amountETH: (1 * 10 ** 18).toString(),
  },
};

const WETH = '0xc778417E063141139Fce010982780140Aa0cD5Ab';
const DEADLINE = '2000000000';

module.exports = { TOKENS, WETH, DEADLINE, SWAP_EXACT_ETH_FOR_TOKENS };
