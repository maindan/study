// Key/value persistence for the desktop app, backed by a real SQLite database.
// Uses sql.js (SQLite compiled to WebAssembly) so there is NO native build step
// — it works on any machine. The database lives in a single .sqlite file and is
// saved (debounced) after each write. Falls back to a JSON file if anything
// goes wrong loading the WASM engine.
const fs = require("node:fs");
const path = require("node:path");

async function createStore(dbPath) {
  try {
    const initSqlJs = require("sql.js");
    const SQL = await initSqlJs({
      locateFile: (file) =>
        path.join(path.dirname(require.resolve("sql.js")), file),
    });

    const db = fs.existsSync(dbPath)
      ? new SQL.Database(fs.readFileSync(dbPath))
      : new SQL.Database();
    db.run("CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT)");

    let timer = null;
    const save = () => {
      if (timer) return;
      timer = setTimeout(() => {
        timer = null;
        try {
          fs.writeFileSync(dbPath, Buffer.from(db.export()));
        } catch (e) {
          console.error("[db] erro ao salvar:", e.message);
        }
      }, 150);
    };

    console.log("[db] usando SQLite (sql.js) em", dbPath);
    return {
      kind: "sqlite",
      getAll() {
        const out = {};
        const res = db.exec("SELECT key, value FROM kv");
        if (res.length) for (const r of res[0].values) out[r[0]] = r[1];
        return out;
      },
      set(key, value) {
        db.run("INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)", [
          key,
          value,
        ]);
        save();
      },
      remove(key) {
        db.run("DELETE FROM kv WHERE key = ?", [key]);
        save();
      },
    };
  } catch (err) {
    const jsonPath = dbPath + ".json";
    console.warn(
      "[db] SQLite indisponível (" +
        (err && err.message) +
        "). Usando JSON em " +
        jsonPath
    );
    let data = {};
    try {
      data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    } catch {
      /* ainda não existe */
    }
    const save = () => {
      try {
        fs.writeFileSync(jsonPath, JSON.stringify(data));
      } catch {
        /* ignore */
      }
    };
    return {
      kind: "json",
      getAll() {
        return data;
      },
      set(key, value) {
        data[key] = value;
        save();
      },
      remove(key) {
        delete data[key];
        save();
      },
    };
  }
}

module.exports = { createStore };
