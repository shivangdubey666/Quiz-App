const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", loginUser);

async function loginUser(e){

    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value.trim();

    try{

        const response = await fetch("http://localhost:8080/api/auth/login",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                email,
                password
            })

        });

        if(!response.ok){

            alert("Server Error");

            return;

        }

        const user = await response.json();

        if(user == null){

            alert("Invalid Email or Password");

            return;

        }

        localStorage.setItem("user",JSON.stringify(user));

        if(user.role === "ADMIN"){

            window.location.href = "admin-dashboard.html";

        }
        else{

            window.location.href = "dashboard.html";

        }

    }
    catch(error){

        console.log(error);

        alert("Unable to connect to server");

    }

}