document.addEventListener('DOMContentLoaded', async () => {
    const user = getUser();
    const resultData = JSON.parse(localStorage.getItem('lastQuizResult'));

    if (!resultData) {
        window.location.href = 'dashboard.html';
        return;
    }

    document.getElementById('resUsername').innerText = resultData.username || (user ? user.username : 'Student');
    document.getElementById('resQuizName').innerText = resultData.quizName || (resultData.quiz ? resultData.quiz.title : 'Assessment');
    document.getElementById('resScore').innerText = `${resultData.score} / ${resultData.totalQuestions}`;
    
    const pct = resultData.percentage !== undefined ? resultData.percentage : ((resultData.score / resultData.totalQuestions) * 100);
    document.getElementById('resPercentage').innerText = `${pct.toFixed(1)}%`;

    // Fetch Rank from Leaderboard
    try {
        const res = await fetch(`${API_BASE_URL}/result/leaderboard`);
        if (res.ok) {
            const leaderboard = await res.json();
            const emailToFind = resultData.email || (user ? user.email : null);
            const index = leaderboard.findIndex(item => item.email === emailToFind || item.username === resultData.username);
            if (index !== -1) {
                document.getElementById('resRank').innerText = `#${index + 1}`;
            } else {
                document.getElementById('resRank').innerText = `#1`;
            }
        }
    } catch (e) {
        console.error('Failed to fetch rank:', e);
        document.getElementById('resRank').innerText = `#--`;
    }
});