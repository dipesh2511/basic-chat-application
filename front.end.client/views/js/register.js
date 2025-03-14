import { config_variables } from "./config.js";

let register = document.getElementById("register-btn");
let name = document.getElementById("name");
let email = document.getElementById("email");
let password = document.getElementById("password");

register.addEventListener("click", async (event) => {
  if (!name.value || !email.value || !password.value) {
    return alert("Please fill all the fields");
  }

  let new_user = {
    name: name.value,
    email: email.value,
    password: password.value,
  };
  let register_call = await fetch(config_variables.USER_REGISTER, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",

    },
    body: JSON.stringify(new_user),
  });
  let result = await register_call.json();
  console.log(result)
    if (result.message == "User created successfully") {
        alert("User created successfully go to login page");
        window.location.href = config_variables.LOGIN_URL;

    } 
    if(result.error_type == "Mongoose duplicate key error"){
        alert("User already exists");
    }
});
