// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal{
    uint256 totalWaves;

    // Generates random number
    uint256 private seed;

    // emit an event with all info about the wave
    event newWave(address indexed from, uint256 timestamp, string message);

    // Like interface or type in typescript
    struct Wave{
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

     /*
     * This is an address => uint mapping, meaning I can associate an address with a number!
     * In this case, I'll be storing the address with the last time the user waved at us.
     */
     mapping(address => uint256) public lastWavedAt;

    constructor() payable{
        console.log("OK");

        // set initial seed
        seed = (block.timestamp + block.difficulty) % 100;
    }

    // add 1 more to totaWaves
    function wave(string memory  _message) public{

        // make sure the current timestamp is at least 15-minutes bigger than the last timestamp that has stored

        require(lastWavedAt[msg.sender] + 30 seconds < block.timestamp, "Must wait 30 seconds before waving again.");

        
        // Update the current timestamp we have for the user
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log("%s has waved!", msg.sender);

        // push one wave obj to array
        waves.push(Wave(msg.sender, _message, block.timestamp));

        // Generates a new seed based on user thats send wave
        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Seed: %d", seed);

        if(seed <= 50){
            console.log("Win");

            // emit an event with all message info
            emit newWave(msg.sender, block.timestamp, _message);

            // require checks booelan condition
            uint256 prizeAmount = 0.0001 ether;

            // "this" represents self contract
            require(prizeAmount <= address(this).balance, "Contract not have funds.");

            (bool success, ) = (msg.sender).call{value: prizeAmount}("");

            require(success, "failed to withdraw money from contract.");
        }
    }

    function getAllWaves() public view returns  (Wave[] memory){
        return waves;
    }

    function getTotalWaves() public view returns (uint256){
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}