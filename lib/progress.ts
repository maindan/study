"use client";

// Progress store with a synchronous in-memory cache and a pluggable backend.
//
// - In the browser, the backend is localStorage.
// - Inside the Electron app, `window.studyDB` (exposed by preload) persists the
//   same key/value data to a SQLite database. We hydrate the cache from SQLite
//   on startup via initStore() and mirror every write to it.
//
// Components read synchronously from the cache; writes update the cache, fire
// a change event, and persist to both backends.

const NS = "p:"; // namespace for "done" flags
const EVENT = "progress-change";

type DB = {
  getAll: () => Promise<Record<string, string>>;
  set: (key: string, value: string) => void;
  remove: (key: string) => void;
};

declare global {
  interface Window {
    studyDB?: DB;
  }
}

const mem = new Map<string, string>();

function hydrateFromLocalStorage() {
  if (typeof window === "undefined") return;
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k) mem.set(k, window.localStorage.getItem(k) || "");
    }
  } catch {
    /* localStorage may be unavailable */
  }
}

// Hydrate immediately so first render has data even before SQLite loads.
hydrateFromLocalStorage();

let initialized = false;

/** Load all rows from SQLite (Electron) into the cache, once. */
export async function initStore(): Promise<void> {
  if (initialized || typeof window === "undefined" || !window.studyDB) return;
  initialized = true;
  try {
    const rows = await window.studyDB.getAll();
    for (const [k, v] of Object.entries(rows)) mem.set(k, v);
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    /* fall back to localStorage cache already loaded */
  }
}

function persist(key: string, value: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
  try {
    if (value === null) window.studyDB?.remove(key);
    else window.studyDB?.set(key, value);
  } catch {
    /* ignore */
  }
}

/* ---------- raw key/value (used for saved code, etc.) ---------- */
export function getRaw(key: string): string | null {
  return mem.has(key) ? mem.get(key)! : null;
}
export function setRaw(key: string, value: string): void {
  mem.set(key, value);
  persist(key, value);
}
export function removeRaw(key: string): void {
  mem.delete(key);
  persist(key, null);
}

/* ---------- "done" flags ---------- */
export function isDone(key: string): boolean {
  return mem.get(NS + key) === "1";
}
export function setDone(key: string, done: boolean): void {
  if (done) mem.set(NS + key, "1");
  else mem.delete(NS + key);
  persist(NS + key, done ? "1" : null);
  if (typeof window !== "undefined")
    window.dispatchEvent(new CustomEvent(EVENT));
}

/** Count completed units whose key starts with `prefix` ("" = all). */
export function countDone(prefix: string): number {
  const full = NS + prefix;
  let n = 0;
  for (const [k, v] of mem) if (v === "1" && k.startsWith(full)) n++;
  return n;
}

export function onProgressChange(fn: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => fn();
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
