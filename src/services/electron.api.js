import { app, BrowserWindow, ipcMain, session, Tray, Menu, nativeImage, globalShortcut, dialog } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { exec, spawn } from 'node:child_process';
import util from 'node:util';

const execAsync = util.promisify(exec);

import { 
  WINDOW_WIDTH, 
  DEFAULT_HEIGHT, 
  MAX_WINDOW_HEIGHT, 
  MIN_WINDOW_HEIGHT, 
  STANDALONE_WIDTH, 
  STANDALONE_HEIGHT 
} from '../common/constants.js';
import DbManager from './db.api.js';

class ElectronManager {
  constructor() {
    this.mainWindow = null;
    this.tray = null;
    this.WINDOW_STATE_PATH = path.join(app.getPath('userData'), 'window-state.json');
    this.STANDALONE_STATES_PATH = path.join(app.getPath('userData'), 'standalone-states.json');
    this.APP_SETTINGS_PATH = path.join(app.getPath('userData'), 'app-settings.json');
    this.DATABASE_PATH = path.join(app.getPath('userData'), 'database.sqlite');
    this.db = new DbManager(this.DATABASE_PATH);
    this.activeChild = null;
  }

  init() {
    const gotTheLock = app.requestSingleInstanceLock();

    if (!gotTheLock) {
      app.quit();
      return;
    }

    app.on('second-instance', () => {
      // Someone tried to run a second instance, we should focus our window.
      if (this.mainWindow) {
        if (!this.mainWindow.isVisible()) this.mainWindow.show();
        if (this.mainWindow.isMinimized()) this.mainWindow.restore();
        this.mainWindow.focus();
      }
    });

    this.registerIpcHandlers();
    
    app.whenReady().then(() => {
      this.setupWebRequests();
      this.createMainWindow();
      this.createTray();
      this.updateLoginItemSettings();

      // Developer Tools Shortcuts
      globalShortcut.register('CommandOrControl+R', () => {
        if (this.mainWindow && this.mainWindow.isFocused()) {
          this.mainWindow.reload();
        }
      });

      globalShortcut.register('CommandOrControl+Shift+I', () => {
        if (this.mainWindow && this.mainWindow.isFocused()) {
          this.mainWindow.webContents.toggleDevTools();
        }
      });
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createMainWindow();
      }
    });

