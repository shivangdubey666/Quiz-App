const result = JSON.parse(localStorage.getItem("result"));

if(result==null){

window.location.href="dashboard.html";

}

document.getElementById("studentName").innerHTML=

result.studentName;

document.getElementById("quizName").innerHTML=

result.quizName;

document.getElementById("score").innerHTML=

result.score+" / "+result.totalQuestions;

document.getElementById("percentage").innerHTML=

result.percentage+" %";

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        localStorage.clear();

        window.location.href = "index.html";

    });

}