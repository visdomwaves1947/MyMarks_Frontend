import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { BookOpen, Clapperboard, GraduationCap, Lock, LogIn, Play, Scissors, Search, ShoppingCart, X } from 'lucide-react';
import Marked from '../components/search/Marked';
import ReelPlayer from '../components/highlights/ReelPlayer';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { fetchSearch } from '../services/searchApi';
import { courseImage, formatPrice, showDefaultImage } from '../utils/courseImage';
import { formatClock } from '../utils/watchTime';
import SaveHighlightButton from '../components/highlights/SaveHighlightButton';

const PANEL = 'bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm';
const TYPES = [
  { key: 'all', label: 'All' },
  { key: 'highlights', label: 'Highlights' },
  { key: 'reels', label: 'Reels' },
  { key: 'courses', label: 'Courses' },
  { key: 'lessons', label: 'Lessons' },
];
const chapterText = (chapter) => (chapter?.number !== null && chapter?.number !== undefined && chapter?.number !== '' ? `Ch ${chapter.number}` : '');
const joined = (...parts) => parts.filter(Boolean).join(' · ');

function HighlightResult({ item, words, playing, onPlay, onStop, onOpenSignIn, currentUser }) {
  const navigate = useNavigate();
  return (
    <article data-testid="search-result-highlight" className={`${PANEL} p-4 sm:p-5 space-y-3`}>
      <div className="flex items-start gap-3">
        <span className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
          <Scissors size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-slate-950 dark:text-white">
            <Marked text={item.title} words={words} />
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {joined(item.subject, chapterText(item.chapter), item.lessonTitle)} · {formatClock(item.start)}–{formatClock(item.end)} ·{' '}
            {Math.round(item.duration)} sec
          </p>
        </div>
        {item.freePreview && (
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 text-[10px] font-bold uppercase tracking-wide shrink-0">
            Free preview
          </span>
        )}
      </div>

      {item.summary && (
        <p className="text-sm text-slate-700 dark:text-slate-300">
          <Marked text={item.summary} words={words} />
        </p>
      )}
      {item.points.length > 0 && (
        <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-0.5">
          {item.points.map((point) => (
            <li key={point}>
              <Marked text={point} words={words} />
            </li>
          ))}
        </ul>
      )}

      {playing && item.media ? (
        <div className="space-y-2">
          <ReelPlayer clips={[item]} title={item.title} autoPlay />
          <button type="button" onClick={onStop} className="text-xs font-semibold text-slate-600 dark:text-slate-300 inline-flex items-center gap-1.5 cursor-pointer">
            <X size={13} />
            <span>Close the player</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          {!item.lockReason && item.media && (
            <button
              type="button"
              data-testid="highlight-play"
              onClick={onPlay}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Play size={13} fill="currentColor" />
              <span>Play highlight</span>
            </button>
          )}
          {item.lockReason === 'sign-in' && (
            <button
              type="button"
              data-testid="highlight-signin"
              onClick={onOpenSignIn}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn size={13} />
              <span>Sign in to play</span>
            </button>
          )}
          {item.lockReason === 'buy' && item.course && (
            <button
              type="button"
              data-testid="highlight-buy"
              onClick={() => navigate(`/checkout?course=${encodeURIComponent(item.course.slug)}`)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingCart size={13} />
              <span>Buy {item.course.name} to play</span>
            </button>
          )}
          {item.lockReason && (
            <span className="text-xs text-slate-500 dark:text-slate-400 inline-flex items-center gap-1">
              <Lock size={12} />
              <span>{item.lockReason === 'sign-in' ? 'Sign in to play highlights' : 'Part of a course for sale'}</span>
            </span>
          )}
          <SaveHighlightButton highlight={item} currentUser={currentUser} onOpenSignIn={onOpenSignIn} />
          {item.course && (
            <Link to={`/courses/${item.course.slug}`} className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline">
              Open {item.course.name}
            </Link>
          )}
        </div>
      )}

      {item.reels.length > 0 && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          In {item.reels.length === 1 ? 'the reel' : 'the reels'}{' '}
          {item.reels.map((reel, index) => (
            <span key={reel._id}>
              {index > 0 && ', '}
              <Link to={`/highlights/${reel._id}`} className="font-semibold text-blue-600 dark:text-cyan-400 hover:underline">
                {reel.name}
              </Link>
            </span>
          ))}
        </p>
      )}
    </article>
  );
}

