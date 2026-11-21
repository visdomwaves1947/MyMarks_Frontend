import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Copy,
  ListPlus,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import useDialog from '../../../hooks/useDialog';
import { daysLabel, isFinishedPart, partOf, partsSummary } from '../../course/roadmapPlan';
import { formatClock } from '../../../utils/watchTime';
import { ICON_BUTTON, INPUT_STYLE, PANEL_STYLE, PRIMARY_BUTTON, SECONDARY_BUTTON, TextArea, TextInput, moveItem } from '../courses/fields';
import PartEditor from './PartEditor';
import SyllabusPicker from './SyllabusPicker';
import { MAX_DAYS, MAX_PARTS, blankDay, copyOfDay, dayCountProblem, olderSteps, partKey, partStep, summaryStep, unfinishedParts, withStats } from './roadmapDrafts';

const CHIP = 'shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide';
const HINT = 'text-[11px] text-slate-500 dark:text-slate-400';

const thumbnailOf = (lesson) => (lesson?.media?.kind === 'youtube' ? `https://img.youtube.com/vi/${lesson.media.youtubeId}/mqdefault.jpg` : '');

const dayState = (day) => {
  const parts = (day.steps || []).map(partOf).filter(Boolean);
  if (parts.length === 0) return 'empty';
  return parts.every(isFinishedPart) ? 'ready' : 'unfinished';
};

const dayTabStyle = (isActive, state) =>
  `shrink-0 min-w-[78px] px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer text-left ${
    isActive
      ? 'bg-blue-600 border-blue-600 text-white'
      : state === 'ready'
        ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
        : state === 'unfinished'
          ? 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300'
          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
  }`;

/**
 * The page for one roadmap: its name and card details, its days, and each day's video parts picked
 * from the syllabus. Every part is a stretch of a lesson with its summary, never a whole video.
 */
