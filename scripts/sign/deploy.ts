import * as hre from "hardhat";

async function main() {
  await hre.run("compile");

  const cfSign = await hre.ethers.getContractFactory("Sign");
  const dtxSign = await cfSign.deploy();

  await dtxSign.deployed();

  console.log("Sign deployed to:", dtxSign.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
