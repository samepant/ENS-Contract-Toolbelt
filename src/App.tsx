import React, {useState} from 'react';
import {Buffer} from 'buffer';
import './App.css';
import bs58 from './bs58.bundle'
import { keccak256 } from 'js-sha3';
import {CopyToClipboard} from 'react-copy-to-clipboard';

const namehash = require('eth-ens-namehash');

window.Buffer = Buffer;
function App() {
  const [namehashInput, setNamehashInput] = useState('')
  const [namehashResult, setNamehash] = useState('')

  const [keccakInput, setKeccakInput] = useState('')
  const [keccak, setKeccak] = useState('')

  const [contenHashInput, setContentHashInput] = useState('')
  const [contentHashResult, setContentHashResult] = useState('')

  const genNamehash = () => {
    setNamehash(namehash.hash(namehashInput))
  }

  const genKeccak = () => {
    setKeccak('0x' + keccak256(keccakInput))
  }

  const genContentHash = () => {
    const matched = contenHashInput.match(/^(ipfs|ipns|bzz|onion|onion3):\/\/(.*)/) || contenHashInput.match(/\/(ipfs)\/(.*)/) || contenHashInput.match(/\/(ipns)\/(.*)/)
    
    if (matched && matched.length > 0) {
    
      const contentType = matched[1]
      const content = matched[2]
      console.log(content)
      /* @ts-ignore */
      const bs58content = bs58.encode(
        Buffer.concat([
          Buffer.from([0, content.length]),
          Buffer.from(content)
        ]))

        console.log(bs58content)

        /* @ts-ignore */
      const ensContentHash = '0x' + window.contentHash.encode('ipns-ns', bs58content)
      setContentHashResult(ensContentHash)
    }
  }

  return (
    <div className="App">
      <h1>ENS Toolbelt</h1>
      <section>
        <h2>Namehash</h2>
        <p>ENS uses a specific hashing algo to encode node names (e.g. abi.gnosisguild.eth).</p>
        <label>ENS Node</label>
        <input value={namehashInput} onChange={(e) => setNamehashInput(e.target.value)} />
        <button onClick={genNamehash}>Generate Namehash</button>
        {namehashResult &&
          <div className='result'>
            <CopyToClipboard text={namehashResult}>
            <p>{namehashResult}</p>
            </CopyToClipboard>
          </div>
        }
      </section>
      <section>
        <h2>Keccak256</h2>
        <p>When setting a subdomain, the name must be encoded using Keccak256.</p>
        <label>Subdomain</label>
        <input value={keccakInput} onChange={(e) => setKeccakInput(e.target.value)} />
        <button onClick={genKeccak}>Generate Keccak256</button>
        {keccak &&
          <div className='result'>
            <CopyToClipboard text={keccak}>
            <p>{keccak}</p>
            </CopyToClipboard>
          </div>
        }
      </section>
      <section>
        <h2>IPNS Content Hash</h2>
        <p>When setting the content hash for a Node, it must be encoded using the EIP-1577 standard.</p>
        <label>Content</label>
        <input value={contenHashInput} onChange={(e) => setContentHashInput(e.target.value)} />
        <button onClick={genContentHash}>Generate Content Hash</button>
        {contentHashResult &&
          <div className='result'>
            <CopyToClipboard text={contentHashResult}>
            <p>{contentHashResult}</p>
            </CopyToClipboard>
          </div>
        }
      </section>
    </div>
  );
}

export default App;
