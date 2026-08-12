"use client";

import { useCallback, useMemo, useState } from "react";
import { Chess } from "chess.js";
import ChessBoard from "../components/ChessBoard";
import { toBoardMap, findKingSquare, computeCaptures } from "../lib/chessHelpers";

const CAPTURE_GLYPH = {
  wp: "\u2659", wr: "\u2656", wn: "\u2658", wb: "\u2657", wq: "\u2655",
  bp: "\u265F", br: "\u265C", bn: "\u265E", bb: "\u265D", bq: "\u265B",
};

export default function Home() {
  const [game, setGame] = useState(() => new Chess());
  const [fen, setFen] = useState(game.fen());
  const [selected, setSelected] = useState(null);
  const [legalTargets, setLegalTargets] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [orientation, setOrientation] = useState("white");

  // derive display state from the current fen
  const view = useMemo(() => {
    const c = new Chess(fen);
    const board = toBoardMap(c);
    const turn = c.turn();
    const inCheck = c.inCheck();
    const checkSquare = inCheck ? findKingSquare(c, turn) : null;
    const { captured, score } = computeCaptures(c);
    let status = "";
    if (c.isCheckmate()) status = "checkmate";
    else if (c.isStalemate()) status = "stalemate";
    else if (c.isThreefoldRepetition()) status = "repetition";
    else if (c.isInsufficientMaterial()) status = "insufficient";
    else if (c.isDraw()) status = "draw";
    else if (inCheck) status = "check";
    else status = "playing";
    return { board, turn, checkSquare, captured, score, status, history: c.history({ verbose: true }) };
  }, [fen]);

  const gameOver = ["checkmate", "stalemate", "repetition", "insufficient", "draw"].includes(view.status);

  const handleSquareClick = useCallback(
    (square) => {
      if (gameOver) return;
      const c = new Chess(fen);

      // if a square is already selected, attempt a move
      if (selected) {
        if (square === selected) {
          setSelected(null);
          setLegalTargets([]);
          return;
        }
        const moves = c.moves({ square: selected, verbose: true });
        const target = moves.find((m) => m.to === square);
        if (target) {
          const move = c.move({ from: selected, to: square, promotion: "q" });
          if (move) {
            setFen(c.fen());
            setLastMove({ from: move.from, to: move.to });
            setSelected(null);
            setLegalTargets([]);
            return;
          }
        }
      }

      // otherwise, select a piece of the side to move
      const piece = c.get(square);
      if (piece && piece.color === c.turn()) {
        const moves = c.moves({ square, verbose: true });
        setSelected(square);
        setLegalTargets(moves.map((m) => m.to));
      } else {
        setSelected(null);
        setLegalTargets([]);
      }
    },
    [fen, selected, gameOver]
  );

  const reset = useCallback(() => {
    const c = new Chess();
    setGame(c);
    setFen(c.fen());
    setSelected(null);
    setLegalTargets([]);
    setLastMove(null);
  }, []);

  const undo = useCallback(() => {
    const c = new Chess(fen);
    const undone = c.undo();
    if (undone) {
      setFen(c.fen());
      setSelected(null);
      setLegalTargets([]);
      const hist = c.history({ verbose: true });
      const last = hist[hist.length - 1];
      setLastMove(last ? { from: last.from, to: last.to } : null);
    }
  }, [fen]);

  const flip = useCallback(() => {
    setOrientation((o) => (o === "white" ? "black" : "white"));
  }, []);

  const statusText = useMemo(() => {
    const mover = view.turn === "w" ? "White" : "Black";
    const winner = view.turn === "w" ? "Black" : "White";
    switch (view.status) {
      case "checkmate":
        return `Checkmate — ${winner} wins!`;
      case "stalemate":
        return "Stalemate — it's a draw.";
      case "repetition":
        return "Draw by threefold repetition.";
      case "insufficient":
        return "Draw — insufficient material.";
      case "draw":
        return "Draw by the fifty-move rule.";
      case "check":
        return `${mover} is in check!`;
      default:
        return `${mover} to move`;
    }
  }, [view]);

  // group moves into pairs for the move list
  const movePairs = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < view.history.length; i += 2) {
      pairs.push({
        no: i / 2 + 1,
        white: view.history[i]?.san,
        black: view.history[i + 1]?.san,
      });
    }
    return pairs;
  }, [view.history]);

  return (
    <main className="min-h-screen w-full px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-8 flex flex-col items-center text-center animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="text-4xl">♞</span>
            <h1 className="bg-gradient-to-r from-emerald-300 via-teal-200 to-sky-300 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
              Next Chess
            </h1>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            A polished two-player chess game built with Next.js &amp; chess.js
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[auto,1fr]">
          {/* Board column */}
          <div className="flex flex-col items-center gap-5">
            {/* Top captured tray (opponent relative to orientation) */}
            <div className="flex w-full items-center justify-between px-1">
              <PlayerTag
                name={orientation === "white" ? "Black" : "White"}
                color={orientation === "white" ? "b" : "w"}
                active={view.turn === (orientation === "white" ? "b" : "w") && !gameOver}
                captured={view.captured[orientation === "white" ? "b" : "w"]}
                score={orientation === "white" ? -view.score : view.score}
              />
            </div>

            <ChessBoard
              board={view.board}
              onSquareClick={handleSquareClick}
              selectedSquare={selected}
              legalTargets={legalTargets}
              lastMove={lastMove}
              checkSquare={view.checkSquare}
              orientation={orientation}
            />

            {/* Bottom captured tray */}
            <div className="flex w-full items-center justify-between px-1">
              <PlayerTag
                name={orientation === "white" ? "White" : "Black"}
                color={orientation === "white" ? "w" : "b"}
                active={view.turn === (orientation === "white" ? "w" : "b") && !gameOver}
                captured={view.captured[orientation === "white" ? "w" : "b"]}
                score={orientation === "white" ? view.score : -view.score}
              />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-5">
            {/* Status */}
            <div
              className={[
                "rounded-2xl p-5 ring-1 backdrop-blur transition-colors",
                gameOver
                  ? "bg-emerald-500/10 ring-emerald-400/40"
                  : view.status === "check"
                  ? "bg-red-500/10 ring-red-400/40"
                  : "bg-slate-900/70 ring-white/10",
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={[
                    "inline-block h-3 w-3 rounded-full",
                    view.turn === "w" ? "bg-white" : "bg-slate-500",
                    !gameOver && "animate-pulse",
                  ].join(" ")}
                />
                <p className="text-lg font-semibold text-slate-100">{statusText}</p>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Move {Math.floor(view.history.length / 2) + (view.turn === "w" ? 0 : 1)} ·{" "}
                {view.history.length} plies played
              </p>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-3 gap-3">
              <ActionButton onClick={reset} label="New Game" accent="emerald" />
              <ActionButton onClick={undo} label="Undo" accent="slate" disabled={view.history.length === 0} />
              <ActionButton onClick={flip} label="Flip Board" accent="sky" />
            </div>

            {/* Move history */}
            <div className="rounded-2xl bg-slate-900/70 p-5 ring-1 ring-white/10 backdrop-blur">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
                Move History
              </h2>
              <div className="max-h-72 overflow-y-auto pr-1">
                {movePairs.length === 0 ? (
                  <p className="py-6 text-center text-sm text-slate-500">
                    No moves yet — white to start.
                  </p>
                ) : (
                  <table className="w-full text-sm">
                    <tbody>
                      {movePairs.map((p) => (
                        <tr key={p.no} className="border-b border-white/5 last:border-0">
                          <td className="w-8 py-1.5 pr-2 text-right font-mono text-xs text-slate-500">
                            {p.no}.
                          </td>
                          <td className="py-1.5 font-mono font-medium text-slate-100">{p.white}</td>
                          <td className="py-1.5 font-mono font-medium text-slate-300">{p.black || ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <p className="text-center text-xs text-slate-600">
              Click a piece to see legal moves. Pawns auto-promote to a queen.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

function PlayerTag({ name, color, active, captured, score }) {
  return (
    <div
      className={[
        "flex w-full items-center gap-3 rounded-xl px-4 py-2.5 ring-1 transition-all",
        active ? "bg-emerald-500/15 ring-emerald-400/50" : "bg-slate-900/60 ring-white/10",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-7 w-7 items-center justify-center rounded-full text-lg font-bold",
          color === "w" ? "bg-white text-slate-900" : "bg-slate-950 text-white ring-1 ring-white/20",
        ].join(" ")}
      >
        {color === "w" ? "\u2659" : "\u265F"}
      </span>
      <span className="font-semibold text-slate-100">{name}</span>
      <div className="ml-1 flex flex-wrap items-center gap-0.5 text-lg leading-none">
        {captured.map((t, i) => (
          <span key={i} className={color === "w" ? "text-slate-400" : "text-slate-400"}>
            {CAPTURE_GLYPH[`${color === "w" ? "b" : "w"}${t}`]}
          </span>
        ))}
      </div>
      {score > 0 && (
        <span className="ml-auto rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300">
          +{score}
        </span>
      )}
    </div>
  );
}

function ActionButton({ onClick, label, accent, disabled }) {
  const styles = {
    emerald: "bg-emerald-500 hover:bg-emerald-400 text-slate-950",
    slate: "bg-slate-700 hover:bg-slate-600 text-white",
    sky: "bg-sky-500 hover:bg-sky-400 text-slate-950",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        "rounded-xl px-3 py-2.5 text-sm font-semibold shadow-lg transition-all",
        "hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0",
        styles[accent],
      ].join(" ")}
    >
      {label}
    </button>
  );
}
