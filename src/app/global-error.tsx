"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{
          minHeight: "100vh",
          backgroundColor: "#FFF9F5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}>
          <div style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #EFE3DB",
            borderRadius: "1rem",
            boxShadow: "0 8px 30px rgba(56, 42, 37, 0.06)",
            padding: "2rem",
            maxWidth: "28rem",
            width: "100%",
            textAlign: "center",
          }}>
            <h2 style={{ color: "#382A25", fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Application Error
            </h2>
            <p style={{ color: "#81736C", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
              A critical error occurred. Please refresh the page.
            </p>
            <button
              onClick={reset}
              style={{
                padding: "0.625rem 1.5rem",
                backgroundColor: "#D97757",
                color: "white",
                fontSize: "0.875rem",
                fontWeight: 600,
                borderRadius: "0.75rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
