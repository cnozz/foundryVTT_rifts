import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import archiver from "archiver";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const outDir = path.join(repoRoot, "release");
fs.mkdirSync(outDir, { recursive: true });

const outZip = path.join(outDir, "rifts-system.zip");
const output = fs.createWriteStream(outZip);
const archive = archiver("zip", { zlib: { level: 9 } });

archive.directory(path.join(repoRoot, "system", "rifts"), "rifts");
archive.pipe(output);
await archive.finalize();
console.log("Packed:", outZip);