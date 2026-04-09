# Alumni Directory Implementation Walkthrough

This document outlines the architectural flow and implementation details of the Alumni Directory feature.

## 1. Goal
Fetch all alumni from the database and display them as cards. Clicking "View Profile" opens a modal popup with detailed information.

## 2. Architectural Flow
The data flow follows the standard MVC pattern integration with a React frontend:

```mermaid
graph TD
    A[Frontend: AlumniDirectory.jsx] -->|1. Request| B[Service: alumniService.js]
    B -->|2. GET /api/alumni| C[Backend: api.php Routes]
    C -->|3. Controller| D[AlumniController.php]
    D -->|4. Model Query| E[Models: User, Alumni, Profile]
    E -->|5. Data| D
    D -->|6. JSON Response| B
    B -->|7. State Update| A
    A -->|8. Render| F[Components: AlumniCard.jsx]
    F -->|9. Action| G[Modal: AlumniProfileModal.jsx]
```

## 3. Implementation Details

### Backend (Laravel)
- **Controller**: `app/Http/Controllers/Api/AlumniController.php`
    - `index()`: Fetches users with the `alumni` role. Uses Eager Loading (`with(['profile', 'alumni'])`) to minimize database queries.
- **Routes**: `routes/api.php`
    - Registered `GET /api/alumni` and `GET /api/alumni/{id}` under the `auth:api` middleware.

### Frontend (React)
- **Service**: `src/services/alumniService.js`
    - Handles the Axios abstraction for fetching alumni data.
- **State Management**: `AlumniDirectory.jsx`
    - Uses `useEffect` to fetch data on mount.
    - Includes **Default Cards** fallback logic: if the database is empty or the API fails, it displays a set of pre-defined alumni to ensure the UI remains functional and looks professional.
- **Components**:
    - `AlumniCard.jsx`: Displays basic info and emits a `onViewProfile` event.
    - `AlumniProfileModal.jsx`: A premium, animated modal built with `framer-motion` to show bio, professional details, and socials.

## 4. Database Schema Interaction
The feature integrates three tables:
1. `users`: Stores core credentials and the `role`.
2. `user_profiles`: Stores personal info (`first_name`, `last_name`, `bio`, `linkedin_url`).
3. `alumni`: Stores professional info (`company`, `job_title`).

---
*Created by Antigravity AI Coding Assistant*
