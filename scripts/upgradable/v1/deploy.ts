// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import * as hre from "hardhat";

async function main() {
  // We get the contract to deploy
  const NFT_V1 = await ethers.getContractFactory("NFT_V1");
  const deployProxy = await hre.upgrades.deployProxy(NFT_V1, {
    kind: "uups",
  });

  await deployProxy.deployed();

  const addrImpl = await hre.upgrades.erc1967.getImplementationAddress(
    deployProxy.address
  );

  console.log("NFT_V1 Proxy deployed to:", deployProxy.address);
  console.log("NFT_V1 Implementation deployed to:", addrImpl);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
