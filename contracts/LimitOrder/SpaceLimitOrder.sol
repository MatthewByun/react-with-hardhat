// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.4;
// import "../libraries/SafeMath.sol";
// import "@uniswap/lib/contracts/libraries/TransferHelper.sol";

// import "../interfaces/IUniswapV2Factory.sol";
// import "../interfaces/IUniswapV2Router02.sol";
// import "../libraries/UniswapV2Library.sol";
// import "../libraries/SafeMath.sol";
// import "../interfaces/IERC20.sol";
// import "../interfaces/IWETH.sol";
// import "./ISpaceLimitOrder.sol";
// import "./SpaceOrderRouter.sol";
// contract LimitOrders is ISpaceLimitOrders{
//     using SafeMath for uint256;
//     // enum OrderStatus {PENDING, FILLED, CANCELLED}
//     // enum OrderStatus { PENDING, FILLED, CANCELLED }
//     // enum OrderType { ETH_TOKEN, TOKEN_TOKEN, TOKEN_ETH }

//     // event OrderPlaced(uint256 orderID, address owner, uint256 amountIn, address tokenIn, address tokenOut, uint256 priceExecuted, uint256 minAmountOut);
//     // event OrderCancelled(uint256 orderID);
//     // event OrderFulfilled(uint256 orderID, address broker);


//     struct Order {
//         uint256 orderID;
//         uint256 pendingIndex;
//         address owner;
//         OrderStatus status;
//         OrderType swapType;
//         address pair;
//         address tokenIn;
//         address tokenOut;
//         uint256 amountIn;
//         uint256 priceExecuted;  
//         uint256 minAmountOut;
//         uint256 timestamp;
//     }

//     address public immutable factory;
//     uint256 public constant ORDER_EXPIRY = 7 days;
//     address public immutable WETH;
//     uint256 public ordersIndex = 1;

//     // orders
//     mapping (uint256 => Order) public orders;
//     mapping (address => uint256[]) public addressOrders;
//     mapping (address => uint256[]) public pairOrders;
//     uint256[] pendingOrders;

//     SpaceOrderRouter spaceRouter;

//     constructor(address _factory, address _WETH) {
//         factory = _factory;
//         WETH = _WETH;
//         spaceRouter = new SpaceOrderRouter();
//     }

//     bool entered = false;

//     modifier reentrancyGuard() {
//         require(!entered, "Reentrancy Disallowed");
//         entered = true;
//         _;
//         entered = false;
//     }


//     receive() external payable {
//         assert(msg.sender == WETH);
//     }

//     function getRouterAddress() external view override returns (address){
//         return address(spaceRouter);
//     }

//     function placeETHTokenOrder(address tokenOut, uint256 priceExecuted, uint256 minAmountOut) external payable  {
//         createOrder(msg.sender, OrderType.ETH_TOKEN, WETH, tokenOut, msg.value, priceExecuted, minAmountOut);
//     }
    
    
//     function placeTokenTokenOrder(address tokenIn, uint256 amountIn, address tokenOut, uint256 priceExecuted, uint256 minAmountOut) external  {
//         require(IERC20(tokenIn).allowance(msg.sender, address(spaceRouter)) >= amountIn, "Not enough allowance for order");
        
//         createOrder(msg.sender, OrderType.TOKEN_TOKEN, tokenIn, tokenOut, amountIn, priceExecuted, minAmountOut);
//     }
    
//     function placeTokenETHOrder(address tokenIn, uint256 amountIn, uint256 priceExecuted, uint256 minAmountOut) external  {
//         require(IERC20(tokenIn).allowance(msg.sender, address(spaceRouter)) >= amountIn, "Not enough allowance for order");
        
//         createOrder(msg.sender, OrderType.TOKEN_ETH, tokenIn, WETH, amountIn, priceExecuted, minAmountOut);
//     }

//     function createOrder(
//         address owner,
//         OrderType swapType,
//         address tokenIn,
//         address tokenOut,
//         uint256 amountIn,
//         uint256 priceExecuted,
//         uint256 minAmountOut
//     ) internal returns (uint256) {
//         address pair = IUniswapV2Factory(factory).getPair(tokenIn, tokenOut);
//         require(pair != address(0), "Pair does not exist!");

//         uint256 orderID = ordersIndex++;
//         uint256 pendingIndex = pendingOrders.length;
//         pendingOrders.push(orderID);

//         addressOrders[msg.sender].push(orderID);
//         pairOrders[pair].push(orderID);

//         orders[orderID] = Order(
//             orderID,
//             pendingIndex,
//             owner,
//             OrderStatus.PENDING,
//             swapType,
//             pair,
//             tokenIn,
//             tokenOut,
//             amountIn,
//             priceExecuted,
//             minAmountOut,
//             block.timestamp
//         );

//         emit OrderPlaced(orderID, msg.sender, amountIn, tokenIn, tokenOut,priceExecuted, minAmountOut);
//         return orderID;
//     }

//     function cancelOrder(uint256 orderID) external  {
//         Order memory ord = orders[orderID];

