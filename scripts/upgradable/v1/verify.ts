import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// NFT_V1 Proxy deployed to: 0x43fE0793f8664d8A01c91b67A8028c3deba8eA41
// NFT_V1 Implementation deployed to: 0xfC58AEA13861D0894Ffb9919125aD7E9D75b1Ce2

const addr = "0xfC58AEA13861D0894Ffb9919125aD7E9D75b1Ce2";

task("verify-on-explorer-v1", "Verify contract on explorer").setAction(
  async function (
    taskArgs: Array<any>,
    hre: HardhatRuntimeEnvironment
  ): Promise<void> {
    await hre.run("verify:verify", {
      address: addr,
      contract: "contracts/NFT_V1.sol:NFT_V1",
    });
  }
);
