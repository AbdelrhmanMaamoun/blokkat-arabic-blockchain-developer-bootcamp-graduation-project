// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "forge-std/Test.sol";
import "../src/ShadowICO.sol";
import "../src/Shadow.sol";

contract ICOTest is Test {
    Shadow public token;
    ShadowICO public ico;
    address user = address(0xBEEF);
    address owner = address(this); // test contract is the owner

    receive() external payable {}

    function setUp() public {
        token = new Shadow();
        ico = new ShadowICO(address(token));
        token.setICOContract(address(ico));
    }

    /// @notice Test 1: User can buy tokens successfully
    function testBuyTokens() public {
        vm.deal(user, 1 ether);
        vm.prank(user);

        ico.buyTokens{value: 1 ether}();

        assertEq(token.balanceOf(user), 1000 ether);
    }

    /// @notice Test 2: Buying with 0 ETH should revert
    function testRevertOnZeroETH() public {
        vm.expectRevert("Send ETH to buy tokens");
        ico.buyTokens{value: 0 ether}();
    }

    /// @notice Test 3: Only ICO contract can mint tokens
    function testOnlyICOCanMint() public {
        vm.expectRevert("Not authorized");
        token.mint(user, 1000 ether);
    }

    /// @notice Test 4: Owner can change the rate
    function testSetRate() public {
        ico.setRate(2000);
        assertEq(ico.rate(), 2000);
    }

    /// @notice Test 5: Owner can withdraw collected ETH
    function testWithdrawETH() public {
        vm.deal(user, 2 ether);
        vm.prank(user);
        ico.buyTokens{value: 2 ether}();

        uint256 pre = owner.balance;
        ico.withdrawETH();
        uint256 post = owner.balance;

        assertGt(post, pre);
    }
}
