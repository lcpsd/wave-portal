// lib to interact with smart contracts
import { ethers } from 'ethers';
import {useEffect, useState} from 'react'
import {toast} from 'react-toastify';
import {abi} from '../artifacts/src/contracts/WavePortal.sol/WavePortal.json'
import 'react-toastify/dist/ReactToastify.css';
import './styles.scss'

toast.configure()

export function Home({ethereum}) {

  const [currentAccount, setCurrentAccount] = useState("");
  const [totalWaves, setTotalWaves] = useState(0)
  const [allWaves, setAllWaves] = useState([])
  const [waveMessage, setWaveMesssage] = useState("")
  const [allWavesLoading, setAllWavesLoading] = useState(false)

  // ethereum object injected by metamask in window
  const contractAddress = '0x632f50aCae8bC04dFE9c844cD899aE2854b053c8'
  const contractAbi = abi

  // creates a provider to intereact with ethereum blockchain if has ethereum wallet
  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner();
  let wavePortalContract = new ethers.Contract(contractAddress, contractAbi, signer);

  async function connectWallet(){
    try{
      // Request account authorization
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log(accounts)

      //  Store Account
      setCurrentAccount(accounts[0])
      toast.success('Authorized!')

    }catch(error){
      console.log(error)
    }
  }

  async function getWaveCount(){
    try{
      
        // gets the sign of our provider (origin and integrity data)
        const signer = provider.getSigner()

        const wavePortalContract = new ethers.Contract(contractAddress, contractAbi, signer)

        setTotalWaves(Number(await wavePortalContract.getTotalWaves()))

        return

    }catch(error){
      console.log(error)
    }
  }

  async function getAllWaves(){

    const waves = await wavePortalContract.getAllWaves();

    let allWavesArray = []
    waves.forEach(wave => {
      
      const splitDate = String(new Date(wave.timestamp * 1000)).split(' ')
      const shortAddress = String(wave.waver).slice(0,4) + '...'+ String(wave.waver).slice(-4)

      allWavesArray.push({
        address: shortAddress,
        timestamp: splitDate.slice(0, 5),
        message: wave.message
      })
    })

    setAllWaves((pasState => [...pasState, allWavesArray]))

    setAllWavesLoading(true)
  }
  
  async function wave(){
    try{
      
        // gets the sign of our provider (origin and integrity data)

        const waveTxn = await wavePortalContract.wave(waveMessage, {gasLimit: 300000});

        toast.info(`Mining...\n ${waveTxn.hash}`, {autoClose: 20000})

        await waveTxn.wait();
        toast.success((
          <a href={`https://rinkeby.etherscan.io/tx/${waveTxn.hash}`} target="_blank" rel="noreferrer">
            Click to view on Etherscan 
          </a>
        ), {autoClose: false})

        setTotalWaves(Number(await wavePortalContract.getTotalWaves()))
        getAllWaves()

        return

    }catch(error){
      console.log(error)
    }
  }
  
  async function checkWalletConnection(){
    // pick account if have one logged
    try{

      const accounts = await ethereum.request({method: 'eth_accounts'})

      // Checks if has an account authorized
      if(accounts.length !== 0){
        const account = accounts[0]
        setCurrentAccount(account)
        toast.success('Account Authorized')

      }else{
        toast.warning('No account authorized!', {autoClose: false})
        return
      }

    }catch(error){
      console.log(error)
    }
  }

  function handleWave(event){
    wave()
    setWaveMesssage("")
  }

  useEffect(() => {
    checkWalletConnection()
    
    if(currentAccount){
      getWaveCount()
      getAllWaves()
    }
    // eslint-disable-next-line
  }, [currentAccount])

  useEffect(() => {

    let wavePortalContract;

    const onNewWave = (from, timestamp, message) => {
      
      setAllWaves(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ])
    }

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()

      wavePortalContract = new ethers.Contract(contractAddress, contractAbi, signer)
      wavePortalContract.on('newWave', onNewWave)
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off('newWave', onNewWave)
      }
    };
    // eslint-disable-next-line 
  }, [])

  return (
    <>
      {/* {loading && 
        <div className="loading-screen">
          <h1>Loading...</h1>
        </div>
      } */}
      
      <div className="mainContainer">

      <div className="dataContainer">
        <h1>👋 Hey there!</h1>

        <div className="bio">
          I am Lucas! Connect your Ethereum wallet and wave at me!
        </div>

        <div className="wavesTotal">
          
        {totalWaves} {totalWaves < 2 ? "Wave" : "Waves"}
        </div>

        <textarea type="text" value={waveMessage} onChange={(event) => setWaveMesssage(event.target.value)}/>

        <button className="waveButton" onClick={handleWave} disabled={ethereum && waveMessage ? false : true}>
          Wave at Me
        </button>

        {/* Only render if no has account authorized */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

      </div>
        
      <div id="waveCards">
      <h1>Last Waves</h1>
      {allWavesLoading && allWaves[0].map((wave, index) => {
          return (
            <div key={index} className="waveCard">
              
              <p className="address">
                <span>Address:</span> {wave.address}
              </p>

              <div className="message">
                <span>Message:</span> {wave.message}
              </div>

              <div className="timestamp">
                <span>Time:</span> {wave.timestamp}
              </div>

            </div>)
        })}
      </div>

    </div>
    </>
  );
}
