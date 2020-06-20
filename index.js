// Declarations
const path = require('path');
const { Ichigo } = require('@augu/ichigo');
const fs = require('fs');
const { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage } = require('electron');

// Config
const homedir = require('os').homedir();
const sample = { 
  "url": "https://taiko.derpyenterprises.org",
  "rpc": true,
  "tray": true
}
if (!fs.existsSync(`${homedir}\\taikoconfig.json`)) fs.writeFileSync(`${homedir}\\taikoconfig.json`, JSON.stringify(sample));
const config = require(`${homedir}\\taikoconfig.json`);

// Electron
let win;
app.commandLine.appendSwitch('disable-site-isolation-trials'); // Fix stuff

app.on('ready', () => {
  win = new BrowserWindow({ 
    height: 600, 
    width: 800, 
    webPreferences: { 
      nodeIntegration: true 
    } 
  });
  win.loadFile('./public/index.html');

  if (config.tray === true) {
    let tray = new Tray(nativeImage.createFromPath(path.join(__dirname, 'public', 'icon.png')));
    let contextMenu = Menu.buildFromTemplate([{
        label: 'Show',
        click: () => win.show()
      },
      {
        label: 'Hide',
        click: () => win.close()
      },
      {
        label: 'Quit',
        click: () => {
          app.isQuiting = true;
          tray.destroy();
          process.exit(3);
        }
      },
    ]);
    tray.setContextMenu(contextMenu);
    tray.setToolTip('Taiko Desktop');
  }
});


// Discord RPC
const rpcStatus = (timestamp, content, optional) => {
  return {
      pid: process.pid,
      activity: {
          details: `Playing on ${config.url}`,
          state: content,
          timestamps: { start: timestamp },
          assets: {
              large_image: 'background',
              large_text: 'Taiko Desktop',
              small_image: optional ? optional : 'null',
              small_text: optional ? optional[0].toUpperCase() + optional.substr(1) : 'null'
          },
          instance: false
      }
  }
}

if (config.rpc) {
  const timestamp = new Date().getTime();

  const rpc = new Ichigo('536293982209310730');

  ipcMain.on('RpcToSongSelect', () => rpc.send('SET_ACTIVITY', rpcStatus(timestamp, 'Choosing a song',)));
  ipcMain.on('RpcToMainMenu', () => rpc.send('SET_ACTIVITY', rpcStatus(timestamp, 'On the Main Menu')));
  ipcMain.on('RpcToGame', (_info, data) => rpc.send('SET_ACTIVITY', rpcStatus(timestamp, data.songname, data.difficulty)));
  ipcMain.on('RpcToLoading', () => rpc.send('SET_ACTIVITY', rpcStatus(timestamp, 'Loading...')));
  ipcMain.on('RpcToPaused', () => rpc.send('SET_ACTIVITY', rpcStatus(timestamp, 'Game Paused')));
  ipcMain.on('RpcToMultiplayer', () => rpc.send('SET_ACTIVITY', rpcStatus(timestamp, 'In Multiplayer')));

  rpc.connect();
}
