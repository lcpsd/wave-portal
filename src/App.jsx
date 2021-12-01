import './global.scss'
import { Home } from './pages/Home'
import metamaskLogo from './assets/metamask-logo.png'

export default function App(){
  
  return(
    <>
      {
        window.ethereum && <Home ethereum={window.ethereum}/>
      }

      {
        !window.ethereum &&
        <section>
          <img src={metamaskLogo} alt="" />
          <h2>Metamask Needed!</h2>
          <p>Metamask is needed in order to interact with this application. Please, install.</p>
        </section>
      }
    </>
  )
}