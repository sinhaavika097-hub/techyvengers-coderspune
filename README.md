# Techyvengers - DarwinBox HR Handover Automation

## 🔐 Test Credentials
Use the following credentials to test the authentication and mapping systems:
* **Employee ID:** `EMP-001`
* **Password:** `password123`

---

## 🚀 Setup Walkthrough
This project is split into two independent microservices: a Node.js Dynamic REST API for the dashboard, and a standalone C++ application for secure credential mapping.

### 1. Start the Dynamic REST API (Node.js)
The backend serves the `dashboard_data.json` file to the frontend via a secure REST API.
1. Navigate to the backend folder: `cd frontend/backend`
2. Install dependencies (first time only): `npm install express cors`
3. Start the server: `node server.js`
4. The API will now run on `http://localhost:3000`. Open your frontend `index.html` in the browser to view the live dashboard.

### 2. Run the Secure Credential Mapper (C++)
We use a standalone C++ executable to handle strict credential encryption and mapping, keeping heavy cryptographic tasks separated from the web server.
1. Navigate to the C++ folder: `cd hashee`
2. Compile the file: `g++ hasher.cpp -o hasher.exe`
3. Run the executable: `.\hasher.exe`
4. When prompted, enter the test credentials to verify the hash generation and mapping status.

---

## 🏗️ System Architecture
* **Frontend:** HTML, CSS (Tailwind), and vanilla JavaScript. Fetches data dynamically from the local API instead of hardcoded files.
* **Backend:** Node.js & Express. Serves safe payload data via `/api/handover` and securely strips out sensitive passwords.
* **Security Module:** C++ executable (`hasher.cpp`) for strict, isolated credential verification.

## 🔜 Upcoming: Progressive Dual-Gated Access
We are integrating a "Two-Key" progressive unlock system for sensitive handover timelines (Months 3-6). Access to later-stage data will require:
1. **Tenure Verification:** The system confirms the employee has been in the role for a minimum threshold (e.g., 60 days).
2. **Manager Approval:** A manual database flag triggered by a supervisor overriding the final lock.
