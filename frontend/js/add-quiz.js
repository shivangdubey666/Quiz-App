const quizForm=document.getElementById("quizForm");

quizForm.addEventListener("submit",saveQuiz);

async function saveQuiz(e){

e.preventDefault();

const quiz={

title:document.getElementById("title").value,

price:document.getElementById("price").value

};

const response=await fetch(

"http://localhost:8080/api/quiz",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(quiz)

}

);

if(response.ok){

alert("Quiz Created Successfully");

quizForm.reset();

}

else{

alert("Unable to Create Quiz");

}

}