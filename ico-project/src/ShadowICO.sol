// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/// @title Shadow ICO Contract
/// @author Abderlhman Maamoun
/// @notice Receives ETH and mints SHDW tokens to users
/// @dev Communicates with Shadow contract to mint tokens

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Shadow.sol";

contract ShadowICO is Ownable {
    /// @notice Address of the token contract
    Shadow public token;

    /// @notice Number of tokens minted per 1 ETH
    uint256 public rate = 1000;

    /// @notice Emitted when a user buys tokens
    event TokensPurchased(address indexed buyer, uint256 ethAmount, uint256 tokenAmount);

    /// @notice Emitted when owner withdraws ETH
    event ETHWithdrawn(address indexed owner, uint256 amount);

    /// @param tokenAddress Address of the deployed Shadow contract
    constructor(address tokenAddress) Ownable(msg.sender) {
        require(tokenAddress != address(0), "Invalid token address");
        token = Shadow(tokenAddress);
    }

    /// @notice Buy SHDW tokens by sending ETH
    receive() external payable {
        buyTokens();
    }

    /// @notice Public function to buy tokens
    function buyTokens() public payable {
        require(msg.value > 0, "Send ETH to buy tokens");

        uint256 tokensToMint = msg.value * rate;
        token.mint(msg.sender, tokensToMint);

        emit TokensPurchased(msg.sender, msg.value, tokensToMint);
    }

    /// @notice Change the rate (only owner)
    /// @param newRate New conversion rate (tokens per ETH)
    function setRate(uint256 newRate) external onlyOwner {
        require(newRate > 0, "Rate must be greater than 0");
        rate = newRate;
    }

    /// @notice Withdraw ETH collected in the contract (only owner)
    function withdrawETH() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Nothing to withdraw");
        payable(owner()).transfer(balance);

        emit ETHWithdrawn(owner(), balance);
    }
}