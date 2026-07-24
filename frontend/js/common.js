const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.onclick = function () {
        localStorage.clear();
        window.location.href = "index.html";
    };
}