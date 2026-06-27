"use client";

import { useEffect, useState } from "react";
import { isDone, setDone } from "@/lib/progress";

export default function PersistentCheckbox({
  storageKey,
}: {
  storageKey: string;
}) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(isDone(storageKey));
  }, [storageKey]);

  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => {
        setChecked(e.target.checked);
        setDone(storageKey, e.target.checked);
      }}
    />
  );
}
