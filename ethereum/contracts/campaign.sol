// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
contract CampaignFactory{
    address[] public deployedCampaigns;
    function createCampaign(uint mininum) public{
        Campaign newCapaign = new Campaign(mininum, msg.sender);
        deployedCampaigns.push(address(newCapaign));

    }
    function getDeployedCampaigns() public view returns(address[] memory){
        return deployedCampaigns;
    }
   

}
contract Campaign{
   struct Request{
            string description;
            uint value;
            address payable recipient;
            bool complete;
            uint approvalsCount;
            mapping(address => bool) approvals;
        }
    uint public approversCount;
    uint public numRequests;
    mapping (uint => Request) public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address=>bool) public approvers;
    constructor(uint minContribution, address sender){
        manager = sender;
        minimumContribution = minContribution;
    }
    modifier restricted(){
        require(msg.sender==manager);
        _;
    }
    function contribute() public payable{
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        if(!approvers[msg.sender]){
            approversCount++;
        }

    }
    function createRequest(string memory description, uint value, address payable recipient)
    public restricted{
        require(msg.sender == manager);
        Request storage r = requests[numRequests++];
                r.description = description;
                r.value = value;
                r.recipient = recipient;
                r.complete = false;
                r.approvalsCount = 0;
    }
    function approveRequest(uint index) public{
        require(approvers[msg.sender]);
        require(!requests[index].approvals[msg.sender]);
        requests[index].approvals[msg.sender] = true;
        requests[index].approvalsCount++;
    }
    function finalizeRequest(uint index) public restricted{
         Request storage request = requests[index];
        require(!request.complete);
        require(request.approvalsCount > approversCount/2);
        request.recipient.transfer(request.value);
        request.complete = true;
    }



}