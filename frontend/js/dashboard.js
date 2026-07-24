let currentUser = null;
let purchasedSet = new Set();

document.addEventListener('DOMContentLoaded', async () => {
    currentUser = requireAuth(['STUDENT', 'ADMIN']);
    if (!currentUser) return;

    const welcomeEl = document.getElementById('welcomeUsername');
    if (welcomeEl) welcomeEl.innerText = currentUser.username;

    await loadStudentData();
});

async function loadStudentData() {
    const container = document.getElementById('studentQuizContainer');
    if (!container) return;

    try {
        // Fetch Purchases for user
        const purchaseRes = await fetch(`${API_BASE_URL}/payment/purchases/${encodeURIComponent(currentUser.email)}`);
        if (purchaseRes.ok) {
            const purchases = await purchaseRes.json();
            purchases.forEach(p => purchasedSet.add(p.quizId));
            document.getElementById('statPurchased').innerText = purchases.length;
        }

        // Fetch Results for user stats
        const resultRes = await fetch(`${API_BASE_URL}/result/user/${encodeURIComponent(currentUser.email)}`);
        if (resultRes.ok) {
            const results = await resultRes.json();
            document.getElementById('statAttempted').innerText = results.length;
            if (results.length > 0) {
                const maxPct = Math.max(...results.map(r => r.percentage || 0));
                document.getElementById('statBestScore').innerText = `${maxPct.toFixed(1)}%`;
            }
        }

        // Fetch All Quizzes
        const quizRes = await fetch(`${API_BASE_URL}/quiz`);
        if (!quizRes.ok) throw new Error('Failed to fetch quizzes');
        const quizzes = await quizRes.json();

        if (!quizzes || quizzes.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px; background: white; border-radius: 12px;">
                    <h3>No Quizzes Available</h3>
                    <p style="color: #64748b;">Please check back later when new quizzes are published by Admin.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = quizzes.map(quiz => {
            const isPurchased = purchasedSet.has(quiz.id) || currentUser.role === 'ADMIN';
            const img = quiz.imageUrl || defaultQuizImage(quiz.title);
            const duration = quiz.duration || 10;
            const desc = quiz.description || `${quiz.title} core concepts and placement practice questions.`;

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
                            <span class="quiz-price">${isPurchased ? '<span style="color:#10b981; font-size:16px;"><i class="fa-solid fa-circle-check"></i> Unlocked</span>' : '₹' + quiz.price}</span>
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

    } catch (err) {
        console.error(err);
        container.innerHTML = `<p style="color:red; text-align:center; grid-column:1/-1;">Error loading quizzes from backend server.</p>`;
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
    window.location.href = `quiz.html?quizId=${quizId}`;
}

async function buyQuiz(quizId, price, title) {
    try {
        const orderRes = await fetch(`${API_BASE_URL}/payment/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quizId: quizId, email: currentUser.email })
        });

        if (!orderRes.ok) throw new Error('Order creation failed');
        const orderData = await orderRes.json();

        // Launch simulated Razorpay checkout modal
        openSimulatedRazorpayModal(
            {
                amount: orderData.amount,
                description: `Unlock Quiz: ${title}`,
                order_id: orderData.orderId
            },
            async function (payResponse) {
                await verifyAndUnlock(quizId, payResponse.razorpay_payment_id, payResponse.razorpay_order_id);
            },
            function (errMsg) {
                showToast(errMsg, 'error');
            }
        );

    } catch (err) {
        console.error(err);
        showToast('Error initiating payment.', 'error');
    }
}

async function verifyAndUnlock(quizId, paymentId, orderId) {
    try {
        const verifyRes = await fetch(`${API_BASE_URL}/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                quizId: quizId,
                email: currentUser.email,
                username: currentUser.username,
                razorpayPaymentId: paymentId,
                razorpayOrderId: orderId
            })
        });

        if (verifyRes.ok) {
            showToast('Payment Successful! Quiz Unlocked.', 'success');
            purchasedSet.add(quizId);
            setTimeout(() => {
                loadStudentData();
            }, 800);
        } else {
            showToast('Payment verification failed.', 'error');
        }
    } catch (err) {
        console.error(err);
        showToast('Error completing purchase.', 'error');
    }
}