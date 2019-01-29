const { ipcRenderer } = require('electron');

const checkPresence = () => {
    if (document.getElementById('frame').contentWindow.document.getElementById('song-select')) ipcRenderer.send('RpcToSongSelect');
    else if (document.getElementById('frame').contentWindow.document.getElementById('game')) {
        if ((document.getElementById('frame').contentWindow.document.getElementById('game').classList.contains('game-paused'))) ipcRenderer.send('RpcToPaused');
        if ((document.getElementById('frame').contentWindow.document.getElementById('game').classList.contains('multiplayer'))) ipcRenderer.send('RpcToMultiplayer');
        const data = {
            "songname": `${document.getElementById('frame').contentWindow.debugObj.controller.selectedSong.title}`,
            "difficulty": `${document.getElementById('frame').contentWindow.debugObj.controller.selectedSong.difficulty}`
        }
        ipcRenderer.send('RpcToGame', data);
    } else if (document.getElementById('frame').contentWindow.document.getElementById('load-song')) ipcRenderer.send('RpcToLoading');
      else ipcRenderer.send('RpcToMainMenu');
}

setInterval(checkPresence, 5000);