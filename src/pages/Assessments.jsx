import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { assessmentsAPI, coursesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  HiClipboardCheck, HiPlus, HiX, HiTrash, HiCheckCircle, 
  HiClock, HiBookOpen, HiCalendar, HiPencil, HiCollection
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import SubjectDropdown from '../components/common/SubjectDropdown';

const Assessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    course: '',
    type: 'quiz',
    timeLimit: 30,
    dueDate: '',
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
  }, []);

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
      toast.error('Question text and correct answer are required');
      return;
    }
    setFormData({
      ...formData,
      questions: [...formData.questions, { ...currentQuestion }]
    });
    setCurrentQuestion({
      questionText: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 1
    });
    toast.success('Question added to draft');
  };

  const removeQuestion = (index) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleCreateAssessment = async (e) => {
    e.preventDefault();
    if (formData.questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }
    const submissionData = { ...formData };
    if (!submissionData.course) delete submissionData.course;

    try {
      await assessmentsAPI.create(submissionData);
      toast.success('Assessment created successfully!');
      setShowModal(false);
      resetForm();
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

  const resetForm = () => {
    setFormData({
      title: '',
      subject: '',
      description: '',
      course: '',
      type: 'quiz',
      timeLimit: 30,
      dueDate: '',
      questions: []
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600/20 border-t-blue-600"></div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Academic Modules...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* SaaS Style Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Academic <span className="text-blue-600">Assessments</span></h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Build, manage and publish high-performance evaluations.</p>
        </div>
        {user?.role === 'tutor' && (
          <Button onClick={() => setShowModal(true)} icon={HiPlus}>
            New Assessment
          </Button>
        )}
      </div>

      {/* Stats Summary for Tutors */}
      {user?.role === 'tutor' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card padding="p-6" className="bg-blue-600 text-white border-0 shadow-blue-600/20">
            <div className="flex items-center justify-between">
              <HiClipboardCheck className="h-8 w-8 opacity-50" />
              <span className="text-[10px] font-black uppercase tracking-widest">Total Modules</span>
            </div>
            <h3 className="text-3xl font-black mt-4">{assessments.length}</h3>
          </Card>
          <Card padding="p-6">
            <div className="flex items-center justify-between text-slate-400">
              <HiClock className="h-8 w-8 opacity-50" />
              <span className="text-[10px] font-black uppercase tracking-widest">Active Quizzes</span>
            </div>
            <h3 className="text-3xl font-black mt-4 text-slate-900 dark:text-white">
              {assessments.filter(a => a.type === 'quiz').length}
            </h3>
          </Card>
          <Card padding="p-6">
            <div className="flex items-center justify-between text-slate-400">
              <HiCalendar className="h-8 w-8 opacity-50" />
              <span className="text-[10px] font-black uppercase tracking-widest">Pending Exams</span>
            </div>
            <h3 className="text-3xl font-black mt-4 text-slate-900 dark:text-white">
              {assessments.filter(a => a.type === 'exam').length}
            </h3>
          </Card>
        </div>
      )}

      {/* Assessment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {assessments.length === 0 ? (
          <div className="col-span-full py-32 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
            <HiCollection className="h-16 w-16 text-slate-200 mb-6" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No assessments established yet</p>
          </div>
        ) : (
          assessments.map((assessment) => (
            <Card key={assessment._id} className="group">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${
                  assessment.type === 'exam' ? 'bg-rose-500/10 text-rose-600' : 'bg-blue-500/10 text-blue-600'
                }`}>
                  <HiClipboardCheck className="h-7 w-7" />
                </div>
                <div className="flex gap-2">
                   {user?.role === 'tutor' && (
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => handleDelete(assessment._id)}
                      className="rounded-xl p-3"
                    >
                      <HiTrash />
                    </Button>
                   )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                  <span className="px-2 py-0.5 bg-blue-50 dark:bg-slate-800 rounded-md">{assessment.subject || 'General'}</span>
                  <span>•</span>
                  <span>{assessment.type}</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  {assessment.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                  {assessment.description}
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Value</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white">{assessment.totalPoints} pts</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Limit</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white">{assessment.timeLimit}m</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Creation Modal */}
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title="Construct Assessment"
        size="lg"
      >
        <form onSubmit={handleCreateAssessment} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Assessment Title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Midterm Evaluation"
            />
            
            <SubjectDropdown
              label="Target Discipline"
              required
              value={formData.subject}
              onChange={(subject) => setFormData({ ...formData, subject })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all text-slate-900 dark:text-white font-medium appearance-none"
              >
                <option value="quiz">Quiz</option>
                <option value="assignment">Assignment</option>
                <option value="exam">Exam</option>
              </select>
            </div>

            <Input
              label="Time Limit (min)"
              type="number"
              value={formData.timeLimit}
              onChange={(e) => setFormData({ ...formData, timeLimit: Number(e.target.value) })}
            />
          </div>

          <Input
            label="Module Description"
            type="textarea"
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Outline the objectives of this assessment..."
          />

          <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Question Builder</h3>
              <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                {formData.questions.length} Questions Drafted
              </span>
            </div>

            <div className="space-y-6 bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem]">
              <Input
                label="Question Text"
                value={currentQuestion.questionText}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionText: e.target.value })}
                placeholder="Type your question here..."
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((opt, i) => (
                  <Input
                    key={i}
                    label={`Option ${i + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...currentQuestion.options];
                      newOpts[i] = e.target.value;
                      setCurrentQuestion({ ...currentQuestion, options: newOpts });
                    }}
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Correct Answer Index (1-4)"
                  type="number"
                  min="1"
                  max="4"
                  value={currentQuestion.correctAnswer ? currentQuestion.options.indexOf(currentQuestion.correctAnswer) + 1 : ''}
                  onChange={(e) => {
                    const idx = Number(e.target.value) - 1;
                    setCurrentQuestion({ ...currentQuestion, correctAnswer: currentQuestion.options[idx] || '' });
                  }}
                />
                <Input
                  label="Points"
                  type="number"
                  value={currentQuestion.points}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, points: Number(e.target.value) })}
                />
              </div>

              <Button variant="secondary" onClick={addQuestion} className="w-full py-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-transparent">
                Add Question to Draft
              </Button>
            </div>

            {/* Questions List */}
            <div className="mt-8 space-y-4">
              {formData.questions.map((q, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center">{idx + 1}</div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{q.questionText}</p>
                  </div>
                  <button onClick={() => removeQuestion(idx)} className="text-rose-500 hover:text-rose-600 p-2">
                    <HiTrash className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full py-5 text-lg rounded-[1.5rem]">
            Establish Assessment
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Assessments;
