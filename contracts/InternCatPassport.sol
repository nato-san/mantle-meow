// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract InternCatPassport is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId = 1;

    event PassportMinted(address indexed owner, uint256 indexed tokenId, string tokenURI);

    constructor(address initialOwner) ERC721("Intern Cat Passport", "ICAT") Ownable(initialOwner) {}

    function mintPassport(address to, string calldata tokenURI_) external returns (uint256 tokenId) {
        tokenId = _nextTokenId;
        _nextTokenId += 1;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI_);

        emit PassportMinted(to, tokenId, tokenURI_);
    }
}
