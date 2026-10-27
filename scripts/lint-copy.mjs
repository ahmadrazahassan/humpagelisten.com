// Fails when visible copy contains dashes or banned AI cliches. Run: npm run lint:copy
import fs from "node:fs";
import path from "node:path";

const roots = ["lib/data", "components", "app"];
const banned = [
  "delve", "elevate", "seamless", "unlock the", "unleash", "embark", "tapestry", "realm", "game changer",
  "revolutionize", "cutting edge", "next level", "fast paced world", "look no further", "dive in", "treasure trove",
  "curated just for you", "it's worth noting",
];
const dashes = [/—/, /–/, /[A-Za-z.,)] - [A-Za-z(]/];

const files = [];
const walk = (d) => {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p);
    else if (/\.(tsx?|mdx?)$/.test(f.name)) files.push(p);
  }
};
roots.forEach(walk);

let problems = 0;
for (const file of files) {
  fs.readFileSync(file, "utf8").split("\n").forEach((line, i) => {
    const code = line.trim();
    if (code.startsWith("//") || code.startsWith("*") || code.startsWith("/*")) return;
    const strings = code.match(/"[^"]*"|`[^`]*`|>[^<{]+</g) ?? [];
    for (const s of strings) {
      const lower = s.toLowerCase();
      const hit = dashes.find((r) => r.test(s)) ? "dash" : banned.find((b) => lower.includes(b));
      if (hit) {
        problems++;
        console.log(`${file}:${i + 1}  ${hit}  ${s.slice(0, 90)}`);
      }
    }
  });
}
if (problems) {
  console.error(`\n${problems} copy problem(s) found.`);
  process.exit(1);
}
console.log("Copy check passed.");
