async function testMessages(){

    // get contract
    const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');

    // deploy on local network
    const waveContract = await waveContractFactory.deploy();

    // wait deploy finish
    await waveContract.deployed();
    console.log('Contract address:', waveContract.address);

    let waveCount;
    waveCount = await waveContract.getTotalWaves();

    // call function wave and send a message like deployer
    let waveTxn = await waveContract.wave('A message!');
    await waveTxn.wait(); // Wait for the transaction to be mined

    const [deployer, randomPerson] = await hre.ethers.getSigners()

    // call function wave and send a message like random person
    waveTxn = await waveContract.connect(randomPerson).wave('Another message!');
    await waveTxn.wait(); // Wait for the transaction to be mined

    // Get all waves
    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);

}

async function testPrizes(){
    const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther('0.1'),
    });
    await waveContract.deployed();
    console.log('Contract addy:', waveContract.address);

    /*
    * Get Contract balance
    */
    let contractBalance = await hre.ethers.provider.getBalance(
        waveContract.address
    );
    console.log(
        'Contract balance:',
        hre.ethers.utils.formatEther(contractBalance)
    );

    /*
    * Send Wave
    */
    let waveTxn = await waveContract.wave('A message!');
    await waveTxn.wait();

    /*
    * Get Contract balance to see what happened!
    */
    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log(
        'Contract balance:',
        hre.ethers.utils.formatEther(contractBalance)
    );

    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);
}

async function draw(){
    const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
    const waveContract = await waveContractFactory.deploy({
      value: hre.ethers.utils.parseEther('0.1'),
    });
    await waveContract.deployed();
    console.log('Contract addy:', waveContract.address);
  
    let contractBalance = await hre.ethers.provider.getBalance(
      waveContract.address
    );
    console.log(
      'Contract balance:',
      hre.ethers.utils.formatEther(contractBalance)
    );
  
    /*
     * Let's try two waves now
     */
    const waveTxn = await waveContract.wave('This is wave #1');
    await waveTxn.wait();
  
    const waveTxn2 = await waveContract.wave('This is wave #2');
    await waveTxn2.wait();
  
    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log(
      'Contract balance:',
      hre.ethers.utils.formatEther(contractBalance)
    );
  
    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);
}

// Run contract with errors handle
async function runMain(){
    try{
        await draw()
        process.exit(0)
    }catch (error){
        console.log(error)
        process.exit(1)
    }
}

runMain()