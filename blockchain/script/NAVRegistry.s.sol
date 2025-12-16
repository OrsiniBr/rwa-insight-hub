// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {NAVRegistry} from "../src/NAVRegistry.sol";

contract NAVRegistryScript is Script {
    NAVRegistry public nAVRegistry;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        nAVRegistry = new NAVRegistry();

        vm.stopBroadcast();
    }
}
