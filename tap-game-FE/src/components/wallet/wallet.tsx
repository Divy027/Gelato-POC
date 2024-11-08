import { useState, useEffect } from "react";
import { useConnectWallet } from "./useConnectWallet";
import { ethers } from "ethers";

export function Wallet() {
	const { account, requestAccount, connectStatus } = useConnectWallet();

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [errorMsg, setErrorMsg] = useState<string>("");

	useEffect(() => {
		if (connectStatus === "disconnected") {
			setErrorMsg("");
		}
	}, [connectStatus]);

	const connectWallet = async () => {
		try {
			if ((window as any).ethereum) {
				try {
					const chain = await (window as any).ethereum.request({ method: "eth_chainId" });
					if (chain === ethers.toQuantity(84532)) {
						const addressArray = await (window as any).ethereum.request({
							method: "eth_requestAccounts",
						});

						if (addressArray.length > 0) {
							return {
								address: addressArray[0],
							};
						} else {
							return 0;
						}
					} else {
						await (window as any).ethereum.request({
							method: "wallet_switchEthereumChain",
							params: [{ chainId: ethers.toQuantity(84532) }],
						});
						const addressArray = await (window as any).ethereum.request({
							method: "eth_requestAccounts",
						});
						if (addressArray.length > 0) {
							return {
								address: addressArray[0],
							};
						}
					}
				} catch (e) {
					// Chain doesn't exist in wallet
					const networkMap = {
						Base_Testnet: {
							chainId: ethers.toQuantity(84532),
							chainName: "baseSepolia",
							nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
							rpcUrls: ["https://sepolia.base.org"],
							blockExplorerUrls: ["https://sepolia.basescan.org"],
						},
					};

					await (window as any).ethereum.request({
						method: "wallet_addEthereumChain",
						params: [networkMap.Base_Testnet],
					});

					const addressArray = await (window as any).ethereum.request({
						method: "eth_requestAccounts",
					});
					if (addressArray.length > 0) {
						return {
							address: addressArray[0],
						};
					}
				}
			} else {
				console.log("Ethereum object not found");
			}
		} catch (error) {
			console.log("error", error);
		}
	};

	const handleConnectWallet = async () => {
		setIsLoading(true);
		setErrorMsg("");

		const result = await requestAccount();

		setIsLoading(false);

		if (!result.success) {
			await connectWallet()
		}
	};

	return (
		<div className=" text-black mb-2">
			{connectStatus === "disconnected" && (
				<div className=" bg-lightblue font-bold p-2 rounded-lg justify-center items-center">
					
					{!isLoading && !errorMsg && (
						<button
							className="bg-blue-600  hover:bg-blue-700 text-white rounded-md font-medium uppercase p-2"
							onClick={handleConnectWallet}
						>
							Connect Wallet
						</button>
					)}
				</div>
			)}

			{connectStatus === "connected" && (
				<div className="flex items-center justify-between gap-4 text-green-600 font-medium text-uppercase border-2 border-green-600 rounded-md p-2">
					<div>
						{account ? `${account.address.slice(0, 5)}...${account.address.slice(-4)}` : ""}
					</div>
					<div>Connected</div>
				</div>
			)}
		</div>
	);
}
