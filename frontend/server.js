// Serves the production build. Node is used instead of nginx because the
// upstream proxy sends a duplicate Host header, which nginx rejects with 400.
const express = require("express");
const fs = require("fs");
const path = require("path");

const buildDir = path.join(__dirname, "build");

// Runtime config read by src/config.js through window.ENV
const env = Object.fromEntries(
  Object.entries(process.env).filter(([key]) => key.startsWith("VITE_"))
);
const indexHtml = fs
  .readFileSync(path.join(buildDir, "index.html"), "utf8")
  .replace(
    '<noscript id="env-insertion-point"></noscript>',
    `<script>var ENV=${JSON.stringify(env).replace(/</g, "\\u003c")}</script>`
  );

const sendIndex = (req, res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.type("html").send(indexHtml);
};

const app = express();
app.disable("x-powered-by");
app.get(["/", "/index.html"], sendIndex);
app.use(express.static(buildDir, { index: false, maxAge: "1y" }));
app.get("*", sendIndex);

const port = process.env.PORT || 80;
app.listen(port, () => console.log(`Frontend listening on ${port}`));
