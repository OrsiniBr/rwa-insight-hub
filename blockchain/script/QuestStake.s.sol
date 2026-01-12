// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {QuestStake} from "../src/QuestStake.sol";

contract QuestStakeScript is Script {
    QuestStake public questStake;


    function run() public {
       address token = vm.envAddress("REWARD_TOKEN_ADDRESS");
       address treasury = vm.envAddress("TREASURY_ADDRESS");
       address rewardPool = vm.envAddress("REWARDPOOL_ADDRESS");

        vm.startBroadcast();

        questStake = new QuestStake(token, treasury, rewardPool);

        vm.stopBroadcast();
    }
}