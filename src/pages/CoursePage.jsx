import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Eye, RefreshCw } from 'lucide-react';
import { fetchCoursePage } from '../services/courseApi';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { COURSE_BOUGHT } from '../hooks/useCourseCheckout';
import useDialog from '../hooks/useDialog';
import useCourseProgress from '../hooks/useCourseProgress';
import useCart, { addToCart } from '../hooks/useCart';
import useLikes from '../hooks/useLikes';
import { boughtIds } from '../utils/purchaseEvents';
import { getCourseTheme } from '../components/course/courseTheme';
import { isOutsideLink } from '../utils/courseImage';
import CourseHero from '../components/course/CourseHero';
import CourseSkeleton from '../components/course/CourseSkeleton';
import CourseCurriculum from '../components/course/CourseCurriculum';
import CourseRoadmapPlanner from '../components/course/CourseRoadmapPlanner';
import {
  CourseFaqs,
  CourseGuarantee,
  CourseRoadmaps,
  CourseStats,
  CourseTestimonials,
  CourseWhyChoose,
} from '../components/course/CourseSections';
import SubjectLabPracticalBanner from '../components/lab/SubjectLabPracticalBanner';

function CourseMessage({ title, text, children }) {
  return (
    <section className="min-h-[60vh] flex items-center justify-center px-4 py-16 bg-[#EBF0F7] dark:bg-[#0B0F19]">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">{title}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-5">{text}</p>
        {children}
      </div>
    </section>
  );
}

