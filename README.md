# techyvengers-coderspune

# 🔐 Secure Employee Handover Dashboard

A role-based, JSON-driven web application engineered to streamline employee transitions, manage project assets, and secure handover records. Built with a responsive frontend and supported by C++ backend utilities, this dashboard ensures that incoming employees can seamlessly and securely access historical workflows, documents, and credentials.

## 🎮 Demo Run Guidelines

To test the authentication flow and view the decrypted workspace immediately, use the following sample credentials for **Anvesha K (E1)**:

* **Incoming Employee ID:** `NEW-E1` *(or insert your exact JSON ID here)*
* **Passkey:** `[hackathon2026]`

Simply click on Anvesha's profile in the left sidebar, enter the credentials above, and hit `Enter` to unlock the timeline.

## 🚀 Project Overview

During corporate or organizational transitions, critical project data, timelines, and credentials are often lost or fragmented. This dashboard solves that by providing a centralized, encrypted portal where handover data—such as Google Drive assets, GitHub repositories, and architectural PDFs—is securely locked behind employee-specific passkeys.

## ✨ Key Features

* **Strict Credential Authentication:** Custom-built login flow requiring exact ID and passkey matching, featuring sanitized input handling (`.trim()`) and integrated Enter-key event listeners for a frictionless UX.
* **Dynamic Data Fetching:** Fully driven by a modular `dashboard_data.json` architecture. The UI automatically generates sidebars, timeline windows, and asset links based on the fetched JSON payloads without requiring hardcoded HTML updates.
* **Interactive Workspace & Timeline:** Features a state-driven UI with locked/unlocked visual indicators. Once authenticated, users access a chronological slide-out "Workbook Drawer" detailing monthly project deliverables.
* **C++ Backend Utilities:** Incorporates robust low-level data handling, including `hasher.cpp` and `session_validator.cpp`, to manage data processing and validation before interacting with the frontend JSON state.
* **Zero-Friction Asset Routing:** Seamlessly routes users to public Google Drive folders, direct PDF downloads, and external GitHub repositories via secure browser-tab targeting.

## 🛠️ Technical Stack

**Frontend Architecture:**

* **HTML5 & CSS3:** Semantic structure with rapid, utility-first styling using **Tailwind CSS** for responsive design (glassmorphism effects, modal overlays, slide-out drawers).
* **JavaScript (Vanilla ES6+):** Handles DOM manipulation, asynchronous `fetch()` requests, state management (locked vs. unlocked employees), and event-driven authentication logic.

**Backend & Data Layer:**

* **C++:** System-level data handling and validation (`hasher.cpp`, `session_validator.cpp`, `mainfetch.cpp`).
* **JSON:** Lightweight, scalable data storage (`dashboard_data.json`, `mock_all_data.json`) acting as the primary database for employee profiles and timeline routing.
* **Node.js / JavaScript:** Auxiliary backend validation (`validator.js`).

## ⚙️ System Architecture & Workflow

1. **Initialization:** On load, the `fetch()` API pulls employee data from the JSON file and dynamically populates the left sidebar navigation.
2. **State Management:** The application listens for user interaction, setting a `targetEmployee` state and triggering the authentication modal.
3. **Validation:** Upon credential submission, the frontend sanitizes the input and verifies it strictly against the parsed JSON data.
4. **Rendering:** Upon successful authentication, the `unlockedEmployee` state is updated, the secure workspace is unhidden, and the timeline array is sorted and mapped into interactive workbook nodes.

## 💻 Local Installation & Setup

1. **Clone the repository:**
```bash
git clone https://github.com/sinhaavika097-hub/techyvengers-coderspune.git

```


2. **Navigate to the frontend directory:**
```bash
cd techyvengers-coderspune/frontend

```


3. **Launch a local server:**
* If using VS Code, install the **Live Server** extension.
* Right-click `index.html` and select **"Open with Live Server"**.
* *Note: Opening the HTML file directly in the browser without a local server will cause the JSON `fetch()` request to fail due to CORS policies.*



## 👥 Contributors

* **Avika Kumari Sinha** – backend architecture, JSON Data Integration, JS Authentication Flow
* **Kamallochan Mishra** – Backend Validation, C++ Utilities (`hasher.cpp`, `session_validator.cpp`)
* **Srishti Pathak** – Project Contributor & Development Support, UI/UX, 
