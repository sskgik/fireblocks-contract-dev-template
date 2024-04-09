import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const addrToken = "0x4a13608830F5e6E9583e35edB301097eE7C2d9bA";

task("verify-on-explorer", "Verify contract on explorer").setAction(
  async function (
    taskArgs: Array<any>,
    hre: HardhatRuntimeEnvironment
  ): Promise<void> {
    await hre.run("verify:verify", {
      address: addrToken,
      contract: "contracts/Token.sol:Token",
    });
  }
);
