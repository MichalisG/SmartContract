pragma solidity ^0.5.0;

import "./CappedMintableToken.sol";

contract TokenDistribution{
    address addr;

    constructor(address _address) public{
        addr = _address;
    }
    function distribute(address[] memory contributors, uint256[] memory balances) public {
        CappedMintableToken token = CappedMintableToken(addr);
        for(uint i=0; i<contributors.length; i++){
            token.transfer(contributors[i], balances[i]);
        }
    }
}