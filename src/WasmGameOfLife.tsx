import { useEffect, useState } from "react";

type WasmGameOfLifeProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wasm: any;
}
export const WasmGameOfLife = ({ wasm } : WasmGameOfLifeProps) => {
  const size = 100;

  const [matrix, setMatrix] = useState<number[][]>(Array.from({ length: size }, (_, row) => 
    Array.from({ length: size }, (_, col) => 
      (row === 10 && col === 14) || 
      (row === 11 && col === 15) || 
      (row === 12 && (col === 13 || col === 14 || col === 15)) ? 1 : 0
    ))

  );
  const measureMemory = () => {
    if (performance.memory) {
      console.log("JS Heap Used:", performance.memory.usedJSHeapSize);
      console.log("JS Heap Total:", performance.memory.totalJSHeapSize);
    }
  };

  useEffect(() => {
    if (!wasm) return;

    // const flatMatrix = new Uint8Array(size * size);
    // for (let i = 0; i < size; i++) {
    //   for (let j = 0; j < size; j++) {
    //     flatMatrix[i * size + j] = matrix[i][j];
    //   }
    // }

    // Allocate memory in Wasm and copy the flat matrix
    // const wasmMemory = new Uint8Array(wasm.memory.buffer);
    // const wasmMatrixPtr = wasm._malloc(size * size);
    // wasmMemory.set(flatMatrix, wasmMatrixPtr);

    // const start = performance.now();
    // wasm.gameOfLifeLoop(wasmMatrixPtr, size, 10000);
    // const end = performance.now();
    // console.log(`WASM Game of Life took ${end - start}ms to update the board`);

    // // Copy the result back to JavaScript
    // const updatedFlatMatrix = wasmMemory.slice(wasmMatrixPtr, wasmMatrixPtr + size * size);
    // const updatedMatrix: number[][] = [];
    // for (let i = 0; i < size; i++) {
    //   const row: number[] = [];
    //   for (let j = 0; j < size; j++) {
    //     row.push(updatedFlatMatrix[i * size + j]);
    //   }
    //   updatedMatrix.push(row);
    // }

    // // Free the allocated memory in Wasm
    // wasm._free(wasmMatrixPtr);
    // setMatrix(updatedMatrix);
    const size = 20;
    const jsMatrix = Array.from({ length: size }, (_, row) => 
      Array.from({ length: size }, (_, col) => 
        (row === 10 && col === 14) || 
        (row === 11 && col === 15) || 
        (row === 12 && (col === 13 || col === 14 || col === 15)) ? 1 : 0
      ));
    setMatrix(jsMatrix);
  }, [wasm]);

  const updateBoard = () => {
    if (!wasm || matrix.length === 0) return;

    const wasmMatrix = new wasm.VectorVectorInt();
    for (const row of matrix) {
      const wasmRow = new wasm.VectorInt();
      row.forEach((num) => wasmRow.push_back(num));
      wasmMatrix.push_back(wasmRow);
    }

    measureMemory();
    const start = performance.now();
    // for (let i = 0; i < 100000; i++) {
      wasm.gameOfLife(wasmMatrix);
    // }
    // wasm.gameOfLifeLoop(wasmMatrix, 100000);
    const end = performance.now();
    measureMemory();
    console.log(`WASM Game of Life took ${end - start}ms to update the board`);

    const updatedMatrix: number[][] = [];
    for (let i = 0; i < wasmMatrix.size(); i++) {
      const wasmRow = wasmMatrix.get(i);
      const row: number[] = [];
      for (let j = 0; j < wasmRow.size(); j++) {
        row.push(wasmRow.get(j));
      }
      updatedMatrix.push(row);
    }

    setMatrix(updatedMatrix);
  }

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${matrix[0]?.length || 0}, 30px)`,
          gap: "3px",
        }}
      >
        {matrix.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: "30px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: cell === 1 ? "black" : "white",
                color: cell === 1 ? "white" : "black",
                border: "1px solid #ddd",
                fontSize: "16px",
              }}
            >
              {cell}
            </div>
          ))
        )}
      </div>
      <button onClick={updateBoard} style={{ marginTop: "10px", padding: "10px" }}>
        Next Step
      </button>
    </div>
  );
}