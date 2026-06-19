const { app, BrowserWindow, session } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    title: 'Estate Dashboard',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // Allow fetching from Yahoo Finance / Stooq directly (no CORS in Electron)
    },
  });

  // Remove CORS restrictions for stock price fetches
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
    details.requestHeaders['Referer'] = 'https://finance.yahoo.com/';
    callback({ requestHeaders: details.requestHeaders });
  });

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const headers = { ...details.responseHeaders };
    headers['access-control-allow-origin'] = ['*'];
    callback({ responseHeaders: headers });
  });

  win.loadFile('estate-dashboard.html');

  // Open DevTools only in dev mode
  if (process.argv.includes('--dev')) {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
