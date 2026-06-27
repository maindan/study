// Exposes a minimal, safe DB bridge to the renderer (the Next.js app).
// The renderer uses window.studyDB to persist progress to SQLite.
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("studyDB", {
  getAll: () => ipcRenderer.invoke("db:getAll"),
  set: (key, value) => ipcRenderer.send("db:set", { key, value }),
  remove: (key) => ipcRenderer.send("db:remove", { key }),
});
