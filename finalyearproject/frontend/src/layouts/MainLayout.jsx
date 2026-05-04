import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="lg:pl-72 flex flex-col min-h-screen relative">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 py-10 px-6 sm:px-10 lg:px-12 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-7xl mx-auto pb-12"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
          
          {/* Gorgeous Background Decorations */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.03, 0.05, 0.03],
                x: [0, 50, 0]
              }}
              transition={{ duration: 15, repeat: Infinity }}
              className="absolute -top-[10%] -right-[5%] w-[50%] h-[50%] bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full blur-[150px]"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.03, 0.06, 0.03],
                x: [0, -50, 0]
              }}
              transition={{ duration: 20, repeat: Infinity }}
              className="absolute -bottom-[10%] -left-[5%] w-[60%] h-[60%] bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-full blur-[150px]"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
