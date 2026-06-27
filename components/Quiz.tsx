"use client";

import { useEffect, useState } from "react";
import MarkdownView from "./MarkdownView";
import { isDone, setDone } from "@/lib/progress";
import type { QuizQuestion } from "@/lib/types";

function stripAccents(s: string) {
  // decompose accents (é -> e + ´) then drop the combining marks (U+0300–U+036F)
  return s.normalize("NFD").replace(new RegExp("[\\u0300-\\u036f]", "g"), "");
}

function normalize(s: string) {
  return stripAccents(s.trim().toLowerCase());
}

function QuestionCard({
  q,
  index,
  module,
  section,
}: {
  q: QuizQuestion;
  index: number;
  module: string;
  section: string;
}) {
  const storageKey = `${module}/${section}#${q.id}`;
  const isMC = Array.isArray(q.options) && q.options.length > 0;
  const [selected, setSelected] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [solved, setSolved] = useState(false);

  useEffect(() => setSolved(isDone(storageKey)), [storageKey]);

  function checkMC(i: number) {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    const ok = i === q.answer;
    setCorrect(ok);
    if (ok) {
      setDone(storageKey, true);
      setSolved(true);
    }
  }

  function checkText() {
    const ok = (q.accept || []).some((p) =>
      new RegExp(`^(${p})$`, "i").test(normalize(text))
    );
    setAnswered(true);
    setCorrect(ok);
    if (ok) {
      setDone(storageKey, true);
      setSolved(true);
    }
  }

  function reset() {
    setAnswered(false);
    setSelected(null);
    setCorrect(false);
    setText("");
  }

  return (
    <div className={`ex ${solved ? "solved" : ""}`}>
      <div className="ex-head">
        <span className="ex-num">#{index + 1}</span>
        <h3 style={{ fontSize: 16, fontWeight: 600 }}>{q.q}</h3>
        <span className={`ex-check ${solved ? "ok" : ""}`}>
          {solved ? "✓" : ""}
        </span>
      </div>

      {isMC ? (
        <div>
          {q.options!.map((opt, i) => {
            let cls = "opt";
            if (answered) {
              if (i === q.answer) cls += " correct";
              else if (i === selected) cls += " wrong";
            } else if (i === selected) cls += " selected";
            return (
              <div key={i} className={cls} onClick={() => checkMC(i)}>
                <span>{opt}</span>
                {answered && i === q.answer && <span className="mark">✓</span>}
                {answered && i === selected && i !== q.answer && (
                  <span className="mark">✗</span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <input
            className="answer-input"
            value={text}
            placeholder="Sua resposta…"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && checkText()}
          />
          <div className="btn-row">
            <button className="btn" onClick={checkText}>
              Verificar
            </button>
            {answered && !correct && (
              <button className="btn ghost" onClick={reset}>
                Tentar de novo
              </button>
            )}
          </div>
        </div>
      )}

      {answered && (
        <div className={`result ${correct ? "pass" : "fail"}`}>
          <strong>{correct ? "✅ Correto!" : "❌ Não foi dessa vez"}</strong>
          <div className="explain" style={{ marginTop: 8 }}>
            <MarkdownView source={q.explain} />
          </div>
          {isMC && !correct && (
            <button
              className="btn ghost"
              style={{ marginTop: 8 }}
              onClick={reset}
            >
              Tentar de novo
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function Quiz({
  questions,
  module,
  section,
}: {
  questions: QuizQuestion[];
  module: string;
  section: string;
}) {
  return (
    <div>
      {questions.map((q, i) => (
        <QuestionCard
          key={q.id}
          q={q}
          index={i}
          module={module}
          section={section}
        />
      ))}
    </div>
  );
}
