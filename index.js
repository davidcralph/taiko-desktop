//Declarations
const util                                                     = require('./modules/util');
const { join }                                                 = require('path');
const DiscordRPC                                               = require('./modules/rpc');
const { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage } = require('electron');


//Electron
let win;

app.on('ready', () => {
  win = new BrowserWindow({height: 600, width: 800 });
  win.loadFile('./public/index.html');
  
  let icon = nativeImage.createFromPath(join(__dirname, 'public', 'icon.png'));
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
});


//Discord RPC
const timestamp = new Date().getTime();

const uRPC = new DiscordRPC({ clientID: '536293982209310730', debug: false }); //debug gang, lets not debug for now

const setActivity = async () => {
      ipcMain.on('RpcToSongSelect', () => {
        uRPC.send('SET_ACTIVITY', util.rpcStatus(timestamp, 'Choosing a song'));
      });

      ipcMain.on('RpcToMainMenu', () => {
        uRPC.send('SET_ACTIVITY', util.rpcStatus(timestamp, 'On the Main Menu'));
      });

      ipcMain.on('RpcToGame', (info, data) => {
        uRPC.send('SET_ACTIVITY', util.rpcStatus(timestamp, data.songname, data.difficulty));
      });

      ipcMain.on('RpcToLoading', () => {
        uRPC.send('SET_ACTIVITY', util.rpcStatus(timestamp, 'Loading...'));
      });

      ipcMain.on('RpcToPaused', () => {
        uRPC.send('SET_ACTIVITY', util.rpcStatus(timestamp, 'Game Paused'));
      });

      ipcMain.on('RpcToMultiplayer', () => {
        uRPC.send('SET_ACTIVITY', util.rpcStatus(timestamp, 'In Multiplayer'));
      });
};

uRPC.on('ready', () => {
  setActivity();
  setInterval(setActivity, 15e3);
});
