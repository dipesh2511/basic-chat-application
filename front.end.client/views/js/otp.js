document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const sendOtpBtn = document.getElementById("send-otp-btn");
    const timerDisplay = document.getElementById("timer");
    const otpField = document.querySelector(".otp-field");
    const verifyOtpBtn = document.getElementById("verify-otp-btn");
    const otpInput = document.getElementById("otp");
    let email = "null";
    let countdown;
    let timeLeft = 60; // 1 minute in seconds
    
    // Function to start the countdown timer
    function startTimer() {
      countdown = setInterval(() => {
        if (timeLeft <= 0) {
          clearInterval(countdown);
          timerDisplay.textContent = "00:00";
          alert("OTP expired. Please request a new OTP.");
          otpField.style.display = "none";
          verifyOtpBtn.style.display = "none";
          timerDisplay.style.display = "none";
          sendOtpBtn.disabled = false;
          timeLeft = 60; // Reset timer
        } else {
          const minutes = Math.floor(timeLeft / 60);
          const seconds = timeLeft % 60;
          timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
          timeLeft--;
        }
      }, 1000);
    }
    
    // Send OTP Button Click Event
    sendOtpBtn.addEventListener("click", function () {
      
      email = emailInput.value.trim();
      if (!email) {
        alert("Please enter your email address.");
        return;
      }
  
      // Simulate sending OTP (replace with actual API call)
      alert(`OTP sent to ${email}`);
  
      // Disable Send OTP button and start timer
      sendOtpBtn.disabled = true;
      timerDisplay.style.display = "block";
      otpField.style.display = "block";
      verifyOtpBtn.style.display = "block";
      startTimer();
    });
  
    // Verify OTP Button Click Event
    verifyOtpBtn.addEventListener("click", function () {
      const otp = otpInput.value.trim();
  
      if (!otp || otp.length !== 6) {
        alert("Please enter a valid 6-digit OTP.");
        return;
      }
  
      // Simulate OTP verification (replace with actual API call)
      alert(`OTP ${otp} verified successfully! ${email}`);
      clearInterval(countdown); // Stop the timer
      window.location.href = "./dashboard.html"; // Redirect to dashboard
    });
  });