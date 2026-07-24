document.addEventListener('DOMContentLoaded', () => {
    loadLeaderboard();
});

async function loadLeaderboard() {
    const tbody = document.getElementById('leaderboardBody');
    if (!tbody) return;

    try {
        const response = await fetch(`${API_BASE_URL}/result/leaderboard`);
        if (!response.ok) throw new Error('Failed to load leaderboard data');
        const data = await response.json();

        if (!data || data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center; padding:30px; color:#64748b;">
                        No quiz attempts recorded yet.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = data.map((student, index) => {
            const rankClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : 'rank-other';
            const medal = index === 0 ? '🥇 ' : index === 1 ? '🥈 ' : index === 2 ? '🥉 ' : '';
            return `
                <tr>
                    <td><span class="rank-badge ${rankClass}">${index + 1}</span></td>
                    <td><strong>${medal}<i class="fa-solid fa-user" style="color:#2563eb;"></i> ${escapeHtml(student.username)}</strong></td>
                    <td>${escapeHtml(student.quizName || (student.quiz ? student.quiz.title : 'Assessment'))}</td>
                    <td><strong>${student.score}</strong> / ${student.totalQuestions}</td>
                    <td><span style="color:#10b981; font-weight:700;">${student.percentage ? student.percentage.toFixed(1) : 0}%</span></td>
                </tr>
            `;
        }).join('');

    } catch (error) {
        console.error(error);
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center; color:#ef4444; padding:20px;">
                    Failed to connect to leaderboard server.
                </td>
            </tr>
        `;
    }
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}