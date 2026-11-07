import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MyCourses from '../components/profile/MyCourses';
import useDocumentMeta from '../hooks/useDocumentMeta';

/**
 * My Courses: everything the signed-in student bought, with where they stopped in each.
 */
export default function MyCoursesPage({ currentUser, onOpenSignIn }) {
  const navigate = useNavigate();
  useDocumentMeta({ title: 'My Courses | MyMarks', description: 'Your MyMarks courses and where you stopped.' });

  let body = <MyCourses currentUser={currentUser} />;
  if (!currentUser) {
    body = (
      <div className="max-w-sm mx-auto bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-3">
        <h1 className="text-lg font-bold text-slate-950 dark:text-white">Sign in to see your courses</h1>
        <p className="text-xs text-slate-600 dark:text-slate-400">The courses you buy, and where you stopped in each, appear here.</p>
        <button
          type="button"
          onClick={onOpenSignIn}
          className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm cursor-pointer"
        >
          Sign In
        </button>
      </div>
    );
  } else if (currentUser.role === 'admin') {
    body = (
      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        Administrators see every course. Students' courses are in the admin panel, under Students Directory.
      </p>
    );
  }

  return (
    <div className="min-h-[calc(100vh-86px)] bg-[#EBF0F7] dark:bg-[#070B14] text-slate-900 dark:text-slate-100 py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-5">
        <button
          type="button"
          onClick={() => navigate('/demo')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-300 transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>
        {body}
      </div>
    </div>
  );
}
