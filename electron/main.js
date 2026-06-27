// Electron main process.
// Boots the Next.js production server in-process, then opens a window pointing
// at it. The Java runner (/api/run-java) and all pages are served by Next.
// Progress data is persisted to SQLite (see db.js) via IPC.
const { app, BrowserWindow, ipcMain, shell, Menu } = require("electron");
const path = require("node:path");
const http = require("node:http");
const { createStore } = require("./db");

process.env.NODE_ENV = "production";
process.env.NEXT_TELEMETRY_DISABLED = "1";

const ROOT = path.join(__dirname, "..");
// So the content loader (and the Java runner) find /content when packaged,
// where the process working directory is not the app folder.
process.env.CONTENT_DIR = path.join(ROOT, "content");
let mainWindow = null;
let httpServer = null;
let store = null;

async function startNextServer() {
  const next = require("next");
  const nextApp = next({ dev: false, dir: ROOT });
  await nextApp.prepare();
  const handle = nextApp.getRequestHandler();
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => handle(req, res));
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      httpServer = server;
      resolve(server.address().port);
    });
  });
}

function createWindow(url) {
  mainWindow = new BrowserWindow({
    width: 1320,
    height: 880,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: "#0a0e0d",
    title: "Study",
    icon: path.join(ROOT, "build", "icon.png"),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(url);

  // open target=_blank / external links in the system browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

async function registerDbIpc() {
  store = await createStore(path.join(app.getPath("userData"), "study.sqlite"));
  ipcMain.handle("db:getAll", () => store.getAll());
  ipcMain.on("db:set", (_e, { key, value }) => store.set(key, value));
  ipcMain.on("db:remove", (_e, { key }) => store.remove(key));
}

app.whenReady().then(async () => {
  Menu.setApplicationMenu(null);
  await registerDbIpc();

  let url = process.env.ELECTRON_DEV_URL; // e.g. http://localhost:3000 (next dev)
  if (!url) {
    try {
      const port = await startNextServer();
      url = `http://127.0.0.1:${port}`;
    } catch (err) {
      console.error("Falha ao iniciar o servidor Next:", err);
      const { dialog } = require("electron");
      dialog.showErrorBox(
        "Erro ao iniciar",
        "Não foi possível iniciar o app. Você rodou `npm run build` antes?\n\n" +
          (err && err.message)
      );
      app.quit();
      return;
    }
  }

  createWindow(url);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow(url);
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  if (httpServer) {
    try {
      httpServer.close();
    } catch {
      /* ignore */
    }
  }
});
