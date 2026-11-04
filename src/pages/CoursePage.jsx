import React, { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { Eye, RefreshCw } from 'lucide-react';
import { fetchCoursePage } from '../services/courseApi';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { getCourseTheme } from '../components/course/courseTheme';
import { isOutsideLink } from '../utils/courseImage';
import CourseHero from '../components/course/CourseHero';
import CourseSkeleton from '../components/course/CourseSkeleton';
import CourseCurriculum from '../components/course/CourseCurriculum';
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

export default function CoursePage({ currentUser, onOpenBooking, onSelectRoadmap, onOpenSignIn }) {
  const { slug } = useParams();
  const { hash } = useLocation();
  const [state, setState] = useState({ status: 'loading', data: null });

  const load = useCallback(async () => {
    setState({ status: 'loading', data: null });
    try {
      const data = await fetchCoursePage(slug);
      setState({ status: data ? 'ready' : 'missing', data });
    } catch {
      setState({ status: 'error', data: null });
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  const course = state.data?.course;

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
          isSignedIn={Boolean(currentUser)}
          onEnroll={enroll}
          onOpenSignIn={onOpenSignIn}
        />
      )}

      {isShown('roadmaps') && (
        <CourseRoadmaps data={page.roadmaps} course={course} theme={theme} onSelectRoadmap={onSelectRoadmap} />
      )}

      {isShown('guarantee') && <CourseGuarantee data={page.guarantee} theme={theme} />}

      {isShown('testimonials') && <CourseTestimonials data={page.testimonials} theme={theme} />}

      {isShown('stats') && <CourseStats stats={page.stats} theme={theme} />}

      {isShown('faqs') && <CourseFaqs data={page.faqs} theme={theme} />}
    </>
  );
}
