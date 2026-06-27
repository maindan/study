// Computes the expected stdout for every Java challenge by compiling and
// running its REFERENCE solution through its harness, then writes the result
// back into the challenge JSON as `expected`. This guarantees the runtime
// validator compares against a real, verified output.
//
// Run with the JDK installed:  npm run seed
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "content");

function listJavaFiles() {
  const out = [];
  if (!fs.existsSync(CONTENT)) return out;
  for (const mod of fs.readdirSync(CONTENT)) {
    const metaPath = path.join(CONTENT, mod, "_meta.json");
    if (!fs.existsSync(metaPath)) continue;
    let meta;
    try {
      meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    } catch (e) {
      console.error(`  ! _meta.json inválido em ${mod}: ${e.message}`);
      continue;
    }
    for (const s of meta.sections || []) {
      if (s.type === "java")
        out.push({ module: mod, file: path.join(CONTENT, mod, s.file) });
    }
  }
  return out;
}

function runReference(reference, harness) {
  const dir = path.join(os.tmpdir(), "seed-java-" + crypto.randomUUID());
  fs.mkdirSync(dir, { recursive: true });
  try {
    fs.writeFileSync(path.join(dir, "Solution.java"), reference, "utf8");
    fs.writeFileSync(path.join(dir, "Main.java"), harness, "utf8");
    const c = spawnSync("javac", ["-encoding", "UTF-8", "Solution.java", "Main.java"], {
      cwd: dir,
      encoding: "utf8",
      shell: true,
      timeout: 30000,
    });
    if (c.status !== 0)
      return { error: "COMPILE", detail: (c.stderr || c.stdout || "").trim() };
    const r = spawnSync("java", ["-cp", ".", "Main"], {
      cwd: dir,
      encoding: "utf8",
      shell: true,
      timeout: 15000,
      maxBuffer: 1024 * 1024 * 8,
    });
    if (r.status !== 0)
      return { error: "RUNTIME", detail: (r.stderr || r.stdout || "").trim() };
    return { output: (r.stdout || "").replace(/\r\n/g, "\n").trimEnd() };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function main() {
  const check = spawnSync("javac", ["-version"], { encoding: "utf8", shell: true });
  if (check.error || (check.status !== 0 && !check.stdout && !check.stderr)) {
    console.error("✗ JDK não encontrado. Instale o JDK e adicione ao PATH.");
    process.exit(1);
  }

  const files = listJavaFiles();
  if (files.length === 0) {
    console.log("Nenhum arquivo de desafios Java encontrado em /content.");
    return;
  }

  let total = 0,
    ok = 0;
  const failures = [];

  for (const { module, file } of files) {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    const rel = path.relative(ROOT, file);
    console.log(`\n› ${rel}  (${data.challenges.length} desafios)`);
    for (const ch of data.challenges) {
      total++;
      if (!ch.reference || !ch.harness) {
        failures.push(`${rel} :: ${ch.id} — sem reference/harness`);
        console.log(`  ✗ ${ch.id}: falta reference ou harness`);
        continue;
      }
      const res = runReference(ch.reference, ch.harness);
      if (res.error) {
        failures.push(`${rel} :: ${ch.id} — ${res.error}\n${res.detail}`);
        console.log(`  ✗ ${ch.id}: ${res.error}`);
      } else {
        ch.expected = res.output;
        ok++;
        console.log(`  ✓ ${ch.id}`);
      }
    }
    fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
  }

  console.log(`\n──────────────────────────────`);
  console.log(`Seed concluído: ${ok}/${total} desafios OK`);
  if (failures.length) {
    console.log(`\n${failures.length} FALHA(S):`);
    for (const f of failures) console.log("\n• " + f);
    process.exit(1);
  }
}

main();
