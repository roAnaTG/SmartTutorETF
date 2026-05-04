import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { assessmentsAPI, coursesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { HiClipboardCheck, HiPlus, HiX, HiClock, HiAcademicCap, HiChevronRight, HiStar, HiTrash, HiCheckCircle } from 'react-icons/hi';
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

const Assessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course: '',
    type: 'quiz',
    dueDate: '',
    timeLimit: 30,
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    type: 'multiple-choice',
    options: ['', '', '', ''],
    correctAnswer: '',
    points: 1
  });

  useEffect(() => {
    fetchAssessments();
    if (user?.role === 'tutor') fetchTutorCourses();
  }, [user]);

  const fetchAssessments = async () => {
    try {
      const response = await assessmentsAPI.getAll();
      setAssessments(response.data);
    } catch (error) {
      toast.error('Failed to fetch assessments');
    } finally {
      setLoading(false);
    }
  };

  const fetchTutorCourses = async () => {
    try {
      const response = await coursesAPI.getTutorCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to fetch tutor courses');
    }
  };

  const addQuestion = () => {
    if (!currentQuestion.questionText || !currentQuestion.correctAnswer) {
      toast.error('Please complete the question and select a correct answer');
      return;
    }
    setFormData({
      ...formData,
      questions: [...formData.questions, currentQuestion]
    });
    setCurrentQuestion({
      questionText: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 1
    });
  };

  const removeQuestion = (index) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index)
    });
  };

  const handleCreateAssessment = async (e) => {
    e.preventDefault();
    if (formData.questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }
    try {
      await assessmentsAPI.create(formData);
      toast.success('Assessment created successfully!');
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        course: '',
        type: 'quiz',
        dueDate: '',
        timeLimit: 30,
        questions: []
      });
      fetchAssessments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create assessment');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) return;
    try {
      await assessmentsAPI.delete(id);
      toast.success('Assessment deleted successfully');
      fetchAssessments();
    } catch (error) {
      toast.error('Failed to delete assessment');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Assessments</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Evaluate student performance and track knowledge growth.</p>
        </motion.div>
        {user?.role === 'tutor' && (
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="btn-premium"
          >
            <HiPlus className="h-5 w-5" />
            New Assessment
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {assessments.length === 0 ? (
          <div className="col-span-full text-center py-20 premium-card border-dashed border-2">
            <HiClipboardCheck className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-bold text-lg">No assessments posted yet.</p>
          </div>
        ) : (
          assessments.map((assessment) => (
            <motion.div
              key={assessment._id}
              variants={itemVariants}
              className="premium-card group hover:scale-[1.02]"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-2">
                  <div className={`p-4 rounded-2xl ${
                    assessment.type === 'quiz' ? 'bg-blue-500/10 text-blue-600' :
                    assessment.type === 'assignment' ? 'bg-emerald-500/10 text-emerald-600' :
                    'bg-purple-500/10 text-purple-600'
                  }`}>
                    <HiClipboardCheck className="h-6 w-6" />
                  </div>
                  {user?.role === 'tutor' && (
                    <button
                      onClick={() => handleDelete(assessment._id)}
                      className="p-4 rounded-2xl bg-rose-500/10 text-rose-600 hover:bg-rose-600 hover:text-white transition-all"
                    >
                      <HiTrash className="h-6 w-6" />
                    </button>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                  assessment.type === 'quiz' ? 'bg-blue-500/10 text-blue-600' :
                  assessment.type === 'assignment' ? 'bg-emerald-500/10 text-emerald-600' :
                  'bg-purple-500/10 text-purple-600'
                }`}>
                  {assessment.type}
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight mb-2">
                {assessment.title}
              </h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-1.5">
                <HiAcademicCap className="text-blue-500" /> {assessment.course?.title}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Limit</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1">
                    <HiClock className="text-blue-500" /> {assessment.timeLimit}m
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Points</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1">
                    <HiStar className="text-amber-500" /> {assessment.totalPoints}
                  </p>
                </div>
              </div>

              <div className="mt-auto space-y-4 pt-6 border-t border-slate-50 dark:border-slate-800">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">Due Date</span>
                  <span className="text-slate-900 dark:text-white font-black">
                    {assessment.dueDate ? new Date(assessment.dueDate).toLocaleDateString() : 'No deadline'}
                  </span>
                </div>
                
                <button
                  className="w-full py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 dark:hover:bg-blue-50 transition-all text-sm flex items-center justify-center gap-2 group"
                >
                  {user?.role === 'student' ? 'Take Assessment' : 'View Details'}
                  <HiChevronRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto custom-scrollbar">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden my-8"
            >
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">Create Assessment</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
                  <HiX className="h-6 w-6 text-slate-500" />
                </button>
              </div>
              <form onSubmit={handleCreateAssessment} className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {/* Basic Info */}
                <div className="space-y-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">General Settings</h3>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Assessment Title</label>
                    <input
                      required
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-medium"
                      placeholder="e.g. Midterm Quiz"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Course</label>
                      <select
                        required
                        value={formData.course}
                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white appearance-none font-medium"
                      >
                        <option value="">Select Course</option>
                        {courses.map(c => (
                          <option key={c._id} value={c._id}>{c.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white appearance-none font-medium"
                      >
                        <option value="quiz">Quiz</option>
                        <option value="assignment">Assignment</option>
                        <option value="exam">Final Exam</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Due Date</label>
                      <input
                        required
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Time Limit (min)</label>
                      <input
                        required
                        type="number"
                        value={formData.timeLimit}
                        onChange={(e) => setFormData({ ...formData, timeLimit: Number(e.target.value) })}
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Instructions</label>
                    <textarea
                      required
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-medium"
                      placeholder="Provide instructions for this assessment..."
                    />
                  </div>
                </div>

                {/* Question Builder */}
                <div className="space-y-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Question Builder</h3>
                  
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl space-y-4 border border-blue-500/10">
                    <input
                      type="text"
                      value={currentQuestion.questionText}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionText: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white text-sm"
                      placeholder="Enter question text..."
                    />
                    
                    <div className="grid grid-cols-2 gap-3">
                      {currentQuestion.options.map((option, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...currentQuestion.options];
                              newOptions[i] = e.target.value;
                              setCurrentQuestion({ ...currentQuestion, options: newOptions });
                            }}
                            className="w-full px-4 py-2 bg-white dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white text-xs"
                            placeholder={`Option ${i + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: option })}
                            className={`p-2 rounded-xl transition-all ${currentQuestion.correctAnswer === option ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-700 text-slate-400'}`}
                          >
                            <HiCheckCircle className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={addQuestion}
                      className="w-full py-3 bg-blue-600/10 text-blue-600 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                    >
                      Add to Assessment
                    </button>
                  </div>

                  {/* Added Questions List */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Added Questions ({formData.questions.length})</h4>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                      {formData.questions.map((q, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl group">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate mr-4">
                            {i + 1}. {q.questionText}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeQuestion(i)}
                            className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <HiTrash className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black text-lg rounded-[1.5rem] hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all">
                    Finalize Assessment
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Assessments;
