import axios from 'axios';

const API_BASE_URL = 'http://localhost:15000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/users/refresh-token`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ============ AUTH APIs ============
export const authAPI = {
  // User Auth
  signup: (data) => api.post('/users/signup', data),
  login: (data) => api.post('/users/login', data),
  logout: (refreshToken) => api.post('/users/logout', { refreshToken }),
  verifyEmail: (token) => api.get(`/users/verify-email/${token}`),
  resendVerification: (email) => api.post('/users/resend-verification', { email }),
  forgotPassword: (email) => api.post('/users/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/users/reset-password/${token}`, { password }),
  changePassword: (data) => api.post('/users/change-password', data),
  refreshToken: (refreshToken) => api.post('/users/refresh-token', { refreshToken }),

  // HR Auth
  signupHR: (data) => api.post('/signup-hr', data),
  loginHR: (data) => api.post('/login-hr', data),
};

// ============ JOBS APIs ============
export const jobsAPI = {
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/job/${id}`),
  getCategories: () => api.get('/jobs/categories'),
  getLocations: () => api.get('/jobs/locations'),
  create: (data) => api.post('/jobs', data),
  apply: (jobId, data) => api.post(`/apply/${jobId}`, data),
  // HR Job Management
  getMyJobs: () => api.get('/jobs/my-jobs'),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
};

// ============ SAVED JOBS APIs ============
export const savedJobsAPI = {
  getAll: () => api.get('/saved-jobs'),
  save: (jobId) => api.post(`/saved-jobs/${jobId}`),
  unsave: (jobId) => api.delete(`/saved-jobs/${jobId}`),
  checkSaved: (jobId) => api.get(`/saved-jobs/check/${jobId}`),
};

// ============ APPLICATIONS APIs ============
export const applicationsAPI = {
  getMyApplications: () => api.get('/applications/my-applications'),
  getApplicationById: (id) => api.get(`/applications/my-applications/${id}`),
  getMyApplicationWorkflow: (id) => api.get(`/applications/my-applications/${id}/workflow`),
  withdrawApplication: (id) => api.delete(`/applications/my-applications/${id}`),
  
  // HR
  getApplicants: (params) => api.get('/applications/hr/applicants', { params }),
  updateStatus: (id, data) => api.put(`/applications/hr/applicants/${id}/status`, data),
  getStats: () => api.get('/applications/hr/stats'),
  
  // Workflow Management
  getWorkflow: (id) => api.get(`/applications/hr/applicants/${id}/workflow`),
  moveToNextStage: (id, data) => api.post(`/applications/hr/applicants/${id}/next-stage`, data),
  rejectApplication: (id, data) => api.post(`/applications/hr/applicants/${id}/reject`, data),
  scheduleInterview: (id, data) => api.post(`/applications/hr/applicants/${id}/schedule-interview`, data),
  completeStage: (id, data) => api.post(`/applications/hr/applicants/${id}/complete-stage`, data),
  getWorkflowStages: () => api.get('/applications/hr/workflow-stages'),
};

// ============ PROFILE APIs ============
export const profileAPI = {
  get: () => api.get('/enhanced-profile'),
  update: (data) => api.put('/enhanced-profile', data),
  addExperience: (data) => api.post('/enhanced-profile/experience', data),
  deleteExperience: (id) => api.delete(`/enhanced-profile/experience/${id}`),
  addEducation: (data) => api.post('/enhanced-profile/education', data),
  deleteEducation: (id) => api.delete(`/enhanced-profile/education/${id}`),
  updateSkills: (skills) => api.put('/enhanced-profile/skills', { skills }),
  getCompletionTips: () => api.get('/enhanced-profile/completion-tips'),
};

// ============ UPLOAD APIs ============
export const uploadAPI = {
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post('/upload/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadPhoto: (file) => {
    const formData = new FormData();
    formData.append('photo', file);
    return api.post('/upload/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteResume: (filename) => api.delete(`/upload/resume/${filename}`),
  deletePhoto: (filename) => api.delete(`/upload/photo/${filename}`),
};

// ============ CONTACT API ============
export const contactAPI = {
  submit: (data) => api.post('/contact', data),
};

export default api;


