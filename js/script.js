// 使用 mcstatus.io 的API获取服务器状态
async function fetchServerStatus() {
    const SERVER_ADDRESS = 'frp-hub.top:29808'; // 替换为你的服务器地址
    const API_URL = `https://api.mcstatus.io/v2/status/java/${SERVER_ADDRESS}`;

    try {
        // 发起API请求并解析JSON数据
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            params: {
                query: true, // 启用查询查找
                timeout: 5.0  // 设置超时时间为5秒
            }
        });

        if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
        const data = await response.json();

        // 检查服务器是否在线
        if (!data?.online) throw new Error("服务器离线或数据无效");

        // 更新页面元素
        updateElements(data);
    } catch (error) {
        console.error('状态获取失败:', error);
        showError(error.message);
    }
}

function updateElements(data) {
    const elements = {
        'online-players': data.players?.online || 0,
        'max-players': data.players?.max || 20,
        'server-version': data.version?.name_clean || '未知版本',
        'player-list': getPlayerListHtml(data.players?.list)
    };

    Object.entries(elements).forEach(([id, content]) => {
        const element = document.getElementById(id);
        if (element) element.innerHTML = content;
    });
}

function getPlayerListHtml(players) {
    if (!players || players.length === 0) return '<li style="color: #888;">当前没有在线玩家</li>';

    return players.map(player => `
        <li style="padding: 5px; margin: 3px 0; background-color: #3a3a3a; border-radius: 4px;">
            ${player.name_clean}
        </li>
    `).join('');
}

function showError(message) {
    const serverStatusElement = document.getElementById('server-status');
    if (serverStatusElement) {
        serverStatusElement.innerHTML = `
            <div style="color: #ff4444; background: #2d2d2d; padding: 10px; border-radius: 5px;">
                <p>❌ 状态获取失败: ${message}</p>
                <small>错误详情请查看控制台 (F12)</small>
            </div>
        `;
    } else {
        console.error('错误显示区域未找到');
    }
}

// 页面初始化
document.addEventListener('DOMContentLoaded', () => {
    // 立即获取状态并设置定时刷新（每10秒）
    let interval;
    fetchServerStatus().then(() => {
        interval = setInterval(fetchServerStatus, 10000);
    });

    // 页面卸载时清理定时器
    window.addEventListener('beforeunload', () => clearInterval(interval));
});

// 获取服务器状态
async function fetchServerStatus() {
    const SERVER_IP = 'play.cubexmc.top'; // 修改为你的服务器IP
    const API_URL = `https://api.mcsrvstat.us/2/${SERVER_IP}`;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // 添加调试信息
        console.log('API Response:', data);

        // 更新服务器状态
        document.getElementById('status').textContent = data.online ? '在线' : '离线';
        document.getElementById('online-players').textContent = data.players ? data.players.online : '0';
        document.getElementById('max-players').textContent = data.players ? data.players.max : '0';
        document.getElementById('server-version').textContent = data.version || '未知';

        // 更新在线玩家列表
        const playerList = document.getElementById('player-list');
        playerList.innerHTML = '';
        if (data.players && data.players.list && data.players.list.length > 0) {
            data.players.list.forEach(player => {
                const li = document.createElement('li');
                li.textContent = player.name; // 确保使用正确的属性名
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
    setInterval(fetchServerStatus, 600000); // 每10分钟刷新一次
});