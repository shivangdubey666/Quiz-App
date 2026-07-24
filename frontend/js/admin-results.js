document.addEventListener('DOMContentLoaded', () => {
    requireAuth(['ADMIN']);
    loadResults();
});

async function loadResults() {
    const tbody = document.getElementById('resultTable');
    if (!tbody) return;

    try {
        const response = await fetch(`${API_BASE_URL}/result/all`);
        if (!response.ok) throw new Error('Failed to fetch results');
        const results = await response.json();

        if (!results || results.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 25px; color: #64748b;">
                        No quiz attempts recorded yet.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = results.map(res => `
            <tr>
                <td><strong>#${res.id}</strong></td>
                <td><strong><i class="fa-solid fa-user" style="color: #2563eb;"></i> ${escapeHtml(res.username)}</strong></td>
                <td>${escapeHtml(res.email)}</td>
                <td>${escapeHtml(res.quizName || (res.quiz ? res.quiz.title : 'Assessment'))}</td>
                <td><strong>${res.score}</strong></td>
                <td>${res.totalQuestions}</td>
                <td><strong style="color: #10b981;">${res.percentage ? res.percentage.toFixed(1) : 0}%</strong></td>
            </tr>
        `).join('');

    } catch (error) {
        console.error(error);
        tbody.innerHTML = `<tr><td colspan="7" style="color: red; text-align: center; padding: 20px;">Failed to load results data.</td></tr>`;
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