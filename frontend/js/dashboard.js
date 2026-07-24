const user = JSON.parse(localStorage.getItem("user"));

if(user==null){

window.location.href="login.html";

}

document.getElementById("welcome").innerHTML=

"Welcome " + user.username;

const buyBtn=document.getElementById("buyBtn");

const startBtn=document.getElementById("startBtn");

if(user.paymentDone){

buyBtn.style.display="none";

startBtn.style.display="block";

}

else{

buyBtn.style.display="block";

startBtn.style.display="none";

}

buyBtn.addEventListener("click",buyQuiz);

async function buyQuiz(){

const response=await fetch(

"http://localhost:8080/api/payment/"+user.email,

{

method:"POST"

}

);

const data=await response.text();

alert(data);

user.paymentDone=true;

localStorage.setItem("user",JSON.stringify(user));

location.reload();

}

startBtn.addEventListener("click",()=>{

window.location.href="quiz.html";

});

document.getElementById("logoutBtn")

.addEventListener("click",()=>{

localStorage.clear();

window.location.href="login.html";

});

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        localStorage.clear();

        window.location.href = "index.html";

    });

}