// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {DocumentRegistry} from "../src/DocumentRegistry.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        DocumentRegistry registry = new DocumentRegistry();

        console.log("DocumentRegistry deployed at:", address(registry));

        vm.stopBroadcast();
    }
}

