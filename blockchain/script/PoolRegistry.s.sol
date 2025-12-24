// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {PoolRegistry} from "../src/PoolRegistry.sol";

contract NAVRegistryScript is Script {
    PoolRegistry public poolRegistry;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        poolRegistry = new PoolRegistry();

        vm.stopBroadcast();
    }
}
