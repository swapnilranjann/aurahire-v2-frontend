import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from '../components/common/ScrollToTop';
import PageTitle from '../components/common/PageTitle';

// Lazy load pages for better performance
const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About'));
const Jobs = lazy(() => import('../pages/Jobs'));
const Contact = lazy(() => import('../pages/Contact'));
const NotFound = lazy(() => import('../pages/NotFound'));
const JobDetails = lazy(() => import('../pages/JobDetails'));

// Auth Pages
const Login = lazy(() => import('../pages/auth/Login'));
const Signup = lazy(() => import('../pages/auth/Signup'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));
const VerifyEmail = lazy(() => import('../pages/auth/VerifyEmail'));
const VerifyEmailNotice = lazy(() => import('../pages/auth/VerifyEmailNotice'));

// User Pages
const Profile = lazy(() => import('../pages/Profile'));
const MyApplications = lazy(() => import('../pages/MyApplications'));
const MyApplicationDetail = lazy(() => import('../pages/MyApplicationDetail'));
const SavedJobs = lazy(() => import('../pages/SavedJobs'));
const ResumeBuilder = lazy(() => import('../pages/ResumeBuilder'));
const JobAlerts = lazy(() => import('../pages/JobAlerts'));
const CareerAdvice = lazy(() => import('../pages/CareerAdvice'));
const CareerAdviceDetail = lazy(() => import('../pages/CareerAdviceDetail'));
const SkillTests = lazy(() => import('../pages/SkillTests'));

// HR Pages
const HRDashboard = lazy(() => import('../pages/hr/Dashboard'));
const ResumeSearch = lazy(() => import('../pages/hr/ResumeSearch'));
const PostJob = lazy(() => import('../pages/hr/PostJob'));
const ApplicationWorkflow = lazy(() => import('../pages/hr/ApplicationWorkflow'));

// Public Pages
const Pricing = lazy(() => import('../pages/Pricing'));
const RecruitmentSolutions = lazy(() => import('../pages/RecruitmentSolutions'));

// Loading spinner component
const LoadingSpinner = () => (
  <div 
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 200px)',
      background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)',
    }}
    role="status"
    aria-label="Loading page content"
  >
    <div
      style={{
        width: '50px',
        height: '50px',
        border: '4px solid #e2e8f0',
        borderTopColor: '#667eea',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    />
    <style>
      {`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}
    </style>
    <span className="sr-only">Loading...</span>
  </div>
);

const Routers = () => {
  return (
    <>
      <ScrollToTop />
      <PageTitle />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/career-advice" element={<CareerAdvice />} />
          <Route path="/career-advice/:id" element={<CareerAdviceDetail />} />
          <Route path="/skill-tests" element={<SkillTests />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/recruitment-solutions" element={<RecruitmentSolutions />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verify-email-notice" element={<VerifyEmailNotice />} />

          {/* User Protected Routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/my-applications/:id/details" element={<MyApplicationDetail />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/job-alerts" element={<JobAlerts />} />

          {/* HR Protected Routes */}
          <Route path="/hr/dashboard" element={<HRDashboard />} />
          <Route path="/hr/post-job" element={<PostJob />} />
          <Route path="/hr/resume-search" element={<ResumeSearch />} />
          <Route path="/hr/applications/:id/workflow" element={<ApplicationWorkflow />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default Routers;
