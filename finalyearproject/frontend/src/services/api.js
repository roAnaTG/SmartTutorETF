import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data)
};

// Courses API
export const coursesAPI = {
  getAll: (params) => api.get('/courses', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  postVacancy: (id, data) => api.post(`/courses/${id}/vacancy`, data),
  getManagerCourses: () => api.get('/courses/manager/my-courses'),
  getTutorCourses: () => api.get('/courses/tutor/my-courses'),
  getStudentCourses: () => api.get('/courses/student/my-courses')
};

// Applications API
export const applicationsAPI = {
  apply: (data) => api.post('/applications', data),
  getAll: (params) => api.get('/applications', { params }),
  getById: (id) => api.get(`/applications/${id}`),
  review: (id, data) => api.put(`/applications/${id}`, data)
};

// Payments API
export const paymentsAPI = {
  create: (data) => api.post('/payments', data),
  getAll: (params) => api.get('/payments', { params }),
  getById: (id) => api.get(`/payments/${id}`),
  review: (id, data) => api.put(`/payments/${id}`, data),
  getMyPayments: () => api.get('/payments/my-payments')
};

// Lessons API
export const lessonsAPI = {
  getAll: (params) => api.get('/lessons', { params }),
  getById: (id) => api.get(`/lessons/${id}`),
  create: (data) => api.post('/lessons', data),
  update: (id, data) => api.put(`/lessons/${id}`, data),
  delete: (id) => api.delete(`/lessons/${id}`),
  publish: (id) => api.put(`/lessons/${id}/publish`),
  markComplete: (id) => api.post(`/lessons/${id}/complete`)
};

// Sessions API
export const sessionsAPI = {
  getAll: (params) => api.get('/sessions', { params }),
  getById: (id) => api.get(`/sessions/${id}`),
  create: (data) => api.post('/sessions', data),
  update: (id, data) => api.put(`/sessions/${id}`, data),
  delete: (id) => api.delete(`/sessions/${id}`),
  join: (id) => api.post(`/sessions/${id}/join`),
  leave: (id) => api.post(`/sessions/${id}/leave`)
};

// Groups API
export const groupsAPI = {
  getAll: (params) => api.get('/groups', { params }),
  getById: (id) => api.get(`/groups/${id}`),
  create: (data) => api.post('/groups', data),
  update: (id, data) => api.put(`/groups/${id}`, data),
  delete: (id) => api.delete(`/groups/${id}`),
  assignStudents: (id, studentIds) => api.post(`/groups/${id}/students`, { studentIds }),
  removeStudent: (groupId, studentId) => api.delete(`/groups/${groupId}/students/${studentId}`)
};

// Assessments API
export const assessmentsAPI = {
  getAll: (params) => api.get('/assessments', { params }),
  getById: (id) => api.get(`/assessments/${id}`),
  create: (data) => api.post('/assessments', data),
  update: (id, data) => api.put(`/assessments/${id}`, data),
  delete: (id) => api.delete(`/assessments/${id}`),
  publish: (id) => api.put(`/assessments/${id}/publish`),
  submit: (id, answers) => api.post(`/assessments/${id}/submit`, { answers }),
  getSubmissions: (params) => api.get('/assessments/submissions', { params })
};

// Progress API
export const progressAPI = {
  getAll: () => api.get('/progress'),
  getCourseProgress: (courseId) => api.get(`/progress/${courseId}`),
  update: (courseId, data) => api.put(`/progress/${courseId}`, data),
  getStudentStats: () => api.get('/progress/stats/student'),
  getTutorStats: () => api.get('/progress/stats/tutor')
};

// Notifications API
export const notificationsAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`)
};

export default api;
