// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./RouterPolygonLimitOrder.sol";


interface IUniswapV2Factory {
    // event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    function feeTo() external view returns (address);
    function feeToSetter() external view returns (address);

    function getPair(address tokenA, address tokenB) external view returns (address pair);
    function allPairs(uint) external view returns (address pair);
    function allPairsLength() external view returns (uint);

    function createPair(address tokenA, address tokenB) external returns (address pair);

    function setFeeTo(address) external;
    function setFeeToSetter(address) external;
}

interface ISpaceLimitOrders {
    enum OrderStatus { PENDING, FILLED, CANCELLED }
    enum OrderType { ETH_TOKEN, TOKEN_TOKEN, TOKEN_ETH }
    
    function getRouterAddress() external view returns (address);
    
    function placeETHTokenOrder(address tokenOut, uint256 priceExecute, uint256 minAmountOut) external payable;
    function placeTokenTokenOrder(address tokenIn, uint256 amountIn, address tokenOut, uint256 priceExecute, uint256 minAmountOut) external;
    function placeTokenETHOrder(address tokenIn, uint256 amountIn, uint256 priceExecute, uint256 minAmountOut) external;
    
    function cancelOrder(uint256 orderID) external;
    
    function canFulfilOrder(uint256 orderID) external view returns (bool);
    function shouldFulfilOrder(uint256 orderID) external view returns (bool);
    
    function executeOrder(uint256 orderID) external returns (bool filled);
    
    function getPendingOrders() external view returns (uint256[] memory);
    
    function getOrdersForAddress(address adr) external view returns (uint256[] memory);
    function getOrdersForPair(address pair) external view returns (uint256[] memory);
    
    event OrderPlaced(uint256 orderID, address owner, uint256 amountIn, address tokenIn, address tokenOut, uint256 priceExecute, uint256 minAmountOut);
    event OrderCancelled(uint256 orderID);
    event OrderFulfilled(uint256 orderID, address broker);
}


