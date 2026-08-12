// Convert a chess.js board() 2D array into a lookup keyed by rank/file
// so the ChessBoard component can access board[rank][file] directly.
export function toBoardMap(chess) {
  const grid = chess.board(); // array of 8 rows, top rank 8 -> index 0
  const map = {};
  for (let r = 0; r < 8; r++) {
    const rank = 8 - r;
    map[rank] = {};
    for (let f = 0; f < 8; f++) {
      const file = "abcdefgh"[f];
      const cell = grid[r][f];
      map[rank][file] = cell ? { color: cell.color, type: cell.type } : null;
    }
  }
  return map;
}

export function findKingSquare(chess, color) {
  const grid = chess.board();
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const cell = grid[r][f];
      if (cell && cell.type === "k" && cell.color === color) {
        return "abcdefgh"[f] + (8 - r);
      }
    }
  }
  return null;
}

const PIECE_VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9 };

// Compute material advantage and captured pieces from move history
export function computeCaptures(chess) {
  const history = chess.history({ verbose: true });
  const captured = { w: [], b: [] }; // pieces captured BY that color
  let score = 0; // positive = white ahead
  for (const m of history) {
    if (m.captured) {
      const byColor = m.color; // color that made the capture
      captured[byColor].push(m.captured);
      const val = PIECE_VALUE[m.captured] || 0;
      score += byColor === "w" ? val : -val;
    }
  }
  return { captured, score };
}
