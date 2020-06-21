// Discord RPC
const { ipcRenderer } = require('electron');

const checkPresence = () => {
    const iframe = document.getElementById('frame').contentWindow;
    if (iframe.document.getElementById('song-select')) ipcRenderer.send('RpcToSongSelect');
    else if (iframe.document.getElementById('game')) {
        if (iframe.document.getElementById('game').classList.contains('game-paused')) return ipcRenderer.send('RpcToPaused');
        if (iframe.document.getElementById('game').classList.contains('multiplayer')) return ipcRenderer.send('RpcToMultiplayer');
        ipcRenderer.send('RpcToGame', {
            "songname": `${iframe.debugObj.controller.selectedSong.title}`,
            "difficulty": `${iframe.debugObj.controller.selectedSong.difficulty}`
        });
    } 
    else if (iframe.document.getElementById('load-song')) ipcRenderer.send('RpcToLoading');
    else ipcRenderer.send('RpcToMainMenu');
}

setInterval(checkPresence, 7500);

// Config
const config = require(`${require('os').homedir()}\\taikoconfig.json`);

if (!config.url) document.getElementById('frame').src = 'https://taiko.derpyenterprises.org';
else document.getElementById('frame').src = config.url;