import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";

import "./scripts/sign/verify.ts";
import "./scripts/verify/verify.ts";

import "./scripts/upgradable/v1/verify.ts";
import "./scripts/upgradable/v2/verify.ts";

//Fireblocks
import "@fireblocks/hardhat-fireblocks";
import { ApiBaseUrl } from "@fireblocks/fireblocks-web3-provider";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: process.env.GOERLI_URL || "",
      fireblocks: {
        apiBaseUrl: ApiBaseUrl.Production,
        privateKey: process.env.FIREBLOCKS_API_PRIVATE_KEY_PATH as string,
        apiKey: process.env.FIREBLCOKS_API_KEY as string,
        vaultAccountIds: process.env.FIREBLOCKS_VAULT_ACCOUNT_IDS as string,
      }
    },
    amoy: {
      url: process.env.POLYGON_AMOY_URL || "",
      fireblocks: {
        apiBaseUrl: ApiBaseUrl.Production, 
        privateKey: process.env.FIREBLOCKS_API_PRIVATE_KEY_PATH as string,
        apiKey: process.env.FIREBLCOKS_API_KEY as string,
        vaultAccountIds: process.env.FIREBLOCKS_VAULT_ACCOUNT_IDS as string,
      }
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS
      ? process.env.REPORT_GAS.toLocaleLowerCase() === "true"
      : false,
    currency: "JPY",
    coinmarketcap: process.env.CMC_API_KEY,
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY,
      ropsten: process.env.ETHERSCAN_API_KEY,
      rinkeby: process.env.ETHERSCAN_API_KEY,
      goerli: process.env.ETHERSCAN_API_KEY,
      // polygon
      polygon: process.env.POLYGONSCAN_API_KEY,
      polygonMumbai: process.env.POLYGONSCAN_API_KEY,
    },
  },
};

export default config;
