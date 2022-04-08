// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./RouterV2LimitOrder.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

interface IUniswapV2Factory {
    function feeTo() external view returns (address);

    function feeToSetter() external view returns (address);

    function getPair(address tokenA, address tokenB)
        external
        view
        returns (address pair);

    function allPairs(uint256) external view returns (address pair);

    function allPairsLength() external view returns (uint256);

    function createPair(address tokenA, address tokenB)
        external
        returns (address pair);

    function setFeeTo(address) external;

    function setFeeToSetter(address) external;
}

contract LimitOrder is EIP712("FORBIT SPACE", "1") {
    using SafeMath for uint256;
    // ISwapRouter public constant uniswapRouter =ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

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
    event CancelOrder(Order);
    event ExecuteOrder(Order);
    address public factory;
    address public feeAdr;
    bytes32 LIMIT_ORDER_TYPEHASH = keccak256("Order(address owner,uint256 status,address tokenIn,address tokenOut,uint256 amountIn,uint256 priceExecute,uint256 minAmountOut,uint256 deadline,uint256 salt)");

    mapping(address => bytes32[]) public msgHashOrderCancel;

    SpaceOrderRouter spaceRouter;

    constructor(address _factory, address _feeAddress) {
        factory = _factory;
        feeAdr = _feeAddress;
        spaceRouter = new SpaceOrderRouter(_feeAddress);
    }

    bool entered = false;

    modifier reentrancyGuard() {
        require(!entered, "RD");
        entered = true;
        _;
        entered = false;
    }

    function getRouterAddress() external view returns (address) {
        return address(spaceRouter);
    }

    function recoverSigner(Order memory ord, bytes memory _signature)
        public
        view
        returns (address)
    {
        bytes32 _getMsgHash = getMessageHash(ord);
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
        return ECDSA.recover(_getMsgHash, v, r, s);
    }

    function getMessageHash(Order memory ord) public view returns (bytes32) {
        bytes32 structHash = keccak256(
            abi.encode(
                LIMIT_ORDER_TYPEHASH,
                ord.owner,
                ord.status,
                ord.tokenIn,
                ord.tokenOut,
                ord.amountIn,
                ord.priceExecute,
                ord.minAmountOut,
                ord.deadline,
                ord.salt
            )
        );
        bytes32 hash = _hashTypedDataV4(structHash);
        return hash;
    }

    function splitSignature(bytes memory sig)
        internal
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        require(sig.length == 65, "ISL");
        assembly {
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }
        return (r, s, v);
    }

    function shouldFulfilOrder(Order memory ord, bytes memory _signature)
        public
        view
        returns (bool)
    {
        bool _isEnoughToken = true;
        if (
            IERC20(address(ord.tokenIn)).balanceOf(address(ord.owner)) <
            ord.amountIn
        ) _isEnoughToken = false;

        bool _allowance = false;
        if (
            IERC20(ord.tokenIn).allowance(ord.owner, address(spaceRouter)) >=
            ord.amountIn
        ) _allowance = true;

        bool _isNotCancelledOrder = isNotCancelledOrder(ord);

        bool _isPendingOrder = true;
        if (ord.status != 0) _isPendingOrder = false;

        address _signer = recoverSigner(ord, _signature);
        bool _isSigner = false;

        if (_signer == ord.owner) _isSigner = true;
        bool _isFulfiledOrder = false;

        if (
            getAmountOut(ord.amountIn, ord.tokenIn, ord.tokenOut) >=
            ord.priceExecute
        ) _isFulfiledOrder = true;

        return (_isEnoughToken &&
            _isNotCancelledOrder &&
            _isPendingOrder &&
            _isSigner &&
            _isFulfiledOrder &&
            _allowance);
    }

    function isNotCancelledOrder(Order memory ord) public view returns (bool) {
        bytes32 _msgHash = getMessageHash(ord);
        bool _isNotCancelledOrder = true;
        for (uint256 i = 0; i < msgHashOrderCancel[ord.owner].length; i++) {
            if (_msgHash == msgHashOrderCancel[ord.owner][i]) {
                _isNotCancelledOrder = false;
            }
        }
        return _isNotCancelledOrder;
    }

    function ExecuteCustomOrder(Order memory ord, bytes memory _signature)
        public
        reentrancyGuard
        returns (bool result, string memory message)
    {
        require(block.timestamp <= ord.deadline, "ED");
        bytes32 _msgHash = getMessageHash(ord);

        address _signer = recoverSigner(ord, _signature);
        require(_signer == ord.owner, "IS");
        require(isNotCancelledOrder(ord) == true, "ICO");
        require(
            IERC20(ord.tokenIn).balanceOf(ord.owner) >= ord.amountIn,
            "NEB"
        );
        require(ord.status == 0, "NPD");
        //UniV2
        if (execute(ord)) {
            msgHashOrderCancel[ord.owner].push(_msgHash);
            emit ExecuteOrder(ord);
            return (result = true, message = "S");
        } else {
            return (result = false, message = "F");
        }
    }


    function cancelOrder(Order memory ord) external {
        require(msg.sender == ord.owner || ord.deadline >= block.timestamp,"F");
        // require(msg.sender == ord.owner || ord.timestamp + ORDER_EXPIRY  >= block.timestamp, "Failed to cancel this order.");
        require(ord.status == 0, "MBPD");
        require(isNotCancelledOrder(ord) == true, "ICO");
        bytes32 _msgHash = getMessageHash(ord);
        msgHashOrderCancel[ord.owner].push(_msgHash);
        emit CancelOrder(ord);
    }

    // returns sorted token addresses, used to handle return values from pairs sorted in this order
    function sortTokens(address tokenA, address tokenB)
        public
        pure
        returns (address token0, address token1)
    {
        (token0, token1) = tokenA < tokenB
            ? (tokenA, tokenB)
            : (tokenB, tokenA);
    }

    // fetches and sorts the reserves for a pair
    function getReserves(
        address pair,
        address tokenA,
        address tokenB
    ) public view returns (uint256 reserveA, uint256 reserveB) {
        (address token0, ) = sortTokens(tokenA, tokenB);
        (uint256 reserve0, uint256 reserve1, ) = IUniswapV2Pair(pair)
            .getReserves();
        (reserveA, reserveB) = tokenA == token0
            ? (reserve0, reserve1)
            : (reserve1, reserve0);
    }

    function getAmountOut(
        uint256 amountIn,
        address tokenIn,
        address tokenOut
    ) public view returns (uint256 amountOut) {
        address pair = getPair(tokenIn, tokenOut);
        (uint256 reserveIn, uint256 reserveOut) = getReserves(
            pair,
            tokenIn,
            tokenOut
        );
        uint256 amountInWithFee = amountIn.mul(997);
        uint256 numerator = amountInWithFee.mul(reserveOut);
        uint256 denominator = reserveIn.mul(1000).add(amountInWithFee);
        amountOut = numerator / denominator;
    }

    function execute(Order memory ord) internal returns (bool) {
        address pair = getPair(ord.tokenIn, ord.tokenOut);
        try
            spaceRouter.makeTokenTokenSwap(
                ord.owner,
                ord.tokenIn,
                ord.tokenOut,
                pair,
                ord.amountIn,
                ord.minAmountOut,
                ord.deadline
            )
        {
            return true;
        } catch {
            return false;
        }
    }

    function getPair(address tokenIn,
    address tokenOut)
        public
        view
        returns (address)
    {
        return IUniswapV2Factory(factory).getPair(tokenIn,
        tokenOut);
    }

    function symbolFor(address token) external view returns (string memory) {
        return IERC20(token).symbol();
    }
}