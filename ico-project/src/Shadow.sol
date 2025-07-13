// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Shadow Contract
/// @author Abderlhman Maamoun
/// @notice ERC20 token that can only be minted by the ICO contract
/// @dev Uses OpenZeppelin ERC20 and Ownable

contract Shadow is ERC20, Ownable {
    address public ico;

    constructor() ERC20("Shadow", "SHDW") Ownable(msg.sender) {}

    /// @notice Set the ICO contract address once
    /// @param _ico The address of the ICO contract
    function setICOContract(address _ico) external onlyOwner {
        require(ico == address(0), "ICO already set");
        ico = _ico;
    }

    /// @notice Mint new tokens (only callable by ICO contract)
    /// @param to The address to mint tokens to
    /// @param amount The amount of tokens to mint
    function mint(address to, uint256 amount) external {
        require(msg.sender == ico, "Not authorized");
        _mint(to, amount);
    }
}