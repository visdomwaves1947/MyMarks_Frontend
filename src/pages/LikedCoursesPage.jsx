import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Heart, Play, ShoppingCart } from 'lucide-react';
import LikeButton from '../components/course/LikeButton';
import useLikes from '../hooks/useLikes';
import useCart, { addToCart } from '../hooks/useCart';
import useMyCourses, { continueLink } from '../hooks/useMyCourses';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { courseImage, courseTag, formatPrice, showDefaultImage } from '../utils/courseImage';

const PANEL = 'bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm';
const SOFT_BUTTON =
  'inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-transparent text-xs font-semibold transition-colors duration-200';

function LikedCard({ course, owned, inCart, onUnlike }) {
  const forSale = course.sellOnline !== false && Number(course.price) > 0;
  const tag = courseTag(course);
  return (
    <li data-testid="liked-course" className={`${PANEL} overflow-hidden flex flex-col`}>
      <Link to={`/courses/${course.slug}`} className="relative block aspect-video bg-slate-900">
        <img
          src={courseImage(course.thumbnail, 480)}
          onError={showDefaultImage}
          alt=""
          className="w-full h-full object-cover"
        />
        {tag && (
          <span className="absolute top-3 left-3 text-[10px] font-semibold text-blue-100 bg-blue-950/85 px-2.5 py-1 rounded-lg border border-blue-400/30 uppercase tracking-wider">
            {tag}
          </span>
        )}
        {owned && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[11px] font-semibold text-white bg-emerald-600/95 px-2 py-1 rounded-lg">
            <CheckCircle2 size={12} />
            <span>Your course</span>
          </span>
        )}
      </Link>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-3">
          <Link to={`/courses/${course.slug}`} className="text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-cyan-300 line-clamp-2">
            {course.name}
          </Link>
          <LikeButton liked onToggle={onUnlike} name={course.name} variant="list" />
        </div>
        {course.shortDescription && <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{course.shortDescription}</p>}
        {forSale && !owned && (
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-slate-900 dark:text-white">{formatPrice(course.price)}</span>
            {course.oldPrice > course.price && (
              <span className="text-xs text-slate-500 dark:text-slate-400 line-through">{formatPrice(course.oldPrice)}</span>
            )}
          </div>
        )}
        <div className="mt-auto pt-2 flex flex-wrap gap-2">
          {owned ? (
            <Link to={continueLink(course)} className={`${SOFT_BUTTON} bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 hover:border-emerald-300 dark:hover:border-emerald-700`}>
              <Play size={12} className="fill-current" />
              <span>Continue</span>
            </Link>
          ) : (
            <>
              <Link to={`/courses/${course.slug}`} className={`${SOFT_BUTTON} bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600`}>
                View Course
              </Link>
              {forSale &&
                (inCart ? (
                  <Link to="/cart" className={`${SOFT_BUTTON} bg-blue-50 dark:bg-cyan-950/30 text-blue-700 dark:text-cyan-300 hover:border-blue-300 dark:hover:border-cyan-700`}>
                    <CheckCircle2 size={13} />
                    <span>Go to Cart</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => addToCart(course)}
                    className={`${SOFT_BUTTON} bg-blue-600 hover:bg-blue-500 text-white cursor-pointer`}
                  >
                    <ShoppingCart size={13} />
                    <span>Add to Cart</span>
                  </button>
                ))}
            </>
          )}
        </div>
      </div>
    </li>
  );
}

/**
 * Liked Courses: the courses a student hearted, newest first, to buy or open later.
 */
export default function LikedCoursesPage({ currentUser, onOpenSignIn }) {
  const navigate = useNavigate();
  const likes = useLikes(currentUser);
  const mine = useMyCourses(currentUser);
  const cart = useCart();
  useDocumentMeta({ title: 'Liked Courses | MyMarks', description: 'The MyMarks courses you liked.' });

  const ownedIds = new Set(mine.courses.map((course) => course.courseId));
  let body;
  if (!currentUser) {
    body = (
      <div className={`${PANEL} max-w-sm mx-auto p-6 text-center space-y-3`}>
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">Sign in to see your liked courses</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Tap the heart on a course to keep it here.</p>
        <button type="button" onClick={onOpenSignIn} className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm cursor-pointer">
          Sign In
        </button>
      </div>
    );
  } else if (currentUser.role === 'admin') {
    body = <p className="text-center text-sm text-slate-600 dark:text-slate-400">Administrators see every course, so there is nothing to like.</p>;
  } else if (likes.status === 'loading' || likes.status === 'none') {
    body = <p className="text-sm text-slate-500 dark:text-slate-400">Loading your liked courses...</p>;
  } else if (likes.status === 'error') {
    body = <p className="text-sm text-rose-600 dark:text-rose-400">Your liked courses could not be loaded. Please refresh the page.</p>;
  } else if (likes.count === 0) {
    body = (
      <div data-testid="liked-empty" className={`${PANEL} max-w-md mx-auto p-8 text-center space-y-3`}>
        <span className="mx-auto w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center">
          <Heart size={26} />
        </span>
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">No liked courses yet</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Tap the heart on a course to keep it here for later.</p>
        <Link to="/demo#courses" className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold">
          Browse Courses
        </Link>
      </div>
    );
  } else {
    body = (
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {likes.courses.map((course) => (
          <LikedCard
            key={course._id}
            course={course}
            owned={ownedIds.has(course._id)}
            inCart={cart.has(course._id)}
            onUnlike={() => likes.toggle(course).catch(() => {})}
          />
        ))}
      </ul>
    );
  }

  return (
    <div className="min-h-[calc(100vh-86px)] bg-[#EBF0F7] dark:bg-[#070B14] text-slate-900 dark:text-slate-100 py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-5">
        <button
          type="button"
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/demo'))}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-300 transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Keep Browsing</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white flex items-center gap-2.5">
          <Heart size={24} className="text-rose-500 fill-rose-500" />
          <span>Liked Courses</span>
          {likes.count > 0 && <span className="text-base font-semibold text-slate-500 dark:text-slate-400">({likes.count})</span>}
        </h1>
        {body}
      </div>
    </div>
  );
}