export default function CoursePage({ currentUser, onOpenBooking, onOpenSignIn }) {
  const { slug } = useParams();
  const { hash } = useLocation();
  const navigate = useNavigate();
  const cart = useCart();
  const likes = useLikes(currentUser);
  const [state, setState] = useState({ status: 'loading', data: null });
  const [openPlan, setOpenPlan] = useState(null);

  // A quiet load keeps the page on screen, such as after a purchase or signing in
  const load = useCallback(
    async ({ quiet = false } = {}) => {
      if (!quiet) {
        setState({ status: 'loading', data: null });
        setOpenPlan(null);
      }
      try {
        const data = await fetchCoursePage(slug);
        setState({ status: data ? 'ready' : 'missing', data });
      } catch {
        if (!quiet) setState({ status: 'error', data: null });
      }
    },
    [slug]
  );

  useEffect(() => {
    load();
  }, [load]);

  // Signing in or out changes which lessons open, so the page asks again
  const signedInAs = currentUser?.token || '';
  const firstUser = useRef(signedInAs);
  useEffect(() => {
    if (firstUser.current === signedInAs) return;
    firstUser.current = signedInAs;
    load({ quiet: true });
  }, [signedInAs, load]);

  const course = state.data?.course;
  const access = state.data?.access || {};
  // Administrators see every lesson: the page shows them the lessons, never Buy Now
  const shownAccess = currentUser?.role === 'admin' ? { ...access, forSale: false, adminView: true } : access;

  // Bought somewhere else on the site, such as the enrollment form: open the lessons here too
  const courseId = course?._id;
  useEffect(() => {
    const onBoughtElsewhere = (event) => {
      if (boughtIds(event).includes(courseId)) load({ quiet: true });
    };
    window.addEventListener(COURSE_BOUGHT, onBoughtElsewhere);
    return () => window.removeEventListener(COURSE_BOUGHT, onBoughtElsewhere);
  }, [courseId, load]);
  const isSignedIn = Boolean(currentUser);
  const isStudent = isSignedIn && currentUser.role !== 'admin';
  const tracking = useCourseProgress(course?._id, isStudent && state.status === 'ready');
  const { confirm } = useDialog();
  // Buy Now opens the checkout with only this course; signing in and paying happen there
  const buy = () => navigate(`/checkout?course=${encodeURIComponent(course?.slug || slug)}`);
  const buying = false;
  const addCourseToCart = async () => {
    if (!addToCart(course)) return;
    const goToCart = await confirm({
      title: 'Added to cart',
      message: `${course.name} is in your cart. Add more courses, then pay for them together.`,
      confirmLabel: 'Go to Cart',
      cancelLabel: 'Keep Browsing',
      tone: 'success',
    });
    if (goToCart) navigate('/cart');
  };
  // Add to Cart sits next to Buy Now, for anyone but an administrator (who sees every lesson)
  const cartButton =
    course && access.forSale && !access.owned && currentUser?.role !== 'admin'
      ? { inCart: cart.has(course._id), isFull: cart.isFull, onAdd: addCourseToCart, onOpen: () => navigate('/cart') }
      : null;
  // The heart, for a course not bought yet: a visitor signs in first; administrators have no likes
  const likeButton =
    course && !access.owned && currentUser?.role !== 'admin'
      ? {
          liked: likes.isLiked(course._id),
          onToggle: () =>
            currentUser ? likes.toggle(course).catch((problem) => problem.status === 401 && onOpenSignIn()) : onOpenSignIn(),
        }
      : null;

  useDocumentMeta({
    title: course ? course.seoTitle || `${course.name} | MyMarks` : '',
    description: course?.seoDescription || course?.shortDescription,
    image: course?.thumbnail,
  });

  useEffect(() => {
    if (state.status === 'ready' && hash) {
      setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [state.status, hash]);

  if (state.status === 'loading') {
    return <CourseSkeleton />;
  }

  if (state.status === 'error') {
    return (
      <CourseMessage title="We could not load this course" text="Please check your connection and try again.">
        <button
          onClick={load}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold cursor-pointer"
        >
          <RefreshCw size={15} />
          <span>Try Again</span>
        </button>
      </CourseMessage>
    );
  }

  if (state.status === 'missing') {
    return (
      <CourseMessage title="Course not found" text="This course is not available right now.">
        <Link to="/demo#courses" className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold">
          View All Courses
        </Link>
      </CourseMessage>
    );
  }

  if (course.ownLink) {
    if (isOutsideLink(course.ownLink)) {
      window.location.replace(course.ownLink);
      return null;
    }
    return <Navigate to={course.ownLink} replace />;
  }

  const sections = course.sections || {};
  const page = course.page || {};
  const theme = getCourseTheme(page.themeColor);
  const isShown = (name) => sections[name] !== false;

  const enroll = (track) => onOpenBooking(track, course);

  return (
    <>
      {course.status !== 'published' && (
        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-400 text-amber-950 text-xs font-bold">
          <Eye size={14} />
          <span>Preview of a {course.status} course. Students cannot see this page.</span>
        </div>
      )}

      {isShown('hero') && (
        <CourseHero
          course={course}
          theme={theme}
          access={shownAccess}
          onBuy={buy}
          buying={buying}
          cart={cartButton}
          like={likeButton}
          onEnroll={enroll}
          onExplore={() => document.getElementById('course-curriculum')?.scrollIntoView({ behavior: 'smooth' })}
        />
      )}

      {isShown('practical') && page.practical?.labId && (
        <SubjectLabPracticalBanner
          subjectId={page.practical.labId}
          subjectName={course.name}
          practicalMarks={course.practicalMarks || '30 Marks'}
        />
      )}

      {isShown('whyChoose') && <CourseWhyChoose data={page.whyChoose} />}

      {isShown('curriculum') && (
        <CourseCurriculum
          course={course}
          curriculum={state.data.curriculum}
          theme={theme}
          isSignedIn={isSignedIn}
          onEnroll={enroll}
          onOpenSignIn={onOpenSignIn}
          access={shownAccess}
          onBuy={buy}
          buying={buying}
          cart={cartButton}
          tracking={tracking}
          currentUser={currentUser}
        />
      )}

      {isShown('roadmaps') && (
        <CourseRoadmaps data={page.roadmaps} theme={theme} onSelectRoadmap={setOpenPlan} />
      )}

      {openPlan && (
        <CourseRoadmapPlanner
          plan={openPlan}
          course={course}
          curriculum={state.data.curriculum}
          theme={theme}
          isSignedIn={isSignedIn}
          onClose={() => setOpenPlan(null)}
          onEnroll={enroll}
          onOpenSignIn={onOpenSignIn}
          access={shownAccess}
          onBuy={buy}
          buying={buying}
          tracking={tracking}
        />
      )}

      {isShown('guarantee') && <CourseGuarantee data={page.guarantee} theme={theme} />}

      {isShown('testimonials') && <CourseTestimonials data={page.testimonials} theme={theme} />}

      {isShown('stats') && <CourseStats stats={page.stats} theme={theme} />}

      {isShown('faqs') && <CourseFaqs data={page.faqs} theme={theme} />}
    </>
  );
}
