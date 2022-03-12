// // SPDX-License-Identifier: MIT
// pragma solidity >=0.5.16;

// interface ISpaceLimitOrders {
//     enum OrderStatus { PENDING, FILLED, CANCELLED }
//     enum OrderType { ETH_TOKEN, TOKEN_TOKEN, TOKEN_ETH }
    
//     function getRouterAddress() external view returns (address);
    
//     function placeETHTokenOrder(address tokenOut, uint256 priceExecuted, uint256 minAmountOut) external payable;
//     function placeTokenTokenOrder(address tokenIn, uint256 amountIn, address tokenOut, uint256 priceExecuted, uint256 minAmountOut) external;
//     function placeTokenETHOrder(address tokenIn, uint256 amountIn, uint256 priceExecuted, uint256 minAmountOut) external;
    
//     function cancelOrder(uint256 orderID) external;
    

//     function executeOrder(uint256 orderID) external returns (bool filled);
//     function shouldFulfilOrder(uint256 orderID) external returns (bool);
//     function canFulfilOrder(uint256 orderID) external returns (bool);
//     function unableToFulfil(uint256 orderID) external returns (bool);


//     function getCurrentAmountOut(uint256 orderID) external  returns (uint256 amount);
//     function sortTokens(address tokenA, address tokenB) external  returns (address token0, address token1);

    
//     function getReserves(address pair, address tokenA, address tokenB) external  returns (uint reserveA, uint reserveB);
//     function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external  returns (uint amountOut);
    
//     function getPendingOrders() external  returns (uint256[] memory);
    
//     function getOrdersForAddress(address adr) external  returns (uint256[] memory);
//     function getOrdersForPair(address pair) external  returns (uint256[] memory);
//     function symbolFor(address token) external  returns (string memory);

//     event OrderPlaced(uint256 orderID, address owner, uint256 amountIn, address tokenIn, address tokenOut, uint256 priceExecuted, uint256 minAmountOut);
//     event OrderCancelled(uint256 orderID);
//     event OrderFulfilled(uint256 orderID, address broker);
// }