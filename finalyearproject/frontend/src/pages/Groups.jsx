import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { groupsAPI, coursesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  HiUserGroup, HiPlus, HiChevronRight, HiUsers, 
  HiBookOpen, HiTrash, HiTag, HiOutlineUserGroup 
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import SubjectDropdown from '../components/common/SubjectDropdown';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    description: '',
    course: '',
    maxMembers: 10
  });

  useEffect(() => {
    fetchGroups();
    if (user?.role !== 'student') fetchCourses();
  }, [user]);

  const fetchGroups = async () => {
    try {
      const response = await groupsAPI.getAll();
      setGroups(response.data);
    } catch (error) {
      toast.error('Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await coursesAPI.getTutorCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to fetch tutor courses');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this group?')) return;
    try {
      await groupsAPI.delete(id);
      toast.success('Group deleted successfully');
      fetchGroups();
    } catch (error) {
      toast.error('Failed to delete group');
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    const submissionData = { ...formData };
    if (!submissionData.course) delete submissionData.course;

    try {
      await groupsAPI.create(submissionData);
      toast.success('Study group created successfully!');
      setShowModal(false);
      setFormData({ name: '', subject: '', description: '', course: '', maxMembers: 10 });
      fetchGroups();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create group');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600/20 border-t-blue-600"></div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Syncing Communities...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Study <span className="text-blue-600">Communities</span></h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Collaborative hubs for peer-to-peer knowledge exchange.</p>
        </div>
        {user?.role !== 'student' && (
          <Button onClick={() => setShowModal(true)} icon={HiPlus}>
            New Community
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {groups.length === 0 ? (
          <div className="col-span-full py-32 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
            <HiOutlineUserGroup className="h-16 w-16 text-slate-200 mb-6" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No active communities found</p>
          </div>
        ) : (
          groups.map((group) => (
            <Card key={group._id} className="flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 transition-transform group-hover:scale-110">
                  <HiUserGroup className="h-8 w-8" />
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Occupancy</p>
                   <p className="text-lg font-black text-slate-900 dark:text-white leading-none mt-1">
                    {group.students?.length || 0}<span className="text-slate-300 dark:text-slate-700">/</span>{group.maxMembers}
                   </p>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-50 dark:bg-slate-800 text-blue-600 text-[10px] font-black rounded uppercase tracking-widest">
                    {group.subject || 'General'}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  {group.name}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed">
                  {group.description}
                </p>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                <div className="flex -space-x-3">
                  {group.students?.slice(0, 4).map((student, i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-black text-slate-600"
                      title={`${student.firstName}`}
                    >
                      {student.firstName?.[0]}
                    </div>
                  ))}
                  {group.students?.length > 4 && (
                    <div className="h-10 w-10 rounded-full bg-blue-600 border-4 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-black text-white">
                      +{group.students.length - 4}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {user?.role !== 'student' && (
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => handleDelete(group._id)}
                      className="rounded-xl p-3"
                      icon={HiTrash}
                    />
                  )}
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="rounded-xl p-3"
                    icon={HiChevronRight}
                  />
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title="Establish Community Hub"
        size="lg"
      >
        <form onSubmit={handleCreateGroup} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Community Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Quantum Computing Cohort A"
            />
            
            <SubjectDropdown
              label="Hub Discipline"
              required
              value={formData.subject}
              onChange={(subject) => setFormData({ ...formData, subject })}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Maximum Enrollment"
              type="number"
              required
              value={formData.maxMembers}
              onChange={(e) => setFormData({ ...formData, maxMembers: Number(e.target.value) })}
            />
          </div>

          <Input
            label="Community Abstract"
            type="textarea"
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Define the scope and objectives of this peer group..."
          />

          <Button type="submit" className="w-full py-5 rounded-[1.5rem] text-lg">
            Establish Community
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Groups;
