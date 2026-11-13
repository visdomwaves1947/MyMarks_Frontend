import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clapperboard, Lock, LogIn, ShoppingCart } from 'lucide-react';
import ReelWatch from '../components/highlights/ReelWatch';
import NoticePanel from '../components/ui/NoticePanel';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { fetchReel } from '../services/highlightsApi';
import { formatClock } from '../utils/watchTime';
import { partLabel } from '../utils/reelTimeline';
import SaveHighlightButton from '../components/highlights/SaveHighlightButton';

const PANEL = 'bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm';

/**
 * One highlight reel: its parts from different chapters played as one video, with the list of parts
 * beside the player and what the part now playing covers below it.
 * Visitors see what is in it and are asked to sign in; students without the course are asked to buy it,
 * unless the admin made the reel a free preview.
 */
export default function HighlightReelPage({ currentUser, onOpenSignIn }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({ status: 'loading', data: null });
  const signedInAs = currentUser?._id || currentUser?.email || currentUser?.role || '';

  useEffect(() => {
    let live = true;
    setState((previous) => ({ ...previous, status: previous.data ? 'ready' : 'loading' }));
    fetchReel(id)
      .then((data) => live && setState({ status: 'ready', data }))
      .catch((error) => live && setState({ status: error.status === 404 ? 'missing' : 'error', data: null }));
    return () => {
      live = false;
    };
    // Signing in changes what may play
  }, [id, signedInAs]);

  const reel = state.data?.reel;
  const course = state.data?.course;
  useDocumentMeta({
    title: reel ? `${reel.name} | MyMarks Highlights` : 'Highlights | MyMarks',
    description: reel?.description || 'Short highlights from MyMarks lessons, played as one video.',
  });

  let body;
  if (state.status === 'loading') {
    body = <p className="text-sm text-slate-500 dark:text-slate-400">Loading the highlights...</p>;
  } else if (state.status !== 'ready') {
    body = (
      <NoticePanel
        testId="reel-missing"
        icon={<Clapperboard size={26} />}
        title={state.status === 'missing' ? 'This highlight reel is not available' : 'We could not load this highlight reel'}
        actions={[{ to: '/demo#courses', label: 'Browse Courses' }]}
      >
        {state.status === 'missing' ? 'It may have been removed.' : 'Please check your connection and try again.'}
      </NoticePanel>
    );
  } else {
    const parts = `${reel.clipCount} ${reel.clipCount === 1 ? 'part' : 'parts'} · ${formatClock(reel.duration)}`;
    body = reel.playable ? (
      <ReelWatch clips={reel.clips} title={reel.name} subtitle={parts} currentUser={currentUser} onOpenSignIn={onOpenSignIn} />
    ) : (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <div className="lg:col-span-2 space-y-3">
          <div
            data-testid="reel-locked"
            className="aspect-video rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white flex flex-col items-center justify-center gap-3 p-6 text-center"
          >
            <span className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
              <Lock size={22} />
            </span>
            {reel.lockReason === 'sign-in' ? (
              <>
                <p className="text-sm sm:text-base font-bold">Sign in to watch these highlights</p>
                <button
                  type="button"
                  onClick={onOpenSignIn}
                  className="px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
                >
                  <LogIn size={15} />
                  <span>Sign In</span>
                </button>
              </>
            ) : (
              <>
                <p className="text-sm sm:text-base font-bold">These highlights are part of the {course?.name || reel.subject} course</p>
                <p className="text-xs text-slate-300 max-w-sm">Buy the course to watch every highlight and lesson.</p>
                {course && (
                  <button
                    type="button"
                    onClick={() => navigate(`/checkout?course=${encodeURIComponent(course.slug)}`)}
                    className="px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart size={15} />
                    <span>Buy {course.name}</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <aside className={`${PANEL} p-5 space-y-4`}>
          <div>
            <h2 className="text-sm font-bold text-slate-950 dark:text-white">In this reel</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {reel.clipCount} {reel.clipCount === 1 ? 'part' : 'parts'} from {reel.chapterCount}{' '}
              {reel.chapterCount === 1 ? 'chapter' : 'chapters'} · {formatClock(reel.duration)}
            </p>
          </div>
          <ol className="space-y-3">
            {reel.clips.map((clip, index) => (
              <li key={clip._id} data-testid="reel-item" className="text-sm">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {index + 1}. {partLabel(clip)}
                  </p>
                  <SaveHighlightButton highlight={clip} currentUser={currentUser} onOpenSignIn={onOpenSignIn} />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {clip.lessonTitle ? `${clip.lessonTitle} · ` : ''}
                  {formatClock(clip.start)}–{formatClock(clip.end)}
                </p>
                {clip.summary && <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{clip.summary}</p>}
                {clip.points.length > 0 && (
                  <ul className="mt-1 list-disc pl-4 text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
                    {clip.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </aside>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-86px)] bg-[#EBF0F7] dark:bg-[#070B14] text-slate-900 dark:text-slate-100 py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-5">
        <Link
          to={course ? `/courses/${course.slug}` : '/demo#courses'}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-300"
        >
          <ArrowLeft size={16} />
          <span>{course ? `Back to ${course.name}` : 'Browse Courses'}</span>
        </Link>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
            {reel?.subject ? `${reel.subject} highlights` : 'Highlights'}
          </p>
          <h1 data-testid="reel-name" className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
            {reel?.name || 'Highlight reel'}
          </h1>
          {reel?.description && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{reel.description}</p>}
        </div>
        {body}
      </div>
    </div>
  );
}
