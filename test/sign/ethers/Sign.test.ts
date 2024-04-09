import { ethers } from "hardhat";
import { expect } from "chai";
import * as chai from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { solidity } from "ethereum-waffle";
import { Sign } from "../../../typechain";

//ethersjsとweb3jsの両方でテストを書く。

chai.use(solidity);

describe("Example", function () {
  let contract: Sign;
  let signer: SignerWithAddress;
  let value: {
    someAddress: string;
    someAddressList: string[];
    someString: string;
    someStringList: string[];
    someIntList: number[];
    someBytes: string;
    someBytes32List: string[];
  };

  beforeEach(async function () {
    [signer] = await ethers.getSigners();

    const cfSign = await ethers.getContractFactory("Sign");
    contract = await cfSign.deploy();

    value = {
      someAddress: signer.address,
      someAddressList: [signer.address, contract.address],
      someString: "test",
      someStringList: ["hi", "hello"],
      someIntList: [1],
      someBytes: ethers.utils.solidityKeccak256(["string"], ["someBytes"]),
      someBytes32List: [
        ethers.utils.formatBytes32String("example"),
        ethers.utils.formatBytes32String("someBytes32List"),
      ],
    };
  });

  describe("ethers-verifyForERC191", function () {
    it("verify", async () => {
      const message = ethers.utils.arrayify(
        ethers.utils.solidityKeccak256(
          [
            "bytes1",
            "bytes1",
            "address",
            "address",
            "address[]",
            "string",
            "string[]",
            "uint256[]",
            "bytes",
            "bytes32[]",
          ],
          [
            "0x19",
            "0x00",
            contract.address,
            value.someAddress,
            value.someAddressList,
            value.someString,
            value.someStringList,
            value.someIntList,
            value.someBytes,
            value.someBytes32List,
          ]
        )
      );

      const _sig = await signer.signMessage(message);

      expect(await contract.verifyForERC191(value, _sig, signer.address)).to.be
        .true;
    });
  });

  describe("ethers-verifyForERC712", function () {
    it("verify", async function () {
      const domain = {
        name: "Example",
        version: "1",
        chainId: await signer.getChainId(),
        verifyingContract: contract.address,
      };

      const types2 = {
        Example: [
          { name: "someAddress", type: "address" },
          { name: "someAddressList", type: "address[]" },
          { name: "someString", type: "string" },
          { name: "someStringList", type: "string[]" },
          { name: "someIntList", type: "uint256[]" },
          { name: "someBytes", type: "bytes" },
          { name: "someBytes32List", type: "bytes32[]" },
        ],
      };

      const message = await signer._signTypedData(domain, types2, value);
      const _message = ethers.utils.splitSignature(message);

      expect(
        await contract.verifyForERC712(
          value,
          { v: _message.v, r: _message.r, s: _message.s },
          message,
          signer.address
        )
      ).to.be.true;
    });
  });
});
