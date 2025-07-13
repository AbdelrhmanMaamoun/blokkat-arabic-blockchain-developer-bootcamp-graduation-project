// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "forge-std/Script.sol";
import "../src/Shadow.sol";
import "../src/ShadowICO.sol";

contract DeployScript is Script {
    function run() external {
        // Load private key from .env
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerKey);

        Shadow token = new Shadow();
        ShadowICO ico = new ShadowICO(address(token));

        token.setICOContract(address(ico)); 

        vm.stopBroadcast();
    }
}