export default function RoadmapPage({ roadmap, chapters, lessons, summaries, problems, takenDays, subject, onChange, onBack }) {
  const { confirm } = useDialog();
  const days = roadmap.days || [];
  const [chosenDay, setChosenDay] = useState(0);
  const [dayInput, setDayInput] = useState(String(days.length || 1));
  const [dayError, setDayError] = useState('');
  const [picking, setPicking] = useState(false);
  const [editing, setEditing] = useState(null); // step index on the open day

  const current = Math.min(chosenDay, Math.max(days.length - 1, 0));
  const day = days[current];
  const steps = day?.steps || [];
  const unfinished = unfinishedParts(roadmap);
  const older = olderSteps(roadmap);
  const partCount = days.reduce((sum, item) => sum + (item.steps || []).length, 0);

  const change = (changes) => onChange(withStats({ ...roadmap, ...changes }));
  const setDays = (next) => {
    change({ days: next, duration: Math.max(next.length, 1) });
    setDayInput(String(next.length));
  };
  const setDay = (index, changes) => setDays(days.map((item, itemIndex) => (itemIndex === index ? { ...item, ...changes } : item)));
  const setSteps = (next) => setDay(current, { steps: next });

  // ── Days ──
  const applyDayCount = async () => {
    const count = Number(dayInput);
    if (count === days.length) return;
    const problem = dayCountProblem(count, takenDays, subject);
    setDayError(problem);
    if (problem) return;
    if (count < days.length) {
      const removed = days.length - count;
      const planned = days.slice(count).filter((item) => item.steps?.length > 0).length;
      if (planned > 0) {
        const ok = await confirm({
          title: removed === 1 ? 'Remove the last day?' : `Remove the last ${removed} days?`,
          message: removed === 1 ? 'It has parts, and they will be removed.' : `${planned} of them have parts, and those will be removed.`,
          confirmLabel: 'Remove Days',
          tone: 'danger',
        });
        if (!ok) {
          setDayInput(String(days.length));
          return;
        }
      }
      setDays(days.slice(0, count));
      setChosenDay((index) => Math.min(index, count - 1));
    } else {
      setDays([...days, ...Array.from({ length: count - days.length }, blankDay)]);
    }
  };

  const tryDayCount = (count) => {
    const problem = dayCountProblem(count, takenDays, subject);
    setDayError(problem);
    return !problem;
  };

  const addDay = () => {
    if (!tryDayCount(days.length + 1)) return;
    setDays([...days, blankDay()]);
    setChosenDay(days.length);
  };

  const copyDay = () => {
    if (!tryDayCount(days.length + 1)) return;
    const next = [...days];
    next.splice(current + 1, 0, { ...copyOfDay(day), title: day.title ? `${day.title} (copy)` : '' });
    setDays(next);
    setChosenDay(current + 1);
  };

  const removeDay = async () => {
    if (days.length <= 1 || !tryDayCount(days.length - 1)) return;
    if (steps.length > 0) {
      const ok = await confirm({
        title: `Remove Day ${current + 1}?`,
        message: `Its ${partsSummary(steps).split(' · ')[0]} will be removed. The days after it move up.`,
        confirmLabel: 'Remove Day',
        tone: 'danger',
      });
      if (!ok) return;
    }
    setDays(days.filter((_, index) => index !== current));
    setChosenDay(Math.max(0, current - 1));
  };

  const moveDay = (direction) => {
    const target = current + direction;
    if (target < 0 || target >= days.length) return;
    setDays(moveItem(days, current, direction));
    setChosenDay(target);
  };

  // ── Parts of the open day ──
  // A summary is in the day when its stretch is; a video to cut when a part of it has no times yet
  const inThisDay = new Set(
    steps
      .map(partOf)
      .filter((part) => part?.nodeId)
      .map((part) => partKey(part.nodeId, part.start, part.end))
  );

  const addParts = (picked) => {
    const room = MAX_PARTS - steps.length;
    setSteps([...steps, ...picked.slice(0, Math.max(room, 0)).map(({ lesson, clip }) => (clip ? summaryStep(lesson, clip) : partStep(lesson)))]);
    setPicking(false);
  };

  const removeStep = async (index) => {
    const part = partOf(steps[index]);
    if (part && (part.summary || part.start !== null)) {
      const ok = await confirm({
        title: 'Remove this part?',
        message: `"${steps[index].title || part.text}" and its summary are removed from Day ${current + 1}.`,
        confirmLabel: 'Remove',
        tone: 'danger',
      });
      if (!ok) return;
    }
    setSteps(steps.filter((_, stepIndex) => stepIndex !== index));
  };

  const moveToDay = (index, target) => {
    if (target === current || !days[target]) return;
    const step = steps[index];
    setDays(
      days.map((item, dayIndex) => {
        if (dayIndex === current) return { ...item, steps: steps.filter((_, stepIndex) => stepIndex !== index) };
        if (dayIndex === target) return { ...item, steps: [...(item.steps || []), step] };
        return item;
      })
    );
  };

  const savePart = (index, changes) => {
    setSteps(
      steps.map((step, stepIndex) => {
        if (stepIndex !== index) return step;
        return { ...step, resources: step.resources.map((resource) => (resource.kind === 'part' ? { ...resource, ...changes } : resource)) };
      })
    );
    setEditing(null);
  };

  const editingLesson = editing !== null ? lessons.get(partOf(steps[editing])?.nodeId) : null;

  return (
    <div className="space-y-4" data-testid="roadmap-page">
      {/* Where this page sits, and how far along the roadmap is */}
      <div className={`${PANEL_STYLE} flex flex-wrap items-center gap-2`}>
        <button type="button" onClick={onBack} className={SECONDARY_BUTTON}>
          <ArrowLeft size={14} />
          <span>All roadmaps</span>
        </button>
        <h3 className="text-base font-black text-slate-900 dark:text-white truncate">{roadmap.title || 'Untitled roadmap'}</h3>
        <span className={`${CHIP} bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300`}>{daysLabel(days.length)}</span>
        <span className={`${CHIP} bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300`}>
          {partCount} {partCount === 1 ? 'part' : 'parts'}
        </span>
        {unfinished > 0 && (
          <span className={`${CHIP} bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300`} data-testid="roadmap-unfinished">
            {unfinished} not finished
          </span>
        )}
      </div>

      {problems.length > 0 && (
        <div role="alert" className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200">
          <p className="text-xs font-bold mb-1">Fix this before saving:</p>
          <ul className="list-disc pl-4 space-y-0.5 text-xs">
            {problems.map((problem) => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
        </div>
      )}
      {older > 0 && (
        <p className="text-xs text-rose-700 dark:text-rose-300" data-testid="roadmap-older">
          {older === 1 ? '1 older step plays' : `${older} older steps play`} a whole lesson or opens a link. Students still see {older === 1 ? 'it' : 'them'}; remove {older === 1 ? 'it' : 'them'} and add video parts instead.
        </p>
      )}
      {unfinished > 0 && (
        <p className="text-xs text-amber-800 dark:text-amber-300">
          {unfinished === 1 ? '1 part has' : `${unfinished} parts have`} no times or summary yet. You can save now: students see each part once it is finished.
        </p>
      )}

      {/* About the roadmap */}
      <div className={`${PANEL_STYLE} space-y-3`}>
        <h4 className="text-sm font-black text-slate-900 dark:text-white">About this roadmap</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <TextInput
            label="Title"
            required
            value={roadmap.title}
            onChange={(title) => change({ title })}
            error={roadmap.title?.trim() ? '' : 'Add a title. Students see it on the roadmap card.'}
          />
          <TextInput label="Level" value={roadmap.level} onChange={(level) => change({ level })} placeholder="e.g. BEGINNER" />
          <TextInput label="Expected score" value={roadmap.expectedScore} onChange={(expectedScore) => change({ expectedScore })} placeholder="e.g. 60-65 / 75" />
        </div>
        <TextArea label="Description" rows={2} value={roadmap.desc} onChange={(desc) => change({ desc })} placeholder="Who this roadmap is for and what it covers." />
      </div>

      {/* Days */}
      <div className={`${PANEL_STYLE} space-y-3`}>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3">
          <div>
            <div className="flex items-end gap-2">
              <div className="w-32 shrink-0">
                <TextInput
                  label="Number of days"
                  type="number"
                  min="1"
                  max={MAX_DAYS}
                  value={dayInput}
                  onChange={(value) => {
                    setDayInput(value);
                    setDayError('');
                  }}
                  onKeyDown={(event) => event.key === 'Enter' && applyDayCount()}
                  aria-invalid={dayError ? true : undefined}
                />
              </div>
              <button type="button" onClick={applyDayCount} className={`${SECONDARY_BUTTON} whitespace-nowrap`}>
                Set Days
              </button>
            </div>
            {dayError && (
              <p role="alert" className="mt-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 max-w-md">
                {dayError}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button type="button" onClick={addDay} className={SECONDARY_BUTTON}>
              <Plus size={13} /> Add day
            </button>
            <button type="button" onClick={copyDay} disabled={!day} className={SECONDARY_BUTTON}>
              <Copy size={13} /> Copy Day {current + 1}
            </button>
            <button type="button" onClick={removeDay} disabled={days.length <= 1} className={`${SECONDARY_BUTTON} hover:!text-rose-600`}>
              <Trash2 size={13} /> Remove Day {current + 1}
            </button>
          </div>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="Days">
          {days.map((item, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === current}
              onClick={() => setChosenDay(index)}
              className={dayTabStyle(index === current, dayState(item))}
            >
              <span className="block">Day {index + 1}</span>
              <span className="block font-semibold opacity-80">{(item.steps || []).length ? partsSummary(item.steps).split(' · ')[0] : 'Empty'}</span>
            </button>
          ))}
        </div>
        <p className={HINT}>Green: every part ready. Amber: some parts still need their times or summary.</p>
      </div>

      {/* The open day */}
      {day && (
        <div className={`${PANEL_STYLE} space-y-3`} data-testid="roadmap-day">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-black text-slate-900 dark:text-white">
              Day {current + 1} of {days.length}
              {steps.length > 0 && <span className="ml-2 text-xs font-semibold text-slate-500">{partsSummary(steps)}</span>}
            </h4>
            <div className="flex items-center">
              <button type="button" aria-label="Move this day earlier" disabled={current === 0} onClick={() => moveDay(-1)} className={ICON_BUTTON}>
                <ArrowUp size={14} />
              </button>
              <button type="button" aria-label="Move this day later" disabled={current === days.length - 1} onClick={() => moveDay(1)} className={ICON_BUTTON}>
                <ArrowDown size={14} />
              </button>
              <button type="button" aria-label="Previous day" disabled={current === 0} onClick={() => setChosenDay(current - 1)} className={ICON_BUTTON}>
                <ChevronLeft size={16} />
              </button>
              <button type="button" aria-label="Next day" disabled={current === days.length - 1} onClick={() => setChosenDay(current + 1)} className={ICON_BUTTON}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <TextInput label="Day title" value={day.title} onChange={(title) => setDay(current, { title })} placeholder="e.g. Functions: ordered pairs" />
            <TextInput label="Note for the day" value={day.desc} onChange={(desc) => setDay(current, { desc })} placeholder="e.g. Write the key points in your notebook" />
          </div>

          {steps.length === 0 && (
            <div className="text-center py-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">No parts on Day {current + 1} yet.</p>
              <button type="button" onClick={() => setPicking(true)} disabled={lessons.size === 0} className={`${PRIMARY_BUTTON} mx-auto`}>
                <ListPlus size={14} /> Add summaries from the syllabus
              </button>
              {lessons.size === 0 && <p className={`${HINT} mt-2`}>This course has no lesson videos yet.</p>}
            </div>
          )}

          <ol className="space-y-2">
            {steps.map((step, index) => {
              const part = partOf(step);
              const lesson = part ? lessons.get(part.nodeId) : null;
              const isOlder = !part || step.resources.some((resource) => resource.kind !== 'part');
              const finished = part && isFinishedPart(part);
              const hasTimes = part && part.start !== null && part.start !== undefined && part.end !== null && part.end !== undefined;
              return (
                <li
                  key={`${index}-${part?.nodeId || step.title}`}
                  data-testid="roadmap-part"
                  className={`flex flex-col sm:flex-row gap-3 p-3 rounded-2xl border ${
                    isOlder
                      ? 'border-rose-200 dark:border-rose-900 bg-rose-50/60 dark:bg-rose-950/20'
                      : finished
                        ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                        : 'border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20'
                  }`}
                >
                  <div className="flex gap-3 min-w-0 flex-1">
                    <span className="shrink-0 w-6 text-xs font-black text-slate-400 pt-1">{index + 1}</span>
                    {thumbnailOf(lesson) ? (
                      <img src={thumbnailOf(lesson)} alt="" className="shrink-0 w-24 h-14 rounded-lg object-cover bg-slate-200" loading="lazy" />
                    ) : (
                      <span className="shrink-0 w-24 h-14 rounded-lg bg-slate-100 dark:bg-slate-800" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{step.title || part?.text || 'Part'}</p>
                      <p className={`${HINT} truncate`}>
                        {isOlder
                          ? 'Older step: a whole lesson or a link. Remove it and add a video part instead.'
                          : [lesson?.chapterNumber && `Ch ${lesson.chapterNumber}`, lesson?.chapterName].filter(Boolean).join(' · ') || 'Lesson not found in the course'}
                      </p>
                      {!isOlder && (
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          <span
                            data-testid="part-times"
                            className={`${CHIP} ${hasTimes ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}`}
                          >
                            {hasTimes ? `${formatClock(part.start)}–${formatClock(part.end)} · ${Math.round(part.end - part.start)} sec` : 'Needs times'}
                          </span>
                          {!String(part.summary || '').trim() && (
                            <span className={`${CHIP} bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300`}>Needs summary</span>
                          )}
                          {part.summary && <span className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">{part.summary}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                    {!isOlder && (
                      <button type="button" onClick={() => setEditing(index)} disabled={!lesson} className={SECONDARY_BUTTON} data-testid="part-edit">
                        <Pencil size={13} /> {finished ? 'Edit part' : 'Set part'}
                      </button>
                    )}
                    <button type="button" aria-label="Move up" disabled={index === 0} onClick={() => setSteps(moveItem(steps, index, -1))} className={ICON_BUTTON}>
                      <ArrowUp size={14} />
                    </button>
                    <button type="button" aria-label="Move down" disabled={index === steps.length - 1} onClick={() => setSteps(moveItem(steps, index, 1))} className={ICON_BUTTON}>
                      <ArrowDown size={14} />
                    </button>
                    {days.length > 1 && (
                      <select
                        aria-label="Move to another day"
                        value=""
                        onChange={(event) => moveToDay(index, Number(event.target.value))}
                        className={`${INPUT_STYLE} !w-auto !py-1.5 !text-xs cursor-pointer`}
                      >
                        <option value="">Move to…</option>
                        {days.map((_, dayIndex) =>
                          dayIndex === current ? null : (
                            <option key={dayIndex} value={dayIndex}>
                              Day {dayIndex + 1}
                            </option>
                          )
                        )}
                      </select>
                    )}
                    <button type="button" aria-label="Remove part" onClick={() => removeStep(index)} className={`${ICON_BUTTON} hover:!text-rose-500`}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>

          {steps.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <button type="button" onClick={() => setPicking(true)} disabled={steps.length >= MAX_PARTS} className={SECONDARY_BUTTON}>
                <ListPlus size={14} /> Add summaries from the syllabus
              </button>
              {current < days.length - 1 && (
                <button type="button" onClick={() => setChosenDay(current + 1)} className={SECONDARY_BUTTON}>
                  Plan Day {current + 2} <ChevronRight size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {picking && day && (
        <SyllabusPicker
          chapters={chapters}
          lessons={lessons}
          summaries={summaries}
          alreadyIn={inThisDay}
          dayNumber={current + 1}
          onAdd={addParts}
          onClose={() => setPicking(false)}
        />
      )}
      {editing !== null && editingLesson && (
        <PartEditor
          lesson={editingLesson}
          part={partOf(steps[editing])}
          dayNumber={current + 1}
          onSave={(changes) => savePart(editing, changes)}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
