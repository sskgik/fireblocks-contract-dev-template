// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";

import "./NFT_V1.sol";

contract NFT_V2 is
  NFT_V1,
  PausableUpgradeable,
  ERC721BurnableUpgradeable
{
  function initialize() public override initializer {
    super.initialize();
    __Pausable_init();
    __ERC721Burnable_init();
  }

  function _baseURI()
    internal
    pure
    override(ERC721Upgradeable, NFT_V1)
    returns (string memory)
  {
    return super._baseURI();
  }

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override whenNotPaused {
    super._beforeTokenTransfer(from, to, tokenId);
  }
}
