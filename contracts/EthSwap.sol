pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract EthSwap {
  string public name = "EthSwap Instant Exchange";
  IERC20 public token;
  uint public rate = 100;

  event TokensPurchased(
    address account,
    address token,
    uint amount,
    uint rate
  );

  event TokensSold(
    address account,
    address token,
    uint amount,
    uint rate
  );

  constructor(IERC20 _token) {
    token = _token;
  }


  function sendEth() external payable {

  }

  function buyTokens() public payable {
    // Calculate the number of tokens to buy
    uint tokenAmount = msg.value * rate;
    console.log(token.balanceOf(address(this)));

    // Require that EthSwap has enough tokens
    require(token.balanceOf(address(this)) >= tokenAmount, "Failed");

    // Transfer tokens to the user
    token.transfer(msg.sender, tokenAmount);

    // Emit an event
    emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
  }

  function sellToken(uint256 _amount) public {
    require(token.balanceOf(msg.sender) >= _amount);
    uint etherAmount = _amount / rate;
    require(address(this).balance >= etherAmount);

    //perform 
    token.transferFrom(msg.sender, address(this), _amount);
    payable(msg.sender).transfer(etherAmount);

    //submit event
    emit TokensSold(msg.sender, address(token), etherAmount, rate);
  }

  function _safeTransferFrom(
    IERC20 token,
    address sender,
    address receiver,
    uint256 amount
  ) private {
    bool sent = token.transferFrom(sender, receiver, amount);
    require(sent, "Failed!");
  }
}
