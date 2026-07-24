document.addEventListener('DOMContentLoaded', () => {
    requireAuth(['ADMIN']);

    const quizForm = document.getElementById('quizForm');
    if (quizForm) {
        quizForm.addEventListener('submit', saveQuiz);
    }
});

async function saveQuiz(e) {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const imageUrl = document.getElementById('imageUrl').value.trim();
    const duration = parseInt(document.getElementById('duration').value) || 10;
    const price = parseInt(document.getElementById('price').value) || 0;
    const btn = document.getElementById('submitBtn');

    const quizObj = { title, description, imageUrl, duration, price };

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Publishing...';

    try {
        const response = await fetch(`${API_BASE_URL}/quiz`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(quizObj)
        });

        if (response.ok) {
            const savedQuiz = await response.json();
            showToast(`Quiz "${savedQuiz.title}" Created Successfully!`, 'success');
            setTimeout(() => {
                window.location.href = `add-question.html?quizId=${savedQuiz.id}`;
            }, 1000);
        } else {
            showToast('Unable to create quiz', 'error');
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Publish Quiz';
        }
    } catch (err) {
        console.error(err);
        showToast('Server connection error.', 'error');
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Publish Quiz';
    }
}