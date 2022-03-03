// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16;
import "../libraries/SafeMath.sol";
import "@uniswap/lib/contracts/libraries/TransferHelper.sol";
import "../interfaces/IERC20.sol";
import "../interfaces/IWETH.sol";
import "../libraries/UniswapV2Library.sol";
import "../interfaces/IUniswapV2Pair.sol";

// Use second contract for router as allows try catch on external router calls from main contract to make cancelling failing swaps possible in same tx

contract SpaceOrderRouter {
    using SafeMath for uint256;
    
    enum OrderStatus { PENDING, FILLED, CANCELLED }
    enum OrderType { ETH_TOKEN, TOKEN_TOKEN, TOKEN_ETH }
    
    struct Order {
        uint256 id;                 // Order ID 
        uint256 pendingIndex;       // Index in pending order array
        address owner;              // Order placer 
        OrderStatus status;         // Order status 
        OrderType swapType;         // Order type
        address tokenIn;            // Token to swap 
        address tokenOut;           // Token to swap for
        uint256 amountIn;           // ETH Amount in 
        uint256 priceExecuted;    // Price to trigger order at 
        uint256 minAmountOut;       // Max price to trigger order at (in case price changed before tx has been mined)
        uint256 timestamp;
    }
    
    address public constant WETH = 0xc778417E063141139Fce010982780140Aa0cD5Ab;
    
    address authorizedCaller;
    

    constructor () {
        authorizedCaller = msg.sender;
    }
    
    modifier onlyAuthorized() {
        require(msg.sender == authorizedCaller); _;
    }
    
    receive() external payable {
        assert(msg.sender == WETH);
    }
    

    function makeTokenTokenSwap(address owner, address tokenIn, address tokenOut, address pair, uint256 amountIn, uint256 minAmountOut) external onlyAuthorized {
        TransferHelper.safeTransferFrom(
            tokenIn, owner, pair, amountIn
        );
        
        uint balanceBefore = IERC20(tokenOut).balanceOf(owner);
        _swap(pair, tokenIn, tokenOut, owner);
        
        require(
            IERC20(tokenOut).balanceOf(owner).sub(balanceBefore) >= minAmountOut,
            'SpaceRouter: INSUFFICIENT_OUTPUT_AMOUNT'
        );
    }

    
     function makeTokenETHSwap(address owner, address tokenIn, address tokenOut, address pair, uint256 amountIn, uint256 minAmountOut) external onlyAuthorized {
        TransferHelper.safeTransferFrom(
            tokenIn, owner, pair, amountIn
        );
        
        uint balanceBefore = IERC20(WETH).balanceOf(address(this));
        _swap(pair, tokenIn, tokenOut, address(this));
        
        uint amountOut = IERC20(WETH).balanceOf(address(this)).sub(balanceBefore);
        
        require(amountOut >= minAmountOut, 'SpaceRouter: INSUFFICIENT_OUTPUT_AMOUNT');
        
        IWETH(WETH).withdraw(amountOut);
        
        TransferHelper.safeTransferETH(owner, amountOut);
    }
    
    function makeETHTokenSwap(address owner, address tokenIn, address tokenOut, address pair, uint256 amountIn, uint256 minAmountOut) external payable onlyAuthorized {
        // Swap bnb for WETH then transfer to pair
        IWETH(WETH).deposit{value: amountIn}();
        assert(IWETH(WETH).transfer(pair, amountIn));
        
        uint balanceBefore = IERC20(tokenOut).balanceOf(owner);
        _swap(pair, tokenIn, tokenOut, owner);
        
        require(
            IERC20(tokenOut).balanceOf(owner).sub(balanceBefore) >= minAmountOut,
            'SpaceRouter: INSUFFICIENT_OUTPUT_AMOUNT'
        );
    }
    
    
    // function _swap(
    //     uint256[] memory amounts,
    //     address[] memory path,
    //     address _to
    // ) internal virtual {
    //     for (uint256 i; i < path.length - 1; i++) {
    //         (address input, address output) = (path[i], path[i + 1]);
    //         (address token0, ) = UniswapV2Library.sortTokens(input, output);
    //         uint256 amountOut = amounts[i + 1];
    //         (uint256 amount0Out, uint256 amount1Out) = input == token0
    //             ? (uint256(0), amountOut)
    //             : (amountOut, uint256(0));
    //         address to = i < path.length - 2
    //             ? UniswapV2Library.pairFor(factory, output, path[i + 2])
    //             : _to;
    //         IUniswapV2Pair(UniswapV2Library.pairFor(factory, input, output))
    //             .swap(amount0Out, amount1Out, to, new bytes(0));
    //     }
    // }
    function _swap(
        address _pair,
        address tokenIn,
        address tokenOut,
        address to
    ) internal virtual {
        (address token0,) = UniswapV2Library.sortTokens(tokenIn, tokenOut);
        IUniswapV2Pair pair = IUniswapV2Pair(_pair);
        uint amountInput;
        uint amountOutput;
        (uint reserve0, uint reserve1,) = pair.getReserves();
        (uint reserveInput, uint reserveOutput) = tokenIn == token0 ? (reserve0, reserve1) : (reserve1, reserve0);
        amountInput = IERC20(tokenIn).balanceOf(address(pair)).sub(reserveInput);
        amountOutput = UniswapV2Library.getAmountOut(amountInput, reserveInput, reserveOutput);

        (uint amount0Out, uint amount1Out) = tokenIn == token0 ? (uint(0), amountOutput) : (amountOutput, uint(0));
        pair.swap(amount0Out, amount1Out, to, new bytes(0));
    }
}