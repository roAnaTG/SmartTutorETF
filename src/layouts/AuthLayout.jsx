import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { HiAcademicCap } from 'react-icons/hi';

const AuthLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
              <HiAcademicCap className="h-7 w-7 text-accent-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground tracking-tight">
              SmartTutor
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            Next Generation Learning Platform
          </p>
        </div>
        
        {/* Card */}
        <div className="card-elevated rounded-2xl overflow-hidden">
          <Outlet />
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} SmartTutor. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
