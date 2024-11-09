# Tap Game Smart Contract

This project demonstrates a basic smart contract setup for the **Tap Game**, built using Hardhat. The Tap Game contract allows users to tap and increase their score, with functionality enabled for gasless transactions through Gelato's ERC-2771 relay. The contract has a simple structure, focusing on storing and incrementing a user’s score.

## Features
- **Score Tracking**: The contract tracks each user's score on-chain.
- **Gasless Transactions**: Enabled via Gelato's ERC-2771 SDK, allowing users to tap without needing ETH for gas.

## Deployed Contract
The contract has been deployed to base sepolia testnet
- **Contract Address**: 0x749900c97A4636f77830a640Cb2EEe758A37aD44

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Tap.ts
```
