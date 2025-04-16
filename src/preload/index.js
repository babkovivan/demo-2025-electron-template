import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  foo: (data) => ipcRenderer.invoke('sendSignal', data),
  getPartners: () => ipcRenderer.invoke('get-partners'),
  addPartner: (data) => ipcRenderer.send('add-partner', data)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('api', {
      getPartners: () => ipcRenderer.invoke('get-partners'),
      addPartner: (data) => ipcRenderer.invoke('add-partner', data) // ← это нужно!
    })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
