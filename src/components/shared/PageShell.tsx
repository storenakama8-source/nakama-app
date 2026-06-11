"use client";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: "var(--bg)",
        minHeight: "100svh",
        paddingTop: "76px",
        overflowX: "hidden",
        color: "var(--text)",
        transition: "background-color 0.5s ease, color 0.3s ease",
      }}
    >
      {children}
    </div>
  );
}
