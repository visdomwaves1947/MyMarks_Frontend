import React, { useCallback, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  ExternalLink,
  Layers,
  ListTree,
  Lock,
  LogIn,
  Play,
  Search,
  Sparkles,
  Tag,
  Tv,
  X,
} from 'lucide-react';
import { courseImage, showDefaultImage } from '../../utils/courseImage';
import CourseLecturePlayer from './CourseLecturePlayer';
import { firstLessonIn, flattenChapters, isVideoLesson, withExtraLessons } from './curriculumTree';

const normalize = (value) =>
  (value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const matchesSearch = (topic, query) => {
  const raw = query.toLowerCase();
  const normalized = normalize(query);
  const tokens = normalized.split(' ').filter(Boolean);
  const fields = [topic.title, topic.code, topic.chapterName, ...(topic.keywords || [])].map(normalize);

  return (
    (topic.title || '').toLowerCase().includes(raw) ||
    fields.some((field) => field.includes(normalized)) ||
    (tokens.length > 0 && tokens.every((token) => fields.some((field) => field.includes(token))))
  );
};

// Every subtopic below a topic, for the card's syllabus preview
const subtopicsOf = (topic) => flattenChapters([{ chapterId: '', name: '', topics: topic.children || [] }]);

export function LessonPrompt({ prompt, course, onClose, onSignIn, onEnroll }) {
  const isSignIn = prompt === 'sign-in';

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-label={isSignIn ? 'Sign in required' : 'Enrollment required'}
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-center"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center">
          <Lock size={24} />
        </div>

        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          {isSignIn ? 'Sign In to Watch' : 'Enroll to Watch'}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-5">
          {isSignIn
            ? `Please sign in to watch the ${course.name} lessons.`
            : `This lesson is part of the full ${course.name} course.`}
        </p>

        <button
          onClick={isSignIn ? onSignIn : onEnroll}
          className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogIn size={16} />
          <span>{isSignIn ? 'Sign In' : `Enroll in ${course.name}`}</span>
        </button>
      </div>
    </div>
  );
}

