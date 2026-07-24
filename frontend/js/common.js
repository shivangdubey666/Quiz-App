const API_BASE_URL = 'http://localhost:8080/api';

function getUser() {
    try {
        const u = localStorage.getItem('qm_user') || sessionStorage.getItem('qm_user');
        return u ? JSON.parse(u) : null;
    } catch (e) {
        return null;
    }
}

function setUser(user, remember = true) {
    if (remember) {
        localStorage.setItem('qm_user', JSON.stringify(user));
    } else {
        sessionStorage.setItem('qm_user', JSON.stringify(user));
    }
}

function logout() {
    localStorage.removeItem('qm_user');
    sessionStorage.removeItem('qm_user');
    window.location.href = 'login.html';
}

function requireAuth(allowedRoles = []) {
    const user = getUser();
    if (!user) {
        window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
        return null;
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        if (user.role === 'ADMIN') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'dashboard.html';
        }
        return null;
    }
    return user;
}

function showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.cssText = 'position:fixed; top:20px; right:20px; z-index:99999; display:flex; flex-direction:column; gap:10px; pointer-events:none;';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#6366f1'};
        color: #ffffff;
        padding: 12px 20px;
        border-radius: 8px;
        font-family: 'Poppins', sans-serif;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        pointer-events: auto;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
    `;
    toast.innerText = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Simulated Interactive Razorpay Gateway Modal
function openSimulatedRazorpayModal(options, onSuccess, onFailure) {
    const existingModal = document.getElementById('rzpSimulatedModal');
    if (existingModal) existingModal.remove();

    const amountInRupees = (options.amount / 100).toFixed(2);

    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'rzpSimulatedModal';
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(15, 23, 42, 0.75);
        backdrop-filter: blur(6px);
        z-index: 99999;
        display: flex; align-items: center; justify-content: center;
        font-family: 'Poppins', sans-serif;
        animation: fadeIn 0.2s ease;
    `;

    modalOverlay.innerHTML = `
        <div style="background: #ffffff; width: 420px; max-width: 90%; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.3); overflow: hidden; border: 1px solid #e2e8f0;">
            <!-- Header -->
            <div style="background: #0f172a; color: white; padding: 20px 25px; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="background: #2563eb; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: white;">
                        RZP
                    </div>
                    <div>
                        <h4 style="margin: 0; font-size: 16px; font-weight: 600;">Razorpay Checkout</h4>
                        <span style="font-size: 11px; color: #94a3b8; background: #1e293b; padding: 2px 8px; border-radius: 10px;">Test Mode</span>
                    </div>
                </div>
                <button id="rzpCloseBtn" style="background: transparent; border: none; color: #94a3b8; font-size: 20px; cursor: pointer;">&times;</button>
            </div>

            <!-- Body -->
            <div style="padding: 25px;">
                <div style="background: #f8fafc; border-radius: 10px; padding: 15px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
                    <span style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">Item Details</span>
                    <h3 style="margin: 4px 0 0 0; color: #0f172a; font-size: 18px;">${escapeHtml(options.description || 'Quiz Purchase')}</h3>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 10px; border-top: 1px dashed #cbd5e1;">
                        <span style="color: #64748b; font-size: 14px;">Total Payable Amount:</span>
                        <span style="font-size: 22px; font-weight: 700; color: #2563eb;">₹${amountInRupees}</span>
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="font-size: 13px; font-weight: 600; color: #334155; display: block; margin-bottom: 8px;">Select Test Payment Method</label>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; border: 1px solid #2563eb; background: #eff6ff; border-radius: 8px; cursor: pointer;">
                            <input type="radio" name="payMethod" value="upi" checked style="accent-color: #2563eb;">
                            <span style="font-size: 14px; font-weight: 500; color: #1e40af;"><i class="fa-solid fa-qrcode"></i> UPI / QR Code (Auto Success)</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer;">
                            <input type="radio" name="payMethod" value="card" style="accent-color: #2563eb;">
                            <span style="font-size: 14px; font-weight: 500; color: #334155;"><i class="fa-regular fa-credit-card"></i> Credit / Debit Card</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer;">
                            <input type="radio" name="payMethod" value="netbanking" style="accent-color: #2563eb;">
                            <span style="font-size: 14px; font-weight: 500; color: #334155;"><i class="fa-solid fa-building-columns"></i> Net Banking</span>
                        </label>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div style="display: flex; gap: 10px;">
                    <button id="rzpPaySuccessBtn" style="flex: 2; background: #10b981; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 600; font-size: 15px; cursor: pointer;">
                        <i class="fa-solid fa-lock"></i> Pay ₹${amountInRupees}
                    </button>
                    <button id="rzpPayFailBtn" style="flex: 1; background: #f1f5f9; color: #ef4444; border: 1px solid #fee2e2; padding: 12px; border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer;">
                        Cancel
                    </button>
                </div>
            </div>
            
            <div style="background: #f8fafc; padding: 12px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
                <i class="fa-solid fa-shield-halved"></i> Secured by Razorpay 256-bit Encryption
            </div>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    document.getElementById('rzpCloseBtn').onclick = () => {
        modalOverlay.remove();
        if (onFailure) onFailure('Payment Cancelled by User');
    };

    document.getElementById('rzpPayFailBtn').onclick = () => {
        modalOverlay.remove();
        if (onFailure) onFailure('Payment Cancelled by User');
    };

    document.getElementById('rzpPaySuccessBtn').onclick = () => {
        const btn = document.getElementById('rzpPaySuccessBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
        
        setTimeout(() => {
            modalOverlay.remove();
            if (onSuccess) {
                onSuccess({
                    razorpay_payment_id: 'pay_' + Math.random().toString(36).substring(2, 12),
                    razorpay_order_id: options.order_id || 'order_' + Math.random().toString(36).substring(2, 12)
                });
            }
        }, 1000);
    };
}

function updateNavigation() {
    const navHeader = document.querySelector('header.navbar, header:not(.navbar)');
    if (!navHeader) return;

    const user = getUser();
    let navLinksHtml = '';
    let actionButtonsHtml = '';

    if (!user) {
        // Guest Navigation
        navLinksHtml = `
            <a href="index.html">Home</a>
            <a href="index.html#quiz">Quizzes</a>
            <a href="leaderboard.html">Leaderboard</a>
            <a href="index.html#about">About</a>
            <a href="index.html#contact">Contact</a>
        `;
        actionButtonsHtml = `
            <a href="login.html" class="login-btn">Login</a>
            <a href="register.html" class="register-btn">Register</a>
        `;
    } else if (user.role === 'ADMIN') {
        // Admin Navigation
        navLinksHtml = `
            <a href="index.html">Home</a>
            <a href="admin-dashboard.html">Admin Dashboard</a>
            <a href="students.html">Students</a>
            <a href="admin-results.html">Results</a>
        `;
        actionButtonsHtml = `
            <span class="user-badge"><i class="fa-solid fa-user-shield"></i> ${user.username}</span>
            <button onclick="logout()" class="logout-btn"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
        `;
    } else {
        // Student Navigation
        navLinksHtml = `
            <a href="index.html">Home</a>
            <a href="dashboard.html">Dashboard</a>
            <a href="leaderboard.html">Leaderboard</a>
        `;
        actionButtonsHtml = `
            <span class="user-badge"><i class="fa-solid fa-user"></i> ${user.username}</span>
            <button onclick="logout()" class="logout-btn"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
        `;
    }

    navHeader.innerHTML = `
        <div class="logo">
            <a href="index.html" style="display:flex; align-items:center; gap:8px; text-decoration:none; color:inherit;">
                <i class="fa-solid fa-graduation-cap"></i>
                <h2>QuizMaster</h2>
            </a>
        </div>
        <nav class="nav-links">
            ${navLinksHtml}
        </nav>
        <div class="nav-actions">
            ${actionButtonsHtml}
        </div>
    `;
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

document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
});