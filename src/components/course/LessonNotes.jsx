import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Clock, ExternalLink, LogIn, NotebookPen, Play, RotateCcw } from 'lucide-react';
import NoteText, { timesIn } from '../notes/NoteText';
import useCourseNotes, { chapterNoteId, rememberNote, videoNoteId } from '../../hooks/useCourseNotes';
import { saveNoteRequest, saveVideoNoteRequest } from '../../services/learningApi';
import { formatClock, lessonKeyOf } from '../../utils/watchTime';

const MAX_TEXT = 20000;
// Saved this long after the student stops typing
const SAVE_AFTER_MS = 800;

// A chapter's notes are grouped under its number (or its name when it has none)
export const chapterKeyOf = (chapter) =>
  String(chapter?.number || chapter?.name || 'lessons')
    .trim()
    .toLowerCase()
    .slice(0, 80);
export const chapterNameOf = (chapter) => (chapter?.number ? `Chapter ${chapter.number}: ${chapter.name}` : chapter?.name || 'More lessons');
const titleOf = (code, title) => (code ? `${code} · ${title}` : title);
const firstLine = (text) => String(text || '').split('\n').find((line) => line.trim()) || '';

/**
 * My Notes beside the lesson video: the note of the video playing (with its title and length),
 * the chapter's older note if there is one, and the notes of the chapter's other videos.
 * Times written as [3:05] jump the video there.
 */
