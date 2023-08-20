pragma solidity ^0.4.17;

contract AccessControl {
    struct data {
        string hashData;
    }

    mapping(address => mapping(address=>bool)) isApproved;
    mapping(address => data) Database;
    
    function giveAccess(address _address) public returns(bool success) {
        isApproved[msg.sender][_address] = true;
        return true;
    }

    function revokeAccess(address _address) public returns(bool success) {
        isApproved[msg.sender][_address] = false;
        return true;
    }

    function checkAccess(address _address1, address _address2) view public returns(bool val)  {
        return isApproved[_address1][_address2];
    }

    function sendHash(address _address1, address _address2, string hash) public {
        if (isApproved[_address1][_address2])
            Database[_address1].hashData = hash;
    }

    function returnHash(address _address1, address _address2) view public returns(string hash) {
        if (isApproved[_address1][_address2]) {
            return (Database[_address1].hashData);
        }
        else 
            return ("-1");
    }
}
