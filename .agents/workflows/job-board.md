# Job Board Workflow

This document outlines the end-to-end technical flow of the AlumniConnect Job Board system.

## 1. Posting a Job
Recruiters can deploy new job opportunities to the network.

| Layer | Action |
| :--- | :--- |
| **Frontend Page** | `PostJob.jsx` collects form data (title, company, type, category, salary, deadline, etc.) and calls `jobService.postJob(formData)`. |
| **Service Layer** | `jobService.js` sends a `POST` request to `/api/jobs` with the data and the Sanctum Auth Token in headers. |
| **Backend Route** | `api.php` receives the request at `Route::post('/jobs', [JobController::class, 'store'])` protected by `auth:sanctum`. |
| **Controller** | `JobController.php` method `store()`: <br>1. Validates the incoming request (including handling nullable deadlines). <br>2. Verifies the user is a recruiter in the database. <br>3. Creates a new record in the `job_listing` table with the correct `recruiter_id`. |
| **Model** | `JobListing.php` model handles the database entry. |
| **Response** | Returns the created job object and a `201 Created` status code. |

---

## 2. Managing Postings (Toggle Status)
Recruiters can toggle their own jobs between "Active" and "Closed".

| Layer | Action |
| :--- | :--- |
| **Frontend Page** | `ManageJobs.jsx` lists recruiter's jobs and calls `jobService.toggleJob(jobId)` on click. |
| **Service Layer** | `jobService.js` sends a `POST` request to `/api/jobs/{id}/toggle`. |
| **Backend Route** | `api.php` route `Route::post('/jobs/{id}/toggle', [JobController::class, 'toggleStatus'])`. |
| **Controller** | `JobController.php` method `toggleStatus()`: <br>1. Finds the job. <br>2. Verifies that the authenticated user owns the job. <br>3. Inverts the `is_active` boolean and saves. |
| **Response** | Returns the new status and a success message. |

---

## 3. Browsing & Applying
Students and Alumni can discover opportunities and apply via contact.

| Layer | Action |
| :--- | :--- |
| **Frontend Page** | `Jobs.jsx` fetches all active jobs. Clicking "Apply" opens a **Popup Modal**. |
| **Frontend UI** | `Modal.jsx` displays the `contact_email` for the specific job. |
| **Job Details** | `JobDetails.jsx` provides a dedicated page for deep analysis of the job node, showing full description and contact protocol. |
| **Service Layer** | `jobService.js` uses `getJobs()` and `getJobById()` to populate these views. |
| **Backend Route** | `Route::get('/jobs')` and `Route::get('/jobs/{id}')`. |

---

## 4. Specialization Sectors
The categorization system for job listings.

| Layer | Action |
| :--- | :--- |
| **Seeding** | `JobCategorySeeder.php` populates the `job_categories` table with industry sectors. |
| **API Fetch** | `JobController.php` method `getCategories()` returns all available sectors. |
| **UI Component** | `PostJob.jsx` renders a secure dropdown with custom icons and pointer-events logic for optimal UX. |
