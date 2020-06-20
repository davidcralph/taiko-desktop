// Declarations
const util = require('./modules/util');
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
  win = new BrowserWindow({ height: 600, width: 800, webPreferences: { nodeIntegration: true } });
  win.loadFile('./public/index.html');

  if (config.tray === true) {
    let icon = nativeImage.createFromPath(path.join(__dirname, 'public', 'icon.png'));
    let tray = new Tray(icon);
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
if (config.rpc) {
  const timestamp = new Date().getTime();

  const rpc = new Ichigo('536293982209310730');

  ipcMain.on('RpcToSongSelect', () => rpc.send('SET_ACTIVITY', util.rpcStatus(config, timestamp, 'Choosing a song',)));
  ipcMain.on('RpcToMainMenu', () => rpc.send('SET_ACTIVITY', util.rpcStatus(config, timestamp, 'On the Main Menu')));
  ipcMain.on('RpcToGame', (info, data) => rpc.send('SET_ACTIVITY', util.rpcStatus(config, timestamp, data.songname, data.difficulty)));
  ipcMain.on('RpcToLoading', () => rpc.send('SET_ACTIVITY', util.rpcStatus(config, timestamp, 'Loading...')));
  ipcMain.on('RpcToPaused', () => rpc.send('SET_ACTIVITY', util.rpcStatus(config, timestamp, 'Game Paused')));
  ipcMain.on('RpcToMultiplayer', () => rpc.send('SET_ACTIVITY', util.rpcStatus(config, timestamp, 'In Multiplayer')));

  rpc.connect();
}
