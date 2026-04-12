# Job Application API Workflow Documentation

This document explains the technical lifecycle of API calls for the **Job Application System**, from the Frontend UI to the Database.

## 🚀 High-Level Architecture
The system follows a 4-tier architecture:
`Frontend (React)` ➔ `Service Layer (Axios)` ➔ `Backend API (Laravel)` ➔ `Database (MSSQL)`

---

## 1. Discovery & Application (Student/Alumni)
This flow describes how a user discovers jobs and applies with a CV.

### A. Discovery (Job Board)
- **Path**: `Jobs.jsx` ➔ `jobService.getJobs()`
- **Logic**: The `JobController@index` calculates a `has_applied` boolean for each job based on the authenticated user's record.
- **UI Action**: If `has_applied` is true, the button transforms into a disabled **"Applied"** badge with an emerald glow.
- **Restriction**: If the user is a **Recruiter**, the Apply button is hidden and replaced with a "Recruiter View Only" notice.

### B. Submission (Transmission Protocol)
- **Path**: `Jobs.jsx` ➔ `Modal`
- **Action**: User selects a PDF file. A **Scanning Animation** initiates in the UI to confirm selection.
- **Logic**: 
    - Validates file size locally (< 3MB).
    - Uses `FormData` for multipart transmission.
- **Call**: `jobService.applyJob(jobId, formData)`

### C. Backend API Handlers
- **Path**: `backend/routes/api.php` ➔ `JobController@apply`
- **Security**: 
    - `auth:api` middleware identifies the user.
    - Validates 3MB limit and file types (`pdf,doc,docx`).
    - Blocks recruiters from applying (403).
- **Storage**: Files are stored in `storage/app/public/resumes` and linked via `php artisan storage:link`.

---

## 2. Applicants Management (Recruiter)
This flow describes how a recruiter interacts with the **Applicants Dossier**.

### A. Data Retrieval
- **Path**: `ManageJobs.jsx` ➔ `ApplicantsModal`
- **UI Logic**: Loads candidates in a **Wide Modal (size="xl")** to prevent layout compression.
- **Animations**: Rows slide in with a **Staggered Entry** (0.05s delay per index) for a premium feel.

### B. Status Intelligence
- **Action**: Recruiter clicks "Shortlist" or "Reject".
- **Call**: `jobService.updateApplicationStatus(appId, status)`
- **UI State**: The button icons utilize **Active State Glows**. When a candidate is shortlisted, the Award icon remains glowing emerald.
- **Database**: Updates `job_applications.status` (Pending, Shortlisted, Rejected, Offered).

### C. Direct Communication
- **Action**: Clicks "Initiate Message" bubble.
- **Logic**: Retrieves the `user_id` of the applicant and navigates to `/messages/:id`.
- **Navigation**: Uses `react-router-dom`'s `useNavigate` hook for seamless redirection.

---

## 🛠 Project configuration notes
- **Storage**: Ensure `FILESYSTEM_DISK=public` in `.env`.
- **Asset URL**: CV links are generated via `asset('storage/' . $path)`, requiring `APP_URL` to include the correct port (e.g., `:8000`).
- **Models**: Uses `User`, `Student`, `Alumni`, and `JobListing` relationships to map candidate profiles.
