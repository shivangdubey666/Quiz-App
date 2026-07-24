let currentUser = null;
let currentQuizId = null;
let currentQuizDetails = null;
let questions = [];
let timerInterval = null;
let totalSeconds = 0;
let isSubmitted = false;

document.addEventListener('DOMContentLoaded', async () => {
    currentUser = requireAuth(['STUDENT', 'ADMIN']);
    if (!currentUser) return;

    const urlParams = new URLSearchParams(window.location.search);
    currentQuizId = urlParams.get('quizId');

    if (!currentQuizId) {
        showToast('No quiz selected.', 'error');
        setTimeout(() => window.location.href = 'dashboard.html', 1000);
        return;
    }

    // Verify Access / Purchase
    if (currentUser.role !== 'ADMIN') {
        try {
            const checkRes = await fetch(`${API_BASE_URL}/payment/check?email=${encodeURIComponent(currentUser.email)}&quizId=${currentQuizId}`);
            const isPurchased = await checkRes.json();
            if (!isPurchased) {
                showToast('You must purchase this quiz before attempting it.', 'error');
                setTimeout(() => window.location.href = 'dashboard.html', 1200);
                return;
            }
        } catch (e) {
            console.error('Purchase check failed:', e);
        }
    }

    await loadQuizDetails();
    await loadQuestions();
});

async function loadQuizDetails() {
    try {
        const res = await fetch(`${API_BASE_URL}/quiz/${currentQuizId}/details`);
        if (res.ok) {
            currentQuizDetails = await res.json();
            document.getElementById('quizHeaderTitle').innerText = currentQuizDetails.title || 'Placement Assessment';
            const durationMins = currentQuizDetails.duration || 10;
            totalSeconds = durationMins * 60;
            startTimer();
        }
    } catch (e) {
        console.error('Failed to load quiz details:', e);
        totalSeconds = 10 * 60;
        startTimer();
    }
}

function startTimer() {
    const timerBox = document.getElementById('timerBox');
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            if (!isSubmitted) {
                showToast('Time is up! Auto-submitting assessment...', 'error');
                submitQuiz();
            }
            return;
        }
        totalSeconds--;
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    const timerBox = document.getElementById('timerBox');
    if (!timerBox) return;

    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    timerBox.innerText = formatted;

    if (totalSeconds < 60) {
        timerBox.style.background = '#dc2626';
    }
}

async function loadQuestions() {
    const container = document.getElementById('questionContainer');
    const submitCard = document.getElementById('submitCard');

    try {
        const res = await fetch(`${API_BASE_URL}/quiz/${currentQuizId}`);
        if (!res.ok) throw new Error('Failed to fetch questions');
        questions = await res.json();

        if (!questions || questions.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 50px; background: white; border-radius: 12px;">
                    <h3>No Questions Found</h3>
                    <p style="color: #64748b;">This quiz does not have any questions added yet.</p>
                    <a href="dashboard.html" class="primary-btn" style="display: inline-block; margin-top: 15px;">Back to Dashboard</a>
                </div>
            `;
            return;
        }

        document.getElementById('questionCountBadge').innerText = `Total Questions: ${questions.length}`;

        container.innerHTML = questions.map((q, index) => {
            return `
                <div class="question" style="background: white; padding: 25px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                    <h3 style="color: #0f172a; font-size: 18px; margin-bottom: 18px;">
                        <span style="background: #2563eb; color: white; padding: 2px 10px; border-radius: 6px; font-size: 14px; margin-right: 8px;">Q${index + 1}</span>
                        ${escapeHtml(q.question)}
                    </h3>
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <label style="display: flex; align-items: center; gap: 10px; padding: 12px 16px; border: 1px solid #cbd5e1; border-radius: 8px; cursor: pointer; transition: all 0.2s;" class="option-label">
                            <input type="radio" name="q${index}" value="${escapeHtml(q.option1)}" style="accent-color: #2563eb; width: 18px; height: 18px;">
                            <span style="font-size: 15px; color: #334155;">${escapeHtml(q.option1)}</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px; padding: 12px 16px; border: 1px solid #cbd5e1; border-radius: 8px; cursor: pointer; transition: all 0.2s;" class="option-label">
                            <input type="radio" name="q${index}" value="${escapeHtml(q.option2)}" style="accent-color: #2563eb; width: 18px; height: 18px;">
                            <span style="font-size: 15px; color: #334155;">${escapeHtml(q.option2)}</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px; padding: 12px 16px; border: 1px solid #cbd5e1; border-radius: 8px; cursor: pointer; transition: all 0.2s;" class="option-label">
                            <input type="radio" name="q${index}" value="${escapeHtml(q.option3)}" style="accent-color: #2563eb; width: 18px; height: 18px;">
                            <span style="font-size: 15px; color: #334155;">${escapeHtml(q.option3)}</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px; padding: 12px 16px; border: 1px solid #cbd5e1; border-radius: 8px; cursor: pointer; transition: all 0.2s;" class="option-label">
                            <input type="radio" name="q${index}" value="${escapeHtml(q.option4)}" style="accent-color: #2563eb; width: 18px; height: 18px;">
                            <span style="font-size: 15px; color: #334155;">${escapeHtml(q.option4)}</span>
                        </label>
                    </div>
                </div>
            `;
        }).join('');

        submitCard.style.display = 'block';
        document.getElementById('submitBtn').addEventListener('click', submitQuiz);

    } catch (e) {
        console.error(e);
        container.innerHTML = `<p style="color:red; text-align:center;">Failed to load assessment questions.</p>`;
    }
}

async function submitQuiz() {
    if (isSubmitted) return;
    isSubmitted = true;

    if (timerInterval) clearInterval(timerInterval);

    let score = 0;
    questions.forEach((q, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        if (selected && selected.value.trim().toLowerCase() === q.answer.trim().toLowerCase()) {
            score++;
        }
    });

    const payload = {
        username: currentUser.username,
        email: currentUser.email,
        quizId: parseInt(currentQuizId),
        score: score,
        totalQuestions: questions.length
    };

    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
    }

    try {
        const res = await fetch(`${API_BASE_URL}/result/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Submission failed');
        const savedResult = await res.json();

        localStorage.setItem('lastQuizResult', JSON.stringify(savedResult));
        showToast('Assessment submitted successfully!', 'success');

        setTimeout(() => {
            window.location.href = 'result.html';
        }, 1000);

    } catch (err) {
        console.error(err);
        showToast('Error submitting quiz result. Saving locally...', 'error');
        const fallbackResult = {
            username: currentUser.username,
            quizName: currentQuizDetails ? currentQuizDetails.title : 'Assessment',
            score: score,
            totalQuestions: questions.length,
            percentage: ((score / questions.length) * 100)
        };
        localStorage.setItem('lastQuizResult', JSON.stringify(fallbackResult));
        setTimeout(() => {
            window.location.href = 'result.html';
        }, 1000);
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