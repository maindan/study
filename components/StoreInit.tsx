"use client";

import { useEffect } from "react";
import { initStore } from "@/lib/progress";

/** Hydrates the progress cache from SQLite (Electron) once on startup. */
export default function StoreInit() {
  useEffect(() => {
    initStore();
  }, []);
  return null;
}
