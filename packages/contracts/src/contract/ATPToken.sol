pragma solidity ^0.6.12;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Counters.sol";


contract ATPToken is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping (address => bool) public allowToMintToken;
    address factoryAddress;

    constructor(address _factoryAddress) public ERC721("A Policy Token", "APT") {
        factoryAddress = _factoryAddress;
    }

    modifier onlyOwner() {
        require(allowToMintToken[msg.sender], 'You are not valid policy address.');
        _;
    }
    
    function addPolicyAddress(address policyAddress)
        public
    {
        require(msg.sender == factoryAddress);
        allowToMintToken[policyAddress] = true;
    }
    
    function issueToken(address insurer, string memory tokenURI)
        public
        onlyOwner
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(insurer, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}