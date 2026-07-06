"use client";

import { useEffect } from "react";

// Fängt Fehler im Root-Layout ab – muss <html>/<body> selbst rendern.
// Kein Zugriff auf Fonts/Tailwind aus dem Layout, daher Inline-Styles im Marken-Look.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="de">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 16px",
          backgroundColor: "#0b1a10",
          fontFamily: "Georgia, serif",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: 14,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#e5ca7a",
              marginBottom: 16,
            }}
          >
            Fehler
          </p>
          <h1 style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)", color: "#fdfaf5", margin: "0 0 16px" }}>
            Da ist etwas schiefgelaufen
          </h1>
          <p
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: 18,
              color: "rgba(253,250,245,0.6)",
              maxWidth: 448,
              margin: "0 auto 32px",
            }}
          >
            Ein unerwarteter Fehler ist aufgetreten. Versuch es einfach noch einmal – oder melde dich bei uns, wenn das Problem bleibt.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <button
              onClick={reset}
              style={{
                padding: "12px 24px",
                backgroundColor: "#c9a84c",
                color: "#0b1a10",
                border: "none",
                borderRadius: 9999,
                fontFamily: "system-ui, sans-serif",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Erneut versuchen
            </button>
            <a
              href="/"
              style={{
                padding: "12px 24px",
                border: "1px solid rgba(253,250,245,0.3)",
                color: "rgba(253,250,245,0.8)",
                borderRadius: 9999,
                fontFamily: "system-ui, sans-serif",
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              Zur Startseite
            </a>
            <a
              href="/kontakt"
              style={{
                padding: "12px 24px",
                border: "1px solid rgba(253,250,245,0.3)",
                color: "rgba(253,250,245,0.8)",
                borderRadius: 9999,
                fontFamily: "system-ui, sans-serif",
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              Kontakt
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
