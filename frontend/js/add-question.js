document.addEventListener('DOMContentLoaded', async () => {
    requireAuth(['ADMIN']);

    await populateQuizDropdown();

    const quizSelect = document.getElementById('quizSelect');
    if (quizSelect) {
        quizSelect.addEventListener('change', loadExistingQuestions);
    }

    const questionForm = document.getElementById('questionForm');
    if (questionForm) {
        questionForm.addEventListener('submit', saveQuestion);
    }
});

async function populateQuizDropdown() {
    const quizSelect = document.getElementById('quizSelect');
    if (!quizSelect) return;

    const urlParams = new URLSearchParams(window.location.search);
    const paramQuizId = urlParams.get('quizId');

    try {
        const res = await fetch(`${API_BASE_URL}/quiz`);
        if (!res.ok) throw new Error('Failed to fetch quizzes');
        const quizzes = await res.json();

        if (!quizzes || quizzes.length === 0) {
            quizSelect.innerHTML = `<option value="">No Quizzes Available - Create One First</option>`;
            return;
        }

        quizSelect.innerHTML = `<option value="">-- Choose Quiz --</option>` +
            quizzes.map(q => `<option value="${q.id}" ${paramQuizId == q.id ? 'selected' : ''}>#${q.id} - ${escapeHtml(q.title)}</option>`).join('');

        if (quizSelect.value) {
            loadExistingQuestions();
        }
    } catch (e) {
        console.error(e);
        quizSelect.innerHTML = `<option value="">Error loading quizzes</option>`;
    }
}

async function loadExistingQuestions() {
    const quizId = document.getElementById('quizSelect').value;
    const listEl = document.getElementById('existingQuestionsList');
    if (!listEl) return;

    if (!quizId) {
        listEl.innerHTML = `<p style="color: #64748b;">Select a quiz to view questions.</p>`;
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/quiz/${quizId}`);
        if (!res.ok) throw new Error('Failed to fetch questions');
        const questions = await res.json();

        if (!questions || questions.length === 0) {
            listEl.innerHTML = `<p style="color: #64748b; font-size: 14px;">No questions in this quiz yet. Use form on left to add.</p>`;
            return;
        }

        listEl.innerHTML = questions.map((q, index) => `
            <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                    <strong style="font-size: 14px; color: #0f172a;">Q${index + 1}. ${escapeHtml(q.question)}</strong>
                    <button onclick="deleteQuestion(${q.id})" style="background: #ef4444; color: white; border: none; border-radius: 4px; padding: 4px 8px; font-size: 12px; cursor: pointer;">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
                <div style="font-size: 12px; color: #64748b; margin-top: 6px;">
                    <div>A: ${escapeHtml(q.option1)} | B: ${escapeHtml(q.option2)}</div>
                    <div>C: ${escapeHtml(q.option3)} | D: ${escapeHtml(q.option4)}</div>
                    <div style="color: #10b981; font-weight: 600; margin-top: 4px;">Ans: ${escapeHtml(q.answer)}</div>
                </div>
            </div>
        `).join('');

    } catch (e) {
        console.error(e);
        listEl.innerHTML = `<p style="color: red;">Error loading questions.</p>`;
    }
}

async function saveQuestion(e) {
    e.preventDefault();

    const quizId = document.getElementById('quizSelect').value;
    const questionText = document.getElementById('questionText').value.trim();
    const opt1 = document.getElementById('opt1').value.trim();
    const opt2 = document.getElementById('opt2').value.trim();
    const opt3 = document.getElementById('opt3').value.trim();
    const opt4 = document.getElementById('opt4').value.trim();
    const correctVal = document.getElementById('correctAnswer').value;
    const btn = document.getElementById('submitBtn');

    if (!quizId) {
        showToast('Please select a quiz.', 'error');
        return;
    }

    let answerText = opt1;
    if (correctVal === '2') answerText = opt2;
    if (correctVal === '3') answerText = opt3;
    if (correctVal === '4') answerText = opt4;

    const questionObj = {
        question: questionText,
        option1: opt1,
        option2: opt2,
        option3: opt3,
        option4: opt4,
        answer: answerText
    };

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

    try {
        const response = await fetch(`${API_BASE_URL}/quiz/${quizId}/question`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(questionObj)
        });

        if (response.ok) {
            showToast('Question Added Successfully!', 'success');
            document.getElementById('questionText').value = '';
            document.getElementById('opt1').value = '';
            document.getElementById('opt2').value = '';
            document.getElementById('opt3').value = '';
            document.getElementById('opt4').value = '';
            document.getElementById('correctAnswer').value = '';
            loadExistingQuestions();
        } else {
            showToast('Failed to add question.', 'error');
        }
    } catch (err) {
        console.error(err);
        showToast('Server connection error.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-plus"></i> Save Question';
    }
}

async function deleteQuestion(questionId) {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
        const res = await fetch(`${API_BASE_URL}/quiz/question/${questionId}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            showToast('Question deleted successfully.', 'success');
            loadExistingQuestions();
        } else {
            showToast('Failed to delete question.', 'error');
        }
    } catch (e) {
        console.error(e);
        showToast('Error deleting question.', 'error');
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