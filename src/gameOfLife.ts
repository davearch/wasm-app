export function gameOfLife(board: number[][]): number[][] {
  const Z = 0;
  const P = 1;
  const N = -1;

  const directions = [
    { di: P, dj: Z },
    { di: P, dj: P },
    { di: Z, dj: P },
    { di: N, dj: P },
    { di: N, dj: Z },
    { di: N, dj: N },
    { di: Z, dj: N },
    { di: P, dj: N },
  ];

  const rows = board.length;
  const cols = board[0].length;

  // Create a copy of the board to avoid mutating the original
  const newBoard = board.map(row => [...row]);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (board[i][j] & 1) {
        for (const { di, dj } of directions) {
          const ni = i + di;
          const nj = j + dj;
          if (ni >= 0 && ni < rows && nj >= 0 && nj < cols) {
            newBoard[ni][nj] += 2;
          }
        }
      }
    }
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (newBoard[i][j] === 6) {
        newBoard[i][j] = 1; // Birth, no cell, three neighbors
      } else if (newBoard[i][j] & 1) {
        newBoard[i][j] = newBoard[i][j] >= 4 && newBoard[i][j] < 8 ? 1 : 0; // Keep living
      } else {
        newBoard[i][j] = 0; // No life
      }
    }
  }

  return newBoard;
}