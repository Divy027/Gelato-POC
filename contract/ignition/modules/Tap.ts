import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TapGameModule", (m: any) => {
  
  const tapGame = m.contract("TapGame", ["0xd8253782c45a12053594b9deB72d8e8aB2Fca54c"]);

  
  // m.call(tapGame, "tap", []);

  
  // const userScore = m.call(tapGame, "getScore", []);

 
  return { tapGame };
});
