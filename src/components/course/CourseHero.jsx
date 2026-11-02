import React from 'react';
import { ArrowRight, BookOpen, Zap } from 'lucide-react';
import CourseFlags from './CourseFlags';
import { formatPrice } from '../../utils/courseImage';

export default function CourseHero({ course, theme, onEnroll, onExplore }) {
  const hero = course.page?.hero || {};

  return (
    <section className="relative pt-8 pb-14 sm:pt-8 sm:pb-16 lg:pt-10 lg:pb-16 overflow-hidden bg-[#EBF0F7] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="absolute inset-0 bg-math-grid opacity-70 dark:opacity-40 pointer-events-none -z-10"></div>
      <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${theme.glow} rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle`}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          <div className="lg:col-span-7 text-center lg:text-left flex flex-col justify-center">
            <CourseFlags course={course} className="justify-center lg:justify-start mb-3" />

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-3">
              {hero.titleLead || course.name}{' '}
              {hero.titleHighlight && (
                <span className={`bg-gradient-to-r ${theme.highlight} bg-clip-text text-transparent`}>
                  {hero.titleHighlight}
                </span>
              )}
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed mb-5 max-w-2xl mx-auto lg:mx-0">
              {hero.subtitle || course.shortDescription}
            </p>

            {course.price !== null && course.price !== undefined && (
              <div data-testid="course-price" className="flex items-baseline justify-center lg:justify-start gap-2 mb-5">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {formatPrice(course.price)}
                </span>
                {course.oldPrice > course.price && (
                  <span className="text-sm text-slate-500 dark:text-slate-400 line-through">
                    {formatPrice(course.oldPrice)}
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 mb-7 w-full sm:w-auto">
              <button
                onClick={() => onEnroll(course.name)}
                className={`w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r ${theme.button} text-white font-bold text-sm sm:text-base shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border`}
              >
                <span>{hero.primaryLabel || 'Enroll Now'}</span>
                <ArrowRight size={17} />
              </button>

              <button
                onClick={onExplore}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-sm sm:text-base border border-slate-300 dark:border-slate-700 shadow-sm flex items-center justify-center gap-2 transition-all hover:border-slate-400 cursor-pointer"
              >
                <Zap size={16} className={theme.accent} />
                <span>{hero.secondaryLabel || 'Explore Lessons'}</span>
              </button>
            </div>

            {hero.boards?.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 max-w-xl mx-auto lg:mx-0">
                {hero.boards.map((board) => (
                  <button
                    key={`${board.code}-${board.title}`}
                    type="button"
                    onClick={() => onEnroll(board.title)}
                    className="group relative bg-[#DFE7F2] dark:bg-[#131927] hover:bg-white dark:hover:bg-slate-800 p-4 rounded-2xl border border-[#BAC9DC] dark:border-[#243048] shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer text-left"
                  >
                    <span className="flex items-center gap-3">
                      <span className={`w-10 h-10 rounded-xl ${theme.soft} flex items-center justify-center font-black text-sm shrink-0 group-hover:scale-110 transition-transform`}>
                        {board.code}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold text-slate-900 dark:text-white">{board.title}</span>
                        <span className="block text-xs text-slate-500 dark:text-slate-400">{board.subtitle}</span>
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md aspect-[4/5] flex items-center justify-center">
              <div className={`absolute inset-0 rounded-full border ${theme.accent} opacity-20 animate-spin-slow pointer-events-none`}></div>

              <div className={`relative z-10 w-64 h-84 sm:w-72 sm:h-96 rounded-2xl bg-gradient-to-br ${theme.book} text-white p-6 shadow-2xl border border-white/20 flex flex-col justify-between`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white truncate">
                    <Zap size={12} className="shrink-0" />
                    <span className="truncate">{hero.bookBadge || course.name}</span>
                  </div>
                  {hero.bookScore && <span className="text-xs font-mono text-white/80 shrink-0">{hero.bookScore}</span>}
                </div>

                <div className="my-auto text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center text-white">
                    <BookOpen size={36} />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight text-white mb-1">{hero.bookTitle || course.name}</h2>
                  {hero.bookSubtitle && <p className="text-xs text-white/80">{hero.bookSubtitle}</p>}
                </div>

                {hero.bookFooter && (
                  <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-200">
                    {hero.bookFooter}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
