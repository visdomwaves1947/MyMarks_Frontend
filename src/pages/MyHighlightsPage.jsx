import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, Lock, LogIn, Play, ShieldCheck, ShoppingCart } from 'lucide-react';
import ReelWatch from '../components/highlights/ReelWatch';
import SaveHighlightButton from '../components/highlights/SaveHighlightButton';
import NoticePanel from '../components/ui/NoticePanel';
import useDocumentMeta from '../hooks/useDocumentMeta';
import useSavedHighlights from '../hooks/useSavedHighlights';
import { formatClock } from '../utils/watchTime';
import { partLabel } from '../utils/reelTimeline';

const PANEL = 'bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm';

const sameList = (one, other) => one.length === other.length && one.every((clip, index) => clip._id === other[index]._id);

/**
 * My Highlights: the highlights a student saved, one section per subject. Play all plays a subject's
 * saved highlights back to back as one video, chapter by chapter, with the list beside the player;
 * Play on one highlight starts the same list from that highlight. Highlights of a course the student
 * does not have (and that are not free previews) show Buy and are left out of the list that plays.
 */
export default function MyHighlightsPage({ currentUser, onOpenSignIn }) {
  const navigate = useNavigate();
  const saved = useSavedHighlights(currentUser);
  const [filter, setFilter] = useState('all');
  // { subject, clips, title, startAt, startKey }: the list a section's player plays, and where it starts
  const [playing, setPlaying] = useState(null);
  useDocumentMeta({ title: 'My Highlights | MyMarks', description: 'The highlights you saved, to watch again subject by subject.' });

  // Plays a subject's saved highlights as one list, from the highlight picked
  const playFrom = (group, clips, index) =>
    setPlaying((before) => ({
      subject: group.subject,
      // The list already playing stays, so the player jumps instead of starting over
      clips: before?.subject === group.subject && sameList(before.clips, clips) ? before.clips : clips,
      title: `${group.subject}: my highlights`,
      startAt: Math.max(index, 0),
      startKey: Date.now(),
    }));

  let body;
  if (!currentUser) {
    body = (
      <div className={`${PANEL} max-w-lg mx-auto p-8 text-center space-y-3`}>
        <span className="mx-auto w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <Bookmark size={26} />
        </span>
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">Sign in to see your saved highlights</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Save highlights from any lesson, then watch each subject&apos;s as one video.</p>
        <button type="button" onClick={onOpenSignIn} className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold inline-flex items-center gap-2 cursor-pointer">
          <LogIn size={15} />
          <span>Sign In</span>
        </button>
      </div>
    );
  } else if (currentUser.role === 'admin') {
    body = (
      <NoticePanel icon={<ShieldCheck size={26} />} title="You are signed in as an administrator" actions={[{ to: '/admin', label: 'Admin Panel' }]}>
        Administrators see every highlight, so there is nothing to save.
      </NoticePanel>
    );
  } else if (saved.status === 'loading' && saved.subjects.length === 0) {
    body = <p className="text-sm text-slate-500 dark:text-slate-400">Loading your highlights...</p>;
  } else if (saved.status === 'error') {
    body = <p className="text-sm text-rose-600">Could not load your saved highlights. Please try again.</p>;
  } else if (saved.subjects.length === 0) {
    body = (
      <NoticePanel
        testId="my-highlights-empty"
        icon={<Bookmark size={26} />}
        title="No saved highlights yet"
        actions={[{ to: '/demo#courses', label: 'Browse Courses' }]}
      >
        Press Save on a highlight under a lesson video or in the search. It lands here, with the others of its subject.
      </NoticePanel>
    );
  } else {
    const shown = filter === 'all' ? saved.subjects : saved.subjects.filter((group) => group.subject === filter);
    body = (
      <div className="space-y-5">
        {saved.subjects.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Subjects">
            {[{ subject: 'all', count: saved.count }, ...saved.subjects].map((group) => (
              <button
                key={group.subject}
                type="button"
                role="tab"
                aria-selected={filter === group.subject}
                onClick={() => setFilter(group.subject)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer ${
                  filter === group.subject
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {group.subject === 'all' ? 'All subjects' : group.subject} ({group.count})
              </button>
            ))}
          </div>
        )}

        {shown.map((group) => {
          const playable = group.highlights.filter((clip) => clip.playable);
          const locked = group.highlights.filter((clip) => clip.lockReason);
          const here = playing?.subject === group.subject ? playing : null;
          return (
            <section key={group.subject} data-testid="saved-subject" data-subject={group.subject} className={`${PANEL} p-4 sm:p-6 space-y-4`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-slate-950 dark:text-white">{group.subject}</h2>
                  <p data-testid="saved-subject-stats" className="text-xs text-slate-500 dark:text-slate-400">
                    {group.count} {group.count === 1 ? 'highlight' : 'highlights'}
                    {playable.length > 0 ? ` · ${formatClock(group.duration)} to play` : ''}
                    {group.course && (
                      <>
                        {' · '}
                        <Link to={`/courses/${group.course.slug}`} className="font-semibold text-blue-600 dark:text-cyan-400 hover:underline">
                          Open {group.course.name}
                        </Link>
                      </>
                    )}
                  </p>
                </div>
                {playable.length > 0 && (
                  <button
                    type="button"
                    data-testid="saved-play-all"
                    onClick={() => playFrom(group, playable, 0)}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold inline-flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <Play size={15} fill="currentColor" />
                    <span>Play all ({playable.length})</span>
                  </button>
                )}
              </div>

              {here && (
                <ReelWatch
                  key={here.clips.map((clip) => clip._id).join('|')}
                  clips={here.clips}
                  title={here.title}
                  subtitle={`${here.clips.length} ${here.clips.length === 1 ? 'highlight' : 'highlights'}`}
                  autoPlay
                  startAt={here.startAt}
                  startKey={here.startKey}
                  currentUser={currentUser}
                  onOpenSignIn={onOpenSignIn}
                  onClose={() => setPlaying(null)}
                />
              )}

              {locked.length > 0 && group.course && (
                <p data-testid="saved-locked-note" className="text-xs text-slate-600 dark:text-slate-300 inline-flex flex-wrap items-center gap-1.5">
                  <Lock size={12} />
                  <span>
                    {locked.length} {locked.length === 1 ? 'highlight plays' : 'highlights play'} once you have {group.course.name}.
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate(`/checkout?course=${encodeURIComponent(group.course.slug)}`)}
                    className="font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
                  >
                    Buy {group.course.name}
                  </button>
                </p>
              )}

              <ol className="divide-y divide-slate-100 dark:divide-slate-800">
                {group.highlights.map((clip) => (
                  <li key={clip._id} data-testid="saved-highlight" className="py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{partLabel(clip)}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {clip.lessonTitle ? `${clip.lessonTitle} · ` : ''}
                        {formatClock(clip.start)}–{formatClock(clip.end)} · {Math.round(clip.duration)} sec
                      </p>
                      {clip.summary && <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{clip.summary}</p>}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {clip.playable ? (
                        <button
                          type="button"
                          data-testid="saved-play-one"
                          onClick={() => playFrom(group, playable, playable.findIndex((item) => item._id === clip._id))}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Play size={12} fill="currentColor" />
                          <span>Play</span>
                        </button>
                      ) : (
                        clip.lockReason && (
                          <span
                            data-testid="saved-needs-course"
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold inline-flex items-center gap-1.5"
                          >
                            <ShoppingCart size={12} />
                            <span>Needs the course</span>
                          </span>
                        )
                      )}
                      <SaveHighlightButton highlight={clip} currentUser={currentUser} onOpenSignIn={onOpenSignIn} />
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>
    );
  }

  return (
    <div data-testid="my-highlights-page" className="min-h-[calc(100vh-86px)] bg-[#EBF0F7] dark:bg-[#070B14] text-slate-900 dark:text-slate-100 py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white inline-flex items-center gap-2">
            <Bookmark size={26} className="text-blue-600" />
            <span>My Highlights</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Your saved highlights, subject by subject. Play all watches a subject&apos;s highlights as one video, chapter by chapter.
          </p>
        </div>
        {body}
      </div>
    </div>
  );
}
