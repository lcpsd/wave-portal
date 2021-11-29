// lib to interact with smart contracts
import { ethers } from 'ethers';
import {useEffect, useState} from 'react'
import {toast} from 'react-toastify';
import {abi} from './artifacts/src/contracts/WavePortal.sol/WavePortal.json'
import 'react-toastify/dist/ReactToastify.css';
import './global.scss'

toast.configure()

function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [totalWaves, setTotalWaves] = useState(0)
  const [allWaves, setAllWaves] = useState([])
  const [waveMessage, setWaveMesssage] = useState("")

  // ethereum object injected by metamask in window
  const {ethereum} = window
  const contractAddress = '0xf41de70B3e43651Af6ac3BDC58815221Ee962Da0'
  const contractAbi = abi

  // creates a provider to intereact with ethereum blockchain if has ethereum wallet
  let provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner();
  const wavePortalContract = new ethers.Contract(contractAddress, contractAbi, signer);

  async function connectWallet(){
    try{
      
      if(!ethereum){
        toast.warning('Metamask Needed!', {autoClose: false})
        return
      }

      // Request account authorization
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      //  Store Account
      setCurrentAccount(accounts[0])
      toast.success('Authorized!')

    }catch(error){
      console.log(error)
    }
  }

  async function getWaveCount(){
    try{
      
      if(ethereum){

        // gets the sign of our provider (origin and integrity data)
        const signer = provider.getSigner()

        const wavePortalContract = new ethers.Contract(contractAddress, contractAbi, signer)

        setTotalWaves(Number(await wavePortalContract.getTotalWaves()))

        return
      }

      toast.warning('Metamask Needed!', {autoClose: false})

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

    setAllWaves(allWavesArray)

    }
  async function wave(){
    try{
      
      if(ethereum){
        // gets the sign of our provider (origin and integrity data)

        const waveTxn = await wavePortalContract.wave(waveMessage);

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
      }

      toast.warning('Metamask Needed!', {autoClose: false})

    }catch(error){
      console.log(error)
    }
  }
  
  async function checkWalletConnection(){
    // pick account if have one logged
    try{

      // checks if metamask is installed
      if(ethereum){

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

      }else{
        toast.warning('Metamask Needed!', {autoClose: false})
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
    getWaveCount()
    checkWalletConnection()
    getAllWaves()
    // eslint-disable-next-line
  }, [])

  return (
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
      {allWaves.map((wave, index) => {
          return (
            <div key={index} className="waveCard">
              
              <p className="address">
                <span>Address:</span> {wave.address}
              </p>

              <div className="message">
                <span>Message:</span> {wave.message}
              </div>

              <div className="timestamp">
                <span>Time:</span> {wave.timestamp.toString()}
              </div>

            </div>)
        })}
      </div>

    </div>
  );
}

export default App;
