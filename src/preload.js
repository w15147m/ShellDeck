const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  minimize: () => ipcRenderer.send('window-minimize'),   
  close: () => ipcRenderer.send('window-close'),
  setWindowHeight: (height) => ipcRenderer.send('window-set-height', height),
  setWindowSize: (width, height) => ipcRenderer.send('window-set-size', { width, height }),
  getAppSettings: () => ipcRenderer.invoke('get-app-settings'),
  updateAppSettings: (settings) => ipcRenderer.invoke('update-app-settings', settings),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  dbGetItems: () => ipcRenderer.invoke('db-get-items'),
  dbSaveItem: (item) => ipcRenderer.invoke('db-save-item', item),
  dbDeleteItem: (id) => ipcRenderer.invoke('db-delete-item', id),
});
