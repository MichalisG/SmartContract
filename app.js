const Web3 = require('web3');
const fs = require('fs');
const util = require('util');

const account = {
  address: '0x6D2D0C8d05D39B96FEf53a74B61e9974C0029a00',
  key: '79f6211271c58baf8f2eb17651881a935584e845f06589dcfde811269f00c3ca'
};

const balancesheet = {
  '0xBFc79d03a9B592F93edb677e7815F9DA41C14475': 1000,
  '0xF215e07458aa6ad6472961Ec407FAEDb65E5188C': 2000,
  '0x422d16efDB1F60379E82a0a5EC8A71C35334790D': 3000,
  '0x7158d92Ac4dbAd955E01DDa0a3b0b014224D055e': 4000,
  '0x0AEDACa4451B87DB1704b9379f544785b46E2f02': 5000
};

const selectedHost = 'http://127.0.0.1:7545';
const web3 = new Web3(new Web3.providers.HttpProvider(selectedHost));



//main function
const run = async () => {
  const b_addresses = Object.keys(balancesheet);
  const b_values = Object.values(balancesheet);
  //Deploy CappedMintableToken
  const CappedMintableToken = await deployContract('./build/contracts/CappedMintableToken.json', account, [1000000]);

  //Deploy TokenDistribution 
  const TokenDistribution = await deployContract('./build/contracts/TokenDistribution.json', account, [CappedMintableToken.options.address]);


  await CappedMintableToken.methods.mint(TokenDistribution.options.address, 15000).send({ from: account.address });
  let balance = await CappedMintableToken.methods.balanceOf(TokenDistribution.options.address).call();
  
  try {
    await TokenDistribution.methods.distribute(b_addresses, b_values).send({ from: account.address, gas: 800000 });
  }
  catch (err) {
    throw err;
  }
  for (let i = 0; i < b_addresses.length; i++) {
    balance = await CappedMintableToken.methods.balanceOf(b_addresses[i]).call();
  }
  balance = await CappedMintableToken.methods.balanceOf(TokenDistribution.options.address).call();
};

//helper function to deloy contracts
const deployContract = async (contractPath, account, args) => {
  // Read the JSON file contents
  const file = util.promisify(fs.readFile);
  const contractJsonContent = await file(contractPath);
  const jsonOutput = JSON.parse(contractJsonContent);

  // Retrieve the ABI 
  const abi = jsonOutput.abi;

  const bytecode = jsonOutput.bytecode;

  const tokenContract = web3.eth.Contract(abi);

  tokenContract.options.data = bytecode;

  return tokenContract.deploy({ arguments: args }).send({ from: account.address, gas: 2000000, });
}

run();