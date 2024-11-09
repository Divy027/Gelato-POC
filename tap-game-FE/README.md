# Tap Game - Frontend

This project is a simple **Tap Game** where users can connect their wallet, view their score, and make a transaction to increment their score on-chain by tapping. It leverages the **Gelato ERC-2771 relay SDK** for gasless transactions, allowing users to perform the tap action without needing ETH in their wallet for gas fees.

## Features
- **Wallet Connection**: Users can connect their wallets to interact with the game.
- **Gasless Tap Transaction**: Uses Gelato’s ERC-2771 SDK to perform gasless transactions for tapping, so users can increment their score without holding ETH.

## Tech Stack
- **React**: Frontend framework for building the UI.
- **ethers.js**: To interact with the Ethereum blockchain.
- **Gelato SDK**: Used for creating gasless transactions via ERC-2771.
- **TypeScript**: For type-safe JavaScript.
- **Vite**: Fast build and development tool.

## Setup

### Prerequisites
- **Node.js** (>= 18.x)
- **yarn** or **npm**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Divy027/Gelato-POC.git
   cd tap-game-FE

2. **Install dependencies**:
   ```bash
    Copy code
    yarn install
    # or
    npm install

 3. **Environment Variable**:
    Create a `.env` file in the root directory and add your Gelato API key:
 
    ```bash
    VITE_GELATO_API_KEY=<your_gelato_api_key>

 4. **Start the development server**:
    ```bash
    yarn dev
    # or
    npm run dev

 5. **Project Structure**:
    ```bash
      src/
    ├── components/
    │   ├── Wallet.tsx            # Wallet connection component
    │   └── TapGame.tsx           # Main game component
    ├── contract/
    │   └── index.ts              # Contract and signer setup
    ├── App.tsx                   # Main App component
    ├── main.tsx                  # Application entry point
    └── index.html                # HTML template