/**
 * Search results: highlights (play them here), highlight reels, courses and lessons, with the
 * searched words marked. A misspelt word is searched as the closest word the site knows.
 */
export default function SearchPage({ currentUser, onOpenSignIn }) {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const query = (params.get('q') || '').trim();
  const type = TYPES.some((item) => item.key === params.get('type')) ? params.get('type') : 'all';
  const [text, setText] = useState(query);
  const [state, setState] = useState({ status: query ? 'loading' : 'idle', data: null });
  const [playing, setPlaying] = useState(params.get('play') || '');
  const signedInAs = currentUser?._id || currentUser?.email || currentUser?.role || '';

  useEffect(() => setText(query), [query]);
  useEffect(() => setPlaying(params.get('play') || ''), [params]);

  useEffect(() => {
    if (query.length < 2) {
      setState({ status: 'idle', data: null });
      return undefined;
    }
    const controller = new AbortController();
    setState((previous) => ({ status: 'loading', data: previous.data }));
    fetchSearch(query, { signal: controller.signal })
      .then((data) => setState({ status: 'ready', data }))
      .catch((error) => error.name !== 'AbortError' && setState({ status: 'error', data: null }));
    return () => controller.abort();
  }, [query, signedInAs]);

  useDocumentMeta({
    title: query ? `${query} | Search | MyMarks` : 'Search | MyMarks',
    description: 'Search MyMarks highlights, lessons and courses.',
  });

  const results = state.data?.results || { highlights: [], reels: [], lessons: [], courses: [] };
  const words = state.data?.words || [];
  const counts = {
    highlights: results.highlights.length,
    reels: results.reels.length,
    courses: results.courses.length,
    lessons: results.lessons.length,
  };
  counts.all = counts.highlights + counts.reels + counts.courses + counts.lessons;
  const shows = (key) => type === 'all' || type === key;
  const setType = (key) => {
    const next = new URLSearchParams(params);
    if (key === 'all') next.delete('type');
    else next.set('type', key);
    next.delete('play');
    setParams(next);
  };

  return (
    <div data-testid="search-page" className="min-h-[calc(100vh-86px)] bg-[#EBF0F7] dark:bg-[#070B14] text-slate-900 dark:text-slate-100 py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-5">
        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            if (text.trim()) navigate(`/search?q=${encodeURIComponent(text.trim())}`);
          }}
          className="relative"
        >
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            data-testid="search-page-input"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Search topics, e.g. what is trigonometry"
            aria-label="Search"
            className="w-full pl-11 pr-28 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm sm:text-base font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-sm"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold cursor-pointer">
            Search
          </button>
        </form>

        {query && (
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">Results for &quot;{query}&quot;</h1>
            {state.data?.didYouMean && (
              <p data-testid="search-did-you-mean" className="text-sm text-slate-600 dark:text-slate-400">
                Showing results for <span className="font-semibold text-slate-900 dark:text-white">{state.data.didYouMean}</span>
              </p>
            )}
          </div>
        )}

        {state.status === 'ready' && counts.all > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Kind of result">
            {TYPES.filter((item) => item.key === 'all' || counts[item.key] > 0).map((item) => (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={type === item.key}
                data-testid={`search-tab-${item.key}`}
                onClick={() => setType(item.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer ${
                  type === item.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {item.label} ({counts[item.key]})
              </button>
            ))}
          </div>
        )}

        {state.status === 'idle' && <p className="text-sm text-slate-600 dark:text-slate-400">Type a topic, such as &quot;what is trigonometry&quot;.</p>}
        {state.status === 'loading' && !state.data && <p className="text-sm text-slate-500">Searching...</p>}
        {state.status === 'error' && <p className="text-sm text-rose-600">The search did not work. Please try again.</p>}
        {state.status === 'ready' && counts.all === 0 && (
          <div data-testid="search-empty" className={`${PANEL} p-8 text-center space-y-2`}>
            <p className="font-bold text-slate-900 dark:text-white">Nothing matches &quot;{query}&quot;</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Try another word, such as the chapter or topic name.</p>
          </div>
        )}

        {shows('highlights') && counts.highlights > 0 && (
          <section className="space-y-3" aria-label="Highlights">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Highlights</h2>
            {results.highlights.map((item) => (
              <HighlightResult
                key={item._id}
                item={item}
                words={words}
                playing={playing === String(item._id)}
                onPlay={() => setPlaying(String(item._id))}
                onStop={() => setPlaying('')}
                onOpenSignIn={onOpenSignIn}
                currentUser={currentUser}
              />
            ))}
          </section>
        )}

        {shows('reels') && counts.reels > 0 && (
          <section className="space-y-3" aria-label="Highlight reels">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Highlight reels</h2>
            {results.reels.map((reel) => (
              <Link
                key={reel._id}
                to={`/highlights/${reel._id}`}
                data-testid="search-result-reel"
                className={`${PANEL} p-4 sm:p-5 flex items-start gap-3 hover:border-blue-300 dark:hover:border-blue-700`}
              >
                <span className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 flex items-center justify-center shrink-0">
                  <Clapperboard size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-slate-950 dark:text-white">
                    <Marked text={reel.name} words={words} />
                  </span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    {joined(reel.subject, `${reel.clipCount} parts`, formatClock(reel.duration), `${reel.chapterCount} chapters`)}
                  </span>
                  {reel.firstTitles.length > 0 && (
                    <span className="block text-xs text-slate-600 dark:text-slate-300 mt-1 truncate">
                      <Marked text={reel.firstTitles.join(' → ')} words={words} />
                    </span>
                  )}
                </span>
                {reel.lockReason && <Lock size={14} className="text-slate-400 mt-1" aria-label="Locked" />}
              </Link>
            ))}
          </section>
        )}

        {shows('courses') && counts.courses > 0 && (
          <section className="space-y-3" aria-label="Courses">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {results.courses.map((course) => (
                <Link
                  key={course._id}
                  to={`/courses/${course.slug}`}
                  data-testid="search-result-course"
                  className={`${PANEL} p-3 flex items-center gap-3 hover:border-blue-300 dark:hover:border-blue-700`}
                >
                  <img src={courseImage(course.thumbnail, 200)} onError={showDefaultImage} alt="" className="w-20 h-14 rounded-xl object-cover bg-slate-100 shrink-0" />
                  <span className="min-w-0">
                    <span className="block font-bold text-slate-950 dark:text-white">
                      <Marked text={course.name} words={words} />
                    </span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400 truncate">
                      {course.price ? formatPrice(course.price) : 'Course'} · {course.subject}
                    </span>
                  </span>
                  <GraduationCap size={16} className="ml-auto text-slate-400 shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {shows('lessons') && counts.lessons > 0 && (
          <section className="space-y-3" aria-label="Lessons">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Lessons</h2>
            <ul className={`${PANEL} divide-y divide-slate-100 dark:divide-slate-800`}>
              {results.lessons.map((lesson) => (
                <li key={lesson._id} data-testid="search-result-lesson">
                  <Link
                    to={lesson.course ? `/courses/${lesson.course.slug}` : `/search?q=${encodeURIComponent(lesson.subject || lesson.title)}`}
                    className="px-4 py-3 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  >
                    <BookOpen size={16} className="mt-0.5 text-slate-400 shrink-0" />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                        <Marked text={lesson.title} words={words} />
                      </span>
                      <span className="block text-xs text-slate-500 dark:text-slate-400">
                        {joined(lesson.subject, chapterText(lesson.chapter), lesson.chapter?.name, lesson.topic)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
