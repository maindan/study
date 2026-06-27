"use client";

import { useEffect, useRef, useState } from "react";
import MarkdownView from "./MarkdownView";
import { isDone, setDone, getRaw, setRaw } from "@/lib/progress";
import type { JavaChallenge as Challenge } from "@/lib/types";

interface RunResult {
  ok: boolean;
  passed: boolean;
  stage: "compile" | "run" | "config";
  message: string;
  stdout?: string;
  expected?: string;
}

export default function JavaChallenge({
  challenge,
  index,
  module,
  section,
}: {
  challenge: Challenge;
  index: number;
  module: string;
  section: string;
}) {
  const storageKey = `${module}/${section}#${challenge.id}`;
  const [code, setCode] = useState(challenge.starter);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [solved, setSolved] = useState(false);
  const [showRef, setShowRef] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setSolved(isDone(storageKey));
    const saved = getRaw("code:" + storageKey);
    if (saved) setCode(saved);
  }, [storageKey]);

  function persistCode(v: string) {
    setCode(v);
    setRaw("code:" + storageKey, v);
  }

  async function run() {
    setRunning(true);
    setResult(null);
    try {
      const res = await fetch("/api/run-java", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module, section, id: challenge.id, code }),
      });
      const data = (await res.json()) as RunResult;
      setResult(data);
      if (data.passed) {
        setDone(storageKey, true);
        setSolved(true);
      }
    } catch {
      setResult({
        ok: false,
        passed: false,
        stage: "config",
        message:
          "Não foi possível contatar o executor. O servidor (npm run dev) está rodando?",
      });
    } finally {
      setRunning(false);
    }
  }

  function onTab(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = taRef.current!;
      const s = ta.selectionStart;
      const en = ta.selectionEnd;
      const v = code.slice(0, s) + "    " + code.slice(en);
      persistCode(v);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = s + 4;
      });
    }
  }

  return (
    <div className={`ex ${solved ? "solved" : ""}`}>
      <div className="ex-head">
        <span className="ex-num">#{index + 1}</span>
        <h3>{challenge.title}</h3>
        <span className={`ex-check ${solved ? "ok" : ""}`}>
          {solved ? "✓ resolvido" : "não resolvido"}
        </span>
      </div>

      <MarkdownView source={challenge.statement} />

      <textarea
        ref={taRef}
        className="editor"
        spellCheck={false}
        value={code}
        onChange={(e) => persistCode(e.target.value)}
        onKeyDown={onTab}
      />

      <div className="btn-row">
        <button className="btn" onClick={run} disabled={running}>
          {running ? "Executando…" : "▶ Rodar testes"}
        </button>
        <button
          className="btn ghost"
          onClick={() => persistCode(challenge.starter)}
        >
          Resetar
        </button>
        {challenge.hints && challenge.hints.length > 0 && (
          <button className="btn ghost" onClick={() => setShowHint((v) => !v)}>
            {showHint ? "Esconder dica" : "💡 Dica"}
          </button>
        )}
        <button className="btn ghost" onClick={() => setShowRef((v) => !v)}>
          {showRef ? "Esconder solução" : "Ver solução"}
        </button>
      </div>

      {showHint && challenge.hints && (
        <div className="hint">
          {challenge.hints.map((h, i) => (
            <div key={i}>💡 {h}</div>
          ))}
        </div>
      )}

      {result && (
        <div className={`result ${result.passed ? "pass" : "fail"}`}>
          <strong>
            {result.passed
              ? "✅ Todos os testes passaram!"
              : result.stage === "compile"
              ? "❌ Erro de compilação"
              : result.stage === "config"
              ? "⚠️ " + result.message
              : "❌ Saída diferente do esperado"}
          </strong>
          {!result.passed && result.stage === "compile" && (
            <pre>{result.message}</pre>
          )}
          {!result.passed && result.stage === "run" && (
            <div className="io-cols">
              <div>
                <div className="progress-label">Sua saída</div>
                <pre>{result.stdout || "(vazio)"}</pre>
              </div>
              <div>
                <div className="progress-label">Esperado</div>
                <pre>{result.expected}</pre>
              </div>
            </div>
          )}
        </div>
      )}

      {showRef && (
        <div style={{ marginTop: 14 }}>
          <div className="progress-label">Solução de referência</div>
          <MarkdownView source={"```java\n" + challenge.reference + "\n```"} />
        </div>
      )}
    </div>
  );
}
