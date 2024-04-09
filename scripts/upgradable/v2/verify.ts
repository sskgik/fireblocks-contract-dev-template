import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// https://ropsten.etherscan.io/address/0xD2C5eDeB5E5CAD89319b9497F0267e6bdf872af2#code
const addr = "0xD2C5eDeB5E5CAD89319b9497F0267e6bdf872af2";

task("verify-on-explorer-v2", "Verify contract on explorer").setAction(
  async function (
    taskArgs: Array<any>,
    hre: HardhatRuntimeEnvironment
  ): Promise<void> {
    await hre.run("verify:verify", {
      address: addr,
      contract: "contracts/NFT_V2.sol:NFT_V2",
    });
  }
);
