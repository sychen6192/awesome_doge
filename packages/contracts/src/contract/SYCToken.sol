pragma solidity ^0.6.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

contract SYCToken is ERC20 {
    constructor(uint256 initialSupply, address _minter, address _factoryAddress) public ERC20 ("SYC coin", "SYC") {
        factoryAddress = _factoryAddress;
        _mint(_minter, initialSupply);
    }
    
    address[] internal stakeholders;
    mapping(address => uint256) internal stakes;
    mapping (address => bool) public allowToMintToken;
    address factoryAddress;


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

    
    function isStakeholder(address _address)
       public
       view
       returns(bool, uint256)
   {
       for (uint256 s = 0; s < stakeholders.length; s += 1){
           if (_address == stakeholders[s]) return (true, s);
       }
       return (false, 0);
   }
   
   function addStakeholder(address _stakeholder)
       public
   {
       (bool _isStakeholder, ) = isStakeholder(_stakeholder);
       if(!_isStakeholder) stakeholders.push(_stakeholder);
   }
   
   
   function stakeOf(address _stakeholder)
       public
       view
       returns(uint256)
   {
       return stakes[_stakeholder];
   }
    
    function totalStakes()
       public
       view
       returns(uint256)
   {
       uint256 _totalStakes = 0;
       for (uint256 s = 0; s < stakeholders.length; s += 1){
           _totalStakes = _totalStakes.add(stakes[stakeholders[s]]);
       }
       return _totalStakes;
   }
   
    function createStake(address insurer, uint256 _stake)
       public
   {
       _burn(insurer, _stake);
       if(stakes[insurer] == 0) addStakeholder(insurer);
       stakes[insurer] = stakes[insurer].add(_stake);
   }
   
   function withDrawClaim(address insurer, uint256 _claimAmount)
       public
       onlyOwner
   {
       (bool _isStakeholder, ) = isStakeholder(insurer);
       require(_isStakeholder, 'You are not stakeholders');
       _mint(insurer, _claimAmount);
   }
   

    
}