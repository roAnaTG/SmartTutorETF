import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { coursesAPI, paymentsAPI, applicationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { HiBookOpen, HiUsers, HiClock, HiAcademicCap, HiCheck, HiX, HiCreditCard, HiChatAlt2, HiChevronRight, HiLightningBolt, HiStar, HiPlay } from 'react-icons/hi';
import toast from 'react-hot-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null); // 'payment', 'apply', 'vacancy'
  
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    paymentMethod: 'credit-card'
  });
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    experience: ''
  });
  const [vacancyData, setVacancyData] = useState({
    requirements: '',
    deadline: ''
  });

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await coursesAPI.getById(id);
      setCourse(response.data);
      setPaymentData(prev => ({ ...prev, amount: response.data.price }));
    } catch (error) {
      toast.error('Failed to fetch course');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    try {
      await paymentsAPI.create({
        course: id,
        amount: course.price,
        paymentMethod: paymentData.paymentMethod
      });
      toast.success('Payment submitted! Awaiting approval.');
      setActiveModal(null);
      navigate('/payments');
    } catch (error) {
      toast.error(error.message || 'Failed to submit payment');
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await applicationsAPI.apply({
        course: id,
        ...applicationData
      });
      toast.success('Application submitted successfully!');
      setActiveModal(null);
      navigate('/applications');
    } catch (error) {
      toast.error(error.message || 'Failed to submit application');
    }
  };

  const handlePostVacancy = async (e) => {
    e.preventDefault();
    try {
      await coursesAPI.postVacancy(id, vacancyData);
      toast.success('Tutor vacancy posted successfully!');
      setActiveModal(null);
      fetchCourse();
    } catch (error) {
      toast.error(error.message || 'Failed to post vacancy');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) return <div className="text-center py-20">Course not found</div>;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto space-y-12"
    >
      {/* Hero Header */}
      <motion.div variants={itemVariants} className="relative rounded-[3rem] overflow-hidden bg-slate-900 h-[500px] shadow-2xl group">
        <img 
          src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'} 
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" 
          alt={course.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 p-12 w-full flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-blue-500/20">
                {course.category}
              </span>
              <div className="flex text-amber-400">
                <HiStar className="h-4 w-4" /><HiStar className="h-4 w-4" /><HiStar className="h-4 w-4" /><HiStar className="h-4 w-4" /><HiStar className="h-4 w-4" />
              </div>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tight leading-tight">{course.title}</h1>
            <p className="text-slate-300 text-lg font-medium leading-relaxed line-clamp-2">{course.description}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="h-16 w-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all hover:scale-110 shadow-2xl">
              <HiPlay className="h-8 w-8 ml-1" />
            </button>
            <div className="text-right">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Tuition Fee</p>
              <h2 className="text-4xl font-black text-white">${course.price}</h2>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          <motion.div variants={itemVariants} className="premium-card">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Course Curriculum</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700 group">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    0{i}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 dark:text-white">Module {i}: Advanced Concepts</h4>
                    <p className="text-xs text-slate-500 mt-1">45 mins • 3 resources</p>
                  </div>
                  <HiPlay className="h-5 w-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="premium-card">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Meet Your Instructor</h3>
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-3xl overflow-hidden bg-slate-100">
                <img src={`https://i.pravatar.cc/150?u=${course.instructor?._id}`} className="w-full h-full object-cover" alt="" />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white">{course.instructor?.firstName} {course.instructor?.lastName}</h4>
                <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mt-1">Senior Expert Tutor</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="flex items-center gap-1 text-xs font-bold text-slate-500"><HiUsers className="h-4 w-4" /> 2.4k Students</span>
                  <span className="flex items-center gap-1 text-xs font-bold text-slate-500"><HiBookOpen className="h-4 w-4" /> 12 Courses</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-8">
          <motion.div variants={itemVariants} className="premium-card bg-gradient-to-br from-blue-600 to-indigo-700 !border-0 text-white">
            <h3 className="text-2xl font-black mb-2">Ready to Start?</h3>
            <p className="text-blue-100 font-medium mb-8">Join thousands of students and transform your career today.</p>
            
            <div className="space-y-4">
              {user?.role === 'student' && (
                <button 
                  onClick={() => setActiveModal('payment')}
                  className="w-full py-5 bg-white text-blue-600 rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] transition-transform active:scale-95"
                >
                  Enroll Now
                </button>
              )}
              {user?.role === 'tutor' && course.tutorVacancy?.isOpen && (
                <button 
                  onClick={() => setActiveModal('apply')}
                  className="w-full py-5 bg-white text-blue-600 rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] transition-transform"
                >
                  Apply as Tutor
                </button>
              )}
              {user?.role === 'admin' && !course.tutorVacancy?.isOpen && (
                <button 
                  onClick={() => setActiveModal('vacancy')}
                  className="w-full py-5 bg-white/20 backdrop-blur-xl text-white rounded-2xl font-black text-lg shadow-xl hover:bg-white/30 transition-all"
                >
                  Post Tutor Vacancy
                </button>
              )}
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between text-sm font-bold text-blue-100">
                <span className="flex items-center gap-2"><HiClock /> Duration</span>
                <span>12 Weeks</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-blue-100">
                <span className="flex items-center gap-2"><HiAcademicCap /> Certification</span>
                <span>Yes</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="premium-card">
            <h4 className="text-lg font-black text-slate-900 dark:text-white mb-4">Why this course?</h4>
            <ul className="space-y-3">
              {['Live mentoring sessions', 'Practical case studies', 'Lifetime access', 'Supportive community'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                  <div className="h-5 w-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <HiCheck className="h-3 w-3 text-blue-600" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Modals with gorgeous styling */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass rounded-[3rem] p-10 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6">
                <button onClick={() => setActiveModal(null)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:scale-110 transition-transform">
                  <HiX className="h-5 w-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-8">
                {activeModal === 'payment' && (
                  <form onSubmit={handleEnroll} className="space-y-6">
                    <div className="text-center">
                      <div className="h-20 w-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <HiCreditCard className="h-10 w-10 text-blue-600" />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white">Secure Checkout</h3>
                      <p className="text-slate-500 font-medium mt-2">Unlock lifetime access to {course.title}</p>
                    </div>
                    <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl space-y-4">
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-500">Course Price</span>
                        <span className="text-slate-900 dark:text-white">${course.price}</span>
                      </div>
                      <div className="flex justify-between font-black text-xl border-t border-slate-200 dark:border-slate-700 pt-4">
                        <span>Total Due</span>
                        <span className="text-blue-600">${course.price}</span>
                      </div>
                    </div>
                    <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/25 hover:bg-blue-700 transition-all">Complete Purchase</button>
                  </form>
                )}
                
                {activeModal === 'apply' && (
                  <form onSubmit={handleApply} className="space-y-6">
                    <div className="text-center">
                      <div className="h-20 w-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <HiAcademicCap className="h-10 w-10 text-indigo-600" />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white">Tutor Application</h3>
                      <p className="text-slate-500 font-medium mt-2">Join our elite faculty for this course</p>
                    </div>
                    <div className="space-y-4">
                      <textarea
                        required
                        placeholder="Why are you a great fit?"
                        value={applicationData.coverLetter}
                        onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                        className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-3xl focus:ring-2 focus:ring-indigo-500 min-h-[150px] font-medium"
                      />
                    </div>
                    <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-500/25">Submit Application</button>
                  </form>
                )}

                {activeModal === 'vacancy' && (
                  <form onSubmit={handlePostVacancy} className="space-y-6">
                    <div className="text-center">
                      <div className="h-20 w-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <HiLightningBolt className="h-10 w-10 text-amber-600" />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white">Post Vacancy</h3>
                      <p className="text-slate-500 font-medium mt-2">Find the best instructor for this course</p>
                    </div>
                    <div className="space-y-4">
                      <textarea
                        required
                        placeholder="Tutor Requirements..."
                        value={vacancyData.requirements}
                        onChange={(e) => setVacancyData({ ...vacancyData, requirements: e.target.value })}
                        className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-3xl focus:ring-2 focus:ring-amber-500 font-medium"
                      />
                      <input
                        type="date"
                        required
                        value={vacancyData.deadline}
                        onChange={(e) => setVacancyData({ ...vacancyData, deadline: e.target.value })}
                        className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-0 rounded-3xl focus:ring-2 focus:ring-amber-500 font-medium"
                      />
                    </div>
                    <button type="submit" className="w-full py-5 bg-amber-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-amber-500/25">Post Vacancy Now</button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CourseDetail;
