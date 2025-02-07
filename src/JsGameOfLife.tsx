import { useState } from "react";
import { gameOfLife } from "./gameOfLife"; // Import the TS implementation

export const GameOfLifeBoard = () => {
  const size = 20;
  const measureMemory = () => {
    if (performance.memory) {
      console.log("JS Heap Used:", performance.memory.usedJSHeapSize);
      console.log("JS Heap Total:", performance.memory.totalJSHeapSize);
    }
  };

  const [matrix, setMatrix] = useState<number[][]>(Array.from({ length: size }, (_, row) => 
    Array.from({ length: size }, (_, col) => 
      (row === 10 && col === 14) || 
      (row === 11 && col === 15) || 
      (row === 12 && (col === 13 || col === 14 || col === 15)) ? 1 : 0
    )));

  const updateBoard = () => {
    measureMemory();
    const start = performance.now(); // start timing
    // for (let i = 0; i < 100000; i++) {
      setMatrix((prevMatrix) => gameOfLife(prevMatrix)); // Apply TS Game of Life
    // }
    const end = performance.now(); // end timing
    measureMemory();
    console.log(`TypeScript Game of Life took ${end - start}ms to update the board`);
  };

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${matrix[0].length}, 30px)`,
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
};