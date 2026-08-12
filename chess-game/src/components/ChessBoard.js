"use client";

import { useMemo } from "react";

// Unicode glyphs for chess pieces
const PIECES = {
  wp: "\u2659", wr: "\u2656", wn: "\u2658", wb: "\u2657", wq: "\u2655", wk: "\u2654",
  bp: "\u265F", br: "\u265C", bn: "\u265E", bb: "\u265D", bq: "\u265B", bk: "\u265A",
}; // note: these are JS string literals, escapes are fine here

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
const RANKS = [8, 7, 6, 5, 4, 3, 2, 1];

export default function ChessBoard({
  board,
  onSquareClick,
  selectedSquare,
  legalTargets,
  lastMove,
  checkSquare,
  orientation = "white",
}) {
  const rows = useMemo(() => {
    const r = orientation === "white" ? RANKS : [...RANKS].reverse();
    const f = orientation === "white" ? FILES : [...FILES].reverse();
    return { r, f };
  }, [orientation]);

  return (
    <div className="relative rounded-2xl p-3 sm:p-4 bg-slate-900/70 shadow-2xl ring-1 ring-white/10 backdrop-blur">
      <div className="grid grid-cols-8 overflow-hidden rounded-lg shadow-inner">
        {rows.r.map((rank, ri) =>
          rows.f.map((file, fi) => {
            const square = `${file}${rank}`;
            const isDark = (ri + fi) % 2 === 1;
            const piece = board?.[rank]?.[file];
            const isSelected = selectedSquare === square;
            const isTarget = legalTargets?.includes(square);
            const isCapture = isTarget && piece;
            const isLast = lastMove && (lastMove.from === square || lastMove.to === square);
            const isCheck = checkSquare === square;

            return (
              <button
                key={square}
                onClick={() => onSquareClick(square)}
                className={[
                  "relative flex aspect-square items-center justify-center select-none",
                  "w-[11vw] h-[11vw] sm:w-16 sm:h-16 md:w-[4.6rem] md:h-[4.6rem] lg:w-20 lg:h-20",
                  "transition-colors duration-150",
                  isDark ? "bg-board-dark" : "bg-board-light",
                ].join(" ")}
              >
                {/* highlight overlays */}
                {isLast && (
                  <span className="absolute inset-0 bg-yellow-300/35" />
                )}
                {isSelected && (
                  <span className="absolute inset-0 bg-emerald-400/50 ring-2 ring-inset ring-emerald-300" />
                )}
                {isCheck && (
                  <span className="absolute inset-0 bg-red-500/60 animate-pulse" />
                )}

                {/* file/rank coordinate labels */}
                {fi === 0 && (
                  <span
                    className={[
                      "absolute left-1 top-0.5 text-[9px] sm:text-[11px] font-semibold pointer-events-none",
                      isDark ? "text-board-light/80" : "text-board-dark/80",
                    ].join(" ")}
                  >
                    {rank}
                  </span>
                )}
                {ri === 7 && (
                  <span
                    className={[
                      "absolute right-1 bottom-0.5 text-[9px] sm:text-[11px] font-semibold pointer-events-none",
                      isDark ? "text-board-light/80" : "text-board-dark/80",
                    ].join(" ")}
                  >
                    {file}
                  </span>
                )}

                {/* legal move indicator */}
                {isTarget && !isCapture && (
                  <span className="absolute h-1/3 w-1/3 rounded-full bg-slate-900/25" />
                )}
                {isCapture && (
                  <span className="absolute inset-1 rounded-full border-4 border-slate-900/25" />
                )}

                {/* the piece */}
                {piece && (
                  <span
                    className={[
                      "relative z-10 leading-none animate-pop drop-shadow-[0_2px_2px_rgba(0,0,0,0.45)]",
                      "text-[8.5vw] sm:text-5xl md:text-[3.2rem] lg:text-[3.6rem]",
                      piece.color === "w" ? "text-white" : "text-slate-950",
                    ].join(" ")}
                  >
                    {PIECES[`${piece.color}${piece.type}`]}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
