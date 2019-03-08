pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Capped.sol";

contract CappedMintableToken is ERC20Capped{

    constructor(uint256 cap) ERC20Capped(cap) public {}
}