import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { lessonsAPI, coursesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  HiPlus, HiPlay, HiDocumentText, HiClock, HiCheckCircle, 
  HiX, HiChevronRight, HiAcademicCap, HiTrash, HiTag
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import SubjectDropdown from '../components/common/SubjectDropdown';

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    course: '',
    videoUrl: '',
    duration: 60,
    week: 1,
    isPublished: true
  });

  useEffect(() => {
    fetchLessons();
    if (user?.role === 'tutor') fetchTutorCourses();
  }, [user]);

  const fetchLessons = async () => {
    try {
      const response = await lessonsAPI.getAll();
      setLessons(response.data);
    } catch (error) {
      toast.error('Failed to fetch lessons');
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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    try {
      await lessonsAPI.delete(id);
      toast.success('Lesson deleted successfully');
      fetchLessons();
    } catch (error) {
      toast.error('Failed to delete lesson');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await lessonsAPI.create(formData);
      toast.success('Lesson created successfully!');
      setShowModal(false);
      setFormData({
        title: '',
        subject: '',
        description: '',
        course: '',
        videoUrl: '',
        duration: 60,
        week: 1,
        isPublished: true
      });
      fetchLessons();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create lesson');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600/20 border-t-blue-600"></div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Academic Materials...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Curriculum <span className="text-blue-600">Materials</span></h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Design and deploy high-quality learning modules.</p>
        </div>
        {user?.role === 'tutor' && (
          <Button onClick={() => setShowModal(true)} icon={HiPlus}>
            Create Lesson
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {lessons.length === 0 ? (
          <div className="text-center py-32 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
            <HiDocumentText className="h-16 w-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No lessons established yet</p>
          </div>
        ) : (
          lessons.map((lesson) => (
            <Card key={lesson._id} padding="p-6" className="flex flex-col md:flex-row items-center gap-8">
              <div className="h-20 w-20 rounded-[1.5rem] bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0">
                <HiPlay className="h-10 w-10" />
              </div>
              
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white truncate">
                    {lesson.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    lesson.isPublished 
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : 'bg-amber-500/10 text-amber-600'
                  }`}>
                    {lesson.isPublished ? 'Live' : 'Draft'}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 dark:bg-slate-800 rounded-md">
                    <HiTag className="text-blue-500" /> {lesson.subject || 'General'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <HiAcademicCap className="text-indigo-500 h-4 w-4" /> Week {lesson.week}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <HiClock className="text-emerald-500 h-4 w-4" /> {lesson.duration} mins
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-900 dark:text-white">
                    {lesson.course?.title}
                  </span>
                </div>
                
                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-1 font-medium italic">
                  "{lesson.description}"
                </p>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto shrink-0">
                {lesson.videoUrl && (
                  <Button 
                    variant="secondary"
                    onClick={() => window.open(lesson.videoUrl, '_blank')}
                    className="flex-1 md:flex-none rounded-xl"
                  >
                    View Module
                  </Button>
                )}
                {user?.role === 'tutor' && (
                  <Button 
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(lesson._id)}
                    className="p-4 rounded-xl"
                    icon={HiTrash}
                  />
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title="Establish New Lesson"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Lesson Title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Masterclass in Quantum Field Theory"
            />
            
            <SubjectDropdown
              label="Discipline"
              required
              value={formData.subject}
              onChange={(subject) => setFormData({ ...formData, subject })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Duration (min)"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
            />
            <Input
              label="Week Number"
              type="number"
              value={formData.week}
              onChange={(e) => setFormData({ ...formData, week: Number(e.target.value) })}
            />
          </div>

          <Input
            label="Media Endpoint (URL)"
            type="url"
            value={formData.videoUrl}
            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            placeholder="YouTube / Vimeo / CloudFront endpoint"
          />

          <Input
            label="Module Abstract"
            type="textarea"
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Summarize the core concepts covered in this lesson..."
          />

          <div className="flex items-center gap-4 pt-4">
             <Button type="submit" className="flex-1 py-5 rounded-[1.5rem] text-lg">
                Establish Lesson
             </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Lessons;
