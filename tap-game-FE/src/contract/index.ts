import { ethers } from "ethers";
import CONFIG from "../config";

export const getProvider = () => {
  return new ethers.BrowserProvider((window as any).ethereum);
};

export const getSigner = async () => {
  const provider = getProvider();
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
};

export const getContract = (signerOrProvider: ethers.Signer) => {
  return new ethers.Contract(
    CONFIG.TapGame.contractAddress,
    CONFIG.TapGame.ABI,
    signerOrProvider
  );
};
