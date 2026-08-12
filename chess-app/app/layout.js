import "./globals.css";

export const metadata = {
  title: "Chess — Play in Style",
  description: "A beautiful chess game built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
