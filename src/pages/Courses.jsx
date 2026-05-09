import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { HiSearch, HiPlus, HiBookOpen, HiUser, HiClock, HiTrash, HiX, HiArrowRight } from 'react-icons/hi';
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

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    price: 0,
    duration: 0
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await coursesAPI.getAll();
      setCourses(response.data);
    } catch (error) {
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await coursesAPI.delete(id);
      toast.success('Course deleted successfully');
      fetchCourses();
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  const handleCreateCourse = async (e) => {
    if (e) e.preventDefault();
    if (!formData.title || !formData.description || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setCreating(true);
    try {
      await coursesAPI.create(formData);
      toast.success('Course created successfully!');
      setShowCreateModal(false);
      setFormData({
        title: '',
        description: '',
        category: '',
        level: 'beginner',
        price: 0,
        duration: 0
      });
      fetchCourses();
    } catch (error) {
      toast.error(error.message || 'Failed to create course');
    } finally {
      setCreating(false);
    }
  };

  const categories = ['All', ...new Set(courses.map(c => c.category))];
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
                         course.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'All' || course.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const levelColors = {
    beginner: 'badge-success',
    intermediate: 'badge-warning',
    advanced: 'badge-primary'
  };

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
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Course Catalog</h1>
          <p className="text-muted-foreground mt-1">
            Explore {courses.length} courses across various subjects
          </p>
        </div>
        {user?.role === 'manager' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <HiPlus className="h-4 w-4" />
            Create Course
          </button>
        )}
      </motion.div>

      {/* Search and Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-11"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                filterCategory === cat
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Course Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="card h-80 animate-pulse">
              <div className="h-40 bg-muted rounded-t-2xl" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <HiBookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No courses found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course) => (
              <motion.div
                key={course._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="card-interactive group flex flex-col overflow-hidden"
              >
                {/* Course Header */}
                <div className="h-36 bg-gradient-to-br from-accent to-blue-700 relative p-5 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="badge bg-white/20 text-white backdrop-blur-sm border-0">
                      {course.category}
                    </span>
                    <span className={`badge ${levelColors[course.level] || 'badge-muted'} capitalize`}>
                      {course.level}
                    </span>
                  </div>
                  <HiBookOpen className="absolute bottom-3 right-3 h-20 w-20 text-white/10" />
                </div>
                
                {/* Course Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <HiClock className="h-4 w-4" />
                      {course.duration}h
                    </span>
                    <span className="flex items-center gap-1.5">
                      <HiUser className="h-4 w-4" />
                      {course.enrolledStudents?.length || 0}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2 flex-1">
                    {course.description}
                  </p>
                  
                  {/* Footer */}
                  <div className="flex justify-between items-center mt-5 pt-4 border-t border-border">
                    <div className="text-xl font-bold text-foreground">
                      <span className="text-sm text-muted-foreground">$</span>
                      {course.price}
                    </div>
                    <div className="flex gap-2">
                      {user?.role === 'manager' && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(course._id);
                          }}
                          className="p-2.5 text-destructive bg-destructive/10 rounded-xl hover:bg-destructive hover:text-destructive-foreground transition-all"
                        >
                          <HiTrash className="h-4 w-4" />
                        </button>
                      )}
                      <Link
                        to={`/courses/${course._id}`}
                        className="btn-primary py-2.5 px-4 text-sm"
                      >
                        View Details
                        <HiArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create Course Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg card-elevated overflow-hidden"
            >
              <div className="p-5 border-b border-border flex justify-between items-center">
                <h2 className="text-lg font-semibold text-foreground">Create New Course</h2>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <HiX className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
              <form onSubmit={handleCreateCourse} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Course Title</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input"
                    placeholder="e.g. Advanced Mathematics"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <SubjectDropdown
                      label="Category"
                      required
                      value={formData.category}
                      onChange={(category) => setFormData({ ...formData, category })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Level</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="input"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Price ($)</label>
                    <input
                      required
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Duration (hours)</label>
                    <input
                      required
                      type="number"
                      min="0"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                      className="input"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <textarea
                    required
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input resize-none"
                    placeholder="Describe what students will learn..."
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="btn-primary flex-1"
                  >
                    {creating ? 'Creating...' : 'Create Course'}
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

export default Courses;
