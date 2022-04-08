import React, { useState } from "react";
import { Buffer } from "buffer";
import "./App.css";
import bs58 from "./bs58.bundle";
import { keccak256 } from "js-sha3";
import { CopyToClipboard } from "react-copy-to-clipboard";

const namehash = require("eth-ens-namehash");

window.Buffer = Buffer;
function App() {
  const [namehashInput, setNamehashInput] = useState("");
  const [namehashResult, setNamehash] = useState("");

  const [keccakInput, setKeccakInput] = useState("");
  const [keccak, setKeccak] = useState("");

  const [contenHashInput, setContentHashInput] = useState("");
  const [contentHashResult, setContentHashResult] = useState("");

  const genNamehash = () => {
    setNamehash(namehash.hash(namehashInput));
  };

  const genKeccak = () => {
    setKeccak("0x" + keccak256(keccakInput));
  };

  const genContentHash = () => {
    const matched =
      contenHashInput.match(/^(ipfs|ipns|bzz|onion|onion3):\/\/(.*)/) ||
      contenHashInput.match(/\/(ipfs)\/(.*)/) ||
      contenHashInput.match(/\/(ipns)\/(.*)/);

    if (matched && matched.length > 0) {
      // const contentType = matched[1];
      const content = matched[2];
      /* @ts-ignore */
      const bs58content = bs58.encode(
        Buffer.concat([Buffer.from([0, content.length]), Buffer.from(content)])
      );

      const ensContentHash =
        /* @ts-ignore */
        "0x" + window.contentHash.encode("ipns-ns", bs58content);
      setContentHashResult(ensContentHash);
    }
  };

  return (
    <div className="App">
      <h1>ENS Toolbelt</h1>
      <section>
        <h2>Namehash</h2>
        <p>
          ENS uses a specific hashing algo to encode node names (e.g.
          abi.gnosisguild.eth).
        </p>
        <div>
          <label>ENS Node</label>
          <input
            value={namehashInput}
            onChange={(e) => setNamehashInput(e.target.value)}
          />
        </div>
        <button onClick={genNamehash}>Generate Namehash</button>
        {namehashResult && (
          <CopyToClipboard text={namehashResult}>
            <div>
              <label>Click to copy</label>
              <div className="result">
                <p>{namehashResult}</p>
              </div>
            </div>
          </CopyToClipboard>
        )}
      </section>
      <section>
        <h2>Keccak256</h2>
        <p>
          When setting a subdomain, the name must be encoded using Keccak256.
        </p>
        <div>
          <label>Subdomain</label>
          <input
            value={keccakInput}
            onChange={(e) => setKeccakInput(e.target.value)}
          />
        </div>
        <button onClick={genKeccak}>Generate Keccak256</button>
        {keccak && (
          <CopyToClipboard text={keccak}>
            <div>
              <label>Click to copy</label>
              <div className="result">
                <p>{keccak}</p>
              </div>
            </div>
          </CopyToClipboard>
        )}
      </section>
      <section>
        <h2>IPNS Content Hash</h2>
        <p>
          When setting the content hash for a Node, it must be encoded using the
          EIP-1577 standard.
        </p>
        <div>
          <label>Content</label>
          <input
            value={contenHashInput}
            onChange={(e) => setContentHashInput(e.target.value)}
          />
        </div>
        <button onClick={genContentHash}>Generate Content Hash</button>
        {contentHashResult && (
          <CopyToClipboard text={contentHashResult}>
            <div>
              <label>Click to copy</label>
              <div className="result">
                <p>{contentHashResult}</p>
              </div>
            </div>
          </CopyToClipboard>
        )}
      </section>
    </div>
  );
}

export default App;
