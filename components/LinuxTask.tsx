"use client";

import { useEffect, useState } from "react";
import MarkdownView from "./MarkdownView";
import { isDone, setDone } from "@/lib/progress";
import type { LinuxTask as Task } from "@/lib/types";

function TaskCard({
  task,
  index,
  module,
  section,
}: {
  task: Task;
  index: number;
  module: string;
  section: string;
}) {
  const storageKey = `${module}/${section}#${task.id}`;
  const [value, setValue] = useState("");
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [solved, setSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => setSolved(isDone(storageKey)), [storageKey]);

  function check() {
    const input = value.trim().replace(/\s+/g, " ");
    const ok = task.accept.some((p) => {
      try {
        return new RegExp(`^(?:${p})$`, "i").test(input);
      } catch {
        return false;
      }
    });
    setAnswered(true);
    setCorrect(ok);
    if (ok) {
      setDone(storageKey, true);
      setSolved(true);
    }
  }

  return (
    <div className={`ex ${solved ? "solved" : ""}`}>
      <div className="ex-head">
        <span className="ex-num">#{index + 1}</span>
        <h3 style={{ fontSize: 16, fontWeight: 600 }}>{task.prompt}</h3>
        <span className={`ex-check ${solved ? "ok" : ""}`}>
          {solved ? "✓" : ""}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <span className="cmd-prompt">$</span>
        <input
          className="answer-input"
          spellCheck={false}
          value={value}
          placeholder="digite o comando…"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && check()}
        />
      </div>

      <div className="btn-row">
        <button className="btn" onClick={check}>
          Verificar
        </button>
        {task.hint && (
          <button className="btn ghost" onClick={() => setShowHint((v) => !v)}>
            {showHint ? "Esconder dica" : "💡 Dica"}
          </button>
        )}
      </div>

      {showHint && task.hint && <div className="hint">💡 {task.hint}</div>}

      {answered && (
        <div className={`result ${correct ? "pass" : "fail"}`}>
          <strong>
            {correct ? "✅ Comando correto!" : "❌ Ainda não — tente de novo"}
          </strong>
          {correct && (
            <div className="explain" style={{ marginTop: 8 }}>
              <MarkdownView source={task.explain} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function LinuxTasks({
  tasks,
  module,
  section,
}: {
  tasks: Task[];
  module: string;
  section: string;
}) {
  return (
    <div>
      {tasks.map((t, i) => (
        <TaskCard
          key={t.id}
          task={t}
          index={i}
          module={module}
          section={section}
        />
      ))}
    </div>
  );
}
