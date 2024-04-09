// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import * as hre from "hardhat";

// NFT_V1 Proxy deployed to: 0x43fE0793f8664d8A01c91b67A8028c3deba8eA41
// NFT_V1 Implementation deployed to: 0xfC58AEA13861D0894Ffb9919125aD7E9D75b1Ce2
// NFT_V2 Implementation deployed to: 0xD2C5eDeB5E5CAD89319b9497F0267e6bdf872af2

async function main() {
  // We get the contract to deploy
  const NFT_V1_PROXY_ADDR = "0x43fE0793f8664d8A01c91b67A8028c3deba8eA41";

  const NFT_V2 = await ethers.getContractFactory("NFT_V2");
  const updateProxy = await hre.upgrades.upgradeProxy(
    NFT_V1_PROXY_ADDR,
    NFT_V2
  );

  await updateProxy.deployed();

  const addrImpl = await hre.upgrades.erc1967.getImplementationAddress(
    updateProxy.address
  );

  console.log("NFT_V2 Proxy deployed to:", updateProxy.address);
  console.log("NFT_V2 Implementation deployed to:", addrImpl);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
