import React, { useCallback, useMemo, useState } from 'react';
import ExamPlannerModal from '../exam-planner/ExamPlannerModal';
import CourseLecturePlayer from './CourseLecturePlayer';
import { LessonPrompt } from './CourseCurriculum';
import { firstLessonIn, flattenChapters, withExtraLessons } from './curriculumTree';

/**
 * A roadmap's day-by-day plan over its course page. Lesson videos in the plan
 * open in the course's own player, with the same sign-in and enroll checks.
 */
export default function CourseRoadmapPlanner({ plan, course, curriculum, theme, isSignedIn, onClose, onEnroll, onOpenSignIn }) {
  const chapters = useMemo(() => withExtraLessons(curriculum), [curriculum]);
  const topics = useMemo(() => new Map(flattenChapters(chapters).map((topic) => [topic.nodeId, topic])), [chapters]);
  const [playingId, setPlayingId] = useState(null);
  const [prompt, setPrompt] = useState(null); // 'sign-in' | 'enroll'

  // A step can point at a topic with its own lesson, or at a topic with lessons inside it
  const lessonAt = useCallback(
    (nodeId) => {
      const topic = topics.get(nodeId);
      if (!topic) return null;
      return topic.lesson ? topic : firstLessonIn(topic);
    },
    [topics]
  );

  const openLesson = (nodeId) => {
    const start = lessonAt(nodeId);
    if (!start) return;
    if (!isSignedIn) setPrompt('sign-in');
    else if (start.lesson.isLocked) setPrompt('enroll');
    else setPlayingId(start.nodeId);
  };

  const closePlayer = useCallback(() => setPlayingId(null), []);

  // Signing in and enrolling open over the page, so the plan closes first. Ticked steps are kept.
  const leaveFor = (action) => {
    setPrompt(null);
    setPlayingId(null);
    onClose();
    action();
  };

  return (
    <>
      <ExamPlannerModal
        isOpen
        onClose={onClose}
        selectedRoadmap={{ ...plan, courseName: course.name }}
        onOpenLesson={openLesson}
        canOpenLesson={(nodeId) => Boolean(lessonAt(nodeId))}
        progressKey={`${course.slug}:${plan.key || plan.title}`}
      />

      {playingId && (
        <CourseLecturePlayer
          course={course}
          chapters={chapters}
          theme={theme}
          startId={playingId}
          onClose={closePlayer}
          onLocked={() => setPrompt('enroll')}
          onAsk={(topic) => leaveFor(() => onEnroll(`${course.name} help: ${topic.title}`))}
        />
      )}

      {prompt && (
        <LessonPrompt
          prompt={prompt}
          course={course}
          onClose={() => setPrompt(null)}
          onSignIn={() => leaveFor(onOpenSignIn)}
          onEnroll={() => leaveFor(() => onEnroll(course.name))}
        />
      )}
    </>
  );
}
