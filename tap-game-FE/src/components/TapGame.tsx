import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getContract, getProvider, getSigner } from "../contract/index"
import { Wallet } from "./wallet/wallet";
import { GelatoRelay, CallWithERC2771Request } from "@gelatonetwork/relay-sdk";
import CONFIG from "../config";
import { toast } from "react-toastify";
const apiKey = import.meta.env.VITE_GELATO_KEY;

const relay = new GelatoRelay();
const TapGame: React.FC = () => {
  const [score, setScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchScore = async () => {
    try {
      const signer = await getSigner();
      const contract = getContract(signer);
      const userAddress = await signer.getAddress();
      const userScore = await contract.getScore(userAddress)
      console.log(userScore);
      setScore(userScore.toString());
    } catch (error) {
      console.error("Error fetching score:", error);
    }
  };

  const handleTap = async () => {
    setIsLoading(true);
    const provider = getProvider()
    const signer = await getSigner();
    const chainId = (await provider.getNetwork()).chainId;
    const tapInterface = new ethers.Interface(CONFIG.TapGame.ABI);
    const functionData = tapInterface.encodeFunctionData("tap")
    try {
        const request: CallWithERC2771Request = {
            chainId:  chainId as any,
            target: CONFIG.TapGame.contractAddress,
            data: functionData,
            user: await signer.getAddress(),
          };
    
        const relayResponse = await relay.sponsoredCallERC2771(request,signer as any, apiKey);
        console.log("Tap transaction sent:", relayResponse);
        toast.success(`Tap transaction sent: ${JSON.stringify(relayResponse.taskId)}`);
        await fetchScore()
        setIsLoading(false);
    } catch (error: any) {
      console.error("Failed to tap:", error);
      toast.error(`${error.message}`);
    }
  };
  

  useEffect(() => {

    const interval = setInterval(async () => {
      const signer = await getSigner();
      if (signer) {

      await fetchScore();
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-600 to-blue-500">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <Wallet />
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Tap Game</h1>
        <p className="text-2xl font-semibold text-blue-600 mb-6">
          Your Score: {score}
        </p>

        <button
          onClick={handleTap}
          className={`w-full px-4 py-2 text-lg rounded-lg font-semibold transition-colors ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          } mb-6`}
          disabled={isLoading}
        >
          {isLoading ? "Tapping..." : "Tap!"}
        </button>

      </div>
    </div>
  );
};

export default TapGame;
