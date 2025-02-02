// 获取服务器状态 mcstatus.io API
async function fetchServerStatus(server) {
    const API_URL = `https://api.mcsrvstat.us/2/${server.ip}`;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // 添加调试信息
        console.log(`API Response for ${server.name}:`, data);

        // 更新服务器状态
        document.getElementById(`status-${server.id}`).textContent = data.online ? '在线' : '离线';
        document.getElementById(`online-players-${server.id}`).textContent = data.players ? data.players.online : '0';
        document.getElementById(`max-players-${server.id}`).textContent = data.players ? data.players.max : '0';
        document.getElementById(`server-version-${server.id}`).textContent = data.version || '未知';

        // 更新在线玩家列表
        const playerList = document.getElementById(`player-list-${server.id}`);
        playerList.innerHTML = '';
        if (data.players && data.players.list && data.players.list.length > 0) {
            data.players.list.forEach(player => {
                const li = document.createElement('li');
                li.textContent = player;
                playerList.appendChild(li);
            });
        } else {
            playerList.innerHTML = '<li>暂无在线玩家</li>';
        }
    } catch (error) {
        console.error(`获取服务器状态失败 (${server.name}):`, error);
        document.getElementById(`server-status-${server.id}`).innerHTML = '<p>❌ 服务器状态获取失败</p>';
    }
}

// 页面加载后自动刷新状态
document.addEventListener('DOMContentLoaded', () => {
    const servers = [
        { id: 'main', ip: 'play.cubexmc.top', name: '主服务器' },
        { id: 'nostalgia', ip: 's1.steve3184.top:26666', name: '怀旧服' },
        { id: 'HXLS', ip: 's2.Wemc.cc:13445', name: 'HXLS服务器' }
    ];

    servers.forEach(server => {
        fetchServerStatus(server);
        setInterval(() => fetchServerStatus(server), 600000); // 每10分钟刷新一次
    });
});