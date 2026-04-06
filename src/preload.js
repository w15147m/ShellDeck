const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  minimize: () => ipcRenderer.send('window-minimize'),   
  close: () => ipcRenderer.send('window-close'),
  setWindowHeight: (height) => ipcRenderer.send('window-set-height', height),
  setWindowSize: (width, height) => ipcRenderer.send('window-set-size', { width, height }),
  detachNote: (note) => ipcRenderer.send('note-detach', note),
  setPinnedNote: (noteId, pinned) => ipcRenderer.send('note-set-pinned', { noteId, pinned }),
  toggleStandaloneAlwaysOnTop: (noteId, isAlwaysOnTop) => ipcRenderer.send('note-toggle-always-on-top', { noteId, isAlwaysOnTop }),
  getAppSettings: () => ipcRenderer.invoke('get-app-settings'),
  updateAppSettings: (settings) => ipcRenderer.invoke('update-app-settings', settings),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  deleteNote: (noteId) => ipcRenderer.send('note-delete', noteId),
});
