async function loadResults(){

const response=await fetch(

"http://localhost:8080/api/result/leaderboard"

);

const results=await response.json();

let html="";

results.forEach(result=>{

html+=`

<tr>

<td>${result.id}</td>

<td>${result.studentName}</td>

<td>${result.quizName}</td>

<td>${result.score}</td>

<td>${result.totalQuestions}</td>

<td>${result.percentage}%</td>

</tr>

`;

});

document.getElementById("resultTable").innerHTML=html;

}

loadResults();