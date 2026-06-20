process.on("uncaughtException",  (e) => console.error("[nakama] uncaughtException:", e?.message ?? e));
process.on("unhandledRejection", (r) => console.error("[nakama] unhandledRejection:", r));
process.on("SIGTERM", () => { console.log("[nakama] SIGTERM"); process.exit(0); });
process.on("SIGINT",  () => { console.log("[nakama] SIGINT");  process.exit(0); });

// Delegate to the self-contained standalone server.
// It uses __dirname for all paths so it works on any machine regardless of where it was built.
require("./.next/standalone/server.js");
