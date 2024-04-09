import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// rikeby:0xc5d0b57f014f7813Bb6d6bE8E1ddeA2B8eb89676

const addr = "0xc5d0b57f014f7813Bb6d6bE8E1ddeA2B8eb89676";

task("verify-sign-on-explorer", "Verify contract on explorer").setAction(
  async function (
    taskArgs: Array<any>,
    hre: HardhatRuntimeEnvironment
  ): Promise<void> {
    await hre.run("verify:verify", {
      address: addr,
      contract: "contracts/sign/Sign.sol:Sign",
    });
  }
);

// https://rinkeby.etherscan.io/address/0xc5d0b57f014f7813Bb6d6bE8E1ddeA2B8eb89676#code
