import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard Pages
import StudentDashboard from './pages/student/Dashboard';
import TutorDashboard from './pages/tutor/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import ManagerDashboard from './pages/manager/Dashboard';

// Feature Pages
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import MyCourses from './pages/MyCourses';
import Lessons from './pages/Lessons';
import Sessions from './pages/Sessions';
import Groups from './pages/Groups';
import Assessments from './pages/Assessments';
import Progress from './pages/Progress';
import Notifications from './pages/Notifications';
import Applications from './pages/Applications';
import Payments from './pages/Payments';
import Profile from './pages/Profile';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Dashboard Router Component
const DashboardSwitcher = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  switch (user.role) {
    case 'student': return <StudentDashboard />;
    case 'tutor': return <TutorDashboard />;
    case 'admin': return <AdminDashboard />;
    case 'manager': return <ManagerDashboard />;
    default: return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#10b981',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
          <Routes>
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardSwitcher />
                </ProtectedRoute>
              } />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/my-courses" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <MyCourses />
                </ProtectedRoute>
              } />
              <Route path="/lessons" element={<Lessons />} />
              <Route path="/sessions" element={<Sessions />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/assessments" element={<Assessments />} />
              <Route path="/progress" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Progress />
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
