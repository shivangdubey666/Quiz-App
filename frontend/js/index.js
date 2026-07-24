document.addEventListener('DOMContentLoaded', () => {
    loadQuizzes();
    loadTopPerformers();
});

let purchasedQuizIds = new Set();

async function loadQuizzes() {
    const container = document.getElementById('quizContainer');
    if (!container) return;

    const user = getUser();
    if (user && user.email) {
        try {
            const res = await fetch(`${API_BASE_URL}/payment/purchases/${encodeURIComponent(user.email)}`);
            if (res.ok) {
                const purchases = await res.json();
                purchases.forEach(p => purchasedQuizIds.add(p.quizId));
            }
        } catch (err) {
            console.error('Failed to load user purchases:', err);
        }
    }

    try {
        const response = await fetch(`${API_BASE_URL}/quiz`);
        if (!response.ok) throw new Error('Failed to fetch quizzes');
        const quizzes = await response.json();

        if (!quizzes || quizzes.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px; background: white; border-radius: 12px;">
                    <h3>No Quizzes Available</h3>
                    <p style="color:#64748b;">Quizzes will appear here once created by Admin.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = quizzes.map(quiz => {
            const isPurchased = purchasedQuizIds.has(quiz.id) || (user && user.role === 'ADMIN');
            const img = quiz.imageUrl || defaultQuizImage(quiz.title);
            const duration = quiz.duration || 10;
            const desc = quiz.description || `${quiz.title} assessment and placement practice questions.`;

            return `
                <div class="quiz-card">
                    <div class="quiz-card-header">
                        <img src="${img}" alt="${quiz.title}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop';">
                        <span class="quiz-duration-badge"><i class="fa-regular fa-clock"></i> ${duration} mins</span>
                    </div>
                    <div class="quiz-card-body">
                        <h3>${escapeHtml(quiz.title)}</h3>
                        <p>${escapeHtml(desc)}</p>
                        <div class="quiz-card-footer">
                            <span class="quiz-price">₹${quiz.price}</span>
                            ${isPurchased ? `
                                <button class="btn-start" onclick="startQuiz(${quiz.id})">
                                    <i class="fa-solid fa-play"></i> Start Quiz
                                </button>
                            ` : `
                                <button class="btn-buy" onclick="buyQuiz(${quiz.id}, ${quiz.price}, '${escapeHtml(quiz.title)}')">
                                    <i class="fa-solid fa-cart-shopping"></i> Buy Quiz
                                </button>
                            `}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error(error);
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #ef4444;">
                <p>Failed to connect to backend server. Please make sure backend is running.</p>
            </div>
        `;
    }
}

function defaultQuizImage(title = '') {
    const t = title.toLowerCase();
    if (t.includes('java') && !t.includes('script')) return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop';
    if (t.includes('python')) return 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop';
    if (t.includes('sql') || t.includes('mysql')) return 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop';
    if (t.includes('spring')) return 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&auto=format&fit=crop';
    if (t.includes('js') || t.includes('javascript')) return 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&auto=format&fit=crop';
    return 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop';
}

function startQuiz(quizId) {
    const user = getUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    window.location.href = `quiz.html?quizId=${quizId}`;
}

async function buyQuiz(quizId, price, title) {
    const user = getUser();
    if (!user) {
        showToast('Please login to purchase quizzes.', 'info');
        setTimeout(() => {
            window.location.href = 'login.html?redirect=' + encodeURIComponent(`dashboard.html`);
        }, 1200);
        return;
    }

    try {
        const orderRes = await fetch(`${API_BASE_URL}/payment/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quizId: quizId, email: user.email })
        });

        if (!orderRes.ok) throw new Error('Order creation failed');
        const orderData = await orderRes.json();

        // Launch simulated Razorpay modal to avoid 401 Unauthorized API error
        openSimulatedRazorpayModal(
            {
                amount: orderData.amount,
                description: `Unlock Quiz: ${title}`,
                order_id: orderData.orderId
            },
            async function (payResponse) {
                await verifyAndUnlock(quizId, user, payResponse.razorpay_payment_id, payResponse.razorpay_order_id);
            },
            function (errMsg) {
                showToast(errMsg, 'error');
            }
        );
    } catch (err) {
        console.error(err);
        showToast('Error initiating purchase.', 'error');
    }
}

async function verifyAndUnlock(quizId, user, paymentId, orderId) {
    try {
        const verifyRes = await fetch(`${API_BASE_URL}/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                quizId: quizId,
                email: user.email,
                username: user.username,
                razorpayPaymentId: paymentId,
                razorpayOrderId: orderId
            })
        });

        if (verifyRes.ok) {
            showToast('Payment Successful! Quiz Unlocked.', 'success');
            purchasedQuizIds.add(quizId);
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showToast('Verification failed. Contact support.', 'error');
        }
    } catch (err) {
        console.error(err);
        showToast('Error recording payment.', 'error');
    }
}

async function loadTopPerformers() {
    const tbody = document.getElementById('topPerformersBody');
    if (!tbody) return;

    try {
        const res = await fetch(`${API_BASE_URL}/result/top5`);
        if (!res.ok) throw new Error('Failed to fetch top performers');
        const list = await res.json();

        if (!list || list.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center; padding:20px; color:#64748b;">
                        No quiz attempts recorded yet. Be the first to attempt a quiz!
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = list.map((item, index) => {
            const rankClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : 'rank-other';
            return `
                <tr>
                    <td><span class="rank-badge ${rankClass}">${index + 1}</span></td>
                    <td><strong><i class="fa-solid fa-user" style="color:#2563eb;"></i> ${escapeHtml(item.username)}</strong></td>
                    <td>${escapeHtml(item.quizName || item.quiz?.title || 'Quiz')}</td>
                    <td>${item.score}/${item.totalQuestions}</td>
                    <td><strong style="color:#10b981;">${item.percentage ? item.percentage.toFixed(1) : 0}%</strong></td>
                </tr>
            `;
        }).join('');
    } catch (err) {
        console.error(err);
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center; color:#ef4444;">Failed to load leaderboard data.</td>
            </tr>
        `;
    }
}