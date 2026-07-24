document.addEventListener('DOMContentLoaded', () => {
    requireAuth(['ADMIN']);
    loadStudents();
});

async function loadStudents() {
    const tbody = document.getElementById('studentTable');
    if (!tbody) return;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/users`);
        if (!response.ok) throw new Error('Failed to fetch students');
        const students = await response.json();

        if (!students || students.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 25px; color: #64748b;">
                        No registered students found in database.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = students.map(student => `
            <tr>
                <td><strong>#${student.id}</strong></td>
                <td><strong><i class="fa-solid fa-user" style="color: #2563eb;"></i> ${escapeHtml(student.username)}</strong></td>
                <td>${escapeHtml(student.email)}</td>
                <td>${escapeHtml(student.phone || 'N/A')}</td>
                <td>${escapeHtml(student.college || 'N/A')}</td>
                <td>${escapeHtml(student.course || 'N/A')}</td>
                <td><span style="background: ${student.role === 'ADMIN' ? '#dbeafe' : '#f1f5f9'}; color: ${student.role === 'ADMIN' ? '#1e40af' : '#475569'}; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600;">${student.role}</span></td>
            </tr>
        `).join('');

    } catch (error) {
        console.error(error);
        tbody.innerHTML = `<tr><td colspan="7" style="color: red; text-align: center; padding: 20px;">Failed to load students list.</td></tr>`;
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