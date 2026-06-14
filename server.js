const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

process.on("uncaughtException", (err) => {
  console.error("[Nakama] Uncaught exception:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("[Nakama] Unhandled rejection:", reason);
});

const port = parseInt(process.env.PORT || "3000", 10);
const hostname = process.env.HOST || "0.0.0.0";

const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("[Nakama] Error handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  }).listen(port, hostname, () => {
    console.log(`> Nakama Store ready on http://${hostname}:${port}`);
  });
}).catch((err) => {
  console.error("[Nakama] Failed to start server:", err);
  process.exit(1);
});
