// 使用 mcstatus.io 的API获取服务器状态（修复版）
async function fetchServerStatus() {
    const SERVER_IP = 'play.cubexmc.top'; // 服务器地址
    const SERVER_PORT = '25565'; // Minecraft默认端口
    const API_URL = `https://api.mcsrvstat.us/2/${SERVER_IP}:${SERVER_PORT}`; // 包含端口号

    try {
        // 发起API请求
        const response = await fetch(API_URL);
        
        // 处理HTTP错误状态码（如404/500）
        if (!response.ok) {
            throw new Error(`HTTP错误: ${response.status}`);
        }

        // 解析JSON数据
        const data = await response.json();
        
        // 处理服务器离线状态
        if (!data.online) {
            throw new Error("服务器当前处于离线状态");
        }

        // 安全地更新服务器状态（使用可选链操作符）
        document.getElementById('online-players').textContent = data.players?.online || 0;
        document.getElementById('max-players').textContent = data.players?.max || 20;
        document.getElementById('server-version').textContent = data.version || '未知版本';

        // 更新在线玩家列表
        const playerList = document.getElementById('player-list');
        playerList.innerHTML = '';
        
        if (data.players?.list?.length > 0) {
            data.players.list.forEach(player => {
                const li = document.createElement('li');
                li.textContent = player;
                li.style.padding = '5px';
                li.style.margin = '3px 0';
                li.style.backgroundColor = '#3a3a3a';
                li.style.borderRadius = '4px';
                playerList.appendChild(li);
            });
        } else {
            playerList.innerHTML = '<li style="color: #888;">当前没有在线玩家</li>';
        }

    } catch (error) {
        console.error('状态获取失败:', error);
        
        // 显示详细的错误信息
        document.getElementById('server-status').innerHTML = `
            <div style="color: #ff4444; background: #2d2d2d; padding: 10px; border-radius: 5px;">
                <p>❌ 状态获取失败: ${error.message}</p>
                <small>错误详情请查看控制台 (F12)</small>
            </div>
        `;
    }
}

// 页面初始化
document.addEventListener('DOMContentLoaded', () => {
    // 立即获取状态
    fetchServerStatus();
    
    // 设置定时刷新（每10秒）
    const interval = setInterval(fetchServerStatus, 10000);
    
    // 页面卸载时清理定时器
    window.addEventListener('beforeunload', () => {
        clearInterval(interval);
    });
});