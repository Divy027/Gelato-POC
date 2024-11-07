// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

contract TapGame is ERC2771Context {
    mapping(address => uint256) public scores;

    event Tapped(address indexed user, uint256 newScore);

    constructor(address trustedForwarder) ERC2771Context(trustedForwarder) {}

    function tap() public {
        address user = _msgSender();
        scores[user] += 1;
        emit Tapped(user, scores[user]);
    }

    function getScore(address user) public view returns (uint256) {
        return scores[user];
    }
}

//0xd8253782c45a12053594b9deB72d8e8aB2Fca54c
