// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {NAVRegistry} from "../src/NAVRegistry.sol";

contract NAVRegistryScript is Script {
    NAVRegistry public navRegistry;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        navRegistry = new NAVRegistry();

        vm.stopBroadcast();
    }
}
