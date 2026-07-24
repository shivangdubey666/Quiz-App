async function loadStudents(){

const response=await fetch(

"http://localhost:8080/api/auth/users"

);

const students=await response.json();

let html="";

students.forEach(student=>{

html+=`

<tr>

<td>${student.id}</td>

<td>${student.fullName}</td>

<td>${student.email}</td>

<td>${student.phone}</td>

<td>${student.college}</td>

<td>${student.course}</td>

<td>${student.paymentDone?"Yes":"No"}</td>

</tr>

`;

});

document.getElementById("studentTable").innerHTML=html;

}

loadStudents();