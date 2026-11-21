import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bookmark, X, Check, Video, FileText, CheckSquare, Tag, ArrowRight, ChevronLeft, ChevronRight, ExternalLink, Play, Lock, LogIn, ShoppingCart, ListVideo } from 'lucide-react';
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

/**
 * A roadmap day by day. A course page passes how to play its parts (partInfo, onPlayPart, onPlayDay) and
 * keeps the progress itself (progress, onProgressChange), so it can follow the student's account.
 */
export default function PlannerDashboard({
  planData,
  onRestart,
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
  // A roadmap made only of video parts counts parts, not steps
  const allParts = totalSteps > 0 && days.every((item) => (item.steps || []).every((step) => partOf(step)));
  const isDayDone = (index) =>
    (days[index].steps || []).length > 0 &&
    days[index].steps.every((_, stepIndex) => done.has(stepId(index, stepIndex)));

  const canOpen = (resource) => (resource.kind === 'video' && resource.nodeId && canOpenLesson(resource.nodeId)) || isLink(resource);
  const openResource = (resource) => {
    if (isLink(resource)) window.open(resource.url, '_blank', 'noopener,noreferrer');
    else onOpenLesson?.(resource.nodeId);
  };

  const durationText = `${daysLabel(dayTotal)} Plan${planData?.level ? ` • ${planData.level}` : ''}`.toUpperCase();
  const planTitle = (planData?.title || planData?.planTitle || daysLabel(dayTotal)).toUpperCase();
  const planSubtitle = planData?.expectedScore ? `Target Score: ${planData.expectedScore}` : 'Perfect for students with almost no preparation. Secures minimum passing marks.';

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

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] dark:bg-[#0B0F19] overflow-y-auto overflow-x-hidden animate-in fade-in duration-500 pb-12">

      {/* Top Blue Banner Section */}
      <div className="bg-[#2A75D3] text-white px-6 py-8 sm:px-10 shrink-0 relative">
        {/* Actions */}
        <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
          <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-colors">
            <Bookmark size={18} fill="currentColor" />
          </button>
          <button onClick={onRestart} aria-label="Close plan" className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="inline-block bg-[#3B82F6]/50 text-white font-bold px-4 py-1.5 rounded-full text-xs tracking-wider mb-4 border border-blue-400/30">
            {durationText}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-3 tracking-tight text-white pr-24">{planTitle}</h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-2xl font-medium">
            {planSubtitle}
          </p>
          {planData?.desc && <p className="text-blue-100/80 text-xs sm:text-sm max-w-2xl mt-1">{planData.desc}</p>}

          {/* Progress */}
          <div className="mt-5 max-w-md" data-testid="plan-progress">
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-blue-100 mb-1.5">
              <span>Your Progress</span>
              <span>{doneSteps} of {totalSteps} {allParts ? 'parts' : 'steps'} done</span>
            </div>
            <div className="h-2 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${totalSteps ? Math.round((doneSteps / totalSteps) * 100) : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">

        {/* Day Picker, for plans longer than one day */}
        {days.length > 1 && (
          <div className="mb-8">
            <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Days">
              {days.map((item, index) => {
                const isActive = index === dayIndex;
                const isComplete = isDayDone(index);
                return (
                  <button
                    key={index}
                    role="tab"
                    aria-selected={isActive}
                    ref={isActive ? activeTabRef : undefined}
                    onClick={() => chooseDay(index)}
                    className={`shrink-0 min-w-[96px] max-w-[180px] text-left px-3.5 py-2.5 rounded-2xl border transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#2A75D3] border-[#2A75D3] text-white shadow-md'
                        : 'bg-white dark:bg-[#131927] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-300'
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2 text-[10px] font-black uppercase tracking-widest">
                      <span>Day {index + 1}</span>
                      {isComplete && (
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center ${isActive ? 'bg-white text-[#2A75D3]' : 'bg-emerald-500 text-white'}`}>
                          <Check size={10} strokeWidth={4} />
                        </span>
                      )}
                    </span>
                    <span className={`block text-xs font-bold truncate mt-0.5 ${isActive ? 'text-blue-50' : 'text-slate-500 dark:text-slate-400'}`}>
                      {item.title || stepCountLabel((item.steps || []).length)}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[11px] font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                  Day {dayIndex + 1} of {days.length}
                </div>
                {day.title && <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">{day.title}</h2>}
                {day.desc && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{day.desc}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => chooseDay(dayIndex - 1)}
                  disabled={dayIndex === 0}
                  aria-label="Previous day"
                  className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => chooseDay(dayIndex + 1)}
                  disabled={dayIndex === days.length - 1}
                  aria-label="Next day"
                  className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {planSteps.length === 0 && (
          <div className="text-center py-14 px-4 bg-white dark:bg-[#131927] rounded-3xl border border-slate-200 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400">
            Nothing is planned for this day yet. Use it to revise the days before.
          </div>
        )}

        {/* The day's video parts, played back to back */}
        {dayParts.length > 0 && onPlayDay && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-[#131927] border border-slate-200 dark:border-slate-800">
            <div className="min-w-0">
              <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                {days.length > 1 ? `Day ${dayIndex + 1}: ` : ''}
                {partsSummary(dayParts.map((step) => ({ resources: [step.part] })))}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Each part plays only its own stretch of the lesson, with its summary beside it.</p>
            </div>
            <button
              type="button"
              data-testid="plan-play-day"
              onClick={() => onPlayDay(dayIndex)}
              className="shrink-0 px-5 py-3 rounded-[20px] bg-[#2A75D3] hover:bg-[#2366B9] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <ListVideo size={16} /> Play the day
            </button>
          </div>
        )}

        {/* Timeline Visualizer */}
        {planSteps.length > 0 && (
          <div className="hidden sm:block relative mb-12 mt-4 px-10">
            {/* Connecting Line */}
            <div className="absolute top-[18px] left-16 right-16 h-0.5 bg-slate-200 dark:bg-slate-700"></div>

            <div className="relative flex justify-between">
              {planSteps.map((step) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full border-[3px] flex items-center justify-center font-bold mb-3 relative z-10 text-sm shadow-sm ${
                    done.has(step.id)
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                  }`}>
                    {done.has(step.id) ? <Check size={16} strokeWidth={3} /> : step.number}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-white/50 dark:bg-slate-900/50 px-2 py-1 rounded">
                    {step.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Horizontal Scrollable Cards */}
        <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar min-h-0 shrink-0 -mx-4 px-4 sm:mx-0 sm:px-0">
          {planSteps.map((step, stepIndex) => {
            const isDone = done.has(step.id);
            const firstAction = step.resources.find(canOpen);
            if (step.part) {
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
                <div
                  key={step.id}
                  data-testid="plan-part"
                  className={`snap-center shrink-0 w-[85vw] sm:w-[350px] bg-white dark:bg-[#131927] border rounded-3xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow ${
                    isDone ? 'border-emerald-200 dark:border-emerald-900/50' : 'border-cyan-100 dark:border-cyan-900/30'
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
                      <span className="w-12 h-12 rounded-full bg-black/60 text-white flex items-center justify-center">
                        {info.state && info.state !== 'play' ? <Lock size={18} /> : <Play size={20} fill="currentColor" />}
                      </span>
                    </span>
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/75 text-white text-[11px] font-bold">
                      {formatClock(step.part.start)}–{formatClock(step.part.end)}
                    </span>
                  </button>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start gap-3 mb-2">
                      <div className="bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 font-bold text-[10px] px-3 py-1.5 rounded-full uppercase tracking-wider">
                        PART {twoDigits(step.number)} • {seconds < 60 ? `${Math.round(seconds)} SEC` : `${Math.round(seconds / 60)} MIN`}
                      </div>
                      <button
                        onClick={() => toggleDone(step.id)}
                        aria-pressed={isDone}
                        aria-label={isDone ? `Part ${twoDigits(step.number)} done` : `Mark part ${twoDigits(step.number)} done`}
                        className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                          isDone ? 'bg-emerald-500 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 hover:text-emerald-500'
                        }`}
                      >
                        <Check size={14} strokeWidth={3} />
                      </button>
                    </div>
                    {info.chapterLine && <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{info.chapterLine}</p>}
                    <h3 className="text-[17px] font-extrabold text-slate-900 dark:text-white mb-2 leading-snug">{step.title || step.part.text}</h3>
                    <p data-testid="plan-part-summary" className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed mb-3">{step.part.summary}</p>
                    {step.part.points?.length > 0 && (
                      <ul className="list-disc pl-5 space-y-0.5 text-[12.5px] text-slate-600 dark:text-slate-400 mb-4">
                        {step.part.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    )}
                    {action ? (
                      <button
                        type="button"
                        data-testid="plan-play-part"
                        onClick={() => onPlayPart?.(dayIndex, stepIndex)}
                        className="mt-auto w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm py-3.5 rounded-[20px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ActionIcon size={14} /> {action.label}
                      </button>
                    ) : (
                      <p className="mt-auto text-xs text-slate-500 dark:text-slate-400">This lesson is not available right now.</p>
                    )}
                  </div>
                </div>
              );
            }
            return (
              <div
                key={step.id}
                data-testid="plan-step"
                className={`snap-center shrink-0 w-[85vw] sm:w-[350px] bg-white dark:bg-[#131927] border rounded-3xl p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow relative ${
                  isDone ? 'border-emerald-200 dark:border-emerald-900/50' : 'border-cyan-100 dark:border-cyan-900/30'
                }`}
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 font-bold text-[10px] px-3 py-1.5 rounded-full uppercase tracking-wider">
                    STEP {twoDigits(step.number)}{step.time ? ` • ${step.time}` : ''}
                  </div>
                  <button
                    onClick={() => toggleDone(step.id)}
                    aria-pressed={isDone}
                    aria-label={isDone ? `Step ${twoDigits(step.number)} done` : `Mark step ${twoDigits(step.number)} done`}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                      isDone
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 hover:text-emerald-500'
                    }`}
                  >
                    <Check size={14} strokeWidth={3} />
                  </button>
                </div>

                {/* Title & Description */}
                <h3 className="text-[17px] font-extrabold text-slate-900 dark:text-white mb-3 leading-snug">
                  {step.title}
                </h3>
                {step.desc ? (
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed mb-6 flex-1 min-h-[90px]">
                    {step.desc}
                  </p>
                ) : (
                  <div className="flex-1" />
                )}

                {/* Tags List */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {step.resources.map((resource, i) => {
                    const style = RESOURCE_STYLES[resource.kind] || RESOURCE_STYLES.tag;
                    const TagIcon = style.icon;
                    const chipStyle = `flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border ${style.border} ${style.bg} ${style.color} w-fit max-w-full`;
                    const content = (
                      <>
                        <TagIcon size={12} className="shrink-0" />
                        <span className="text-[10px] font-bold truncate tracking-wide">{resource.text}</span>
                      </>
                    );
                    return canOpen(resource) ? (
                      <button
                        key={i}
                        onClick={() => openResource(resource)}
                        title={isLink(resource) ? 'Opens in a new tab' : 'Watch this lesson'}
                        className={`${chipStyle} cursor-pointer hover:brightness-95 hover:shadow-sm`}
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

                {/* Action Button */}
                <button
                  onClick={() => (firstAction ? openResource(firstAction) : toggleDone(step.id))}
                  className="mt-auto w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm py-3.5 rounded-[20px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {firstAction ? (
                    <>Start Step {twoDigits(step.number)} <ArrowRight size={14} /></>
                  ) : isDone ? (
                    <>Step {twoDigits(step.number)} Done <Check size={14} /></>
                  ) : (
                    <>Mark Step {twoDigits(step.number)} Done <Check size={14} /></>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Next Day */}
        {days.length > 1 && dayIndex < days.length - 1 && planSteps.length > 0 && (
          <div className="flex justify-end">
            <button
              onClick={() => chooseDay(dayIndex + 1)}
              className="px-5 py-3 rounded-[20px] bg-[#2A75D3] hover:bg-[#2366B9] text-white font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              Go to Day {dayIndex + 2} <ArrowRight size={14} />
            </button>
          </div>
        )}

      </div>

      {/* Hide scrollbar CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
