# Let's Connect

## Introduction
Let's Connect is a web application built using the MERN stack and WebSockets to provide real-time communication features. The backend is developed using Express.js, Node.js, and MongoDB with Mongoose. The frontend is built using HTML, CSS, and JavaScript.

## Features
- User authentication with JWT
- File uploads using Multer
- OTP-based login verification
- Real-time communication with Socket.io
- CRUD operations for user data

## Technologies Used
- **Backend:** Express.js, Node.js, MongoDB, Mongoose
- **Authentication:** JWT
- **File Uploads:** Multer
- **Real-time Communication:** Socket.io
- **Frontend:** HTML, CSS, JavaScript (Located in `front.end.client` folder)

## API Endpoints
### User Routes (`/api/user`)
| Method | Endpoint           | Description |
|--------|--------------------|-------------|
| POST   | `/`                | Create a new user with profile photo upload |
| GET    | `/`                | Get a list of all users (JWT Protected) |
| GET    | `/:id`             | Get user details by ID |
| PATCH  | `/:id`             | Update user details with profile photo upload |
| DELETE | `/:id`             | Delete user by ID |
| POST   | `/generate-otp`    | Generate OTP for authentication |
| POST   | `/verify-otp`      | Verify OTP and authenticate user |
| POST   | `/login`           | Login with credentials |

## Setup & Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/dipesh2511/basic-chat-application.git
   cd lets-connect/backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and configure your environment variables (MongoDB URI, JWT secret, etc.).
4. Start the backend server:
   ```sh
   npm start
   ```
5. Navigate to the `front.end.client` folder and open `index.html` in a browser to access the frontend.

## Author
Dipesh Pohanekar

