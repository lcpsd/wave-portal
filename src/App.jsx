// lib to interact with smart contracts
import { ethers } from 'ethers';
import {useEffect, useState} from 'react'
import {toast} from 'react-toastify';
import {abi} from './artifacts/contracts/WavePortal.sol/WavePortal.json'
import 'react-toastify/dist/ReactToastify.css';
import './global.scss'

toast.configure()

function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [totalWaves, setTotalWaves] = useState(0)

  // ethereum object injected by metamask in window
  const {ethereum} = window
  const contractAddress = '0x44eA35Ca8DA3d9298e5c1F6B9692E1917537993A'
  const contractAbi = abi
  // creates a provider to intereact with ethereum blockchain
  let provider = new ethers.providers.Web3Provider(ethereum)

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

  async function wave(){
    try{
      
      if(ethereum){
        // gets the sign of our provider (origin and integrity data)
        const signer = provider.getSigner()

        const wavePortalContract = new ethers.Contract(contractAddress, contractAbi, signer)

        const waveTxn = await wavePortalContract.wave();
        toast.info(`Mining...\n ${waveTxn.hash}`)

        await waveTxn.wait();
        toast.success((
          <a href={`https://rinkeby.etherscan.io/tx/${waveTxn.hash}`} target="_blank" rel="noreferrer">
            Click to view on Etherscan 
          </a>
        ))

        setTotalWaves(Number(await wavePortalContract.getTotalWaves()))

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

  useEffect(() => {
    getWaveCount()
    checkWalletConnection()
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

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {/* Only render if no has account authorized */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
