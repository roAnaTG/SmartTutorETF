import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sessionsAPI, coursesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  HiCalendar, HiClock, HiVideoCamera, HiPlus, 
  HiLink, HiTrash, HiX 
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import SubjectDropdown from '../components/common/SubjectDropdown';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }
};

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course: '',
    scheduledAt: '',
    duration: 60,
    type: 'live',
    meetingLink: ''
  });

  useEffect(() => {
    fetchSessions();
    if (user?.role === 'tutor') fetchTutorCourses();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await sessionsAPI.getAll({ upcoming: 'true' });
      setSessions(response.data);
    } catch (error) {
      toast.error('Failed to fetch sessions');
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
    if (!window.confirm('Are you sure you want to delete this session?')) return;
    try {
      await sessionsAPI.delete(id);
      toast.success('Session deleted successfully');
      fetchSessions();
    } catch (error) {
      toast.error('Failed to delete session');
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    const submissionData = { ...formData };
    if (!submissionData.course) delete submissionData.course;

    try {
      await sessionsAPI.create(submissionData);
      toast.success('Session scheduled successfully!');
      setShowModal(false);
      resetForm();
      fetchSessions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to schedule session');
    }
  };

  const handleJoin = (link) => {
    if (!link) {
      toast.error('No meeting link provided');
      return;
    }
    window.open(link, '_blank');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      course: '',
      scheduledAt: '',
      duration: 60,
      type: 'live',
      meetingLink: ''
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Live Sessions</h1>
          <p className="text-muted-foreground mt-1">Join upcoming classes and workshops</p>
        </div>
        {user?.role === 'tutor' && (
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <HiPlus className="h-4 w-4" />
            Schedule Session
          </button>
        )}
      </motion.div>

      {/* Sessions Grid */}
      {sessions.length === 0 ? (
        <motion.div variants={itemVariants} className="card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <HiCalendar className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No upcoming sessions</h3>
          <p className="text-muted-foreground mt-1">Check back later for scheduled sessions</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <motion.div
              key={session._id}
              variants={itemVariants}
              className="card-interactive p-6 flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${
                  session.type === 'live' ? 'bg-accent/10 text-accent' : 'bg-violet-500/10 text-violet-600'
                }`}>
                  <HiVideoCamera className="h-5 w-5" />
                </div>
                <span className={`badge ${
                  session.type === 'live' ? 'badge-primary' : 'badge-muted'
                } capitalize`}>
                  {session.type}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2">
                  {session.title}
                </h3>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <HiCalendar className="h-4 w-4 text-accent" /> 
                    {new Date(session.scheduledAt).toLocaleDateString('en-US', { 
                      weekday: 'short', month: 'short', day: 'numeric' 
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <HiClock className="h-4 w-4 text-emerald-500" /> 
                    {new Date(session.scheduledAt).toLocaleTimeString('en-US', { 
                      hour: '2-digit', minute: '2-digit' 
                    })}
                    <span className="text-border">|</span>
                    {session.duration} min
                  </div>
                </div>

                {session.course?.title && (
                  <div className="mt-4">
                    <span className="badge-muted text-xs">
                      {session.course.title}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-6 pt-4 border-t border-border">
                <button 
                  onClick={() => handleJoin(session.meetingLink)}
                  className="btn-primary flex-1 py-2.5 text-sm"
                >
                  <HiLink className="h-4 w-4" />
                  Join Session
                </button>
                {user?.role === 'tutor' && (
                  <button 
                    onClick={() => handleDelete(session._id)}
                    className="p-2.5 text-destructive bg-destructive/10 rounded-xl hover:bg-destructive hover:text-destructive-foreground transition-all"
                  >
                    <HiTrash className="h-4 w-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Session Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowModal(false)}
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-lg card-elevated overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="p-5 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
              <h2 className="text-lg font-semibold text-foreground">Schedule Session</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <HiX className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            
            <form onSubmit={handleCreateSession} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Session Title</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input"
                  placeholder="e.g. Weekly Group Review"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <SubjectDropdown
                    label="Subject"
                    required
                    value={formData.subject}
                    onChange={(subject) => setFormData({ ...formData, subject })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="input"
                  >
                    <option value="live">Live Class</option>
                    <option value="workshop">Workshop</option>
                    <option value="office-hours">Office Hours</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Date & Time</label>
                  <input
                    required
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Duration (min)</label>
                  <input
                    required
                    type="number"
                    min="15"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Meeting Link</label>
                <div className="relative">
                  <HiLink className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    required
                    type="url"
                    value={formData.meetingLink}
                    onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                    className="input pl-12"
                    placeholder="Zoom / Meet / Teams link"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description (Optional)</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input resize-none"
                  placeholder="Brief overview of the session..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Schedule Session
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Sessions;
