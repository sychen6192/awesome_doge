pragma solidity >=0.6.0 <0.8.0;

import './Policy.sol';
import "./ATPToken.sol";
import "./SYCToken.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Counters.sol";


contract PolicyFactory {
    
    address[] public deployedPolicies;
    
    address public ATPtokenAddress;
    ATPToken newATPToken;
    
    address public SYCtokenAddress;
    SYCToken newSYCToken;

    Policy[] public policies;
    
    constructor() public {
        // deploy ATP ERC721
        newATPToken = new ATPToken(address(this));
        ATPtokenAddress = address(newATPToken);
        // deploy SYC ERC20
        newSYCToken = new SYCToken(57427000000000000000000, msg.sender, address(this));
        SYCtokenAddress = address(newSYCToken);
    }

    
    function createPolicy(
        string memory policyName,
        string memory policyType,
        uint policyPremium,
        uint policySellDeadline,
        uint policyDuration,
        string memory tokenURI) 
        public {
        Policy newPolicy = new Policy(
            policyName,
            policyType,
            policyPremium,
            policySellDeadline,
            policyDuration,
            msg.sender,
            tokenURI,
            ATPtokenAddress,
            SYCtokenAddress);
        policies.push(newPolicy);
            
        // create policy contract
        deployedPolicies.push(address(newPolicy));
        // gives policy contract mint right
        newATPToken.addPolicyAddress(address(newPolicy));
        newSYCToken.addPolicyAddress(address(newPolicy));
    }
    
    function getDeloyedPolicies() public view returns (address[] memory) {
        return deployedPolicies;
    }
}