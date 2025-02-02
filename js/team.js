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
        managementTeamList.innerHTML = data.management_team.map(member => member.url ? `<a href="${member.url}" target="_blank" style="text-decoration: none; color: inherit;">${member.name}</a>` : member.name).join(' | ');

        // 更新试用团队名单
        const trialTeamList = document.getElementById('trial_team');
        trialTeamList.innerHTML = '';
        trialTeamList.innerHTML = data.trial_team.map(member => member.url ? `<a href="${member.url}" target="_blank" style="text-decoration: none; color: inherit;">${member.name}</a>` : member.name).join(' | ');

        // 更新退休团队名单
        const retiredTeamList = document.getElementById('retired_team');
        retiredTeamList.innerHTML = '';
        retiredTeamList.innerHTML = data.retired_team.map(member => member.url ? `<a href="${member.url}" target="_blank" style="text-decoration: none; color: inherit;">${member.name}</a>` : member.name).join(' | ');
    } catch (error) {
        console.error('获取团队名单失败:', error);
        document.getElementById('management_team').textContent = '加载失败';
        document.getElementById('trial_team').textContent = '加载失败';
        document.getElementById('retired_team').textContent = '加载失败';
    }
}

// 页面加载后自动刷新状态
document.addEventListener('DOMContentLoaded', () => {
    fetchTeamData(); // 加载团队名单
});