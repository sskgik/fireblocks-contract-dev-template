// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Sign is EIP712 {
  using ECDSA for bytes32;

  string private _name = "Example";
  string private _version = "1";

  struct Sign {
    uint8 v;
    bytes32 r;
    bytes32 s;
  }

  struct EIP712Domain {
    string name;
    string version;
    uint256 chainId;
    address verifyingContract;
  }

  struct Data {
    address someAddress;
    address[] someAddressList;
    string someString;
    string[] someStringList;
    uint256[] someIntList;
    bytes someBytes;
    bytes32[] someBytes32List;
  }

  constructor() EIP712("Example", "EX") {}

  function covertStringArraytoHash(string[] memory _string)
    private
    pure
    returns (bytes memory)
  {
    bytes32[] memory _output = new bytes32[](_string.length);

    for (uint256 i = 0; i < _string.length; i++) {
      _output[i] = keccak256(bytes(_string[i]));
    }
    return abi.encodePacked(_output);
  }

  function convertStringArraytoString(string[] memory _string)
    private
    pure
    returns (string memory)
  {
    bytes memory _output;

    for (uint256 i = 0; i < _string.length; i++) {
      _output = abi.encodePacked(_output, _string[i]);
    }
    return string(_output);
  }

  function verifyForERC191(
    Data memory _data,
    bytes calldata _signature,
    address _signer
  ) public view returns (bool) {
    // Arguments when calculating hash to validate
    // 1: byte(0x19) - the initial 0x19 byte
    // 2: byte(0x00) - the version byte
    // 3: address(this) - the validator address
    // 4- : Application specific data
    bytes32 message = keccak256(
      abi.encodePacked(
        bytes1(0x19),
        bytes1(0x00),
        address(this),
        _data.someAddress,
        _data.someAddressList,
        _data.someString,
        convertStringArraytoString(_data.someStringList),
        _data.someIntList,
        _data.someBytes,
        _data.someBytes32List
      )
    );
    address verifyAddress = message.toEthSignedMessageHash().recover(
      _signature
    );

    return _signer == verifyAddress;
  }

  function verifyForERC712(
    Data memory _data,
    Sign memory _sign,
    bytes calldata _signature,
    address _signer
  ) public view returns (bool) {
    bytes32 domainSeparator = keccak256(
      abi.encode(
        keccak256(
          "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
        ),
        keccak256(bytes(_name)),
        keccak256(bytes(_version)),
        block.chainid,
        address(this)
      )
    );

    bytes32 hashStruct = keccak256(
      abi.encode(
        keccak256(
          "Example(address someAddress,address[] someAddressList,string someString,string[] someStringList,uint256[] someIntList,bytes someBytes,bytes32[] someBytes32List)"
        ),
        _data.someAddress,
        keccak256(abi.encodePacked(_data.someAddressList)),
        keccak256(bytes(_data.someString)),
        keccak256(covertStringArraytoHash(_data.someStringList)),
        keccak256(abi.encodePacked(_data.someIntList)),
        keccak256(_data.someBytes),
        keccak256(abi.encodePacked(_data.someBytes32List))
      )
    );

    bytes32 hash = keccak256(
      abi.encodePacked("\x19\x01", domainSeparator, hashStruct)
    );

    // two signature verification methods
    address verifyAddress = hash.recover(_signature);

    address verifyAddress2 = ecrecover(hash, _sign.v, _sign.r, _sign.s);

    return _signer == verifyAddress && _signer == verifyAddress2;
  }
}
