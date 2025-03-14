let email_template = (receiver_details) => {
  return `
    <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Login via OTP</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }

    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 15px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .email-header {
      background-color: #25d366;
      padding: 20px;
      text-align: center;
    }

    .email-header .logo {
      font-size: 36px;
      color: #ffffff;
    }

    .email-header h1 {
      color: #ffffff;
      font-size: 24px;
      margin: 10px 0 0;
    }

    .email-body {
      padding: 30px;
      text-align: center;
    }

    .email-body h2 {
      color: #25d366;
      font-size: 22px;
      margin-bottom: 20px;
    }

    .email-body p {
      color: #555555;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .otp-code {
      background-color: #ece5dd;
      padding: 15px;
      border-radius: 8px;
      font-size: 24px;
      font-weight: bold;
      color: #25d366;
      margin: 20px 0;
      display: inline-block;
    }

    .email-footer {
      background-color: #f5f5f5;
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: #777777;
    }

    .email-footer a {
      color: #25d366;
      text-decoration: none;
      font-weight: bold;
    }

    .email-footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>

<body>
  <div class="email-container">
    <!-- Header -->
    <div class="email-header">
      <div class="logo">
        <i class="fab fa-whatsapp"></i>
      </div>
      <h1>Let's Connect</h1>
    </div>

    <!-- Body -->
    <div class="email-body">
      <h2>Login via OTP</h2>
      <p>Hello, ${receiver_details.name}</p>
      <p>You have requested to log in to your Let's Connect account. Please use the following OTP to complete your login:</p>
      <div class="otp-code">${receiver_details.otp}</div>
      <p>This OTP is valid for <strong>1 minute</strong>. Do not share this code with anyone.</p>
      <p>If you did not request this OTP, please ignore this email or contact support.</p>
    </div>

    <!-- Footer -->
    <div class="email-footer">
      <p>Need help? <a href="mailto:support@letsconnect.com">Contact support</a></p>
      <p>&copy; 2023 Let's Connect. All rights reserved.</p>
    </div>
  </div>
</body>

</html>
    `;
};
