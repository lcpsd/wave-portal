async function main(){

    // gets owner, and random person thats calling the contract
    const [owner, randomPerson] = await hre.ethers.getSigners()

    // Compile the current contract
    const waveContractFactory = await hre.ethers.getContractFactory('WavePortal')

    // Do deploy of contract in a temp blockchain
    const waveContract = await waveContractFactory.deploy()

    // Wait to check deploy
    await waveContract.deployed()

    // Show address where contract has deployed
    console.log("Contract deployed to:", waveContract.address)
    console.log("Contract Deployed by:", owner.address)

    // Call wave function coneccting caller and the contract, and wait your execution
    waveTxn = await waveContract.connect(randomPerson).wave();
    await waveTxn.wait()

    //Calls public function getTotalWaves
    await waveContract.getTotalWaves()

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