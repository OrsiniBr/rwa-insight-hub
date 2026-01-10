// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {MockUSDT} from "../src/MockUSDT.sol";

contract MockUSDTScript is Script {
    MockUSDT public mockUSDT;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        mockUSDT = new MockUSDT();

        vm.stopBroadcast();
    }
}
