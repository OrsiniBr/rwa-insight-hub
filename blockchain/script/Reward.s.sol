// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {Reward} from "../src/Reward.sol";

contract RewardScript is Script {
    Reward public reward;


    function run() public {
       address token = vm.envAddress("REWARD_TOKEN_ADDRESS");

        vm.startBroadcast();

        reward = new Reward(token);

        vm.stopBroadcast();
    }
}
