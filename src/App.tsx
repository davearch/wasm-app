import { useEffect, useState } from 'react';
import { loadWasm } from './utils/wasm';
import './App.css'
import { WasmGameOfLife } from './WasmGameOfLife';
import { GameOfLifeBoard } from './JsGameOfLife';

function App() {
  const [result, setResult] = useState<number | null>(null);
  const [loadedWasm, setLoadedWasm] = useState<any | null>(null);
  const [useWasm, setUseWasm] = useState(false);

  useEffect(() => {
    async function initWasm() {
      const wasm = await loadWasm();
      const version = wasm.wasmVersion();
      setResult(version);
      setLoadedWasm(wasm);
    }
    initWasm();
  }, []);

  return (
    <div>
      <h1>WASM in React</h1>
      <p>Version: {result !== null ? result : "Loading..."}</p>
      <h2>Game of Life</h2>
      {loadedWasm && (
        <>
          <label className="flex items-center gap-2 mb-2">
            <span className={`${!useWasm ? 'underline font-bold' : ''}`}>TypeScript Game of Life</span>
            <input type="checkbox" checked={useWasm} onChange={() => setUseWasm(!useWasm)} />
            <span className={`${useWasm ? 'underline font-bold': ''}`}>WASM Game of Life</span>
          </label>
          {useWasm ? <WasmGameOfLife wasm={loadedWasm} /> : <GameOfLifeBoard />}
        </>
      )}
      
    </div>
  );
  
}

export default App
