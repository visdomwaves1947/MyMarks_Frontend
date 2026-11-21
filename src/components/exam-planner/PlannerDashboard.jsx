import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Video, FileText, CheckSquare, Tag, ArrowRight, ChevronLeft, ChevronRight, ExternalLink, Play, Lock, LogIn, ShoppingCart, ListVideo, Target } from 'lucide-react';
import { daysLabel, partLength, partOf, partsSummary, planDays } from '../course/roadmapPlan';
import { formatClock } from '../../utils/watchTime';
import { readProgress, writeProgress } from './plannerProgress';

const RESOURCE_STYLES = {
  video: { icon: Video, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-200 dark:border-rose-800' },
  notes: { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' },
  quiz: { icon: CheckSquare, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800' },
  tag: { icon: Tag, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800' },
};

// The old subject pages bring no plan of their own, so they still show this Mathematics plan
const FALLBACK_STEPS = [
  {
    time: '00-15 MINUTES',
    title: 'Algebra Basics & High-Yield Equations',
    desc: 'Learn crucial algebraic identities and quadratic formulas. Focus on high-weightage equation patterns commonly asked in Board Exams.',
    resources: [
      { kind: 'video', text: 'Algebra Shortcuts (8 mins)' },
      { kind: 'notes', text: 'Quadratic Formula Sheet' },
      { kind: 'quiz', text: 'Linear Equations Quiz (5 Qs)' },
      { kind: 'tag', text: 'High-Yield Identities' },
    ],
  },
  {
    time: '15-30 MINUTES',
    title: 'Essential Geometry Theorems',
    desc: 'Master the most critical geometry proofs: Pythagoras theorem, Basic Proportionality (Thales), and Circle tangents across all variations.',
    resources: [
      { kind: 'video', text: 'Theorem Memorizer (6 mins)' },
      { kind: 'notes', text: 'Top 3 Proof Sheets' },
      { kind: 'quiz', text: 'Triangles Match Quiz (5 Qs)' },
    ],
  },
  {
    time: '30-45 MINUTES',
    title: 'High-Yield One-Mark Questions',
    desc: 'Review top 10 most frequently repeated one-mark questions from Trigonometry & Statistics sections. Memorize formulas and contexts.',
    resources: [
      { kind: 'video', text: 'One-Mark Board Qs Breakdown (5 mins)' },
      { kind: 'notes', text: 'One-Mark Master List PDF' },
      { kind: 'quiz', text: 'One-Mark Board Practice (10 Qs)' },
    ],
  },
  {
    time: '45-60 MINUTES',
    title: 'Final Mock Bits & Presentation',
    desc: 'Complete a 15-question fast-paced mock paper section. Learn the exact order in which to write answers and how to leave a great impression on the examiner.',
    resources: [
      { kind: 'video', text: 'Exam Hall Presentation Secrets' },
      { kind: 'notes', text: '1-Hour Exam Cheat Sheet' },
    ],
  },
];

const twoDigits = (number) => String(number).padStart(2, '0');

// A day with nothing planned is left for revising the days before
const stepCountLabel = (count) => (count === 0 ? 'Revision' : `${count} ${count === 1 ? 'step' : 'steps'}`);

const isLink = (resource) => (resource.kind === 'notes' || resource.kind === 'quiz') && Boolean(resource.url);

const CARD = 'rounded-2xl bg-white dark:bg-[#131927] border border-slate-200 dark:border-slate-800';

function Chip({ children, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  };
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${tones[tone]}`}>{children}</span>;
}

// How much of the plan is done, as a small ring
function ProgressRing({ percent }) {
  const radius = 20;
  const length = 2 * Math.PI * radius;
  return (
    <span className="relative w-12 h-12 shrink-0">
      <svg viewBox="0 0 48 48" className="w-12 h-12 -rotate-90" aria-hidden="true">
        <circle cx="24" cy="24" r={radius} fill="none" strokeWidth="5" className="stroke-slate-100 dark:stroke-slate-800" />
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={length}
          strokeDashoffset={length - (length * percent) / 100}
          className="stroke-emerald-500 transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-slate-700 dark:text-slate-200">{percent}%</span>
    </span>
  );
}

function DoneButton({ isDone, label, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isDone}
      aria-label={isDone ? `${label} done` : `Mark ${label.toLowerCase()} done`}
      className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
        isDone ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 hover:text-emerald-500'
      }`}
    >
      <Check size={12} strokeWidth={3} />
    </button>
  );
}

/**
 * A roadmap day by day: the plan and its progress, the days, and the open day's parts. A course page
 * passes how to play its parts (partInfo, onPlayPart, onPlayDay) and keeps the progress itself
 * (progress, onProgressChange), so it can follow the student's account.
 */
export default function PlannerDashboard({
  planData,
  onOpenLesson,
  canOpenLesson = () => false,
  progressKey,
  progress: givenProgress = null,
  onProgressChange = null,
  partInfo = null,
  onPlayPart = null,
  onPlayDay = null,
}) {
  const days = useMemo(() => {
    const found = planDays(planData);
    return found.length > 0 ? found : [{ title: '', desc: '', steps: FALLBACK_STEPS }];
  }, [planData]);
  const hasOwnDays = planDays(planData).length > 0;
  const dayTotal = hasOwnDays ? days.length : Number(planData?.duration) || 1;

  const [ownProgress, setOwnProgress] = useState(() => readProgress(progressKey));
  const progress = givenProgress || ownProgress;
  const dayIndex = Math.min(progress.day, days.length - 1);

  // Keeps the open day's tab in view on a narrow screen, also when the arrows change the day
  const activeTabRef = useRef(null);
  useEffect(() => {
    activeTabRef.current?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [dayIndex]);
  const day = days[dayIndex];
  const done = useMemo(() => new Set(progress.done), [progress.done]);

  const saveProgress = (changes) => {
    if (onProgressChange) {
      onProgressChange({ ...progress, ...changes });
      return;
    }
    setOwnProgress((previous) => {
      const next = { ...previous, ...changes };
      writeProgress(progressKey, next);
      return next;
    });
  };

  const stepId = (dayNumber, stepNumber) => `${dayNumber}-${stepNumber}`;
  const toggleDone = (id) =>
    saveProgress({ done: done.has(id) ? progress.done.filter((item) => item !== id) : [...progress.done, id] });
  const chooseDay = (index) => saveProgress({ day: index });

  const totalSteps = days.reduce((sum, item) => sum + (item.steps || []).length, 0);
  const doneSteps = days.reduce(
    (sum, item, index) => sum + (item.steps || []).filter((_, stepIndex) => done.has(stepId(index, stepIndex))).length,
    0
  );
  const percent = totalSteps ? Math.round((doneSteps / totalSteps) * 100) : 0;
  // A roadmap made only of video parts counts parts, not steps
  const allParts = totalSteps > 0 && days.every((item) => (item.steps || []).every((step) => partOf(step)));
  const isDayDone = (index) =>
    (days[index].steps || []).length > 0 &&
    days[index].steps.every((_, stepIndex) => done.has(stepId(index, stepIndex)));
  const dayDoneCount = (index) => (days[index].steps || []).filter((_, stepIndex) => done.has(stepId(index, stepIndex))).length;

  const canOpen = (resource) => (resource.kind === 'video' && resource.nodeId && canOpenLesson(resource.nodeId)) || isLink(resource);
  const openResource = (resource) => {
    if (isLink(resource)) window.open(resource.url, '_blank', 'noopener,noreferrer');
    else onOpenLesson?.(resource.nodeId);
  };

  const planTitle = planData?.title || planData?.planTitle || daysLabel(dayTotal);

  const planSteps = (day.steps || []).map((step, index) => ({
    id: stepId(dayIndex, index),
    number: index + 1,
    time: step.time,
    title: step.title,
    desc: step.desc,
    resources: step.resources || [],
    part: partOf(step),
  }));
  const dayParts = planSteps.filter((step) => step.part);
  const dayMeta = dayParts.length > 0 ? partsSummary(dayParts.map((step) => ({ resources: [step.part] }))) : planSteps.length > 0 ? stepCountLabel(planSteps.length) : '';
  const arrowButton =
    'w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed';

  const renderPart = (step, stepIndex) => {
    const isDone = done.has(step.id);
    const info = partInfo?.(step.part) || {};
    const seconds = partLength(step.part);
    const action =
      info.state === 'sign-in'
        ? { label: 'Sign in to watch', icon: LogIn }
        : info.state === 'buy' || info.state === 'enroll'
          ? { label: info.state === 'buy' ? 'Buy to watch' : 'Enroll to watch', icon: ShoppingCart }
          : info.state === 'missing'
            ? null
            : { label: 'Play part', icon: Play };
    const ActionIcon = action?.icon;
    return (
      <article
        key={step.id}
        data-testid="plan-part"
        className={`bg-white dark:bg-[#131927] border rounded-xl overflow-hidden flex flex-col hover:shadow-md transition-shadow ${
          isDone ? 'border-emerald-300 dark:border-emerald-800' : 'border-slate-200 dark:border-slate-800'
        }`}
      >
        <button
          type="button"
          disabled={!action}
          onClick={() => onPlayPart?.(dayIndex, stepIndex)}
          aria-label={action ? `${action.label}: ${step.title}` : step.title}
          className="relative aspect-video bg-slate-900 group cursor-pointer disabled:cursor-default"
        >
          {info.thumbnail && <img src={info.thumbnail} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100" />}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              {info.state && info.state !== 'play' ? <Lock size={14} /> : <Play size={15} fill="currentColor" />}
            </span>
          </span>
          <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/75 text-white text-[10px] font-bold">
            {formatClock(step.part.start)}–{formatClock(step.part.end)}
          </span>
        </button>
        <div className="p-3 flex flex-col flex-1">
          <div className="flex justify-between items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Part {twoDigits(step.number)} · {seconds < 60 ? `${Math.round(seconds)} sec` : `${Math.round(seconds / 60)} min`}
            </span>
            <DoneButton isDone={isDone} label={`Part ${twoDigits(step.number)}`} onToggle={() => toggleDone(step.id)} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{step.title || step.part.text}</h3>
          {info.chapterLine && <p className="text-[10.5px] text-slate-400 dark:text-slate-500 truncate mb-1">{info.chapterLine}</p>}
          <p data-testid="plan-part-summary" title={step.part.summary} className="text-xs text-slate-600 dark:text-slate-300 leading-snug line-clamp-3">
            {step.part.summary}
          </p>
          {step.part.points?.length > 0 && (
            <ul className="mt-1.5 list-disc pl-4 space-y-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              {step.part.points.slice(0, 3).map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          )}
          {action ? (
            <button
              type="button"
              data-testid="plan-play-part"
              onClick={() => onPlayPart?.(dayIndex, stepIndex)}
              className="mt-3 pt-0 w-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-800 dark:text-slate-200 font-semibold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ActionIcon size={12} /> {action.label}
            </button>
          ) : (
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">This lesson is not available right now.</p>
          )}
        </div>
      </article>
    );
  };

  // Steps from before parts: a whole lesson, notes, a quiz or a tag
  const renderStep = (step) => {
    const isDone = done.has(step.id);
    const firstAction = step.resources.find(canOpen);
    return (
      <article
        key={step.id}
        data-testid="plan-step"
        className={`bg-white dark:bg-[#131927] border rounded-xl p-4 flex flex-col hover:shadow-md transition-shadow ${
          isDone ? 'border-emerald-300 dark:border-emerald-800' : 'border-slate-200 dark:border-slate-800'
        }`}
      >
        <div className="flex justify-between items-center gap-2 mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Step {twoDigits(step.number)}
            {step.time ? ` · ${step.time}` : ''}
          </span>
          <DoneButton isDone={isDone} label={`Step ${twoDigits(step.number)}`} onToggle={() => toggleDone(step.id)} />
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug mb-1">{step.title}</h3>
        {step.desc && <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug line-clamp-4 mb-2">{step.desc}</p>}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {step.resources.map((resource, i) => {
            const style = RESOURCE_STYLES[resource.kind] || RESOURCE_STYLES.tag;
            const TagIcon = style.icon;
            const chipStyle = `flex items-center gap-1 px-2 py-1 rounded-md border ${style.border} ${style.bg} ${style.color} w-fit max-w-full`;
            const content = (
              <>
                <TagIcon size={11} className="shrink-0" />
                <span className="text-[10px] font-semibold truncate">{resource.text}</span>
              </>
            );
            return canOpen(resource) ? (
              <button
                key={i}
                onClick={() => openResource(resource)}
                title={isLink(resource) ? 'Opens in a new tab' : 'Watch this lesson'}
                className={`${chipStyle} cursor-pointer hover:brightness-95`}
              >
                {content}
                {isLink(resource) ? <ExternalLink size={10} className="shrink-0" /> : <Play size={10} className="shrink-0" />}
              </button>
            ) : (
              <div key={i} className={chipStyle}>
                {content}
              </div>
            );
          })}
        </div>
        <button
          onClick={() => (firstAction ? openResource(firstAction) : toggleDone(step.id))}
          className="mt-auto w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {firstAction ? (
            <>
              Start Step {twoDigits(step.number)} <ArrowRight size={12} />
            </>
          ) : isDone ? (
            <>
              Step {twoDigits(step.number)} Done <Check size={12} />
            </>
          ) : (
            <>
              Mark Step {twoDigits(step.number)} Done <Check size={12} />
            </>
          )}
        </button>
      </article>
    );
  };

  return (
    <div className="min-h-full bg-slate-50 dark:bg-[#0B0F19] animate-in fade-in duration-300">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4">
        {/* The plan: its name, level and target, and how much is done */}
        <section className={`${CARD} p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4`}>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <Chip tone="blue">{daysLabel(dayTotal)} plan</Chip>
              {planData?.level && <Chip>{planData.level}</Chip>}
              {planData?.expectedScore && (
                <Chip tone="green">
                  <Target size={11} /> Target {planData.expectedScore}
                </Chip>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{planTitle}</h1>
            {planData?.desc && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{planData.desc}</p>}
          </div>
          <div data-testid="plan-progress" className="flex items-center gap-3 shrink-0 sm:pl-5 sm:border-l border-slate-100 dark:border-slate-800">
            <ProgressRing percent={percent} />
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {doneSteps} of {totalSteps} {allParts ? 'parts' : 'steps'} done
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your progress</p>
            </div>
          </div>
        </section>

        {/* The days, for plans longer than one day */}
        {days.length > 1 && (
          <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0 pb-0.5" role="tablist" aria-label="Days">
            {days.map((item, index) => {
              const isActive = index === dayIndex;
              const isComplete = isDayDone(index);
              const count = (item.steps || []).length;
              return (
                <button
                  key={index}
                  role="tab"
                  aria-selected={isActive}
                  ref={isActive ? activeTabRef : undefined}
                  onClick={() => chooseDay(index)}
                  className={`shrink-0 max-w-[230px] flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                      : 'bg-white dark:bg-[#131927] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-300'
                  }`}
                >
                  <span
                    className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isComplete
                        ? 'bg-emerald-500 text-white'
                        : isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {isComplete ? <Check size={13} strokeWidth={3} /> : index + 1}
                  </span>
                  <span className="min-w-0">
                    <span className={`block text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'}`}>
                      Day {index + 1}
                      {count > 0 ? ` · ${dayDoneCount(index)}/${count}` : ''}
                    </span>
                    <span className="block text-xs font-semibold truncate">{item.title || stepCountLabel(count)}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* The open day: its title, what is in it, and its parts */}
        <section className={`${CARD} p-4 sm:p-5`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Day {dayIndex + 1} of {days.length}
                {dayMeta ? ` · ${dayMeta}` : ''}
              </p>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                {day.title || (planSteps.length > 0 ? `Day ${dayIndex + 1}` : 'Revision')}
              </h2>
              {day.desc && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{day.desc}</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {days.length > 1 && (
                <>
                  <button onClick={() => chooseDay(dayIndex - 1)} disabled={dayIndex === 0} aria-label="Previous day" className={arrowButton}>
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={() => chooseDay(dayIndex + 1)} disabled={dayIndex === days.length - 1} aria-label="Next day" className={arrowButton}>
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
              {dayParts.length > 0 && onPlayDay && (
                <button
                  type="button"
                  data-testid="plan-play-day"
                  onClick={() => onPlayDay(dayIndex)}
                  className="h-8 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ListVideo size={15} /> Play the day
                </button>
              )}
            </div>
          </div>

          {planSteps.length === 0 ? (
            <p className="mt-4 text-center py-8 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-sm text-slate-500 dark:text-slate-400">
              Nothing is planned for this day yet. Use it to revise the days before.
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {planSteps.map((step, stepIndex) => (step.part ? renderPart(step, stepIndex) : renderStep(step)))}
            </div>
          )}

          {days.length > 1 && dayIndex < days.length - 1 && planSteps.length > 0 && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => chooseDay(dayIndex + 1)}
                className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Go to Day {dayIndex + 2} <ArrowRight size={14} />
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Hide scrollbar CSS */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `,
        }}
      />
    </div>
  );
}
