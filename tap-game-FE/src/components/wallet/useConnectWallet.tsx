import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { JsonRpcSigner } from "ethers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

type ConnectWalletReturnType = {
  provider: ethers.BrowserProvider | null;
  account: JsonRpcSigner | null;
  requestAccount: () => Promise<{ success: boolean; msg?: string }>;
  connectStatus: "connected" | "disconnected";
};

export function useConnectWallet(): ConnectWalletReturnType {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<JsonRpcSigner | null>(null);
  const [connectStatus, setConnectStatus] = useState<"connected" | "disconnected">("disconnected");

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum as any);
        setProvider(web3Provider);

        try {
          const accounts: any = await web3Provider.listAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setConnectStatus("connected");
          }
        } catch (error) {
          console.error("Failed to get accounts:", error);
        }

        // Listen for account changes
        window.ethereum.on("accountsChanged", (accounts: any) => {
          if (accounts.length === 0) {
            setAccount(null);
            setConnectStatus("disconnected");
          } else {
            setAccount(accounts[0]);
            setConnectStatus("connected");
          }
        });

        // Listen for network changes
        window.ethereum.on("chainChanged", () => {
          setProvider(new ethers.BrowserProvider(window.ethereum as any));
          setAccount(null);
          setConnectStatus("disconnected");
        });
      } else {
        console.log("No Ethereum wallet detected");
      }
    };
    init();

   
  }, []);

  const requestAccount = async (): Promise<{ success: boolean; msg?: string }> => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        setConnectStatus("connected");
        const accounts = await provider?.listAccounts();
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
          return { success: true };
        } else {
          setAccount(null);
          setConnectStatus("disconnected");
          return { success: false, msg: "No accounts found" };
        }
      } catch (error: any) {
        setConnectStatus("disconnected");
        return { success: false, msg: error.message };
      }
    } else {
      setConnectStatus("disconnected");
      return { success: false, msg: "No Ethereum wallet detected" };
    }
  };

  return { provider, account, requestAccount, connectStatus };
}
