# AuraHire Frontend

A modern job portal frontend built with React.js.

## 📁 Project Structure

```
ApplicationTrackingSystemFrontend-master/
├── public/
├── src/
│   ├── components/
│   │   ├── assets/           # Images and static assets
│   │   ├── common/            # Common components (ErrorBoundary, ScrollToTop, PageTitle)
│   │   ├── footer/            # Footer component
│   │   ├── header/            # Header component
│   │   └── layout/            # Layout wrapper
│   ├── context/
│   │   └── AuthContext.jsx   # Authentication context
│   ├── pages/
│   │   ├── auth/              # Authentication pages
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── VerifyEmail.jsx
│   │   │   └── VerifyEmailNotice.jsx
│   │   ├── hr/                # HR pages
│   │   │   └── Dashboard.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Home.jsx
│   │   ├── Jobs.jsx           # Job listing with search/filters
│   │   ├── JobDetails.jsx     # Single job details page
│   │   ├── MyApplications.jsx # User's applications
│   │   ├── Profile.jsx        # User profile
│   │   ├── SavedJobs.jsx     # Saved jobs
│   │   └── NotFound.jsx
│   ├── routers/
│   │   └── Routers.js         # Route definitions
│   ├── services/
│   │   └── api.js             # API service (Axios)
│   ├── styles/                # CSS files
│   │   ├── Auth.css
│   │   ├── Jobs.css
│   │   ├── JobDetails.css
│   │   ├── Profile.css
│   │   ├── MyApplications.css
│   │   ├── HRDashboard.css
│   │   └── ...
│   ├── utils/
│   │   └── constants.js
│   ├── App.js
│   └── index.js
└── package.json
```

## 🚀 Features

### Public Pages
- **Home** - Landing page with hero section
- **Jobs** - Browse all jobs with search and filters
- **Job Details** - View individual job details
- **About** - About page
- **Contact** - Contact form

### Authentication
- **Login** - User and HR login
- **Signup** - User and HR registration
- **Forgot Password** - Password reset flow
- **Email Verification** - Verify email address

### User Features
- **Profile** - Enhanced profile with skills, education, experience
- **My Applications** - Track application status
- **Saved Jobs** - Bookmarked jobs
- **Apply for Jobs** - Apply directly from job listings

### HR Features
- **HR Dashboard** - Manage applicants and job postings

## 📦 Installation

```bash
npm install
```

## 🏃 Running

```bash
npm start
```

App runs on `http://localhost:3000`

## 🔗 API Integration

The frontend connects to the backend API at `http://localhost:15000/api`

All API calls are handled through `src/services/api.js` which includes:
- Automatic token management
- Request/response interceptors
- Error handling

## 🎨 Styling

- CSS modules for component-specific styles
- Responsive design
- Modern UI with gradients and animations

## 🔐 Authentication Flow

1. User signs up → Email verification sent
2. User verifies email → Can login
3. Login → Access token + Refresh token stored
4. Token refresh → Automatic on expiry
5. Logout → Tokens cleared

## 📱 Pages Overview

### `/home` - Landing Page
- Hero section
- Featured jobs
- Call-to-action

### `/jobs` - Job Listings
- Search by keyword
- Filter by location, category
- Pagination
- Save/Apply buttons

### `/job/:id` - Job Details
- Full job description
- Apply button
- Save button
- Share functionality

### `/profile` - User Profile
- Personal information
- Skills management
- Education history
- Work experience
- Resume/Photo upload

### `/my-applications` - Applications
- List of all applications
- Application status
- Job details for each application

### `/saved-jobs` - Saved Jobs
- List of bookmarked jobs
- Quick apply option
- Remove from saved

### `/hr/dashboard` - HR Dashboard
- View all applicants
- Update application status
- Job statistics