// Lesson card for the curriculum grid, with a preview of its subtopics
function TopicCard({ topic, theme, isSearching, onOpen }) {
  const { lesson } = topic;
  const subtopics = useMemo(() => subtopicsOf(topic), [topic]);
  const hasChildren = subtopics.length > 0;
  const startsLesson = lesson || firstLessonIn(topic);
  const isLocked = Boolean(lesson?.isLocked);
  const thumbnail =
    lesson?.thumbnailUrl || (lesson?.youtubeId ? `https://img.youtube.com/vi/${lesson.youtubeId}/hqdefault.jpg` : '');

  const open = () => {
    if (startsLesson) onOpen(topic);
  };

  return (
    <div
      data-testid="course-topic"
      className={`group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border ${
        hasChildren ? theme.edge : 'border-slate-200/80 dark:border-slate-800'
      } hover:-translate-y-1`}
    >
      <div onClick={open} className={`relative aspect-video w-full overflow-hidden bg-slate-900 ${startsLesson ? 'cursor-pointer' : ''}`}>
        {thumbnail ? (
          <img
            src={courseImage(thumbnail, 480)}
            alt={topic.title}
            loading="lazy"
            onError={showDefaultImage}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex items-center justify-center">
            <BookOpen size={34} className="text-slate-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-85 group-hover:opacity-65 transition-opacity" />

        {topic.code && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg backdrop-blur-md bg-black/65 text-white font-mono text-xs font-bold border border-white/15 flex items-center gap-1.5 shadow-sm">
            <Layers size={12} className="text-white/80" />
            <span>Lesson {topic.code}</span>
          </div>
        )}

        {startsLesson && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`w-12 h-12 rounded-full text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ring-4 ring-white/30 ${
                isLocked ? 'bg-slate-700' : 'bg-red-600 shadow-red-600/40'
              }`}
            >
              {isLocked ? <Lock size={20} /> : <Play size={20} className="ml-0.5 fill-white" />}
            </div>
          </div>
        )}

        {lesson && (
          <div className="absolute bottom-2.5 right-3 text-[11px] font-bold text-white/90 drop-shadow flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse"></span>
            <span>{lesson.youtubeId ? 'YouTube Lecture' : isVideoLesson(lesson) ? 'Video Lecture' : 'Lesson Link'}</span>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className={`text-[11px] font-extrabold tracking-wider uppercase ${theme.accent} mb-2 truncate`}>
            {topic.chapterName}
          </div>

          <h3
            onClick={open}
            title={topic.title}
            className={`text-base font-bold text-slate-900 dark:text-white line-clamp-2 transition-colors leading-snug mb-2 ${
              startsLesson ? 'cursor-pointer hover:opacity-80' : ''
            }`}
          >
            {topic.code && <span className={`${theme.accent} font-extrabold mr-1.5`}>{topic.code}:</span>}
            {topic.title}
          </h3>

          {topic.description && (
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">{topic.description}</p>
          )}

          {hasChildren && (
            <div className={`mb-3 p-2.5 rounded-xl ${theme.soft}`}>
              <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <ListTree size={12} />
                  <span>Interactive Syllabus</span>
                </span>
                <span className="text-[10px] font-mono font-bold">{subtopics.length} Subtopics</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                Includes {subtopics.slice(0, 3).map((item) => `${item.code ? `${item.code} ` : ''}${item.title}`).join(' • ')}
                {subtopics.length > 3 ? ' with complete collapsible navigation inside the lecture.' : '.'}
              </p>
            </div>
          )}

          {isSearching && topic.trail?.length > 0 && (
            <div className="mb-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold max-w-full truncate">
              <Tag size={10} className="shrink-0" />
              <span className="truncate">{topic.trail.map((step) => step.title).join(' / ')}</span>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
          {startsLesson ? (
            <button
              onClick={open}
              className={`flex-1 py-2.5 px-3 rounded-xl ${theme.solid} text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm`}
            >
              {isLocked ? <Lock size={14} /> : <Play size={14} className="fill-white" />}
              <span>{isLocked ? 'Locked' : `Watch Lecture${topic.code ? ` (${topic.code})` : ''}`}</span>
            </button>
          ) : (
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Lesson coming soon</span>
          )}

          {lesson?.url && !isLocked && (
            <a
              href={lesson.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title={`Open ${topic.title}`}
              aria-label={`Open ${topic.title} in a new tab`}
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CourseCurriculum({ course, curriculum, theme, isSignedIn, onEnroll, onOpenSignIn }) {
  const intro = course.page?.curriculumIntro || {};
  const modules = course.page?.modules || [];

  // Some subjects have syllabus modules but no lessons yet
  const [view, setView] = useState(
    curriculum.chapters.length === 0 && modules.length > 0 ? 'modules' : 'lectures'
  );
  const [selectedChapter, setSelectedChapter] = useState('all');
  const [search, setSearch] = useState('');
  const [playingId, setPlayingId] = useState(null);
  const [prompt, setPrompt] = useState(null); // 'sign-in' | 'enroll'

  const chapters = useMemo(() => withExtraLessons(curriculum), [curriculum]);
  const allTopics = useMemo(() => flattenChapters(chapters), [chapters]);
  const topLevelCount = useMemo(() => chapters.reduce((sum, chapter) => sum + chapter.topics.length, 0), [chapters]);

  const query = search.trim();
  const isSearching = query.length > 0;

  const visibleTopics = useMemo(() => {
    if (isSearching) {
      const matches = allTopics.filter((topic) => matchesSearch(topic, query));
      return selectedChapter === 'all' ? matches : matches.filter((topic) => topic.chapterId === selectedChapter);
    }
    return allTopics.filter(
      (topic) => topic.trail.length === 0 && (selectedChapter === 'all' || topic.chapterId === selectedChapter)
    );
  }, [allTopics, isSearching, query, selectedChapter]);

  // Opens the full-page player at this topic, or at the first lesson inside it
  const openLecture = (topic) => {
    const start = topic.lesson ? topic : firstLessonIn(topic);
    if (!start) return;
    if (!isSignedIn) {
      setPrompt('sign-in');
    } else if (start.lesson.isLocked) {
      setPrompt('enroll');
    } else {
      setPlayingId(start.nodeId);
    }
  };

  const closePlayer = useCallback(() => setPlayingId(null), []);

  return (
    <section id="course-curriculum" className="py-16 sm:py-24 bg-[#EBF0F7] dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          {intro.badge && (
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ${theme.soft} text-xs sm:text-sm font-bold mb-4 shadow-xs`}>
              <BookOpen size={15} />
              <span>{intro.badge}</span>
            </div>
          )}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            {intro.heading || `${course.name} Lessons`}
          </h2>
          {intro.subheading && <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg font-medium">{intro.subheading}</p>}

          {intro.noticeTitle && (
            <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-600/70 shadow-md text-amber-950 dark:text-amber-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center sm:items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0 shadow-sm">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-extrabold text-amber-900 dark:text-amber-200">{intro.noticeTitle}</h4>
                  <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300/90 mt-0.5 leading-relaxed">{intro.noticeText}</p>
                </div>
              </div>
              <button
                onClick={() => onEnroll(course.name)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-extrabold shadow-md transition-all cursor-pointer shrink-0 inline-flex items-center gap-1.5"
              >
                <span>Enroll Now</span>
                <ArrowRight size={15} />
              </button>
            </div>
          )}

          {modules.length > 0 && (
            <div className="mt-6 inline-flex p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              {[
                ['lectures', Tv, `Video Lectures (${topLevelCount})`],
                ['modules', BookOpen, `Syllabus Modules (${modules.length})`],
              ].map(([id, Icon, label]) => (
                <button
                  key={id}
                  onClick={() => setView(id)}
                  className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    view === id ? `${theme.solid} shadow-sm` : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Icon size={15} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {view === 'modules' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {modules.map((module) => (
              <div
                key={module.key || module.name}
                className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 group hover:-translate-y-1"
              >
                {module.image && (
                  <div className="h-40 w-full overflow-hidden relative shrink-0">
                    <img
                      src={courseImage(module.image, 480)}
                      alt={module.name}
                      loading="lazy"
                      onError={showDefaultImage}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">{module.category}</div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{module.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">{module.desc}</p>
                    {module.topics?.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {module.topics.map((topic) => (
                          <li key={topic} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                            <Tag size={11} className={`mt-0.5 shrink-0 ${theme.accent}`} />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button
                    onClick={() => onEnroll(module.name)}
                    className={`mt-4 w-full py-2.5 rounded-xl ${theme.solid} text-sm font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer`}
                  >
                    <span>Enroll in Module</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : chapters.length === 0 ? (
          <p className="text-center py-14 text-sm text-slate-500 dark:text-slate-400">
            Lessons for this course are being added. Please check back soon.
          </p>
        ) : (
          <>
            <div className="mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none min-w-0">
                {[{ chapterId: 'all', label: `All Topics (${topLevelCount})` }, ...chapters.map((chapter) => ({
                  chapterId: chapter.chapterId,
                  label: `${chapter.number ? `${chapter.number}. ` : ''}${chapter.name} (${chapter.topics.length})`,
                }))].map((item) => (
                  <button
                    key={item.chapterId}
                    onClick={() => setSelectedChapter(item.chapterId)}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      selectedChapter === item.chapterId
                        ? `${theme.solid} shadow-md`
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full lg:w-96 shrink-0">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  aria-label="Search topics"
                  placeholder={intro.searchHint || 'Search topic or code'}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400 shadow-xs"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer p-0.5"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>

            {visibleTopics.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <BookOpen className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No matching topics found</h3>
                <button
                  onClick={() => {
                    setSearch('');
                    setSelectedChapter('all');
                  }}
                  className={`mt-3 px-4 py-2 rounded-xl ${theme.solid} text-xs font-bold transition-colors cursor-pointer`}
                >
                  View All Topics
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {visibleTopics.map((topic) => (
                  <TopicCard key={topic.nodeId} topic={topic} theme={theme} isSearching={isSearching} onOpen={openLecture} />
                ))}
              </div>
            )}
          </>
        )}

        <div className="mt-16 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 border border-blue-700/30 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left">
            <h3 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">Need Help with {course.name}?</h3>
            <p className="text-blue-200/80 text-sm sm:text-base max-w-2xl">
              Get 1-on-1 doubt clarification and step-by-step guidance from our faculty.
            </p>
          </div>
          <button
            onClick={() => onEnroll(`${course.name} 1-on-1 Doubt Session`)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg cursor-pointer shrink-0"
          >
            <span>Book 1-on-1 Doubt Session</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {playingId && (
        <CourseLecturePlayer
          course={course}
          chapters={chapters}
          theme={theme}
          startId={playingId}
          onClose={closePlayer}
          onLocked={() => setPrompt('enroll')}
          onAsk={(topic) => {
            setPlayingId(null);
            onEnroll(`${course.name} help: ${topic.title}`);
          }}
        />
      )}

      {prompt && (
        <LessonPrompt
          prompt={prompt}
          course={course}
          onClose={() => setPrompt(null)}
          onSignIn={() => {
            setPrompt(null);
            onOpenSignIn();
          }}
          onEnroll={() => {
            setPrompt(null);
            setPlayingId(null);
            onEnroll(course.name);
          }}
        />
      )}
    </section>
  );
}
