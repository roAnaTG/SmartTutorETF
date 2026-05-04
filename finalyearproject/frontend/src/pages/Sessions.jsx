import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sessionsAPI, coursesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  HiCalendar, HiClock, HiVideoCamera, HiPlus, HiChevronRight, 
  HiUsers, HiLink, HiTrash, HiOutlineCalendar 
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';

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
    try {
      await sessionsAPI.create(formData);
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
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600/20 border-t-blue-600"></div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Syncing Calendar...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Live <span className="text-blue-600">Interactions</span></h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Synchronous academic events and collaborative workshops.</p>
        </div>
        {user?.role === 'tutor' && (
          <Button onClick={() => setShowModal(true)} icon={HiPlus}>
            Schedule Event
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sessions.length === 0 ? (
          <div className="col-span-full py-32 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
            <HiOutlineCalendar className="h-16 w-16 text-slate-200 mb-6" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No upcoming sessions discovered</p>
          </div>
        ) : (
          sessions.map((session) => (
            <Card key={session._id} className="flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <div className={`p-4 rounded-2xl ${
                  session.type === 'live' ? 'bg-blue-600/10 text-blue-600' : 'bg-purple-600/10 text-purple-600'
                }`}>
                  <HiVideoCamera className="h-7 w-7" />
                </div>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  session.type === 'live' ? 'bg-blue-600/10 text-blue-600' : 'bg-purple-600/10 text-purple-600'
                }`}>
                  {session.type}
                </span>
              </div>

              <div className="space-y-4 flex-1">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-2">
                  {session.title}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    <HiCalendar className="text-blue-500 h-4 w-4" /> 
                    {new Date(session.scheduledAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    <HiClock className="text-emerald-500 h-4 w-4" /> 
                    {new Date(session.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    <span className="mx-2 text-slate-200">|</span>
                    {session.duration} min
                  </div>
                </div>
                <div className="pt-4 flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                  <span className="px-2 py-0.5 bg-blue-50 dark:bg-slate-800 rounded-md truncate max-w-[200px]">
                    {session.course?.title}
                  </span>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-50 dark:border-slate-800 flex flex-col gap-4">
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 rounded-xl"
                    onClick={() => handleJoin(session.meetingLink)}
                    icon={HiLink}
                  >
                    Join
                  </Button>
                  {user?.role === 'tutor' && (
                    <Button 
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(session._id)}
                      className="p-4 rounded-xl"
                      icon={HiTrash}
                    />
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title="Schedule Academic Event"
        size="lg"
      >
        <form onSubmit={handleCreateSession} className="space-y-8">
          <Input
            label="Event Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Weekly Group Review: Advanced Calculus"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SubjectDropdown
              label="Event Discipline"
              required
              value={formData.subject}
              onChange={(subject) => setFormData({ ...formData, subject })}
            />
            
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Event Classification</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all text-slate-900 dark:text-white font-medium appearance-none"
              >
                <option value="live">Live Class</option>
                <option value="workshop">Workshop</option>
                <option value="office-hours">Office Hours</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Scheduled Date & Time"
              type="datetime-local"
              required
              value={formData.scheduledAt}
              onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
            />
            <Input
              label="Duration (min)"
              type="number"
              required
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
            />
          </div>

          <Input
            label="Virtual Meeting Endpoint (URL)"
            type="url"
            required
            value={formData.meetingLink}
            onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
            placeholder="Zoom / Google Meet / Teams link"
            icon={HiLink}
          />

          <Input
            label="Event Abstract"
            type="textarea"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Provide a brief overview of the session goals..."
          />

          <Button type="submit" className="w-full py-5 rounded-[1.5rem] text-lg">
            Establish Event
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Sessions;
