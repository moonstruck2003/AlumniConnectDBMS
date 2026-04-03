# 📌 Internship & Mentorship Platform

## 🧠 Overview
A full-stack system built from the ERD to manage:

- Users (Students, Alumni, Recruiters)
- Job Listings & Applications
- Mentorship Listings & Requests
- Messaging System
- User Profiles

---

# 🧱 Project Structure

root/
│
├── frontend/
├── backend/
├── tables/            # ALL DATABASE SCHEMAS
├── contents/          # API + Backend Flow Docs
└── README.md

---

# 🎨 FRONTEND STRUCTURE

frontend/
│
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Profile.jsx
│   ├── JobListings.jsx
│   ├── JobDetails.jsx
│   ├── ApplyJob.jsx
│   ├── MentorshipListings.jsx
│   ├── MentorshipRequest.jsx
│   ├── Requests.jsx
│   ├── Conversations.jsx
│   └── Messages.jsx
│
├── components/
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── Card.jsx
│   ├── Modal.jsx
│   ├── FormInput.jsx
│   └── MessageBubble.jsx
│
├── services/
│   ├── authService.js
│   ├── userService.js
│   ├── jobService.js
│   ├── mentorshipService.js
│   ├── messageService.js
│
├── hooks/
│   ├── useAuth.js
│   ├── useFetch.js
│
└── utils/

---

# ⚠️ FRONTEND RULES

- ❌ No API calls inside components
- ✅ Use services/ for all API calls
- Each page MUST document:
  - What it does
  - APIs used
  - Flow

---

# ⚙️ BACKEND STRUCTURE

backend/
│
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── jobController.js
│   ├── mentorshipController.js
│   ├── messageController.js
│   └── requestController.js
│
├── models/
│
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── jobRoutes.js
│   ├── mentorshipRoutes.js
│   ├── messageRoutes.js
│   └── requestRoutes.js
│
├── services/
├── middleware/
├── config/

---

# 🗄️ DATABASE SCHEMAS

📁 ALL schemas MUST be inside:

/tables/schema.sql

---

## 🔥 COMPLETE SQL SCHEMA

```sql
-- USERS
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('student','alumni','recruiter') NOT NULL
);

-- USER PROFILES
CREATE TABLE user_profiles (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    bio TEXT,
    linkedin_url VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- STUDENTS
CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    department VARCHAR(100),
    cgpa FLOAT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ALUMNI
CREATE TABLE alumni (
    alumni_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    company VARCHAR(255),
    job_title VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- RECRUITERS
CREATE TABLE recruiters (
    recruiter_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    company_name VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- JOB LISTING
CREATE TABLE job_listing (
    job_id INT AUTO_INCREMENT PRIMARY KEY,
    recruiter_id INT,
    job_title VARCHAR(255),
    job_description TEXT,
    category_id INT,
    FOREIGN KEY (recruiter_id) REFERENCES recruiters(recruiter_id)
);

-- JOB CATEGORIES
CREATE TABLE job_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100)
);

-- JOB APPLICATIONS
CREATE TABLE job_applications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    listing_id INT,
    status VARCHAR(50),
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (listing_id) REFERENCES job_listing(job_id)
);

-- MENTORSHIP LISTING
CREATE TABLE mentorship_listing (
    listing_id INT AUTO_INCREMENT PRIMARY KEY,
    alumni_id INT,
    description TEXT,
    min_coin_bid INT,
    FOREIGN KEY (alumni_id) REFERENCES alumni(alumni_id)
);

-- MENTORSHIP REQUESTS
CREATE TABLE mentorship_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    listing_id INT,
    student_id INT,
    status VARCHAR(50),
    message TEXT,
    FOREIGN KEY (listing_id) REFERENCES mentorship_listing(listing_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- CONVERSATIONS
CREATE TABLE conversations (
    conversation_id INT AUTO_INCREMENT PRIMARY KEY,
    created_by INT,
    title VARCHAR(255),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- MESSAGES
CREATE TABLE messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT,
    message_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id)
);





📡 CONTENTS (API DOCUMENTATION)

📁 Folder:

/contents/

REQUIRED FILES

contents/
│
├── auth.md
├── users.md
├── jobs.md
├── mentorship.md
├── messages.md
├── requests.md
└── architecture.md

EACH API MUST INCLUDE:
Endpoint

POST /api/jobs/create

Location

backend/controllers/jobController.js

Flow

Frontend → Service → Route → Controller → Service → DB

Request
{
  "job_title": "Software Engineer"
}
Response
{
  "success": true
}
🔄 SYSTEM FLOW

Example:

Apply Job →

Frontend (jobService.js)
→ API (/api/jobs/apply)
→ Route
→ Controller
→ Service
→ DB

🧠 ENGINEERING RULES
Controller = no logic
Service = logic
Models = DB
Routes = mapping
📏 CODING RULES
camelCase → JS
snake_case → SQL
PascalCase → React Components
📣 INSTRUCTIONS FOR ANTIGRAVITY

You MUST:

Follow folder structure strictly
Place ALL schemas inside /tables
Place ALL API docs inside /contents
Document EVERY page:
Purpose
API used
Endpoint
Maintain clean architecture
No messy code
🚀 RUN PROJECT

Backend:
cd backend
npm install
npm run dev

Frontend:
cd frontend
npm install
npm run dev

Database:
Run /tables/schema.sql