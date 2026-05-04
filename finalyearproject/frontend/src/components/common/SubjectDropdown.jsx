import { useState, useEffect, useRef } from 'react';
import { HiSearch, HiChevronDown, HiCheck } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const SUBJECT_LIST = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'English Language', 'Literature', 'History', 'Geography',
  'Economics', 'Computer Science', 'Art & Design', 'Music',
  'Business Studies', 'Psychology', 'Sociology', 'Philosophy',
  'Physical Education', 'Accounting', 'Law', 'Politics'
];

const SubjectDropdown = ({ value, onChange, label, error, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  const filteredSubjects = SUBJECT_LIST.filter(subject =>
    subject.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-2 relative" ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl transition-all ${
          isOpen ? 'border-blue-500' : 'border-transparent'
        } ${error ? 'border-rose-500' : ''}`}
      >
        <span className={value ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-400 font-medium'}>
          {value || 'Select a subject...'}
        </span>
        <HiChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <HiSearch className="h-5 w-5 text-slate-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search subjects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent border-0 focus:ring-0 text-sm font-medium text-slate-900 dark:text-white"
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto custom-scrollbar p-2">
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => {
                      onChange(subject);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                      value === subject 
                        ? 'bg-blue-600 text-white' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="text-sm font-bold">{subject}</span>
                    {value === subject && <HiCheck className="h-4 w-4" />}
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-slate-400">
                  <p className="text-xs font-bold uppercase tracking-widest">No subjects found</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {error && <p className="text-[10px] font-bold text-rose-500 ml-1">{error}</p>}
    </div>
  );
};

export default SubjectDropdown;
