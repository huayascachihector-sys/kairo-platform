// ─── KAIRO Desktop App (Windows) — Electron main ───────────────────────
// Carga la plataforma web de KAIRO en una ventana nativa.
// Ejecutar: npm run build:exe (genera KAIRO-Setup.exe con electron-builder)

const { app, BrowserWindow, shell, Menu } = require("electron");
const path = require("path");

const APP_URL = process.env.KAIRO_APP_URL || "https://kairoedu.vercel.app";
const APP_NAME = "KAIRO";

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: APP_NAME,
    icon: path.join(__dirname, "..", "public", "app-icon.ico"),
    autoHideMenuBar: true,
    backgroundColor: "#050814",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // Firma como navegador para que la web no detecte Electron
  mainWindow.webContents.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  );

  mainWindow.loadURL(APP_URL);

  // Enlaces externos se abren en el navegador del sistema
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http")) shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});