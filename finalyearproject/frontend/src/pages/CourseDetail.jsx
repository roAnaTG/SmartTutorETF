import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { coursesAPI, paymentsAPI, applicationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    paymentMethod: 'credit-card'
  });
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    experience: ''
  });
  const [showVacancyModal, setShowVacancyModal] = useState(false);
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

  const handleEnroll = async () => {
    try {
      await paymentsAPI.create({
        course: id,
        amount: course.price,
        paymentMethod: paymentData.paymentMethod
      });
      toast.success('Payment submitted! Awaiting approval.');
      setShowPaymentModal(false);
      navigate('/payments');
    } catch (error) {
      toast.error(error.message || 'Failed to submit payment');
    }
  };

  const handleApply = async () => {
    try {
      await applicationsAPI.apply({
        course: id,
        ...applicationData
      });
      toast.success('Application submitted successfully!');
      setShowApplyModal(false);
      navigate('/applications');
    } catch (error) {
      toast.error(error.message || 'Failed to submit application');
    }
  };

  const handlePostVacancy = async () => {
    try {
      await coursesAPI.postVacancy(id, vacancyData);
      toast.success('Tutor vacancy posted successfully!');
      setShowVacancyModal(false);
      fetchCourse(); // Refresh course data
    } catch (error) {
      toast.error(error.message || 'Failed to post vacancy');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!course) {
    return <div className="text-center py-12">Course not found</div>;
  }

  const isEnrolled = course.enrolledStudents?.some(s => s._id === user?.id);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
          <span className="text-white text-6xl font-bold">{course.title[0]}</span>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{course.category}</p>
            </div>
            <span className="text-2xl font-bold text-primary-600">${course.price}</span>
          </div>

          <p className="mt-4 text-gray-600 dark:text-gray-300">{course.description}</p>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Level</p>
              <p className="font-medium text-gray-900 dark:text-white capitalize">{course.level}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
              <p className="font-medium text-gray-900 dark:text-white">{course.duration} hours</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Students</p>
              <p className="font-medium text-gray-900 dark:text-white">{course.enrolledStudents?.length || 0}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Tutor</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {course.assignedTutor ? `${course.assignedTutor.firstName} ${course.assignedTutor.lastName}` : 'Not assigned'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            {user?.role === 'student' && !isEnrolled && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Enroll Now
              </button>
            )}
            {user?.role === 'student' && isEnrolled && (
              <span className="px-6 py-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-md">
                Already Enrolled
              </span>
            )}
            {user?.role === 'tutor' && course.tutorVacancy?.isOpen && (
              <button
                onClick={() => setShowApplyModal(true)}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Apply to Teach
              </button>
            )}
            {user?.role === 'manager' && !course.tutorVacancy?.isOpen && (
              <button
                onClick={() => setShowVacancyModal(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Post Tutor Vacancy
              </button>
            )}
            {user?.role === 'manager' && course.tutorVacancy?.isOpen && (
              <span className="px-6 py-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 rounded-md">
                Vacancy Posted
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Complete Payment</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                <input
                  type="number"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({ ...paymentData, amount: Number(e.target.value) })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
                <select
                  value={paymentData.paymentMethod}
                  onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                >
                  <option value="credit-card">Credit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank-transfer">Bank Transfer</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleEnroll}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Submit Payment
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Apply to Teach</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cover Letter</label>
                <textarea
                  value={applicationData.coverLetter}
                  onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  placeholder="Why do you want to teach this course?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Experience</label>
                <textarea
                  value={applicationData.experience}
                  onChange={(e) => setApplicationData({ ...applicationData, experience: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  placeholder="Describe your relevant experience..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleApply}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Submit Application
                </button>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vacancy Modal */}
      {showVacancyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Post Tutor Vacancy</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Requirements</label>
                <textarea
                  value={vacancyData.requirements}
                  onChange={(e) => setVacancyData({ ...vacancyData, requirements: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  placeholder="What qualifications are required? (e.g., 5+ years experience, specific certifications)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Application Deadline</label>
                <input
                  type="date"
                  value={vacancyData.deadline}
                  onChange={(e) => setVacancyData({ ...vacancyData, deadline: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handlePostVacancy}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Post Vacancy
                </button>
                <button
                  onClick={() => setShowVacancyModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
