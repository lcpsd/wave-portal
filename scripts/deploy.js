async function main(){
    // Gets Deployer Address and Balance
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();
  
    console.log('Deploying contracts with account: ', deployer.address);
    console.log('Account balance: ', accountBalance.toString());
    
    // Get contract and deploy
    const contract = await hre.ethers.getContractFactory('WavePortal');

    // deploy contract
    const contractDeployed = await contract.deploy();

    await contractDeployed.deployed();
    
    // show contract address
    console.log('WavePortal address: ', contractDeployed.address);
  };
  
  async function runMain(){
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };
  
  runMain();