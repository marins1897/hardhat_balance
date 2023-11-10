import { useEffect, useState } from 'react'
import getBlockchain from './ethereum.js';

function App() {
  const [token, setToken] = useState(undefined);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState();
  const [addressTo, setAddressTo] = useState('');
  const [amount, setAmount] = useState();

  useEffect(() => {
    const init = async () => {
      const { token, signerAddress } = await getBlockchain();
      setToken(token);
      setAddress(signerAddress);
    };
    init();
  }, []);

  async function balanceHandler() {
    if (token && address) {
      try {
        console.log(address)
        const myBalance = await token.balanceOf(address);
        const myBalanceBig = Number(myBalance._hex);
        setBalance(myBalanceBig);
      } catch (error) {
        console.error("Error getting balance:", error.message);
      }
    }
  }

  async function transferHandler() {
    if (token && addressTo && amount) { // Check if addressTo and amount are defined
      try {
        console.log(addressTo)
        console.log(amount)
        const tx = await token.transfer(addressTo, amount);
        console.log(tx);
        console.log(await token.balanceOf(address));
      } catch (error) {
        console.error("Error transfer:", error.message);
      }
    } else {
      console.error("Please provide both 'Address To' and 'Amount' to initiate the transfer.");
    }
  }

  if (typeof token === 'undefined') {
    return 'Loading...';
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', margin: '5vh 5vw' }}>
        <button onClick={balanceHandler} style={{ backgroundColor: 'goldenrod' }}> Get My Balance </button>
        <div style={{  margin : '0 2vw', border: '2px solid gray', borderRadius: '10px' }}>
          <p style={{ color: 'yellow', fontWeight: 'bold', fontSize: '22px', justifyContent: 'center', textAlign: 'center' }}> {balance}  </p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', margin: '5vh 5vw' }}>
        
        
      <input type='text' value={addressTo} onChange={(event) => setAddressTo(event.target.value)} placeholder='Address To:' style={{ border: '2px solid gray', borderRadius: '10px',  padding : '1vh 1vw', margin : '0 2vw' }}/>
      <input type='number' value={amount} onChange={(event) => setAmount(event.target.value)} placeholder='Amount:' style={{ border: '2px solid gray', borderRadius: '10px', padding : '1vh 1vw', margin : '0 2vw' }}/>  

      <button onClick={transferHandler} style={{ backgroundColor: 'goldenrod', margin : '0 2vw' }}> Transfer Token to </button>
      </div>
    </>
  );
}

export default App;