export default function LessonNotes({ course, current, currentChapter, currentUser, onOpenSignIn, getTime, getLength, onSeek, onOpenLesson, player }) {
  const signedIn = Boolean(currentUser) && currentUser.role !== 'admin';
  const courseId = course?._id;
  const { notes, status, retry } = useCourseNotes(courseId, signedIn ? currentUser.token || 'signed-in' : null);

  const lessonKey = lessonKeyOf(current);
  const chapterKey = chapterKeyOf(currentChapter);
  const chapterName = chapterNameOf(currentChapter);
  const videoId = videoNoteId(lessonKey);
  // What the box edits: this video's note, or the chapter's older note
  const [target, setTarget] = useState({ kind: 'video', id: videoId });
  const targetId = target.kind === 'video' ? videoId : chapterNoteId(chapterKey);
  const [draft, setDraft] = useState(() => (status === 'ready' ? notes[videoId]?.text || '' : ''));
  const [save, setSave] = useState({ state: 'idle', at: null, error: '' });
  const [length, setLength] = useState(0);
  const [open, setOpen] = useState('');
  const box = useRef(null);
  const timer = useRef(null);
  const pending = useRef(null);

  // The video's length, once the player knows it
  useEffect(() => {
    const tick = setInterval(() => {
      const value = Number(getLength?.()) || 0;
      if (value > 0) setLength((previous) => (Math.abs(previous - value) > 0.5 ? value : previous));
    }, 1000);
    return () => clearInterval(tick);
  }, [getLength, lessonKey]);

  // Sends the last change; a failed save is kept to try again
  const flush = useCallback(async () => {
    clearTimeout(timer.current);
    const job = pending.current;
    if (!job) return;
    pending.current = null;
    setSave({ state: 'saving', at: null, error: '' });
    try {
      const { note } =
        job.kind === 'video'
          ? await saveVideoNoteRequest(courseId, job.lessonKey, job.body)
          : await saveNoteRequest(courseId, job.chapterKey, job.body);
      // Unless more was typed meanwhile, keep the server's copy
      if (!pending.current || pending.current.id !== job.id) rememberNote(courseId, job.id, note);
      setSave({ state: 'saved', at: new Date(), error: '' });
    } catch (problem) {
      if (!pending.current) pending.current = job;
      setSave({ state: 'error', at: null, error: problem.message || 'Your note was not saved.' });
    }
  }, [courseId]);

  // A new video playing: save what was typed, and show that video's note
  useEffect(() => {
    flush();
    setTarget({ kind: 'video', id: videoId });
    setOpen('');
  }, [videoId, flush]);

  // The note in the box: the saved one, once the notes have loaded (never while typing)
  useEffect(() => {
    if (status === 'ready') setDraft(notes[targetId]?.text || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetId, status]);

  // What is left unsaved goes out when the panel closes
  useEffect(
    () => () => {
      clearTimeout(timer.current);
      const job = pending.current;
      if (!job) return;
      const send = job.kind === 'video' ? saveVideoNoteRequest(courseId, job.lessonKey, job.body) : saveNoteRequest(courseId, job.chapterKey, job.body);
      send.catch(() => {});
    },
    [courseId]
  );

  const change = (text) => {
    const value = text.slice(0, MAX_TEXT);
    setDraft(value);
    const video = target.kind === 'video';
    const body = video
      ? {
          text: value,
          chapterKey,
          chapterName,
          lessonTitle: current?.title || '',
          lessonCode: current?.code || '',
          duration: Math.round(Number(getLength?.()) || length || 0),
        }
      : { text: value, chapterName };
    pending.current = { kind: target.kind, id: targetId, lessonKey, chapterKey, body };
    rememberNote(courseId, targetId, { kind: target.kind, chapterKey, chapterName, lessonKey: video ? lessonKey : '', lessonTitle: body.lessonTitle || '', lessonCode: body.lessonCode || '', text: value, duration: body.duration || notes[targetId]?.duration || 0 });
    setSave((previous) => ({ ...previous, state: 'typing' }));
    clearTimeout(timer.current);
    timer.current = setTimeout(flush, SAVE_AFTER_MS);
  };

  // Puts "[0:55] " where the cursor is, on a line of its own
  const addTime = () => {
    const element = box.current;
    const at = formatClock(getTime?.() || 0);
    const start = element ? element.selectionStart : draft.length;
    const end = element ? element.selectionEnd : draft.length;
    const before = draft.slice(0, start);
    const insert = `${before && !before.endsWith('\n') ? '\n' : ''}[${at}] `;
    change(before + insert + draft.slice(end));
    const cursor = (before + insert).length;
    requestAnimationFrame(() => {
      element?.focus();
      element?.setSelectionRange(cursor, cursor);
    });
  };

  if (!currentUser) {
    return (
      <div data-testid="lesson-notes" className="p-5 text-center space-y-3">
        <NotebookPen size={26} className={`mx-auto ${player.text}`} />
        <p className="text-sm font-bold text-slate-900 dark:text-white">Sign in to keep notes</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Type notes beside each video. They are saved on your account.</p>
        <button
          type="button"
          onClick={onOpenSignIn}
          className={`px-4 py-2 rounded-xl ${player.solid} text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer`}
        >
          <LogIn size={14} />
          <span>Sign In</span>
        </button>
      </div>
    );
  }
  if (!signedIn) {
    return (
      <div data-testid="lesson-notes" className="p-5 text-sm text-slate-600 dark:text-slate-300">
        Administrators cannot keep notes. Sign in with a student account to try them.
      </div>
    );
  }

  const shownLength = notes[videoId]?.duration || length;
  const chapterNote = notes[chapterNoteId(chapterKey)];
  const others = Object.values(notes)
    .filter((note) => note.kind === 'video' && note.chapterKey === chapterKey && note.lessonKey !== lessonKey && note.text)
    .sort((a, b) => String(a.lessonCode).localeCompare(String(b.lessonCode), undefined, { numeric: true }));
  const times = target.kind === 'video' ? timesIn(draft) : [];

  let saveText = `${draft.length} / ${MAX_TEXT}`;
  if (save.state === 'typing' || save.state === 'saving') saveText = 'Saving...';
  if (save.state === 'saved' && save.at) saveText = `Saved ${save.at.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;

  return (
    <div data-testid="lesson-notes" className="p-4 space-y-4 lg:flex-1 lg:overflow-y-auto">
      {/* The video the note is for */}
      {target.kind === 'video' ? (
        <div data-testid="notes-video" className="space-y-0.5">
          <p className="flex items-center gap-1.5 text-[11px] font-mono font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <NotebookPen size={13} className={player.text} />
            <span>My notes for this video</span>
          </p>
          <p data-testid="notes-video-title" className="text-sm font-bold text-slate-900 dark:text-white">
            {titleOf(current?.code, current?.title)}
          </p>
          <p data-testid="notes-video-length" className="text-xs text-slate-500 dark:text-slate-400">
            {shownLength > 0 ? `Video · ${formatClock(shownLength)}` : 'Video'} · {chapterName}
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setTarget({ kind: 'video', id: videoId })}
            className="text-xs font-bold text-blue-600 dark:text-cyan-400 inline-flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span>Back to this video&apos;s note</span>
          </button>
          <p className="text-sm font-bold text-slate-900 dark:text-white">Chapter notes · {chapterName}</p>
        </div>
      )}

      {status === 'error' ? (
        <div className="text-sm text-rose-600 space-y-2">
          <p>Could not load your notes.</p>
          <button type="button" onClick={retry} className="text-xs font-bold underline cursor-pointer">
            Try again
          </button>
        </div>
      ) : status !== 'ready' ? (
        <div data-testid="notes-loading" aria-label="Loading your notes" className="min-h-[200px] rounded-xl border border-slate-200 dark:border-slate-800 bg-amber-50/40 dark:bg-slate-950 p-4 space-y-3">
          {[92, 78, 85, 60].map((width) => (
            <span key={width} className="block h-3 rounded-full bg-slate-200/80 dark:bg-slate-800 animate-pulse" style={{ width: `${width}%` }} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            ref={box}
            data-testid="notes-text"
            aria-label={target.kind === 'video' ? `My notes for ${current?.title || 'this video'}` : `Chapter notes for ${chapterName}`}
            value={draft}
            onChange={(event) => change(event.target.value)}
            onBlur={flush}
            maxLength={MAX_TEXT}
            rows={10}
            placeholder="Type your notes for this video. Add time puts in where the video is, such as [0:55]."
            className="w-full min-h-[200px] px-3.5 py-3 rounded-xl bg-amber-50/40 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm leading-relaxed text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-y"
          />
          <div className="flex items-center gap-2">
            {target.kind === 'video' && (
              <button
                type="button"
                data-testid="notes-add-time"
                onClick={addTime}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Clock size={13} />
                <span>Add time</span>
              </button>
            )}
            {save.state === 'error' ? (
              <span data-testid="notes-status" className="ml-auto text-xs font-semibold text-rose-600 inline-flex items-center gap-1.5">
                <span>Not saved</span>
                <button type="button" onClick={flush} className="underline inline-flex items-center gap-1 cursor-pointer">
                  <RotateCcw size={11} />
                  <span>Try again</span>
                </button>
              </span>
            ) : (
              <span data-testid="notes-status" className="ml-auto text-xs text-slate-500 dark:text-slate-400">
                {saveText}
              </span>
            )}
          </div>
          {/* The times in this note, to jump the video there */}
          {times.length > 0 && (
            <div data-testid="notes-times" className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Jump to:</span>
              {times.map((time, index) => (
                <button
                  key={`${time.label}-${index}`}
                  type="button"
                  data-testid="notes-time-chip"
                  onClick={() => onSeek(time.seconds)}
                  className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 font-mono text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <Play size={10} fill="currentColor" />
                  <span>{time.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* The older note kept for the whole chapter */}
      {status === 'ready' && target.kind === 'video' && chapterNote?.text && (
        <div data-testid="notes-chapter-note" className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Chapter notes</p>
            <button
              type="button"
              onClick={() => {
                flush();
                setTarget({ kind: 'chapter', id: chapterNoteId(chapterKey) });
              }}
              className="text-xs font-bold text-blue-600 dark:text-cyan-400 cursor-pointer"
            >
              Edit
            </button>
          </div>
          <NoteText text={chapterNote.text} className="text-xs text-slate-600 dark:text-slate-300" />
        </div>
      )}

      {/* The chapter's other videos with notes */}
      {status === 'ready' && target.kind === 'video' && others.length > 0 && (
        <div data-testid="notes-other-videos" className="space-y-2">
          <p className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Other videos in this chapter</p>
          {others.map((note) => {
            const expanded = open === note.lessonKey;
            return (
              <div key={note.lessonKey} data-testid="notes-other-video" className="rounded-xl border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? '' : note.lessonKey)}
                  className="w-full px-3 py-2 flex items-start gap-2 text-left cursor-pointer"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-slate-900 dark:text-white truncate">{titleOf(note.lessonCode, note.lessonTitle)}</span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {note.duration > 0 ? `Video · ${formatClock(note.duration)} · ` : ''}
                      {firstLine(note.text)}
                    </span>
                  </span>
                  <ChevronDown size={14} className={`mt-0.5 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                </button>
                {expanded && (
                  <div className="px-3 pb-3 space-y-2">
                    <NoteText text={note.text} onTime={(seconds) => onOpenLesson(note.lessonKey, seconds)} className="text-xs text-slate-700 dark:text-slate-200" />
                    <button
                      type="button"
                      onClick={() => onOpenLesson(note.lessonKey, 0)}
                      className={`px-3 py-1.5 rounded-lg ${player.solid} text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer`}
                    >
                      <Play size={11} fill="currentColor" />
                      <span>Open video</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Link
        to="/my-notes"
        data-testid="notes-all-link"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline"
      >
        <ExternalLink size={12} />
        <span>All my notes, subject by subject</span>
      </Link>
    </div>
  );
}
