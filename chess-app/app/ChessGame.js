"use client";

import { useMemo, useState, useCallback, Fragment } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

const PIECE_UNICODE = {
  wp: "\u2659", wn: "\u2658", wb: "\u2657", wr: "\u2656", wq: "\u2655", wk: "\u2654",
  bp: "\u265F", bn: "\u265E", bb: "\u265D", br: "\u265C", bq: "\u265B", bk: "\u265A",
};

export default function ChessGame() {
  const [game, setGame] = useState(() => new Chess());
  const [fen, setFen] = useState(game.fen());
  const [history, setHistory] = useState([]);
  const [orientation, setOrientation] = useState("white");
  const [moveSquares, setMoveSquares] = useState({});
  const [captured, setCaptured] = useState({ w: [], b: [] });

  const applyGame = useCallback((next) => {
    setGame(next);
    setFen(next.fen());
    setHistory(next.history({ verbose: true }));
  }, []);

  const recomputeCaptured = useCallback((g) => {
    const caps = { w: [], b: [] };
    g.history({ verbose: true }).forEach((m) => {
      if (m.captured) {
        // capturing color gains the opponent piece
        const takenColor = m.color === "w" ? "b" : "w";
        caps[m.color].push(takenColor + m.captured);
      }
    });
    setCaptured(caps);
  }, []);

  const makeMove = useCallback((move) => {
    const next = new Chess(game.fen());
    let result = null;
    try {
      result = next.move(move);
    } catch (e) {
      return false;
    }
    if (result === null) return false;
    applyGame(next);
    recomputeCaptured(next);
    return true;
  }, [game, applyGame, recomputeCaptured]);

  const onDrop = useCallback((source, target) => {
    const ok = makeMove({ from: source, to: target, promotion: "q" });
    setMoveSquares({});
    return ok;
  }, [makeMove]);

  const onSquareClick = useCallback((square) => {
    const moves = game.moves({ square, verbose: true });
    if (moves.length === 0) { setMoveSquares({}); return; }
    const highlights = {};
    moves.forEach((m) => {
      highlights[m.to] = {
        background:
          "radial-gradient(circle, rgba(124,92,255,0.55) 26%, transparent 30%)",
        borderRadius: "50%",
      };
    });
    highlights[square] = { background: "rgba(34,211,238,0.25)" };
    setMoveSquares(highlights);
  }, [game]);

  const reset = useCallback(() => {
    const fresh = new Chess();
    applyGame(fresh);
    setCaptured({ w: [], b: [] });
    setMoveSquares({});
  }, [applyGame]);

  const undo = useCallback(() => {
    const next = new Chess(game.fen());
    next.undo();
    // rebuild by replaying from scratch to keep state consistent
    const replay = new Chess();
    const verbose = game.history({ verbose: true });
    verbose.slice(0, -1).forEach((m) => replay.move(m));
    applyGame(replay);
    recomputeCaptured(replay);
    setMoveSquares({});
  }, [game, applyGame, recomputeCaptured]);

  const flip = useCallback(() => {
    setOrientation((o) => (o === "white" ? "black" : "white"));
  }, []);

  const status = useMemo(() => {
    if (game.isCheckmate()) {
      const winner = game.turn() === "w" ? "Black" : "White";
      return { dot: "win", label: "Game Over", value: `Checkmate — ${winner} wins` };
    }
    if (game.isStalemate()) return { dot: "warn", label: "Game Over", value: "Stalemate — Draw" };
    if (game.isDraw()) return { dot: "warn", label: "Game Over", value: "Draw" };
    if (game.isCheck()) {
      const who = game.turn() === "w" ? "White" : "Black";
      return { dot: "warn", label: "Check!", value: `${who} to move` };
    }
    const who = game.turn() === "w" ? "White" : "Black";
    return { dot: game.turn() === "w" ? "white" : "black", label: "Turn", value: `${who} to move` };
  }, [game, fen]);

  const grouped = useMemo(() => {
    const rows = [];
    for (let i = 0; i < history.length; i += 2) {
      rows.push({
        num: i / 2 + 1,
        white: history[i]?.san,
        black: history[i + 1]?.san,
      });
    }
    return rows;
  }, [history]);

  const boardWidth = 520;

  return (
    <div className="layout">
      <div className="board-card">
        <div className="board-wrap">
          <Chessboard
            id="StyledBoard"
            position={fen}
            onPieceDrop={onDrop}
            onSquareClick={onSquareClick}
            boardOrientation={orientation}
            boardWidth={boardWidth}
            customSquareStyles={moveSquares}
            customBoardStyle={{ borderRadius: "10px", boxShadow: "0 8px 30px rgba(0,0,0,0.4)" }}
            customDarkSquareStyle={{ backgroundColor: "#6b5cff" }}
            customLightSquareStyle={{ backgroundColor: "#e9e8ff" }}
            animationDuration={200}
          />
        </div>
        <p className="hint">Drag a piece or tap it to see legal moves. Pawns auto-promote to a queen.</p>
      </div>

      <div className="panel">
        <div className="status">
          <span className={`dot ${status.dot}`}></span>
          <div>
            <div className="label">{status.label}</div>
            <div className="value">{status.value}</div>
          </div>
        </div>

        <div className="captured-row">
          <span className="cap-label">White captured</span>
          <div className="captured-pieces">
            {captured.w.map((p, i) => (
              <span key={i}>{PIECE_UNICODE[p]}</span>
            ))}
          </div>
          <span className="cap-label">Black captured</span>
          <div className="captured-pieces">
            {captured.b.map((p, i) => (
              <span key={i}>{PIECE_UNICODE[p]}</span>
            ))}
          </div>
        </div>

        <div>
          <span className="cap-label">Move history</span>
          <div className="moves" style={{ marginTop: 8 }}>
            {grouped.length === 0 && <span className="moves-empty">No moves yet.</span>}
            {grouped.map((r) => (
              <Fragment key={r.num}>
                <span className="mv-num">{r.num}.</span>
                <span className="mv">{r.white || ""}</span>
                <span className="mv">{r.black || ""}</span>
              </Fragment>
            ))}
          </div>
        </div>

        <div className="btn-row">
          <button className="btn" onClick={undo}>Undo</button>
          <button className="btn" onClick={flip}>Flip</button>
        </div>
        <div className="btn-row">
          <button className="btn primary" onClick={reset}>New Game</button>
        </div>
      </div>
    </div>
  );
}
