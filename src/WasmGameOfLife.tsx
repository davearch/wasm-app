import { useEffect, useState } from "react";

type WasmGameOfLifeProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wasm: any;
}
export const WasmGameOfLife = ({ wasm } : WasmGameOfLifeProps) => {
  const size = 100;
  const totalCells = size * size;
  const cellSize = 4; // Int32Array (4 bytes per cell)

  const [memoryPointer, setMemoryPointer] = useState<number | null>(null);
  const [wasmMemory, setWasmMemory] = useState<Int32Array | null>(null);

  useEffect(() => {
    if (!wasm) return;

    const ptr = wasm._malloc(totalCells * cellSize);
    setMemoryPointer(ptr);

    const memoryView = new Int32Array(wasm.HEAP32.buffer, ptr, totalCells);
    setWasmMemory(memoryView);

    // Set glider
    for (let i = 0; i < totalCells; i++) memoryView[i] = 0;
    memoryView[10 * size + 14] = 1;
    memoryView[11 * size + 15] = 1;
    memoryView[12 * size + 13] = 1;
    memoryView[12 * size + 14] = 1;
    memoryView[12 * size + 15] = 1;
    return () => {
      if (memoryPointer) wasm._free(memoryPointer);
    };
  }, [wasm]);

  const updateBoard = () => {
    if (!wasm || !wasmMemory || memoryPointer === null) return;

    const start = performance.now();
    wasm.optimizedGameOfLife(memoryPointer, size);
    const end = performance.now();
    console.log(`Wasm Game of Life took ${end - start}ms`);

    setWasmMemory(new Int32Array(wasm.HEAP32.buffer, memoryPointer, totalCells));
  }

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${size}, 30px)`,
          gap: "3px",
        }}
      >
        {wasmMemory && 
          Array.from({length: size}, (_, row) =>
            Array.from({length: size}, (_, col) => (
              <div
              key={`${row}-${col}`}
              style={{
                width: "30px",
                height: "30px",
                backgroundColor: wasmMemory[row * size + col] === 1 ? "black" : "white",
                border: "1px solid #ddd",
              }}
            />
            )))}
      </div>
      <button onClick={updateBoard} style={{ marginTop: "10px", padding: "10px" }}>
        Next Step
      </button>
    </div>
  );
}