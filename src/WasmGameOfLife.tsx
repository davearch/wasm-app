import { useEffect, useState } from "react";

type WasmGameOfLifeProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wasm: any;
}
export const WasmGameOfLife = ({ wasm } : WasmGameOfLifeProps) => {
  const [matrix, setMatrix] = useState<number[][]>([]);

  useEffect(() => {
    if (!wasm) return;
    const jsMatrix = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

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

    const start = performance.now();
    wasm.gameOfLife(wasmMatrix);
    const end = performance.now();
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