    app.on('before-quit', () => {
      this.saveWindowState(this.mainWindow);
    });
  }

  setupWebRequests() {
    session.defaultSession.webRequest.onBeforeSendHeaders(
      { urls: ['https://*.tiny.cloud/*'] },
      (details, callback) => {
        details.requestHeaders['Referer'] = 'http://localhost';
        callback({ requestHeaders: details.requestHeaders });
      }
    );
  }

  loadAppSettings() {
    try {
      if (fs.existsSync(this.APP_SETTINGS_PATH)) {
        return JSON.parse(fs.readFileSync(this.APP_SETTINGS_PATH, 'utf8'));
      }
    } catch (err) {
      console.error('Failed to load app settings:', err);
    }
    // Default settings
    return { launchOnStartup: true, startInBackground: true, alwaysOnTop: false };
  }

  saveAppSettings(settings) {
    try {
      fs.writeFileSync(this.APP_SETTINGS_PATH, JSON.stringify(settings));
      this.updateLoginItemSettings(settings.launchOnStartup);
    } catch (err) {
      console.error('Failed to save app settings:', err);
    }
  }

  loadWindowState() {
    try {
      if (fs.existsSync(this.WINDOW_STATE_PATH)) {
        return JSON.parse(fs.readFileSync(this.WINDOW_STATE_PATH, 'utf8'));
      }
    } catch (err) {
      console.error('Failed to load window state:', err);
    }
    return { width: WINDOW_WIDTH, height: DEFAULT_HEIGHT }; 
  }

  saveWindowState(window) {
    if (!window || window.isDestroyed()) return;
    try {
      const bounds = window.getBounds();
      if (bounds.width <= 100 || bounds.height <= 100) return;
      fs.writeFileSync(this.WINDOW_STATE_PATH, JSON.stringify(bounds));
    } catch (err) {
      console.error('Failed to save window state:', err);
    }
  }

  loadStandaloneStates() {
    try {
      if (fs.existsSync(this.STANDALONE_STATES_PATH)) {
        return JSON.parse(fs.readFileSync(this.STANDALONE_STATES_PATH, 'utf8'));
      }
    } catch (err) {
      console.error('Failed to load standalone states:', err);
    }
    return {};
  }

  saveStandaloneState(noteId, window, pinned = null) {
    if ((!window || window.isDestroyed()) && pinned === null) return;
    try {
      const states = this.loadStandaloneStates();
      const currentState = states[noteId] || {};
      
      if (window && !window.isDestroyed()) {
        const bounds = window.getBounds();
        states[noteId] = { ...currentState, ...bounds };
      }
      
      if (pinned !== null) {
        states[noteId] = { ...states[noteId], pinned };
      }
      
      fs.writeFileSync(this.STANDALONE_STATES_PATH, JSON.stringify(states));
    } catch (err) {
      console.error('Failed to save standalone state:', err);
    }
  }

  createMainWindow() {
    const windowState = this.loadWindowState();
    const settings = this.loadAppSettings();
    const iconPath = path.join(app.getAppPath(), 'assets/icons/icon.png');

    // Show window by default unless --start-hidden is passed
    // In production/packaged apps, args might be shifted. We'll check all args.
    const startHidden = process.argv.includes('--start-hidden');
    const showWindow = !startHidden;

    this.mainWindow = new BrowserWindow({
      x: windowState.x,
      y: windowState.y,
      width: WINDOW_WIDTH,
      height: DEFAULT_HEIGHT,
      frame: false,
      transparent: true,
      show: showWindow, // Controlled by flag
      alwaysOnTop: !!settings.alwaysOnTop,
      skipTaskbar: true,
      // Removed type: 'utility' to ensure it follows standard window rules for Activities overview
      backgroundColor: '#00000000',
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
      },
      icon: iconPath,
      title: 'Sticky Notes',
    });

    let saveTimeout;
    const save = () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => this.saveWindowState(this.mainWindow), 500);
    };
    
    this.mainWindow.on('move', save);
    this.mainWindow.on('resize', save);

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      this.mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
      this.mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }
  }

  createTray() {
    try {
      const iconPath = path.join(app.getAppPath(), 'assets/icons/tray-icon.png');
      
      if (!fs.existsSync(iconPath)) {
        console.error('Tray icon not found at:', iconPath);
        return;
      }

      // Create a crisp native image for the tray
      let trayIcon = nativeImage.createFromPath(iconPath);
      // Resize it to 32x32 (standard for crisp tray icons on most high-res Linux environments)
      trayIcon = trayIcon.resize({ width: 32, height: 32 });

      this.tray = new Tray(trayIcon);
      
      const contextMenu = Menu.buildFromTemplate([
        { 
          label: 'Show/Hide Notes', 
          click: () => {
            if (this.mainWindow.isVisible()) {
              this.mainWindow.hide();
            } else {
              this.mainWindow.show();
            }
          } 
        },
        { type: 'separator' },
        { label: 'Quit', click: () => app.quit() }
      ]);

      this.tray.setToolTip('Sticky Notes');
      this.tray.setContextMenu(contextMenu);

      this.tray.on('click', () => {
        if (this.mainWindow.isVisible()) {
          this.mainWindow.hide();
        } else {
          this.mainWindow.show();
          this.mainWindow.focus();
        }
      });
    } catch (err) {
      console.error('Failed to create tray:', err);
    }
  }

  registerIpcHandlers() {
    try {
      console.log('IPC: Initializing Handlers...');

      // Database Handlers (Prioritized)
      console.log('IPC: Registering db-get-items');
      ipcMain.handle('db-get-items', () => {
        return this.db.getItems();
      });

      ipcMain.handle('execute-command', async (event, commandStr) => {
        try {
          const { stdout, stderr } = await execAsync(commandStr);
          if (stderr) console.warn('Command Warning:', stderr);
          return { success: true, output: stdout };
        } catch (error) {
          console.error('Command Error:', error);
          return { success: false, error: error.message };
        }
      });

      ipcMain.on('execute-command-stream', (event, commandStr) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (!win) return;

        const safeSend = (channel, data) => {
          if (win && !win.isDestroyed() && !win.webContents.isDestroyed()) {
            win.webContents.send(channel, data);
          }
        };

        // Kill existing if any
        if (this.activeChild) {
          try { 
            this.activeChild.stdin.end();
            this.activeChild.kill(); 
          } catch (e) {}
        }

        let processedCommand = commandStr.trim();
        
        // Auto-handle sudo: inject -S to read from stdin (our app) instead of TTY
        // We removed -p "" because users NEED to see the prompt to know when to type!
        if (processedCommand.startsWith('sudo ') && !processedCommand.includes(' -S')) {
          processedCommand = processedCommand.replace(/^sudo /, 'sudo -S ');
        }

        console.log('IPC: Executing streaming command:', processedCommand);
        
        this.activeChild = spawn(processedCommand, [], { 
          shell: true
        });

        this.activeChild.stdout.on('data', (data) => {
          safeSend('command-output', { type: 'stdout', data: data.toString() });
        });

        this.activeChild.stderr.on('data', (data) => {
          // sudo prompts and errors usually come through stderr
          safeSend('command-output', { type: 'stderr', data: data.toString() });
        });

        this.activeChild.on('close', (code) => {
          this.activeChild = null;
          safeSend('command-finished', { code });
        });

        this.activeChild.on('error', (err) => {
          this.activeChild = null;
          safeSend('command-output', { type: 'error', data: err.message });
          safeSend('command-finished', { code: 1 });
        });
      });

      ipcMain.on('command-input', (event, text) => {
        if (this.activeChild && this.activeChild.stdin && this.activeChild.stdin.writable) {
          console.log('IPC: Writing to stdin:', text);
          this.activeChild.stdin.write(text + '\n');
        } else {
          console.log('IPC: Cannot write to stdin (child not active or not writable)');
        }
      });

      console.log('IPC: Registering db-save-item');
      ipcMain.handle('db-save-item', (event, item) => {
        return this.db.saveItem(item);
      });

      console.log('IPC: Registering db-delete-item');
      ipcMain.handle('db-delete-item', (event, id) => {
        return this.db.deleteItem(id);
      });

      // Window Handlers
      ipcMain.on('window-minimize', (event) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (win && !win.isDestroyed()) win.minimize();
      });

      ipcMain.on('window-set-size', (event, { width, height }) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (win && !win.isDestroyed()) {
          const bounds = win.getBounds();
          win.setBounds({ 
            x: bounds.x, 
            y: bounds.y, 
            width: Math.ceil(width), 
            height: Math.ceil(height) 
          }, true);
        }
      });

      ipcMain.on('window-close', (event) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (win && !win.isDestroyed()) {
          if (win === this.mainWindow) {
            win.hide();
          } else {
            win.close();
          }
        }
      });

      ipcMain.on('window-set-height', (event, height) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (!win || win.isDestroyed()) return;

        const bounds = win.getBounds();
        if (bounds.width <= 100) return;

        const heightToSet = Math.min(Math.max(height, MIN_WINDOW_HEIGHT), MAX_WINDOW_HEIGHT);
        
        if (bounds.height !== heightToSet) {
          win.setResizable(true);
          win.setBounds({ 
            x: bounds.x, 
            y: bounds.y, 
            width: bounds.width, 
            height: heightToSet 
          }, true);
          win.setResizable(false);
        }
      });

      ipcMain.handle('get-app-settings', () => {
        return this.loadAppSettings();
      });

      ipcMain.handle('update-app-settings', (event, settings) => {
        this.saveAppSettings(settings);
        const alwaysOnTop = !!settings.alwaysOnTop;
        if (this.mainWindow && !this.mainWindow.isDestroyed()) {
          this.mainWindow.setAlwaysOnTop(alwaysOnTop);
        }
      });

      ipcMain.handle('get-app-version', () => {
        return `v${app.getVersion()}`;
      });

      ipcMain.handle('pick-path', async (event, options) => {
        try {
          const defaultOptions = {
            properties: ['openFile', 'openDirectory', 'showHiddenFiles'],
            defaultPath: app.getPath('home'),
            title: 'Select File or Folder'
          };
          
          // Merge provided options with defaults to preserve defaultPath
          const finalOptions = { ...defaultOptions, ...(options || {}) };
          console.log('IPC: Opening file dialog with options:', finalOptions);
          
          const result = await dialog.showOpenDialog(finalOptions);
          console.log('IPC: Dialog result:', result.canceled ? 'Canceled' : result.filePaths[0]);
          
          return result.canceled ? null : result.filePaths[0];
        } catch (err) {
          console.error('IPC: pick-path error:', err);
          return null;
        }
      });

      console.log('IPC: Handlers registration complete.');
    } catch (err) {
      console.error('IPC: Handlers registration FAILURE:', err);
    }
  }

  updateLoginItemSettings(enabled = null) {
    try {
      let shouldOpenAtLogin = enabled;
      const settings = this.loadAppSettings(); 

      // If enabled arg is not provided, load from settings
      if (shouldOpenAtLogin === null) {
        shouldOpenAtLogin = settings.launchOnStartup;
      }

      console.log('Updating Login Item Settings:', shouldOpenAtLogin);
      
      if (process.platform === 'linux') {
        const autostartDir = path.join(os.homedir(), '.config', 'autostart');
        const desktopFilePath = path.join(autostartDir, 'sticky-notes.desktop');

        if (shouldOpenAtLogin) {
            if (!fs.existsSync(autostartDir)) {
                fs.mkdirSync(autostartDir, { recursive: true });
            }
            
            const hideFlag = settings.startInBackground ? ' --start-hidden' : '';
            
            let execCommand = process.execPath;
            if (!app.isPackaged) {
                // In dev mode, we need to pass the app path
                execCommand = `"${process.execPath}" "${app.getAppPath()}"`; 
            } else {
                execCommand = `"${process.execPath}"`;
            }
            execCommand += hideFlag;
            
            const iconPath = path.join(app.getAppPath(), 'assets/icons/icon.png');

            const desktopContent = `[Desktop Entry]
Type=Application
Version=1.0
Name=Sticky Notes
Comment=Sticky Notes Application
Exec=${execCommand}
Icon=${iconPath}
StartupNotify=false
Terminal=false
`;
            fs.writeFileSync(desktopFilePath, desktopContent);
        } else {
            if (fs.existsSync(desktopFilePath)) {
                fs.unlinkSync(desktopFilePath);
            }
        }
      } else {
        // Fallback for Windows/Mac
        app.setLoginItemSettings({
            openAtLogin: !!shouldOpenAtLogin,
            path: process.execPath,
            args: settings.startInBackground ? ['--start-hidden'] : []
        });
      }
    } catch (err) {
      console.error('Failed to update login item settings:', err);
    }
  }
}

export default new ElectronManager();
