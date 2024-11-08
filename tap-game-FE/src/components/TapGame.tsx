import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getContract, getProvider, getSigner } from "../contract/index"
import { AutomateSDK } from "@gelatonetwork/automate-sdk";
import { Wallet } from "./wallet/wallet";
import { GelatoRelay, CallWithERC2771Request } from "@gelatonetwork/relay-sdk";
import CONFIG from "../config";


const apiKey = import.meta.env.VITE_GELATO_KEY;


const relay = new GelatoRelay();
const TapGame: React.FC = () => {
  const [score, setScore] = useState<number>(0);
  const [autoTapTaskId, setAutoTapTaskId] = useState<string | any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

//   const gelato = new AutomateSDK(
//     import.meta.env.VITE_GELATO_API_KEY,
//     new ethers.providers.Web3Provider((window as any).ethereum)
//   );

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
    
        // Send the relay request using Gelato Relay
        const relayResponse = await relay.sponsoredCallERC2771(request,signer as any, apiKey);
        console.log("Tap transaction sent:", relayResponse);
        await fetchScore()
    } catch (error) {
      console.error("Failed to tap:", error);
    }
  };
//   const setupAutoTap = async () => {
//     try {
//       const signer = await getSigner();
//       const contract = getContract(signer);
//       const tapData = contract.interface.encodeFunctionData("tap");

//       const { taskId } = await gelato.createTask({
//         execAddress: contract.address,
//         execSelector: contract.interface.getSighash("tap"),
//         execData: tapData,
//       });

//       setAutoTapTaskId(taskId);
//     } catch (error) {
//       console.error("Error setting up auto-tap:", error);
//     }
//   };

//   const cancelAutoTap = async () => {
//     try {
//       if (autoTapTaskId) {
//         await gelato.cancelTask(autoTapTaskId);
//         setAutoTapTaskId(null);
//       }
//     } catch (error) {
//       console.error("Error canceling auto-tap:", error);
//     }
//   };

  useEffect(() => {
    fetchScore();
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

        <div className="flex justify-between gap-4">
          <button
            // onClick={setupAutoTap}
            className={`w-full px-4 py-2 rounded-lg font-semibold text-white transition-colors ${
              autoTapTaskId
                ? "bg-green-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={autoTapTaskId}
          >
            Enable Auto-Tap
          </button>
          <button
            // onClick={cancelAutoTap}
            className={`w-full px-4 py-2 rounded-lg font-semibold text-white transition-colors ${
              !autoTapTaskId
                ? "bg-red-500 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
            disabled={!autoTapTaskId}
          >
            Disable Auto-Tap
          </button>
        </div>
      </div>
    </div>
  );
};

export default TapGame;
