import { useState } from "react";
import { gameOfLife } from "./gameOfLife"; // Import the TS implementation

export const GameOfLifeBoard = () => {
  const [matrix, setMatrix] = useState<number[][]>([
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
  ]);

  const updateBoard = () => {
    const start = performance.now(); // start timing
    setMatrix((prevMatrix) => gameOfLife(prevMatrix)); // Apply TS Game of Life
    const end = performance.now(); // end timing
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