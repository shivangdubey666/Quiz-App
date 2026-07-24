const form=document.getElementById("questionForm");

form.addEventListener("submit",saveQuestion);

async function saveQuestion(e){

e.preventDefault();

const quizId=document.getElementById("quizId").value;

const question={

question:document.getElementById("question").value,

option1:document.getElementById("option1").value,

option2:document.getElementById("option2").value,

option3:document.getElementById("option3").value,

option4:document.getElementById("option4").value,

answer:document.getElementById("answer").value

};

const response=await fetch(

"http://localhost:8080/api/quiz/"+quizId+"/question",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(question)

}

);

if(response.ok){

alert("Question Added Successfully");

form.reset();

}

else{

alert("Unable To Add Question");

}

}