import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { Eye, RefreshCw } from 'lucide-react';
import { fetchCoursePage } from '../services/courseApi';
import useDocumentMeta from '../hooks/useDocumentMeta';
import useCourseCheckout from '../hooks/useCourseCheckout';
import useCourseProgress from '../hooks/useCourseProgress';
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
  const isSignedIn = Boolean(currentUser);
  const isStudent = isSignedIn && currentUser.role !== 'admin';
  const tracking = useCourseProgress(course?._id, isStudent && access.canWatch !== false && state.status === 'ready');
  const { buy, buying } = useCourseCheckout({
    course: course || {},
    access,
    isSignedIn,
    onOpenSignIn,
    onBought: () => load({ quiet: true }),
  });

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
          access={access}
          onBuy={buy}
          buying={buying}
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
          access={access}
          onBuy={buy}
          buying={buying}
          tracking={tracking}
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
          access={access}
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
