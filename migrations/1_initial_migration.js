const TokenDistribution = artifacts.require("TokenDistribution");
const CappedMintableToken = artifacts.require("CappedMintableToken");

module.exports = function(deployer) {
  deployer.deploy(CappedMintableToken, 1000000).then(()=>{
    deployer.deploy(TokenDistribution, CappedMintableToken.address);
  });
};
