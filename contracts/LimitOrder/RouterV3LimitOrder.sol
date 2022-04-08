// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

library SafeMath {
    function add(uint x, uint y) internal pure returns (uint z) {
        require((z = x + y) >= x, 'ds-math-add-overflow');
    }

    function sub(uint x, uint y) internal pure returns (uint z) {
        require((z = x - y) <= x, 'ds-math-sub-underflow');
    }


    function mul(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x, 'ds-math-mul-overflow');
    }
    // function _div(uint256 a, uint256 b) internal pure returns (uint256) {
    //     require(b>0, "Can't div 0!!!");
    //     uint256 c = a/b;
    //     return c;
    // }
    // function div(uint256 a,uint256 b) internal pure returns (uint256) {
    //     return _div(a,b);
    // }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }
    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }
}
library TransferHelper {
    function safeApprove(
        address token,
        address to,
        uint256 value
    ) internal {
        // bytes4(keccak256(bytes('approve(address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0x095ea7b3, to, value));
        require(
            success && (data.length == 0 || abi.decode(data, (bool))),
            'TransferHelper::safeApprove: approve failed'
        );
    }

    function safeTransfer(
        address token,
        address to,
        uint256 value
    ) internal {
        // bytes4(keccak256(bytes('transfer(address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0xa9059cbb, to, value));
        require(
            success && (data.length == 0 || abi.decode(data, (bool))),
            'TransferHelper::safeTransfer: transfer failed'
        );
    }

    function safeTransferFrom(
        address token,
        address from,
        address to,
        uint256 value
    ) internal {
        // bytes4(keccak256(bytes('transferFrom(address,address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0x23b872dd, from, to, value));
        require(
            success && (data.length == 0 || abi.decode(data, (bool))),
            'TransferHelper::transferFrom: transferFrom failed'
        );
    }

    function safeTransferETH(address to, uint256 value) internal {
        (bool success, ) = to.call{value: value}(new bytes(0));
        require(success, 'TransferHelper::safeTransferETH: ETH transfer failed');
    }
}
interface IERC20 {
    event Approval(address indexed owner, address indexed spender, uint value);
    event Transfer(address indexed from, address indexed to, uint value);

    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
    function totalSupply() external view returns (uint);
    function balanceOf(address owner) external view returns (uint);
    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint value) external returns (bool);
    function transfer(address to, uint value) external returns (bool);
    function transferFrom(address from, address to, uint value) external returns (bool);
}
interface IUniswapV3SwapCallback {
    function uniswapV3SwapCallback(
        int256 amount0Delta,
        int256 amount1Delta,
        bytes calldata data
    ) external;
}
interface ISwapRouter is IUniswapV3SwapCallback {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    function exactInputSingle(ExactInputSingleParams calldata params)
        external
        payable
        returns (uint256 amountOut);

    struct ExactInputParams {
        bytes path;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
    }

    function exactInput(ExactInputParams calldata params)
        external
        payable
        returns (uint256 amountOut);

    // function refundETH() external payable;
}

contract SpaceOrderRouter {
    using SafeMath for uint256;
    ISwapRouter public constant uniswapRouter =ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
    struct Order {
        address owner;
        uint256 status;
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 priceExecute;  
        uint256 minAmountOut;
        uint256 deadline;
        uint256 salt;
    }
    address authorizedCaller;
    address public feeAddress;
    constructor (address _adr) {
        authorizedCaller = msg.sender;
        feeAddress = _adr;
    }
    modifier onlyAuthorized() {
        require(msg.sender == authorizedCaller); _;
    }
    function swapTokensToTokens(
        address _owner,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 deadline,
        uint256 minAmountOut
    ) external onlyAuthorized returns (bool)
    {
        TransferHelper.safeTransferFrom(
            tokenIn,
            _owner,
            address(this),
            amountIn
        );

        TransferHelper.safeApprove(tokenIn, address(uniswapRouter), amountIn);

        uint256 amountOut = uniswapRouter.exactInputSingle(ISwapRouter
            .ExactInputSingleParams(
                tokenIn,
                tokenOut,
                3000, //fee
                address(this),
                deadline,
                amountIn,
                minAmountOut,
                0
            )
            );
        uint256 feeSwap = amountOut.div(1000);
        uint256 _amountOutwFee = amountOut - feeSwap;
        IERC20(tokenOut).transfer(address(feeAddress), feeSwap);
        IERC20(tokenOut).transfer(address(_owner), _amountOutwFee);

        return true;
    }
}
