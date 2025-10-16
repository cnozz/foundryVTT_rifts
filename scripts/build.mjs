import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const sysRoot = path.join(repoRoot, "system", "rifts");
const srcFile = path.join(sysRoot, "src", "rifts.js");
const distDir = path.join(sysRoot, "dist");
const distFile = path.join(distDir, "rifts.js");

fs.mkdirSync(distDir, { recursive: true });
if (fs.existsSync(srcFile)) {
  fs.copyFileSync(srcFile, distFile);
  console.log("Built dist/rifts.js from src.");
} else {
  console.log("No src/rifts.js found; dist remains as-is.");
}