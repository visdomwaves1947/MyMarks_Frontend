import React from 'react';
import { CheckCircle2, Play } from 'lucide-react';
import CourseFlags from './CourseFlags';
import LikeButton from './LikeButton';
import { courseImage, courseTag, showDefaultImage } from '../../utils/courseImage';

const BUTTON_STYLE =
  'flex-1 py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white border border-blue-400/40 cursor-pointer';

const cardBorder = (course) => {
  if (course.mostBought) return 'border-amber-400 hover:border-amber-300';
  if (course.bestValue) return 'border-emerald-400 hover:border-emerald-300';
  return 'border-blue-400/60 hover:border-blue-500';
};

const OWNED_BUTTON_STYLE =
  'flex-1 py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white border border-emerald-300/40 cursor-pointer';

// mine: set when the signed-in student has this course ({ started }); its second button then goes
// back into the course instead of Enroll. like: { liked, onToggle } shows the heart.
export default function CourseCard({ course, onExplore, onEnroll, mine = null, onContinue, like = null }) {
  const handleButton = (event, action) => {
    event.stopPropagation();
    if (action) action(course);
  };

  return (
    <div
      data-testid="course-card"
      className={`relative rounded-2xl sm:rounded-3xl overflow-hidden h-[330px] sm:h-[360px] border-2 ${cardBorder(course)} shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between`}
      onClick={() => onExplore && onExplore(course)}
    >
      {/* Full-Cover Background Image */}
      <img
        src={courseImage(course.thumbnail, 640)}
        alt={course.name}
        loading="lazy"
        onError={showDefaultImage}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
      />

      {/* Legibility Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-900/10 pointer-events-none"></div>

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-3.5 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          {courseTag(course) && (
            <span className="text-[10px] sm:text-[11px] font-semibold text-blue-100 bg-blue-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-blue-400/30 uppercase tracking-wider">
              {courseTag(course)}
            </span>
          )}
          <div className="ml-auto flex items-center gap-1.5">
            {mine && (
              <span
                data-testid="course-card-owned"
                className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-white bg-emerald-600/95 px-2 py-1 rounded-lg shadow-sm"
              >
                <CheckCircle2 size={12} />
                <span>Your course</span>
              </span>
            )}
            {like && <LikeButton liked={like.liked} onToggle={like.onToggle} name={course.name} />}
          </div>
        </div>

        <div className="mt-auto pt-2">
          <CourseFlags course={course} className="mb-2" />

          <h4 className="text-sm sm:text-base md:text-lg font-semibold text-white leading-tight mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] truncate">
            {course.name}
          </h4>

          <div className="flex gap-2">
            <button type="button" onClick={(event) => handleButton(event, onExplore)} className={BUTTON_STYLE}>
              <span>Explore</span>
            </button>
            {mine ? (
              <button type="button" onClick={(event) => handleButton(event, onContinue)} className={OWNED_BUTTON_STYLE}>
                <Play size={11} className="fill-white" />
                <span>{mine.started ? 'Continue' : 'Start Learning'}</span>
              </button>
            ) : (
              <button type="button" onClick={(event) => handleButton(event, onEnroll)} className={BUTTON_STYLE}>
                <span>Enroll</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