//         require(msg.sender == ord.owner || ord.timestamp + ORDER_EXPIRY  >= block.timestamp, "Failed to cancel this order.");
//         require(ord.status == OrderStatus.PENDING, "Order must be a pending order");

//         _cancelOrder(orderID);
//     }

//     function _cancelOrder(uint256 orderID) internal {
//         Order memory ord = orders[orderID];


//         closeOrder(orderID, OrderStatus.CANCELLED);
//         emit OrderCancelled(orderID);
//     }

//     function closeOrder(uint256 orderID, OrderStatus status) internal {
//         //Remove order from pending by swapping in last pending order then pop from array 
//         pendingOrders[orders[orderID].pendingIndex] = pendingOrders[pendingOrders.length - 1];

//         //update pendingIndex for moved order
//         orders[pendingOrders[orders[orderID].pendingIndex]].pendingIndex = orders[orderID].pendingIndex;

//         // remove duplicate pending order from end
//         pendingOrders.pop();

//         // update status
//         orders[orderID].status = status;
//         orders[orderID].timestamp = block.timestamp;
//     }   

//     function executeOrder(uint256 orderID) public override reentrancyGuard returns (bool filled){
//         Order memory ord = orders[orderID];

//         require(ord.status == OrderStatus.PENDING, "Can't executed non-pending order");

//         if(execute(ord)) {
//             closeOrder(orderID, OrderStatus.FILLED);

//             emit OrderFulfilled(orderID, msg.sender);
//             return true;
//         } else {
//             _cancelOrder(orderID);
//             emit OrderCancelled(orderID);
//         }
//         return false;
//     }

//     function execute(Order memory ord) internal returns (bool filled) {
//         if(ord.swapType == OrderType.ETH_TOKEN){
//             try spaceRouter.makeETHTokenSwap{value: ord.amountIn}(ord.owner, ord.tokenIn, ord.tokenOut, ord.pair, ord.amountIn, ord.minAmountOut) {return true;} catch {return false;}
//         } else if (ord.swapType == OrderType.TOKEN_TOKEN) {
//             try spaceRouter.makeTokenTokenSwap(ord.owner, ord.tokenIn, ord.tokenOut, ord.pair, ord.amountIn, ord.minAmountOut) { return true; } catch { return false; }
//         } else { //tpye Token_ETH
//             try spaceRouter.makeTokenETHSwap(ord.owner, ord.tokenIn, ord.tokenOut, ord.pair, ord.amountIn, ord.minAmountOut) { return true; } catch { return false; }
//         }
//     }

//     function symbolFor(address token) external view override returns (string memory) {
//         return IERC20(token).symbol();
//     }

//     function getPendingOrders() external view override returns (uint256[] memory) {
//         return pendingOrders;
//     }

//      function getOrdersForAddress(address adr) external view override returns (uint256[] memory) {
//         return addressOrders[adr];
//     }
    
//     function getOrdersForPair(address pair) external view override returns (uint256[] memory) {
//         return pairOrders[pair];
//     }



//     function unableToFulfil(uint256 orderID) external view override returns (bool) {
//         Order memory ord = orders[orderID];
//         return IERC20(ord.tokenIn).balanceOf(ord.owner) < ord.amountIn || IERC20(ord.tokenIn).allowance(ord.owner, address(spaceRouter)) < ord.amountIn;
//     }
    
//     function shouldFulfilOrder(uint256 orderID) public view override returns (bool) {
//         Order memory ord = orders[orderID];
//         return ord.status == OrderStatus.PENDING && getCurrentAmountOut(orderID) >= ord.priceExecuted;
//     }

//     function canFulfilOrder(uint256 orderID) public view override returns (bool) {
//         Order memory ord = orders[orderID];
//         return ord.status == OrderStatus.PENDING && getCurrentAmountOut(orderID) >= ord.minAmountOut;
//     }

//     function getCurrentAmountOut(uint256 orderID) public view override returns (uint256 amount){
//         Order memory ord = orders[orderID];

//         (uint reserveIn, uint reserveOut) = getReserves(ord.pair, ord.tokenIn, ord.tokenOut);
//         return getAmountOut(ord.amountIn, reserveIn, reserveOut);

//     }
//     // returns sorted token addresses, used to handle return values from pairs sorted in this order
//     function sortTokens(address tokenA, address tokenB) public pure override returns (address token0, address token1) {
//         (token0, token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
//     }

//     // fetches and sorts the reserves for a pair
//     function getReserves(address pair, address tokenA, address tokenB) public view override returns (uint reserveA, uint reserveB) {
//         (address token0,) = sortTokens(tokenA, tokenB);
//         (uint reserve0, uint reserve1,) = IUniswapV2Pair(pair).getReserves();
//         (reserveA, reserveB) = tokenA == token0 ? (reserve0, reserve1) : (reserve1, reserve0);
//     }


//     function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) public pure override returns (uint amountOut) {
//         uint amountInWithFee = amountIn.mul(998);
//         uint numerator = amountInWithFee.mul(reserveOut);
//         uint denominator = reserveIn.mul(1000).add(amountInWithFee);
//         amountOut = numerator / denominator;
//     }
    

// }