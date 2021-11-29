async function main(){

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

// Run contract with errors handle
async function runMain(){
    try{
        await main()
        process.exit(0)
    }catch (error){
        console.log(error)
        process.exit(1)
    }
}

runMain()