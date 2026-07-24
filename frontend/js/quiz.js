const user = JSON.parse(localStorage.getItem("user"));

if (user == null) {

    window.location.href = "login.html";

}

let questions = [];

loadQuiz();

async function loadQuiz() {

    const response = await fetch("http://localhost:8080/api/quiz/1");

    questions = await response.json();

    let html = "";

    questions.forEach((q, index) => {

        html += `

        <div class="question">

        <h3>${index + 1}. ${q.question}</h3>

        <label>

        <input type="radio" name="q${index}" value="${q.option1}">

        ${q.option1}

        </label>

        <br>

        <label>

        <input type="radio" name="q${index}" value="${q.option2}">

        ${q.option2}

        </label>

        <br>

        <label>

        <input type="radio" name="q${index}" value="${q.option3}">

        ${q.option3}

        </label>

        <br>

        <label>

        <input type="radio" name="q${index}" value="${q.option4}">

        ${q.option4}

        </label>

        <hr>

        </div>

        `;

    });

    document.getElementById("questionContainer").innerHTML = html;

}

document.getElementById("submitBtn").addEventListener("click", submitQuiz);

async function submitQuiz() {

    let score = 0;

    questions.forEach((q, index) => {

        const answer = document.querySelector('input[name="q' + index + '"]:checked');

        if (
    answer &&
    answer.value.trim().toLowerCase() ===
    q.answer.trim().toLowerCase()
) {
    score++;
}

    });

    const result = {

        username: user.username,

        email: user.email,

        quizId: 1,

        score: score,

        totalQuestions: questions.length

    };

    const response = await fetch("http://localhost:8080/api/result/submit", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(result)

    });

    const data = await response.json();

    localStorage.setItem("result", JSON.stringify(data));

    window.location.href = "result.html";

}

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        localStorage.clear();

        window.location.href = "index.html";

    });

}