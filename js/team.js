// 读取并显示管理团队、试用团队和退休团队的名单
async function fetchTeamData() {
    try {
        const response = await fetch('js/team.json'); // 修改路径
        const data = await response.json();

        // 调试信息
        console.log('Team Data:', data);

        // 更新管理团队名单
        const managementTeamList = document.getElementById('management_team');
        managementTeamList.innerHTML = '';
        managementTeamList.innerHTML = data.management_team.map(member => member.url ? `<a href="${member.url}" target="_blank">${member.name}</a>` : member.name).join(' | ');

        // 更新试用团队名单
        const trialTeamList = document.getElementById('trial_team');
        trialTeamList.innerHTML = '';
        trialTeamList.innerHTML = data.trial_team.map(member => member.url ? `<a href="${member.url}" target="_blank">${member.name}</a>` : member.name).join(' | ');

        // 更新退休团队名单
        const retiredTeamList = document.getElementById('retired_team');
        retiredTeamList.innerHTML = '';
        retiredTeamList.innerHTML = data.retired_team.map(member => member.url ? `<a href="${member.url}" target="_blank">${member.name}</a>` : member.name).join(' | ');
    } catch (error) {
        console.error('获取团队名单失败:', error);
        document.getElementById('management_team').textContent = '加载失败';
        document.getElementById('trial_team').textContent = '加载失败';
        document.getElementById('retired_team').textContent = '加载失败';
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

    fetchTeamData(); // 加载团队名单
});