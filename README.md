# 🐱 Shadow Token ICO - Blockchain Project

A complete Initial Coin Offering (ICO) dApp built with modern web3 technologies. This project combines a Next.js frontend with Foundry smart contracts for a seamless token sale experience on Scroll Sepolia testnet.

## 📋 About This Project

### 🎯 Project Description

**Shadow Token ICO** is a complete blockchain application that demonstrates a real-world Initial Coin Offering (ICO) implementation. The project consists of two main components:

#### Frontend Application
A modern, responsive web application built with Next.js that allows users to:
- Connect their MetaMask wallet
- Purchase Shadow (SHDW) tokens using ETH
- View real-time transaction history
- Monitor contract information and user balances

#### Smart Contracts
Two main Solidity contracts deployed on Scroll Sepolia testnet:
- **Shadow Token**: An ERC20 token with minting capabilities
- **Shadow ICO Contract**: Handles ETH to token conversion with owner controls

### 📁 Directory Structure

```
blokkat-arabic-blockchain-developer-bootcamp-graduation-project/
├── dapp-front/                    # Frontend Application
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx           # Root layout with providers
│   │   ├── page.tsx             # Main dApp interface
│   │   └── globals.css          # Global styles
│   ├── components/               # React Components
│   │   ├── WalletConnect.tsx    # Wallet connection logic
│   │   ├── ContractInfo.tsx     # Contract data display
│   │   ├── BuyTokens.tsx        # Token purchase interface
│   │   └── TransactionHistory.tsx # Event monitoring
│   ├── config/                  # Configuration
│   │   └── index.tsx            # Wagmi and network setup
│   ├── context/                 # React Context
│   │   └── index.tsx            # Wagmi provider setup
│   ├── lib/                     # Utilities
│   │   └── contracts.ts         # Contract ABIs and utilities
│   ├── abi/                     # Contract ABIs
│   │   ├── Shadow.json          # Shadow token ABI
│   │   └── ShadowICO.json       # ICO contract ABI
│   └── public/                  # Static assets
├── ico-project/                  # Smart Contracts
│   ├── src/                     # Solidity Source Code
│   │   ├── Shadow.sol           # ERC20 token contract
│   │   └── ShadowICO.sol        # ICO contract
│   ├── script/                  # Deployment Scripts
│   │   └── Deploy.s.sol         # Contract deployment script
│   ├── test/                    # Contract Tests
│   │   └── ICO.t.sol            # ICO contract tests
│   ├── abi/                     # Generated ABIs
│   │   ├── Shadow.json          # Generated token ABI
│   │   └── ShadowICO.json       # Generated ICO ABI
│   ├── broadcast/               # Deployment Records
│   ├── cache/                   # Foundry cache
│   └── lib/                     # Dependencies
├── .gitignore                   # Git ignore patterns
├── .env.example                 # Environment template
└── README.md                    # Project documentation
```

## 🎨 Design Patterns

### 🔧 Design Patterns Used

#### 1. Inheritance & Interfaces

**Location**: `ico-project/src/Shadow.sol`

```solidity
contract Shadow is ERC20, Ownable {
    // Inherits from OpenZeppelin's ERC20 and Ownable
    // Promotes modularity and reuse of secure, audited code
}
```

**Benefits**:
- ✅ **Code Reuse**: Leverages battle-tested OpenZeppelin contracts
- ✅ **Security**: Inherits security patterns from audited libraries
- ✅ **Maintainability**: Reduces code duplication and complexity

#### 2. Access Control Pattern

**Location**: `ico-project/src/Shadow.sol` and `ico-project/src/ShadowICO.sol`

```solidity
// In Shadow.sol
function setICOContract(address _ico) external onlyOwner {
    require(ico == address(0), "ICO already set");
    ico = _ico;
}

// In ShadowICO.sol
function setRate(uint256 newRate) external onlyOwner {
    require(newRate > 0, "Rate must be greater than 0");
    rate = newRate;
}

function withdrawETH() external onlyOwner {
    uint256 balance = address(this).balance;
    require(balance > 0, "Nothing to withdraw");
    payable(owner()).transfer(balance);
    emit ETHWithdrawn(owner(), balance);
}
```

**Benefits**:
- ✅ **Security**: Critical functions protected by `onlyOwner` modifier
- ✅ **Authorization**: Clear separation of admin and user functions
- ✅ **Auditability**: Easy to track who can perform administrative actions

#### 3. Inter-Contract Execution

**Location**: `ico-project/src/ShadowICO.sol`

```solidity
function buyTokens() public payable {
    require(msg.value > 0, "Send ETH to buy tokens");
    
    uint256 tokensToMint = msg.value * rate;
    token.mint(msg.sender, tokensToMint); // Inter-contract call
    
    emit TokensPurchased(msg.sender, msg.value, tokensToMint);
}
```

**Benefits**:
- ✅ **Modularity**: Clear separation of concerns between contracts
- ✅ **Reusability**: Token contract can be used by other contracts
- ✅ **Security**: Controlled minting through authorized contract only

## 🔐 Security Measures

### 🛡️ Security Best Practices Followed

#### 1. Fixed Compiler Version

**Location**: All Solidity files

```solidity
pragma solidity 0.8.20; // Fixed version, not ^0.8.20
```

