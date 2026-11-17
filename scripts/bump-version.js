#!/usr/bin/env node
// Bumps the patch version in docs/version.json, sets today's date, and writes both
// into the marker in docs/index.html (<!--version-->...<!--/version-->).
const fs = require("fs");
const vfile = "docs/version.json", page = "docs/index.html";
const v = JSON.parse(fs.readFileSync(vfile, "utf8"));
const [maj, min, pat] = v.version.split(".").map(Number);
v.version = `${maj}.${min}.${pat + 1}`;
v.updated = new Date().toISOString().slice(0, 10);
fs.writeFileSync(vfile, JSON.stringify(v, null, 2) + "\n");
const d = new Date(v.updated + "T00:00:00Z")
  .toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const html = fs.readFileSync(page, "utf8");
const re = /<!--version-->[\s\S]*?<!--\/version-->/;
if (!re.test(html)) { console.error("version marker missing in " + page); process.exit(1); }
fs.writeFileSync(page, html.replace(re, `<!--version-->v${v.version} · last updated ${d}<!--/version-->`));
console.log(`version bumped to ${v.version} (${v.updated})`);