contract LimitOrders is ISpaceLimitOrders {

    using SafeMath for uint256;
    // enum OrderStatus {PENDING, FILLED, CANCELLED}
    // enum OrderStatus { PENDING, FILLED, CANCELLED }
    // enum OrderType { ETH_TOKEN, TOKEN_TOKEN, TOKEN_ETH }

    // event OrderPlaced(uint256 orderID, address owner, uint256 amountIn, address tokenIn, address tokenOut, uint256 priceExecute, uint256 minAmountOut);
    // event OrderCancelled(uint256 orderID);
    // event OrderFulfilled(uint256 orderID, address broker);
    event Approval(address indexed owner, address indexed spender, uint value);


    struct Order {
        uint256 orderID;
        uint256 pendingIndex;
        address owner;
        OrderStatus status;
        OrderType swapType;
        address pair;
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 priceExecute;  
        uint256 minAmountOut;
        uint256 timestamp;
    }

    address public immutable factory;
    uint256 public constant ORDER_EXPIRY = 7 days;
    address public immutable WMATIC;
    uint256 public ordersIndex = 1;

    // orders
    mapping (uint256 => Order) public orders;
    mapping (address => uint256[]) public addressOrders;
    mapping (address => uint256[]) public pairOrders;

    uint256[] pendingOrders;

    SpaceOrderRouter spaceRouter;

    constructor(address _factory, address _WMATIC) {
        factory = _factory;
        WMATIC = _WMATIC;
        spaceRouter = new SpaceOrderRouter();
    }

    bool entered = false;

    modifier reentrancyGuard() {
        require(!entered, "Reentrancy Disallowed");
        entered = true;
        _;
        entered = false;
    }


    receive() external payable {
        assert(msg.sender == WMATIC);
    }

    function getRouterAddress() external view override returns (address){
        return address(spaceRouter);
    }

    function placeETHTokenOrder(address tokenOut, uint256 priceExecute, uint256 minAmountOut) external payable override {
        createOrder(msg.sender, OrderType.ETH_TOKEN, WMATIC, tokenOut, msg.value, priceExecute, minAmountOut);
    }
    
    
    function placeTokenTokenOrder(address tokenIn, uint256 amountIn, address tokenOut, uint256 priceExecute, uint256 minAmountOut) external override {
        require(IERC20(tokenIn).allowance(msg.sender, address(spaceRouter)) >= amountIn, "Not enough allowance for order");
        
        createOrder(msg.sender, OrderType.TOKEN_TOKEN, tokenIn, tokenOut, amountIn, priceExecute, minAmountOut);
    }
    
    function placeTokenETHOrder(address tokenIn, uint256 amountIn, uint256 priceExecute, uint256 minAmountOut) external override {
        require(IERC20(tokenIn).allowance(msg.sender, address(spaceRouter)) >= amountIn, "Not enough allowance for order");
        
        createOrder(msg.sender, OrderType.TOKEN_ETH, tokenIn, WMATIC, amountIn, priceExecute, minAmountOut);
    }

    function createOrder(
        address owner,
        OrderType swapType,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 priceExecute,
        uint256 minAmountOut
    ) internal returns (uint256) {

        address pair = IUniswapV2Factory(factory).getPair(tokenIn, tokenOut);
        require(pair != address(0), "Pair does not exist!");
        require(minAmountOut <= priceExecute, "Invalid output amounts");

        uint256 orderID = ordersIndex++;
        uint256 pendingIndex = pendingOrders.length;
        pendingOrders.push(orderID);

        addressOrders[msg.sender].push(orderID);
        pairOrders[pair].push(orderID);

        orders[orderID] = Order(
            orderID,
            pendingIndex,
            owner,
            OrderStatus.PENDING,
            swapType,
            pair,
            tokenIn,
            tokenOut,
            amountIn,
            priceExecute,
            minAmountOut,
            block.timestamp
        );

        emit OrderPlaced(orderID, msg.sender, amountIn, tokenIn, tokenOut,priceExecute, minAmountOut);
        return orderID;
    }

    function cancelOrder(uint256 orderID) external override {
        Order memory ord = orders[orderID];

        require(msg.sender == ord.owner || ord.timestamp + ORDER_EXPIRY  >= block.timestamp, "Failed to cancel this order.");
        require(ord.status == OrderStatus.PENDING, "Order must be a pending order");

        _cancelOrder(orderID);
    }

    function _cancelOrder(uint256 orderID) internal {
        Order memory ord = orders[orderID];

         // refund and close
        if(ord.swapType == OrderType.ETH_TOKEN){
            payable(ord.owner).transfer(ord.amountIn);
        }

        closeOrder(orderID, OrderStatus.CANCELLED);
        emit OrderCancelled(orderID);
    }

    function closeOrder(uint256 orderID, OrderStatus status) internal {
        //Remove order from pending by swapping in last pending order then pop from array 
        pendingOrders[orders[orderID].pendingIndex] = pendingOrders[pendingOrders.length - 1];

        //update pendingIndex for moved order
        orders[pendingOrders[orders[orderID].pendingIndex]].pendingIndex = orders[orderID].pendingIndex;

        // remove duplicate pending order from end
        pendingOrders.pop();

        // update status
        orders[orderID].status = status;
        orders[orderID].timestamp = block.timestamp;
    }   

    function executeOrder(uint256 orderID) public override reentrancyGuard returns (bool filled){
        Order memory ord = orders[orderID];

        require(ord.status == OrderStatus.PENDING, "Can't executed non-pending order");

        if(execute(ord)) {
            require(shouldFulfilOrder(orderID), "Not filled");
            
            closeOrder(orderID, OrderStatus.FILLED);

            emit OrderFulfilled(orderID, msg.sender);
            return true;
        } else {

            if(canFulfilOrder(orderID) || unableToFulfil(orderID)){
                _cancelOrder(orderID);
                emit OrderCancelled(orderID);
            }
            return false;
        }
    }


     function canFulfilOrder(uint256 orderID) public view override returns (bool) {
        Order memory ord = orders[orderID];
        return ord.status == OrderStatus.PENDING && getCurrentAmountOut(orderID) >= ord.minAmountOut;
    }
    
    function unableToFulfil(uint256 orderID) internal view returns (bool) {
        Order memory ord = orders[orderID];
        return IERC20(ord.tokenIn).balanceOf(ord.owner) < ord.amountIn || IERC20(ord.tokenIn).allowance(ord.owner, address(spaceRouter)) < ord.amountIn;
    }
    
    function shouldFulfilOrder(uint256 orderID) public view override returns (bool) {
        Order memory ord = orders[orderID];
        return ord.status == OrderStatus.PENDING && getCurrentAmountOut(orderID) >= ord.priceExecute;
    }


    function getCurrentAmountOut(uint256 orderID) public view returns (uint256 amount){
        Order memory ord = orders[orderID];

        (uint reserveIn, uint reserveOut) = getReserves(ord.pair, ord.tokenIn, ord.tokenOut);
        return getAmountOut(ord.amountIn, reserveIn, reserveOut);

    }
    // returns sorted token addresses, used to handle return values from pairs sorted in this order
    function sortTokens(address tokenA, address tokenB) public pure returns (address token0, address token1) {
        (token0, token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
    }

    // fetches and sorts the reserves for a pair
    function getReserves(address pair, address tokenA, address tokenB) public view returns (uint reserveA, uint reserveB) {
        (address token0,) = sortTokens(tokenA, tokenB);
        (uint reserve0, uint reserve1,) = IUniswapV2Pair(pair).getReserves();
        (reserveA, reserveB) = tokenA == token0 ? (reserve0, reserve1) : (reserve1, reserve0);
    }


    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) public pure returns (uint amountOut) {
        uint amountInWithFee = amountIn.mul(997);
        uint numerator = amountInWithFee.mul(reserveOut);
        uint denominator = reserveIn.mul(1000).add(amountInWithFee);
        amountOut = numerator / denominator;
    }
    

    function execute(Order memory ord) internal returns (bool filled) {


        // if(ord.swapType == OrderType.ETH_TOKEN){
        //     try spaceRouter.makeETHTokenSwap{value: ord.amountIn}(ord.owner, ord.tokenIn, ord.tokenOut, ord.pair, ord.amountIn, ord.minAmountOut) {return true;} catch {return false;}
        // } else if (ord.swapType == OrderType.TOKEN_TOKEN) {
        //     try spaceRouter.makeTokenTokenSwap(ord.owner, ord.tokenIn, ord.tokenOut, ord.pair, ord.amountIn, ord.minAmountOut) { return true; } catch { return false; }
        // } else { //tpye Token_ETH
        //     try spaceRouter.makeTokenETHSwap(ord.owner, ord.tokenIn, ord.tokenOut, ord.pair, ord.amountIn, ord.minAmountOut) { return true; } catch { return false; }
        // }
        address[] memory path;
        if (ord.tokenIn == WMATIC || ord.tokenOut == WMATIC) {
            path = new address[](2);
            path[0] = ord.tokenIn;
            path[1] = ord.tokenOut;
        }  else {
            path = new address[](3);
            path[0] = ord.tokenIn;
            path[1] = WMATIC;
            path[2] = ord.tokenOut;
    }
        uint deadline = ord.timestamp + ORDER_EXPIRY;
        
        if(ord.swapType == OrderType.ETH_TOKEN){
            try spaceRouter.swapExactETHForTokens{value: ord.amountIn}(ord.amountIn, path, ord.owner, deadline) {return true;} catch {return false;}
        } else if (ord.swapType == OrderType.TOKEN_TOKEN) {
            try spaceRouter.swapExactTokensForTokens(ord.amountIn,ord.minAmountOut,path,ord.owner, deadline) { return true; } catch { return false; }
        } else { //tpye Token_ETH
            try spaceRouter.swapExactTokensForETH(ord.amountIn, ord.minAmountOut, path, ord.owner,  deadline) { return true; } catch { return false; }
        }

    }

    function symbolFor(address token) external view returns (string memory) {
        return IERC20(token).symbol();
    }

    function getPendingOrders() external view override returns (uint256[] memory) {
        return pendingOrders;
    }

     function getOrdersForAddress(address adr) external view override returns (uint256[] memory) {
        return addressOrders[adr];
    }
    
    function getOrdersForPair(address pair) external view override returns (uint256[] memory) {
        return pairOrders[pair];
    }
}