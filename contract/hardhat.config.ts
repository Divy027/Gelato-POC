import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

// Hardhat config for Base testnet
const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    base_testnet: {
      url: "https://sepolia.base.org",
      chainId: 84532, 
      accounts: [process.env.BASE_PRIVATE_KEY || '']
    },
  },
};

export default config;
