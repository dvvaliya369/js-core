import ChessGame from "./ChessGame";

export default function Home() {
  return (
    <main className="page">
      <section className="hero">
        <h1>Play Chess</h1>
        <p>A polished chess experience built with Next.js, chess.js &amp; react-chessboard.</p>
      </section>
      <ChessGame />
      <footer className="footer">Full move validation, check &amp; checkmate detection, and move history.</footer>
    </main>
  );
}
