import { NextRequest, NextResponse } from "next/server";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { loadJava, getSectionMeta } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COMPILE_TIMEOUT = 20000;
const RUN_TIMEOUT = 10000;

interface Body {
  module: string;
  section: string;
  id: string;
  code: string;
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json(
      { ok: false, passed: false, stage: "config", message: "JSON inválido" },
      { status: 400 }
    );
  }

  const { module, section, id, code } = body;
  if (!module || !section || !id || typeof code !== "string") {
    return NextResponse.json(
      { ok: false, passed: false, stage: "config", message: "Parâmetros faltando" },
      { status: 400 }
    );
  }

  // Look up the challenge's harness + expected output (server-side only).
  const meta = getSectionMeta(module, section);
  if (!meta || meta.type !== "java") {
    return NextResponse.json(
      { ok: false, passed: false, stage: "config", message: "Seção inválida" },
      { status: 404 }
    );
  }
  const challenge = loadJava(module, meta.file).challenges.find((c) => c.id === id);
  if (!challenge) {
    return NextResponse.json(
      { ok: false, passed: false, stage: "config", message: "Desafio não encontrado" },
      { status: 404 }
    );
  }
  if (!challenge.harness || challenge.expected === undefined) {
    return NextResponse.json(
      {
        ok: false,
        passed: false,
        stage: "config",
        message:
          "Este desafio ainda não foi 'seedado'. Rode: npm run seed (com o JDK instalado).",
      },
      { status: 500 }
    );
  }

  const dir = path.join(os.tmpdir(), "study-java-" + crypto.randomUUID());
  fs.mkdirSync(dir, { recursive: true });

  try {
    fs.writeFileSync(path.join(dir, "Solution.java"), code, "utf8");
    fs.writeFileSync(path.join(dir, "Main.java"), challenge.harness, "utf8");

    // compile
    const compile = spawnSync("javac", ["-encoding", "UTF-8", "Solution.java", "Main.java"], {
      cwd: dir,
      timeout: COMPILE_TIMEOUT,
      encoding: "utf8",
      shell: true,
    });

    if (compile.error && (compile.error as NodeJS.ErrnoException).code === "ENOENT") {
      return NextResponse.json({
        ok: false,
        passed: false,
        stage: "config",
        message: "javac não encontrado. Instale o JDK e garanta que está no PATH.",
      });
    }
    if (compile.status !== 0) {
      return NextResponse.json({
        ok: false,
        passed: false,
        stage: "compile",
        message: (compile.stderr || compile.stdout || "Erro de compilação").trim(),
      });
    }

    // run
    const run = spawnSync("java", ["-cp", ".", "Main"], {
      cwd: dir,
      timeout: RUN_TIMEOUT,
      encoding: "utf8",
      shell: true,
      maxBuffer: 1024 * 1024 * 8,
    });

    if (run.error && (run.error as NodeJS.ErrnoException).code === "ETIMEDOUT") {
      return NextResponse.json({
        ok: false,
        passed: false,
        stage: "run",
        message: "Tempo limite excedido (possível loop infinito).",
        stdout: "(execução interrompida)",
        expected: challenge.expected,
      });
    }
    if (run.status !== 0) {
      return NextResponse.json({
        ok: false,
        passed: false,
        stage: "run",
        message: "Erro em tempo de execução",
        stdout: (run.stderr || run.stdout || "").trim(),
        expected: challenge.expected,
      });
    }

    const out = (run.stdout || "").replace(/\r\n/g, "\n").trimEnd();
    const exp = challenge.expected.replace(/\r\n/g, "\n").trimEnd();
    const passed = out === exp;

    return NextResponse.json({
      ok: true,
      passed,
      stage: "run",
      message: passed ? "OK" : "Saída diferente",
      stdout: out,
      expected: exp,
    });
  } finally {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch {
      /* ignore cleanup errors */
    }
  }
}
