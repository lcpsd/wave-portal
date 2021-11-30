async function main(){
    // Gets Deployer Address and Balance
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();
  
    console.log('Deploying contracts with account: ', deployer.address);
    console.log('Account balance: ', accountBalance.toString());
    
    // Get contract and deploy
    const contract = await hre.ethers.getContractFactory('WavePortal');

    // start deploy contract process
    const contractDeployed = await contract.deploy();

    // wait deploy finish
    await contractDeployed.deployed();
    
    // show contract address
    console.log('WavePortal address: ', contractDeployed.address);
  };

async function refund(){
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.001'),
  });

  await waveContract.deployed();

  console.log('WavePortal address: ', waveContract.address);
}

  async function runMain(){
    try {
      await refund();
      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };
  
  runMain();