// For child process
const { contextBridge, ipcRenderer } = require('electron');
// Expose a safe API to the renderer
contextBridge.exposeInMainWorld('electronAPI', {
    runCommand: (commdat) => ipcRenderer.invoke('cp-comm', commdat),
    alertBox: (obj) => ipcRenderer.invoke('window-box', obj)
});

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])
    }
})