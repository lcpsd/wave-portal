// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal{
    uint256 totalWaves;

    // emit an event with all info about the wave
    event newWave(address indexed from, uint256 timestamp, string message);

    // Like interface or type in typescript
    struct Wave{
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    constructor() payable{
        console.log("OK");
    }

    // add 1 more to totaWaves
    function wave(string memory  _message) public{
        totalWaves += 1;
        console.log("%s has waved!", msg.sender);

        // push one wave obj to array
        waves.push(Wave(msg.sender, _message, block.timestamp));

        // emit an event with all message info
        emit newWave(msg.sender, block.timestamp, _message);

        // require checks booelan condition
        uint256 prizeAmount = 0.0001 ether;
        // "this" represents self contract
        require(
            prizeAmount <= address(this).balance,
            "Contract not have funds."
        );

        (bool success, ) = (msg.sender).call{value: prizeAmount}("");
        require(success, "failed to withdraw money from contract.");
    }

    function getAllWaves() public view returns  (Wave[] memory){
        return waves;
    }

    function getTotalWaves() public view returns (uint256){
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}