**Security Benefits**:
- ✅ **Predictability**: Prevents unexpected behavior from compiler changes
- ✅ **Reproducibility**: Ensures consistent compilation across environments
- ✅ **Audit Compliance**: Makes security audits more reliable

#### 2. Proper Use of require Statements

**Location**: `ico-project/src/ShadowICO.sol`

```solidity
function buyTokens() public payable {
    require(msg.value > 0, "Send ETH to buy tokens");
    // ... rest of function
}

function setRate(uint256 newRate) external onlyOwner {
    require(newRate > 0, "Rate must be greater than 0");
    rate = newRate;
}

function withdrawETH() external onlyOwner {
    uint256 balance = address(this).balance;
    require(balance > 0, "Nothing to withdraw");
    // ... rest of function
}
```

**Security Benefits**:
- ✅ **Input Validation**: Prevents invalid inputs and state changes
- ✅ **Clear Error Messages**: Helps with debugging and user experience
- ✅ **Fail-Fast**: Stops execution before any state changes occur

#### 3. Checks-Effects-Interactions Pattern

**Location**: `ico-project/src/ShadowICO.sol`

```solidity
function withdrawETH() external onlyOwner {
    // 1. CHECK: Validate conditions
    uint256 balance = address(this).balance;
    require(balance > 0, "Nothing to withdraw");
    
    // 2. EFFECTS: Update state (none in this case)
    // 3. INTERACTIONS: External calls
    payable(owner()).transfer(balance);
    
    // 4. EVENTS: Emit events
    emit ETHWithdrawn(owner(), balance);
}
```

**Security Benefits**:
- ✅ **Reentrancy Protection**: Prevents reentrancy attacks
- ✅ **State Consistency**: Ensures state changes happen before external calls
- ✅ **Audit Trail**: Clear sequence of operations for security analysis

## 🔗 Important Links & Addresses

### Smart Contract Addresses (Scroll Sepolia Testnet)

**Current Deployed Contracts:**
- **Shadow Token Contract**: `0xD2Ce9C0B385fB2f8b0F1254933142dDd36a4f99f`
- **Shadow ICO Contract**: `0x8B2Af207A99Aa28bc37c8834c40B432AE01d654C`

**Note**: These are the currently deployed contracts. If you redeploy, update the addresses in `dapp-front/lib/contracts.ts`.



### Frontend dApp Hosting

- **Live dApp**: [LINK_TO_BE_ADDED]

## 🧪 How to Run Tests

### Smart Contract Tests

From the `ico-project` directory:

```bash
# Run all tests
forge test

# Run tests with verbose output
forge test -vv

# Run tests with gas reporting
forge test --gas-report
```

## 🚀 How to Run the Program

### Prerequisites

- Node.js 18+
- Foundry (for smart contracts)
- MetaMask wallet
- Scroll Sepolia testnet configured

### Local Development Setup

#### 1. Clone and Setup

```bash
git clone https://github.com/AbdelrhmanMaamoun/blokkat-arabic-blockchain-developer-bootcamp-graduation-project.git
cd blokkat-arabic-blockchain-developer-bootcamp-graduation-project
```

#### 2. Environment Configuration

**For Frontend** (`dapp-front/.env.local`):
```bash
# Copy environment template
cp .env.example dapp-front/.env.local

# Edit dapp-front/.env.local and add:
NEXT_PUBLIC_PROJECT_ID=your_walletconnect_project_id_here
```

**For Smart Contracts** (`ico-project/.env`):
```bash
# Copy environment template
cp .env.example ico-project/.env

# Edit ico-project/.env and add:
PRIVATE_KEY=your_private_key_here
```

#### 3. Install Dependencies

```bash
# Frontend dependencies
cd dapp-front
npm install

# Smart contract dependencies
cd ../ico-project
forge install
```

#### 4. Deploy Smart Contracts

```bash
# From ico-project directory
forge script script/Deploy.s.sol:DeployScript --rpc-url https://sepolia-rpc.scroll.io --private-key $PRIVATE_KEY --broadcast
```

#### 5. Update Contract Addresses

After deployment, update the contract addresses in:
- `dapp-front/lib/contracts.ts`

#### 6. Run the Frontend

```bash
# From dapp-front directory
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your dApp!

### MetaMask Setup

1. **Add Scroll Sepolia Network**:
   - Network Name: `Scroll Sepolia`
   - RPC URL: `https://sepolia-rpc.scroll.io`
   - Chain ID: `534351`
   - Currency Symbol: `ETH`
   - Block Explorer: `https://sepolia.scrollscan.com`

2. **Get Test ETH**: Visit Scroll Sepolia faucet to get test ETH

## 🎬 Demo

### Live Demo Walkthrough

[DEMO: https://drive.google.com/file/d/1SvaJWlfVhk8sgvBjQ91fOOFluBphtP2I/view?usp=sharing ]

**Demo Features**:
- ✅ Wallet connection demonstration
- ✅ Token purchase process
- ✅ Real-time transaction monitoring
- ✅ Contract information display
- ✅ Transaction history viewing

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 + React 19
- **Styling**: Tailwind CSS 4
- **Web3**: Wagmi v2 + Viem
- **Language**: TypeScript

### Smart Contracts
- **Framework**: Foundry
- **Language**: Solidity 0.8.20
- **Libraries**: OpenZeppelin Contracts
- **Network**: Scroll Sepolia testnet

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for the Arabic Blockchain Developer Bootcamp** 