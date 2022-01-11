// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NhkToken.sol";

contract Claim is NhkToken{
    NhkToken public nhkToken;

    constructor(NhkToken _nhkToken){
        nhkToken = _nhkToken;
    }
    mapping(address => bool) claimed;
    uint claimAmount = 10;

    function claim() public {
        require(claimed[msg.sender] != true,"Error1");
        require(balances[address(this)] >= 0,"Error2");
        nhkToken.transfer(msg.sender, claimAmount);
        claimed[msg.sender] = false;
    }

    function claimPending() external view returns(uint){
        return balances[address(this)];
    }
}