const Web3 = require('web3');
const fs = require('fs');

const selectedHost = 'http://127.0.0.1:7545';

const acount = {
  address: '0x6D2D0C8d05D39B96FEf53a74B61e9974C0029a00',
  key:'79f6211271c58baf8f2eb17651881a935584e845f06589dcfde811269f00c3ca'
};

const balancesheet = {
  '0xBFc79d03a9B592F93edb677e7815F9DA41C14475': 1000,
  '0xF215e07458aa6ad6472961Ec407FAEDb65E5188C': 2000,
  '0x422d16efDB1F60379E82a0a5EC8A71C35334790D': 3000,
  '0x7158d92Ac4dbAd955E01DDa0a3b0b014224D055e': 4000,
  '0x0AEDACa4451B87DB1704b9379f544785b46E2f02': 5000
};


const web3 = new Web3(new Web3.providers.HttpProvider(selectedHost));

deployContract('./build/contracts/CappedMintableToken.json', acount, [1000000])
.then(CappedMintableToken=>{
  console.log(CappedMintableToken.options.address);
  deployContract('./build/contracts/TokenDistribution.json', acount, [CappedMintableToken.options.address])
  .then(TokenDistribution=>{
    CappedMintableToken.methods.mint(CappedMintableToken.options.address, 100000).send({from: acount.address});
    TokenDistribution.methods.distribute(['0xBFc79d03a9B592F93edb677e7815F9DA41C14475'],[1000]).send({from: acount.address})
    .catch(err=>{
      console.log(err);
    })
  });
  
});


function deployContract(contractPath, acount, args){
  return new Promise((resolve,reject)=>{
    // Read the JSON file contents
    let contractJsonContent = fs.readFileSync(contractPath, 'utf8');    
    let jsonOutput = JSON.parse(contractJsonContent);
    
    // Retrieve the ABI 
    let abi = jsonOutput.abi;
    
    let bytecode = jsonOutput.bytecode;
    // console.log(bytecode);
    
    let tokenContract = web3.eth.Contract(abi);
    
    tokenContract.options.data = bytecode;
    
    tokenContract.deploy({
      arguments: args
    })
    .send({
      from: acount.address,
      gas: 2000000,
    })
    .then((newContractInstance) => {
      resolve(newContractInstance);
    }).catch(err=>{
      console.log(err);
    });
  });
}

