import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Download, LogIn, NotebookPen, Play, Search, ShieldCheck } from 'lucide-react';
import NoteText from '../components/notes/NoteText';
import NoticePanel from '../components/ui/NoticePanel';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { fetchAllNotes } from '../services/learningApi';
import { formatClock } from '../utils/watchTime';

const PANEL = 'bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm';
const titleOf = (code, title) => (code ? `${code} · ${title}` : title || 'Video');
const shortDate = (value) => (value ? new Date(value).toLocaleDateString([], { day: 'numeric', month: 'short' }) : '');
const escapeHtml = (text) => String(text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Keeps only the notes with the searched words (in the note, the video title or the chapter)
const filterSubject = (group, query) => {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return group;
  const has = (...texts) => {
    const hay = texts.join(' ').toLowerCase();
    return words.every((word) => hay.includes(word));
  };
  const chapters = group.chapters
    .map((chapter) => ({
      ...chapter,
      chapterNote: chapter.chapterNote && has(chapter.chapterNote.text, chapter.chapterName) ? chapter.chapterNote : null,
      videos: chapter.videos.filter((note) => has(note.text, note.lessonTitle, note.lessonCode, chapter.chapterName)),
    }))
    .filter((chapter) => chapter.chapterNote || chapter.videos.length > 0);
  return { ...group, chapters };
};

// A page of one subject's notes to print or save as a PDF
const printSubject = (group) => {
  const chapters = group.chapters
    .map(
      (chapter) => `
      <h2>${escapeHtml(chapter.chapterName || 'More lessons')}</h2>
      ${chapter.chapterNote ? `<h3>Chapter notes</h3><pre>${escapeHtml(chapter.chapterNote.text)}</pre>` : ''}
      ${chapter.videos
        .map(
          (note) => `<h3>${escapeHtml(titleOf(note.lessonCode, note.lessonTitle))}</h3>
            ${note.duration ? `<p class="meta">Video · ${formatClock(note.duration)}</p>` : ''}
            <pre>${escapeHtml(note.text)}</pre>`
        )
        .join('')}`
    )
    .join('');
  const page = window.open('', '_blank');
  if (!page) return;
  page.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>My notes - ${escapeHtml(group.subject)}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #0f172a; margin: 32px; }
      h1 { font-size: 22px; margin: 0 0 4px; } .sub { color: #64748b; font-size: 12px; margin: 0 0 18px; }
      h2 { font-size: 16px; color: #1e40af; margin: 22px 0 8px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }
      h3 { font-size: 13px; margin: 14px 0 2px; } .meta { color: #64748b; font-size: 11px; margin: 0 0 4px; }
      pre { white-space: pre-wrap; font-family: Arial, sans-serif; font-size: 12px; line-height: 1.5; margin: 0; }
    </style></head><body>
    <h1>My notes: ${escapeHtml(group.subject)}</h1><p class="sub">MyMarks · ${new Date().toLocaleDateString()}</p>
    ${chapters}
    <script>window.onload = function () { window.print(); };</script>
    </body></html>`);
  page.document.close();
};

/**
 * My Notes: every note the student wrote beside the videos, subject by subject, then chapter by chapter,
 * each video with its title and length. A time such as [3:05] opens that lesson at 3:05.
 */
export default function MyNotesPage({ currentUser, onOpenSignIn }) {
  const signedIn = Boolean(currentUser) && currentUser.role !== 'admin';
  const [state, setState] = useState({ status: signedIn ? 'loading' : 'idle', subjects: [] });
  const [subject, setSubject] = useState('');
  const [query, setQuery] = useState('');
  const [closed, setClosed] = useState({});
  useDocumentMeta({ title: 'My Notes | MyMarks', description: 'Your notes from every video, subject by subject.' });

  useEffect(() => {
    if (!signedIn) return undefined;
    let live = true;
    fetchAllNotes()
      .then((data) => {
        if (!live) return;
        setState({ status: 'ready', subjects: data.subjects || [] });
        setSubject((current) => current || data.subjects?.[0]?.subject || '');
      })
      .catch(() => live && setState({ status: 'error', subjects: [] }));
    return () => {
      live = false;
    };
  }, [signedIn]);

  const group = state.subjects.find((item) => item.subject === subject) || state.subjects[0];
  const shown = useMemo(() => (group ? filterSubject(group, query.trim()) : null), [group, query]);
  const shownCount = shown ? shown.chapters.reduce((total, chapter) => total + chapter.videos.length + (chapter.chapterNote ? 1 : 0), 0) : 0;
  const linkFor = (note) => (seconds) =>
    `/courses/${group.course.slug}?lesson=${encodeURIComponent(note.lessonKey)}${seconds ? `&t=${Math.round(seconds)}` : ''}`;

  let body;
  if (!currentUser) {
    body = (
      <div className={`${PANEL} max-w-lg mx-auto p-8 text-center space-y-3`}>
        <span className="mx-auto w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <NotebookPen size={26} />
        </span>
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">Sign in to see your notes</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Notes you type beside the videos are kept here, subject by subject.</p>
        <button type="button" onClick={onOpenSignIn} className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold inline-flex items-center gap-2 cursor-pointer">
          <LogIn size={15} />
          <span>Sign In</span>
        </button>
      </div>
    );
  } else if (!signedIn) {
    body = (
      <NoticePanel icon={<ShieldCheck size={26} />} title="You are signed in as an administrator" actions={[{ to: '/admin', label: 'Admin Panel' }]}>
        Administrators cannot keep notes.
      </NoticePanel>
    );
  } else if (state.status === 'loading') {
    body = <p className="text-sm text-slate-500 dark:text-slate-400">Loading your notes...</p>;
  } else if (state.status === 'error') {
    body = <p className="text-sm text-rose-600">Could not load your notes. Please try again.</p>;
  } else if (state.subjects.length === 0) {
    body = (
      <NoticePanel testId="my-notes-empty" icon={<NotebookPen size={26} />} title="No notes yet" actions={[{ to: '/demo#courses', label: 'Browse Courses' }]}>
        Open a lesson and choose My Notes beside the video. What you type is kept here.
      </NoticePanel>
    );
  } else {
    body = (
      <div className="space-y-5">
        {state.subjects.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Subjects">
            {state.subjects.map((item) => (
              <button
                key={item.subject}
                type="button"
                role="tab"
                aria-selected={group.subject === item.subject}
                onClick={() => setSubject(item.subject)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer ${
                  group.subject === item.subject
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {item.subject} ({item.count})
              </button>
            ))}
          </div>
        )}

        <div className={`${PANEL} p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3`}>
          <div className="min-w-0 flex-1">
            <h2 data-testid="my-notes-subject" className="text-lg font-black text-slate-950 dark:text-white">{group.subject}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {shownCount} {shownCount === 1 ? 'note' : 'notes'} ·{' '}
              <Link to={`/courses/${group.course.slug}`} className="font-semibold text-blue-600 dark:text-cyan-400 hover:underline">
                Open {group.course.name}
              </Link>
            </p>
          </div>
          <label className="relative sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              data-testid="my-notes-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search my notes"
              aria-label="Search my notes"
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </label>
          <button
            type="button"
            data-testid="my-notes-pdf"
            onClick={() => printSubject(shown)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Download size={14} />
            <span>Download PDF</span>
          </button>
        </div>

        {shown.chapters.length === 0 && <p className="text-sm text-slate-600 dark:text-slate-400">No note matches &quot;{query}&quot;.</p>}

        {shown.chapters.map((chapter) => {
          const isClosed = closed[chapter.chapterKey];
          return (
            <section key={chapter.chapterKey} data-testid="notes-chapter-section" className={`${PANEL} overflow-hidden`}>
              <button
                type="button"
                aria-expanded={!isClosed}
                onClick={() => setClosed((previous) => ({ ...previous, [chapter.chapterKey]: !isClosed }))}
                className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 text-left border-b border-slate-100 dark:border-slate-800 cursor-pointer"
              >
                <span>
                  <span className="block font-bold text-slate-950 dark:text-white">{chapter.chapterName || 'More lessons'}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    {chapter.videos.length} {chapter.videos.length === 1 ? 'video' : 'videos'}
                    {chapter.chapterNote ? ' · chapter notes' : ''}
                  </span>
                </span>
                <ChevronDown size={18} className={`text-slate-400 transition-transform ${isClosed ? '' : 'rotate-180'}`} />
              </button>
              {!isClosed && (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {chapter.chapterNote && (
                    <div data-testid="notes-chapter-block" className="px-4 sm:px-5 py-4 bg-slate-50/60 dark:bg-slate-900/40">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Chapter notes</p>
                      <NoteText text={chapter.chapterNote.text} className="mt-1 text-sm text-slate-700 dark:text-slate-200" />
                    </div>
                  )}
                  {chapter.videos.map((note) => (
                    <article key={note.lessonKey} data-testid="notes-video-block" className="px-4 sm:px-5 py-4 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-slate-950 dark:text-white">{titleOf(note.lessonCode, note.lessonTitle)}</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {note.duration > 0 ? `Video · ${formatClock(note.duration)} · ` : ''}Edited {shortDate(note.updatedAt)}
                          </p>
                        </div>
                        <Link
                          to={linkFor(note)(0)}
                          data-testid="notes-open-video"
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shrink-0"
                        >
                          <Play size={11} fill="currentColor" />
                          <span>Open video</span>
                        </Link>
                      </div>
                      <NoteText text={note.text} linkFor={linkFor(note)} className="text-sm leading-relaxed text-slate-700 dark:text-slate-200" />
                    </article>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    );
  }

  return (
    <div data-testid="my-notes-page" className="min-h-[calc(100vh-86px)] bg-[#EBF0F7] dark:bg-[#070B14] text-slate-900 dark:text-slate-100 py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white inline-flex items-center gap-2">
            <NotebookPen size={26} className="text-blue-600" />
            <span>My Notes</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Your notes from every video, subject by subject and chapter by chapter. Tap a time such as [3:05] to watch from there.
          </p>
        </div>
        {body}
      </div>
    </div>
  );
}
