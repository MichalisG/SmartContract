pragma solidity ^0.5.0;

import "./CappedMintableToken.sol";

contract TokenDistribution{
    address addr;

    constructor(address _address) public{
        addr = _address;
    }
    function distribute(address[] memory contributors, uint256[] memory balances) public {
        for(uint i=0; i<contributors.length; i++){
            CappedMintableToken(addr).mint(contributors[i], balances[i]);
        }
    }
}