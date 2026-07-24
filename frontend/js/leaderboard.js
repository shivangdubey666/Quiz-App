async function loadLeaderboard(){

const response=await fetch(

"http://localhost:8080/api/result/leaderboard"

);

const data=await response.json();

let html="";

data.forEach((student,index)=>{

html+=`

<tr>

<td>${index+1}</td>

<td>${student.username}</td>

<td>${student.score}</td>

<td>${student.percentage}%</td>

</tr>

`;

});

document.getElementById("leaderboardBody").innerHTML=html;

}

loadLeaderboard();

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        localStorage.clear();

        window.location.href = "index.html";

    });

}