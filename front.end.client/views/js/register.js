import { config_variables } from "./config.js";


if(JSON.parse(sessionStorage.getItem('user_payload'))){
  sessionStorage.removeItem('user_payload')
}
// Get DOM elements
let register = document.getElementById("register-btn");
let name = document.getElementById("name");
let email = document.getElementById("email");
let password = document.getElementById("password");
let profilePicInput = document.getElementById("profile-pic");

// Add event listener to the register button
register.addEventListener("click", async (event) => {
  // Validate input fields
  if (!name.value || !email.value || !password.value) {
    return alert("Please fill all the fields");
  }

  // Create a FormData object
  const formData = new FormData();
  formData.append("name", name.value);
  formData.append("email", email.value);
  formData.append("password", password.value);

  // Append the profile picture if selected
  if (profilePicInput.files[0]) {
    formData.append("profile_photo", profilePicInput.files[0]);
  }

  try {
    // Send the registration request
    let register_call = await fetch(config_variables.USER_REGISTER, {
      method: "POST",
      body: formData, // Use FormData instead of JSON
    });

    // Parse the response
    let result = await register_call.json();
    console.log(result);

    // Handle the response
    if (result.message === "User created successfully") {
      alert("User created successfully. Go to the login page.");
      window.location.href = config_variables.LOGIN_URL;
    } else if (result.error_type === "Mongoose duplicate key error") {
      alert("User already exists.");
    } else {
      alert("Registration failed. Please try again.");
    }
  } catch (error) {
    console.error("Error during registration:", error);
    alert("An error occurred during registration. Please try again.");
  }
});