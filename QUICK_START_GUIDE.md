# 🚀 Quick Start Guide: Hello FHEVM Tutorial

## ⚡ 5-Minute Setup

Get your FHEVM dApp running in 5 minutes or less!

### Prerequisites Check
```bash
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 9.0.0
```

### Step 1: Clone & Install (2 minutes)
```bash
# Clone the repository
git clone <repository-url>
cd dapp

# Install dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### Step 2: Environment Setup (1 minute)
Create `.env` file in project root:
```env
PRIVATE_KEY=your_metamask_private_key_here
INFURA_API_KEY=your_infura_key_here
ETHERSCAN_API_KEY=your_etherscan_key_here
```

### Step 3: Deploy Contract (1 minute)
```bash
# Compile contracts
npm run compile:fhe

# Deploy to Zama Devnet (get test tokens from https://faucet.zama.ai first)
npm run deploy:fhe
```

### Step 4: Start Frontend (1 minute)
```bash
cd frontend
npm run dev
```

🎉 **Done!** Your dApp is running at `http://localhost:3000`

---

## 📖 Next Steps

1. **Read the Full Tutorial**: Open `HELLO_FHEVM_TUTORIAL.md` for comprehensive explanations
2. **Get Test Tokens**: Visit [Zama Faucet](https://faucet.zama.ai) to get testnet tokens
3. **Configure MetaMask**: Add Zama Devnet (Chain ID: 8009, RPC: https://devnet.zama.ai)
4. **Test the dApp**: Create proposals and vote to see the privacy features in action

## 🆘 Need Help?

- **Tutorial not working?** Check the troubleshooting section in the full tutorial
- **Questions about FHEVM?** Visit [Zama Documentation](https://docs.zama.ai/fhevm)
- **Found a bug?** Create an issue in the repository

---

*Ready to build the future of privacy-preserving dApps? Let's go! 🚀*