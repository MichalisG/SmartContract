pragma solidity ^0.5.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Capped.sol";

contract CappedMintableToken is ERC20Capped{

    constructor(uint256 cap) ERC20Capped(cap) public {

    }

    function mint(address _to, uint256 _amount) public returns (bool){
        return super.mint(_to,_amount);
        // return true;
    }
}