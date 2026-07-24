document.addEventListener('DOMContentLoaded', () => {
    const user = getUser();
    if (user) {
        if (user.role === 'ADMIN') window.location.href = 'admin-dashboard.html';
        else window.location.href = 'dashboard.html';
    }

    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', handleLogin);
    }
});

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const btn = document.getElementById('submitBtn');

    if (!email || !password) {
        showToast('Please enter both email and password.', 'error');
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Authentication endpoint returned an error.');
        }

        const user = await response.json();

        if (!user || !user.email) {
            showToast('Invalid Email or Password', 'error');
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Login';
            return;
        }

        setUser(user);
        showToast(`Welcome back, ${user.username}!`, 'success');

        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');

        setTimeout(() => {
            if (redirect) {
                window.location.href = decodeURIComponent(redirect);
            } else if (user.role === 'ADMIN') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        }, 800);

    } catch (error) {
        console.error(error);
        showToast('Unable to connect to backend server', 'error');
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Login';
    }
}