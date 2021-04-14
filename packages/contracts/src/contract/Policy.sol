pragma solidity >=0.6.0 <0.7.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/math/SafeMath.sol";
import "./SYCToken.sol";
import "./ATPToken.sol";

contract Policy {
    
    ATPToken immutable Atp;
    SYCToken immutable Syc;
    using SafeMath for uint;

    string public policyName;
    string public policyType; 
    uint public policyPremium;
    uint public policySellDeadline;
    uint public policyDuration;
    uint public totalStakeAmount;
    address public policyProposer;
    string public policyTokenURI;
    address[] internal policyStakeholders;
    mapping (address => bool) public isPolicyStakeholders;
    bool public claimed;

    struct Request {
        string description_URI;
        uint multiple;
        address requester;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    Request[] public requests;

    
    constructor(
        string memory _policyName,
        string memory _policyType,
        uint _policyPremium,
        uint _policySellDeadline,
        uint _policyDuration,
        address _policyProposer,
        string memory _tokenURI,
        address _ATPtokenAddress,
        address _SYCtokenAddress
        ) public {
            policyName = _policyName;
            policyType = _policyType;
            policyPremium = _policyPremium;
            policySellDeadline = _policySellDeadline;
            policyDuration = _policyDuration;
            policyProposer = _policyProposer;
            policyTokenURI = _tokenURI;
            Syc = SYCToken(_SYCtokenAddress);
            Atp = ATPToken(_ATPtokenAddress);
            claimed = false;
    }
    
    function stackPolicyReferral(address freindAddress) public {
        // require(now <= policySellDeadline, 'Policy selling is over.');
        require(!isPolicyStakeholders[msg.sender], 'Already staked.');
        require(!isPolicyStakeholders[freindAddress], 'Your friend is not stakeholders.');
        Syc.createStake(msg.sender, policyPremium.mul(99).div(100));
        totalStakeAmount = totalStakeAmount + policyPremium.mul(99).div(100);
        policyStakeholders.push(msg.sender);
        isPolicyStakeholders[msg.sender] = true;
        Atp.issueToken(msg.sender, policyTokenURI);
    }
    

    function stackPolicy() public {
        // require(now <= policySellDeadline, 'Policy selling is over.');
        require(!isPolicyStakeholders[msg.sender], 'Already staked.');
        Syc.createStake(msg.sender, policyPremium);
        totalStakeAmount = totalStakeAmount + policyPremium;
        policyStakeholders.push(msg.sender);
        isPolicyStakeholders[msg.sender] = true;
        Atp.issueToken(msg.sender, policyTokenURI);
    }
    
    function createRequest(string memory _description_URI, uint _multiple) public {
        // require(now <= policyDuration, 'Policy duration is over.');
        // 這邊應該是要check他有沒有ERC721的token
        require(isPolicyStakeholders[msg.sender], 'You are not the member.');
        Request memory newRequest = Request({
           description_URI: _description_URI,
           multiple: _multiple,
           requester: msg.sender,
           complete: false,
           approvalCount: 0
        });

        requests.push(newRequest);
    }
    
    function approveRequest(uint index) public {
        // require(now <= policyDuration, 'Policy selling is over.');
        Request storage request = requests[index];
        // 這邊應該是要check他有沒有ERC721的token
        require(isPolicyStakeholders[msg.sender], 'You are not the member.');
        // 要沒投過票
        require(!request.approvals[msg.sender]);
        request.approvalCount++;
        request.approvals[msg.sender] = true;
    }
    
    function finalizeRequest(uint index) public {
        Request storage request = requests[index];
        // 發起人自行終結
        require(request.requester == msg.sender);
        // approve過半
        require(request.approvalCount > (policyStakeholders.length / 2));
        // 還沒結束
        require(!request.complete);
        // 給他錢啦
        Syc.withDrawClaim(request.requester, policyPremium.mul(request.multiple));
        // 給所有投票的人錢
        request.complete = true;
        // 已經出險過了
        claimed = true;
    }
    
    // get return
    function finalizePolicy() public {
        require(now > policyDuration, 'Policy duration is not over.');
        // 不能夠出險過
        require(claimed == false);
        // 發錢回去給大家
        for (uint i = 0; i < policyStakeholders.length; i++) {
            Syc.withDrawClaim(policyStakeholders[i], policyPremium.mul(4).div(10));
        }
        // 剩下的以太幣就送給關掉的人
        selfdestruct(msg.sender);
    }

}