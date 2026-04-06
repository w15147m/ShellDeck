import { app, globalShortcut, Menu } from 'electron';
import started from 'electron-squirrel-startup';
import electronManager from './services/electron.api.js';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

// Remove the default menu
Menu.setApplicationMenu(null);

// Initialize Electron Manager
electronManager.init();

// Global shortcuts can be registered here in the future

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
