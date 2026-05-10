const BACKEND_URL = "https://your-render-app.onrender.com/api";
let queue = [];

async function searchMusic() {
    const query = document.getElementById('searchInput').value;
    const res = await fetch(`${BACKEND_URL}/search?query=${query}`);
    const data = await res.json();
    
    const grid = document.getElementById('resultsGrid');
    grid.innerHTML = data.data.map(track => `
        <div class="card" onclick="addToQueue('${track.info.identifier}', '${track.info.title}')">
            <img src="https://img.youtube.com/vi/${track.info.identifier}/hqdefault.jpg">
            <h4>${track.info.title}</h4>
        </div>
    `).join('');
}

function addToQueue(id, title) {
    queue.push({ id, title });
    updateQueueUI();
    if (document.getElementById('mainPlayer').paused && queue.length === 1) {
        playSong(queue[0]);
    }
}

async function playSong(song) {
    const player = document.getElementById('mainPlayer');
    document.getElementById('trackTitle').innerText = song.title;
    
    // Use your backend to get the playable stream URL
    const res = await fetch(`${BACKEND_URL}/stream?id=${song.id}`);
    player.src = await res.text();
    player.play();
}

function playNext() {
    queue.shift();
    updateQueueUI();
    if (queue.length > 0) playSong(queue[0]);
}

function updateQueueUI() {
    const list = document.getElementById('queueList');
    list.innerHTML = queue.map(s => `<li>${s.title}</li>`).join('');
}
