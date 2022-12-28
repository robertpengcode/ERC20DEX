// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Dex {
    address owner;
    IERC20 theToken;
    uint price;

    constructor(IERC20 _token, uint _price) {
        owner = msg.sender;
        theToken = _token;
        price = _price;
    }

    modifier ownerOnly() {
        require(msg.sender == owner);
        _;
    }

    function toDexForSale() external ownerOnly {
        uint allowanceBalance = theToken.allowance(msg.sender, address(this));
        require(allowanceBalance > 0, "there is no allowance");
        bool transfered = theToken.transferFrom(msg.sender, address(this), allowanceBalance);
        require(transfered, "transfer failed");
    }

    function buyToken(uint quantity) external payable {
        require(msg.value == getTransactionAmount(quantity) * price, "payment amount incorrect");
        require(quantity <= getTokenBalance(), "not enough tokens");
        bool transfered = theToken.transfer(msg.sender, quantity);
        require(transfered, "transfer failed");
    }

    function withDrawTokens() external ownerOnly {
        uint withDrawQuantity = getTokenBalance();
        bool transfered = theToken.transfer(msg.sender, withDrawQuantity);
        require(transfered, "transfer failed");
    }

    function withDrawFund() external ownerOnly {
        uint amount = address(this).balance;
        (bool sent,) = payable(msg.sender).call{value: amount}("");
        require(sent, "sent failed");
    }

    function getTransactionAmount(uint quantity) public view returns(uint) {
        return price * quantity;
    }

    function getTokenBalance() public view returns(uint) {
        return theToken.balanceOf(address(this));
    }

}
