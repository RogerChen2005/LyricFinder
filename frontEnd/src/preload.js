const { contextBridge, ipcRenderer } = require("electron");    
contextBridge.exposeInMainWorld("electronAPI", {
  filePicker:()=>ipcRenderer.invoke('file-picker'),
  openToolWin:(name)=>ipcRenderer.send('open-tools',name)
});