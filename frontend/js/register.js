document.addEventListener('DOMContentLoaded', () => {
    const user = getUser();
    if (user) {
        if (user.role === 'ADMIN') window.location.href = 'admin-dashboard.html';
        else window.location.href = 'dashboard.html';
    }

    const form = document.getElementById('registerForm');
    if (form) {
        form.addEventListener('submit', handleRegister);
    }
});

async function handleRegister(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('mobile').value.trim();
    const college = document.getElementById('college').value.trim();
    const course = document.getElementById('branch').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const btn = document.getElementById('submitBtn');

    if (password !== confirmPassword) {
        showToast('Passwords do not match.', 'error');
        return;
    }

    const userObj = { username, email, phone, college, course, password };

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Registering...';

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userObj)
        });

        const msg = await response.text();

        if (msg === 'Registration Successful') {
            showToast('Registration Successful! Redirecting to login...', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1200);
        } else {
            showToast(msg || 'Registration failed', 'error');
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-user-check"></i> Register Account';
        }
    } catch (err) {
        console.error(err);
        showToast('Unable to connect to server', 'error');
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-user-check"></i> Register Account';
    }
}