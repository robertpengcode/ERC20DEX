// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Token is ERC20 {
    constructor(uint initialSupply) ERC20("Hope Token", "HOP") {
        _mint(msg.sender, initialSupply);
    }
}