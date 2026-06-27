"use client";

import { useEffect, useState } from "react";
import { countDone, onProgressChange } from "@/lib/progress";

export default function ProgressBar({
  prefix,
  total,
  label,
}: {
  prefix: string;
  total: number;
  label?: string;
}) {
  const [done, setDone] = useState(0);

  useEffect(() => {
    const refresh = () => setDone(countDone(prefix));
    refresh();
    return onProgressChange(refresh);
  }, [prefix]);

  const pct = total ? Math.round((Math.min(done, total) / total) * 100) : 0;
  return (
    <div className="progress">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-label">
        {label || "Progresso"}: {Math.min(done, total)}/{total} ({pct}%)
      </div>
    </div>
  );
}
