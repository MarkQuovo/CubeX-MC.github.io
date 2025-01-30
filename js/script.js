// 使用 mcstatus.io 的API获取服务器状态
async function fetchServerStatus() {
    const SERVER_IP = 'mc.yourserver.com'; // 修改为你的服务器IP
    const API_URL = `https://api.mcsrvstat.us/2/${SERVER_IP}`;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // 更新服务器状态
        document.getElementById('online-players').textContent = data.players.online;
        document.getElementById('max-players').textContent = data.players.max;
        document.getElementById('server-version').textContent = data.version;

        // 更新在线玩家列表
        const playerList = document.getElementById('player-list');
        playerList.innerHTML = '';
        
        if (data.players.list) {
            data.players.list.forEach(player => {
                const li = document.createElement('li');
                li.textContent = player;
                playerList.appendChild(li);
            });
        } else {
            playerList.innerHTML = '<li>暂无在线玩家</li>';
        }
    } catch (error) {
        console.error('获取服务器状态失败:', error);
        document.getElementById('server-status').innerHTML = '<p>❌ 服务器状态获取失败</p>';
    }
}

// 页面加载后自动刷新状态
document.addEventListener('DOMContentLoaded', () => {
    fetchServerStatus();
    setInterval(fetchServerStatus, 10000); // 每10秒刷新一次
});
