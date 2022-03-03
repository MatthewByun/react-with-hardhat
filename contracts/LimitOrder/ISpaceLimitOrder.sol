// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16;

interface ISpaceLimitOrders {
    enum OrderStatus { PENDING, FILLED, CANCELLED }
    enum OrderType { ETH_TOKEN, TOKEN_TOKEN, TOKEN_ETH }
    
    function getRouterAddress() external view returns (address);
    
    function placeETHTokenOrder(address tokenOut, uint256 priceExecuted, uint256 minAmountOut) external payable;
    function placeTokenTokenOrder(address tokenIn, uint256 amountIn, address tokenOut, uint256 priceExecuted, uint256 minAmountOut) external;
    function placeTokenETHOrder(address tokenIn, uint256 amountIn, uint256 priceExecuted, uint256 minAmountOut) external;
    
    function cancelOrder(uint256 orderID) external;
    
    function executeOrder(uint256 orderID) external returns (bool filled);
    
    function getPendingOrders() external view returns (uint256[] memory);
    
    function getOrdersForAddress(address adr) external view returns (uint256[] memory);
    function getOrdersForPair(address pair) external view returns (uint256[] memory);
    
    event OrderPlaced(uint256 orderID, address owner, uint256 amountIn, address tokenIn, address tokenOut, uint256 priceExecuted, uint256 minAmountOut);
    event OrderCancelled(uint256 orderID);
    event OrderFulfilled(uint256 orderID, address broker);
}