import { config_variables } from "./config.js";

let email_box = document.getElementById("email");
let password_box = document.getElementById("password");
let login = document.getElementById("login-btn");

login.addEventListener("click", async () => {
  console.log("login clicked");
  let email = email_box.value;
  let password = password_box.value;
  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  let data = { email, password };

  console.log(data);
  let login_call = await fetch(config_variables.USER_LOGIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  let result = await login_call.json();
  console.log(result, "this is result");
  if (result.status_code == 200) {
    sessionStorage.setItem("user_payload", JSON.stringify(result));
    let str = sessionStorage.getItem('user_payload')
    console.log(JSON.parse(str))
    window.location.href = config_variables.CHAT_URL;
  } else {
    window.location.href = config_variables.INFO_URL;
  }
});
