import * as dotenv from "dotenv";

import * as fs from "fs";
import * as path from "path";
import Web3 from "web3";
import { expect } from "chai";
import * as chai from "chai";
import { solidity } from "ethereum-waffle";
import { SignTypedDataVersion, signTypedData } from "@metamask/eth-sig-util";
chai.use(solidity);

dotenv.config();

const privateKey = process.env.PRIVATE_KEY || "";
const contractAddress = "0xc5d0b57f014f7813Bb6d6bE8E1ddeA2B8eb89676";
const signerAddress = "YOUR-WALLET-ADDRESS";

describe("Example", function () {
  let web3: Web3;
  let contract: any;
  let chainId: number;
  let data: any[];

  beforeEach(async function () {
    web3 = new Web3();
    const rpctestnet = process.env.RINKEBY_URL || "";
    web3.setProvider(new Web3.providers.HttpProvider(rpctestnet));

    const contractjson = fs.readFileSync(
      path.join(__dirname, "abi.json"),
      "utf-8"
    );
    const abi = JSON.parse(contractjson);
    contract = new web3.eth.Contract(abi, contractAddress);
    chainId = await web3.eth.getChainId();

    data = [
      signerAddress,
      [contractAddress, signerAddress],
      "someStringTest",
      ["some", "String", "Test"],
      [1, 2, 3, 4, 5],
      web3.eth.abi.encodeParameter("bytes", "0xdf3234"),
      [
        web3.eth.abi.encodeParameter("bytes32", "0xdf3234"),
        web3.eth.abi.encodeParameter("bytes32", "0xdf9994"),
      ],
    ];
  });

  describe("web3js-ERC191", function () {
    it("verify", async () => {
      const hash = web3.utils.soliditySha3(
        { t: "bytes1", v: "0x19" },
        { t: "bytes1", v: "0x00" },
        { t: "address", v: contractAddress },
        { t: "address", v: signerAddress },
        // v accepts only string | number | BN in the index.d.ts
        // but actually it accepts array as well.
        // @ts-ignore
        { type: "address", v: [contractAddress, signerAddress] },
        { t: "string", v: "someStringTest" },
        { t: "string", v: ["some", "String", "Test"] },
        { t: "uint256[]", v: [1, 2, 3, 4, 5] },
        { t: "bytes", v: web3.eth.abi.encodeParameter("bytes", "0xdf3234") },
        { t: "bytes32[]", v: ["0xdf3234", "0xdf9994"] }
      );
      if (hash === null) return;
      const sig = web3.eth.accounts.sign(hash, privateKey);
      const result = await contract.methods
        .verifyForERC191(data, sig.signature, signerAddress)
        .call();
      expect(result).to.be.true;
    });
  });

  describe("web3js-ERC712", function () {
    it("verify", async () => {
      const _p = Buffer.from(privateKey, "hex");
      const sig = signTypedData({
        privateKey: _p,
        data: {
          types: {
            Example: [
              { name: "someAddress", type: "address" },
              { name: "someAddressList", type: "address[]" },
              { name: "someString", type: "string" },
              { name: "someStringList", type: "string[]" },
              { name: "someIntList", type: "uint256[]" },
              { name: "someBytes", type: "bytes" },
              { name: "someBytes32List", type: "bytes32[]" },
            ],
            EIP712Domain: [
              { name: "name", type: "string" },
              { name: "version", type: "string" },
              { name: "chainId", type: "uint256" },
              { name: "verifyingContract", type: "address" },
            ],
          },
          domain: {
            chainId: chainId,
            name: "Example",
            version: "1",
            verifyingContract: contractAddress,
          },
          primaryType: "Example",
          message: {
            someAddress: signerAddress,
            someAddressList: [contractAddress, signerAddress],
            someString: "someStringTest",
            someStringList: ["some", "String", "Test"],
            someIntList: [1, 2, 3, 4, 5],
            someBytes: web3.eth.abi.encodeParameter("bytes", "0xdf3234"),
            someBytes32List: [
              web3.eth.abi.encodeParameter("bytes32", "0xdf3234"),
              web3.eth.abi.encodeParameter("bytes32", "0xdf9994"),
            ],
          },
        },
        version: SignTypedDataVersion.V4,
      });
      let _sig = sig.split("x")[1];
      let r = "0x" + _sig.substring(0, 64);
      let s = "0x" + _sig.substring(64, 128);
      let v = parseInt(_sig.substring(128, 130), 16);
      const result = await contract.methods
        .verifyForERC712(data, { v: v, r: r, s: s }, sig, signerAddress)
        .call();
      expect(result).to.be.true;
    });
  });
});
