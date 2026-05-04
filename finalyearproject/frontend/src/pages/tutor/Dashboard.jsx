import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI, progressAPI, applicationsAPI } from '../../services/api';
import { HiBookOpen, HiUsers, HiClipboardCheck, HiTrendingUp } from 'react-icons/hi';

const TutorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, coursesRes, appsRes] = await Promise.all([
        progressAPI.getTutorStats(),
        coursesAPI.getTutorCourses(),
        applicationsAPI.getAll()
      ]);

      setStats(statsRes.data);
      setCourses(coursesRes.data);
      setApplications(appsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tutor Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <HiBookOpen className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned Courses</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats?.totalCourses || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <HiUsers className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Students</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats?.totalStudents || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <HiTrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Progress</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats?.averageProgress || 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <HiClipboardCheck className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Students</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats?.activeStudents || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* My Courses */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Assigned Courses</h2>
          <Link to="/my-courses" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 col-span-3 text-center py-8">
              No courses assigned yet. Apply to courses to get started.
            </p>
          ) : (
            courses.map((course) => (
              <div key={course._id} className="border dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 dark:text-white">{course.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{course.category}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {course.enrolledStudents?.length || 0} students
                  </span>
                  <Link
                    to={`/courses/${course._id}`}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/lessons"
            className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <HiBookOpen className="h-8 w-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Upload Lesson</span>
          </Link>
          <Link
            to="/sessions"
            className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <HiUsers className="h-8 w-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Schedule Session</span>
          </Link>
          <Link
            to="/groups"
            className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <HiUsers className="h-8 w-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Create Group</span>
          </Link>
          <Link
            to="/assessments"
            className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <HiClipboardCheck className="h-8 w-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Create Assessment</span>
          </Link>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Applications</h2>
          <Link to="/applications" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {applications.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No applications yet. Apply to courses to start teaching.
            </p>
          ) : (
            applications.map((app) => (
              <div key={app._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{app.course?.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Applied: {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  app.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                  app.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                }`}>
                  {app.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
