# AlumniConnect API Workflow Documentation

This document explains the technical lifecycle of API calls in the AlumniConnect platform, specifically focusing on the **Mentorship System**.

## 🚀 High-Level Architecture
The system follows a standard 4-tier architecture:
`Frontend (React)` ➔ `Service Layer (Axios)` ➔ `Backend API (Laravel)` ➔ `Database (MSSQL)`

---

## 1. Mentorship Discovery (Find Mentors)
This flow describes how alumni profiles are fetched and filtered for the Mentorship page.

### A. Frontend (UI Layer)
- **Path**: `Mentorship.jsx`
- **Action**: When the "Explore Mentors" tab is active, it calls the `fetchData` function.
- **Call**: `api.get('/mentorships')`

### B. Service Layer (Network API)
- **Path**: `frontend/src/services/api.js`
- **Logic**: Attaches the JWT Bearer token from `localStorage` to the request headers and routes it to the backend base URL.

### C. Backend Routing (Entry Point)
- **Path**: `backend/routes/api.php`
- **Definition**: `Route::get('/mentorships', [MentorshipController::class, 'index']);`
- **Middleware**: `auth:api` (Verifies the JWT token and identifies the user).

### D. Controller (Business Logic)
- **Path**: `app/Http/Controllers/Api/MentorshipController.php`
- **Logic**: 
  1. Executes Eloquent query: `Alumni::with(['user.profile'])->where('is_accepting_mentee', true)->get();`
  2. Maps the resulting Alumni collection into a "Mentor" object.
  3. Uses the **Profile Bio** as the default mentorship description.
- **Output**: Returns a JSON array of Mentor objects.

### E. Model & Database (Data Layer)
- **Primary Table**: `alumni` (Filtered by `is_accepting_mentee = 1`)
- **Relationship**: Joins with `users` and `alumni_profiles` to retrieve full profile details.

---

## 2. Requesting Mentorship
This flow describes how a student sends a mentorship request to an alumni.

### A. Frontend (Interaction)
- **Path**: `MentorCard.jsx`
- **Action**: Student clicks "Apply for Mentorship", enters a message, and submits.
- **Call**: `api.post('/mentorships/${id}/request', { message })`

### B. Controller (Request Validation & Storage)
- **Path**: `MentorshipController.php@storeRequest`
- **Logic**:
  1. Checks if the user is a `student`.
  2. **Crucial Step**: Finds or creates a entry in the `mentorship_listing` table for that alumni (to ensure database referential integrity).
  3. Checks if a request already exists to prevent duplicates.
  4. Creates a record in the `mentorship_requests` table with `status = 'Pending'`.

### C. Database Effects
- **Table**: `mentorship_requests` (New row inserted)
- **Fields**: `listing_id`, `student_id`, `message`, `status`.

---

## 3. Profile Management (Accepting Mentees Toggle)
How an alumni updates their availability.

### A. Frontend
- **Path**: `Profile.jsx`
- **Action**: Alumni toggles the "Accepting Mentees" switch.
- **Call**: `api.put('/profile', { alumni_data: { is_accepting_mentee: true } })`

### B. Controller
- **Path**: `ProfileController.php@update`
- **Logic**: Updates the `is_accepting_mentee` column in the `alumni` table for the authenticated user.

---

## 🛠 Summary Checklist for Developers
- **Routes**: Always defined in `api.php`.
- **Logic**: Encapsulated in `Controllers`.
- **Auth**: Handled via JWT middleware.
- **Data**: Defined in `Models` with proper relationships.
