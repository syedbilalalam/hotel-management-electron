const { app, BrowserWindow } = require('electron/main')
const path = require('node:path') // For preload path function
// For child process
const { ipcMain } = require('electron');
// const { exec } = require('child_process');
const { spawn } = require('child_process');
const { dialog } = require('electron');
const cppProcess = spawn('cpp_base.exe');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'assets/app.ico'),  // Set window icon
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      devTools: false, // Disable dev tools
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win.loadFile('./src/index.html');
  // Removeing default menu buttons
  win.setMenuBarVisibility(false);
}

async function showMessage({ type, title, msg, buttons }) {
  if (!buttons)
    buttons = ['OK'];
  try {

    await dialog.showMessageBox({
      type: type,
      title: title,
      message: msg,
      buttons: buttons
    });
    // .then(() => {
    // After the dialog is dismissed, focus on your input
    const inputElement = document.getElementById('your-input-element');
    if (inputElement) {
      inputElement.focus();
    }
    return 'finished';
  } catch (err) {
    (err) => {
      console.error('Error showing dialog:', err);
    };
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    cppProcess.stdin.write('7\n');
    cppProcess.kill('SIGKILL');; // Ensure process is.kill('SIGKILL'); when app quits
    app.quit();
  }
})


// For child process
ipcMain.handle('window-box', async (event, userRequest) => {
  const GUIRequest = JSON.parse(userRequest);
  return new Promise(async (resolve, reject) => {
    await showMessage(GUIRequest);
    resolve("success");
  });
});

// Callback function
let cppReplyCallback = () => { };

// Listening the cpp reply
// Handling CPP language comunications for CPP to GUI
cppProcess.stdout.on('data', (data) => {
  cppReplyCallback(data.toString(), true);
});
cppProcess.stderr.on('data', (data) => {
  cppReplyCallback(data.toString(), false);
});
cppProcess.on('close', (code) => {
  showMessage({ type: 'error', title: 'CPP Communications', msg: 'CPP communication failed! Please restart the app. Code: '+code });
});

// For child process
ipcMain.handle('cp-comm', async (event, userRequest) => {
  const GUIRequest = JSON.parse(userRequest);
  return new Promise((resolve, reject) => {
    // resolve('Hello world');

    // resolve("success");

    if (GUIRequest.exit) {
      cppProcess.stdin.write('7\n');
      cppProcess.kill('SIGKILL');
      app.quit();
      resolve();
      return;
    }
    cppReplyCallback = (reply, isSmooth) => {
      cppReplyCallback = () => { };
      if (isSmooth)
        resolve(reply);
      else
        reject(reply);
    }
    cppProcess.stdin.write(GUIRequest.msg + '\n'); // Send data to `cin` in C++

    // Example of sending more data dynamically, e.g., from your app
    // setTimeout(() => {
    //   cppProcess.stdin.write('Another input\n');
    // }, 2000);
  });
});


// Closing our cpp process
app.on('before-quit', () => {
  cppProcess.stdin.write('7\n');
  cppProcess.kill('SIGKILL');; // Ensure process is.kill('SIGKILL'); when app quits
  app.quit();
});
