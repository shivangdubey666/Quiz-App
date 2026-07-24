document.addEventListener('DOMContentLoaded', async () => {
    const user = requireAuth(['ADMIN']);
    if (!user) return;

    await loadAdminStats();
    await loadAdminQuizzes();
    await loadPurchasesHistory();
});

async function loadAdminStats() {
    try {
        const res = await fetch(`${API_BASE_URL}/dashboard/stats/admin`);
        if (res.ok) {
            const stats = await res.json();
            document.getElementById('adminRevenue').innerText = `₹${stats.totalRevenue || 0}`;
            document.getElementById('adminQuizzes').innerText = stats.totalQuizzes || 0;
            document.getElementById('adminQuestions').innerText = stats.totalQuestions || 0;
            document.getElementById('adminStudents').innerText = stats.totalStudents || 0;
        }
    } catch (e) {
        console.error('Failed to load stats:', e);
    }
}

async function loadAdminQuizzes() {
    const tbody = document.getElementById('adminQuizTableBody');
    if (!tbody) return;

    try {
        const res = await fetch(`${API_BASE_URL}/quiz`);
        if (!res.ok) throw new Error('Failed to load quizzes');
        const quizzes = await res.json();

        if (!quizzes || quizzes.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 25px; color: #64748b;">
                        No quizzes found. Click "Add Quiz" above to publish one.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = quizzes.map(q => `
            <tr>
                <td><strong>#${q.id}</strong></td>
                <td><strong>${escapeHtml(q.title)}</strong></td>
                <td>${q.duration || 10} mins</td>
                <td><strong style="color: #2563eb;">₹${q.price}</strong></td>
                <td>
                    <a href="add-question.html?quizId=${q.id}" class="table-btn" style="background: #2563eb; text-decoration: none; padding: 6px 12px; font-size: 13px; margin-right: 6px;">
                        <i class="fa-solid fa-plus"></i> Add Qs
                    </a>
                    <button onclick="deleteQuiz(${q.id}, '${escapeHtml(q.title)}')" class="table-btn" style="background: #ef4444; padding: 6px 12px; font-size: 13px;">
                        <i class="fa-solid fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `).join('');

    } catch (e) {
        console.error(e);
        tbody.innerHTML = `<tr><td colspan="5" style="color:red; text-align:center;">Failed to load quizzes.</td></tr>`;
    }
}

async function deleteQuiz(id, title) {
    if (!confirm(`Are you sure you want to delete Quiz #${id} ("${title}") and all its questions?`)) {
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/quiz/${id}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            showToast(`Quiz "${title}" deleted successfully.`, 'success');
            loadAdminStats();
            loadAdminQuizzes();
        } else {
            showToast('Failed to delete quiz.', 'error');
        }
    } catch (e) {
        console.error(e);
        showToast('Error connecting to backend server.', 'error');
    }
}

async function loadPurchasesHistory() {
    const tbody = document.getElementById('adminPurchasesTableBody');
    if (!tbody) return;

    try {
        const res = await fetch(`${API_BASE_URL}/payment/purchases/all`);
        if (!res.ok) throw new Error('Failed to load purchases');
        const purchases = await res.json();

        if (!purchases || purchases.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 25px; color: #64748b;">
                        No purchases recorded yet.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = purchases.map(p => `
            <tr>
                <td>#${p.id}</td>
                <td><strong>${escapeHtml(p.username)}</strong></td>
                <td>${escapeHtml(p.email)}</td>
                <td>${escapeHtml(p.quizTitle)}</td>
                <td><strong style="color: #10b981;">₹${p.amount}</strong></td>
                <td><code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 12px;">${escapeHtml(p.paymentId || 'N/A')}</code></td>
            </tr>
        `).join('');

    } catch (e) {
        console.error(e);
        tbody.innerHTML = `<tr><td colspan="6" style="color:red; text-align:center;">Failed to load purchase history.</td></tr>`;
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