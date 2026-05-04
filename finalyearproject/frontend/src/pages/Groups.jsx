import { useState, useEffect } from 'react';
import { groupsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchGroups();
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Groups</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div key={group._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{group.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{group.description}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Course: {group.course?.title}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {group.students?.length || 0} / {group.maxMembers} members
              </span>
            </div>
            <div className="mt-3 flex -space-x-2">
              {group.students?.slice(0, 5).map((student, i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-medium border-2 border-white dark:border-gray-800"
                >
                  {student.firstName?.[0]}{student.lastName?.[0]}
                </div>
              ))}
              {group.students?.length > 5 && (
                <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 text-xs font-medium border-2 border-white dark:border-gray-800">
                  +{group.students.length - 5}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Groups;
