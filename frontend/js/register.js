const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", registerUser);

async function registerUser(e) {

    e.preventDefault();

    const password = document.getElementById("password").value;

    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {

        alert("Passwords do not match");

        return;

    }

    const user = {

        username: document.getElementById("username").value.trim(),

        email: document.getElementById("email").value.trim(),

        phone: document.getElementById("mobile").value.trim(),

        college: document.getElementById("college").value.trim(),

        course: document.getElementById("branch").value.trim(),

        password: password

    };

    try {

        const response = await fetch("http://localhost:8080/api/auth/register", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(user)

        });

        const data = await response.text();

        alert(data);

        if (data === "Registration Successful") {

            window.location.href = "login.html";

        }

    }

    catch (error) {

        console.log(error);

        alert("Server Error");

    }

}