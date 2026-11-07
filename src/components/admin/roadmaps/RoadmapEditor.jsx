import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ListChecks, WandSparkles } from 'lucide-react';
import useDialog from '../../../hooks/useDialog';
import { RESOURCE_KINDS, countPlan } from '../../course/roadmapPlan';
import { Field, ICON_BUTTON, INPUT_STYLE, RepeatList, SECONDARY_BUTTON, TextArea, TextInput } from '../courses/fields';
import { MAX_DAYS, blankDay, dayCountProblem, linkProblem, spreadLessons } from './roadmapDrafts';

const BLANK_STEP = { time: '', title: '', desc: '', resources: [] };
const BLANK_RESOURCE = { kind: 'video', text: '', nodeId: '', url: '' };

const CARD_NUMBERS = [
  ['modules', 'Modules'],
  ['tests', 'Tests'],
  ['notes', 'Notes'],
  ['videos', 'Videos'],
];

const LABEL_STYLE = 'block text-xs font-bold text-slate-700 dark:text-slate-300';
const HINT_STYLE = 'text-[11px] text-slate-500 dark:text-slate-400';

const dayChipStyle = (isActive, isPlanned) =>
  `min-w-[64px] px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
    isActive
      ? 'bg-blue-600 border-blue-600 text-white'
      : isPlanned
        ? 'bg-white dark:bg-slate-900 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300'
        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
  }`;

function LessonSelect({ value, options, onChange }) {
  const groups = useMemo(() => {
    const byChapter = new Map();
    options.forEach((option) => {
      if (!byChapter.has(option.chapterName)) byChapter.set(option.chapterName, []);
      byChapter.get(option.chapterName).push(option);
    });
    return [...byChapter.entries()];
  }, [options]);

  const isMissing = Boolean(value) && !options.some((option) => option.nodeId === value);

  return (
    <Field
      label="Lesson"
      error={isMissing ? 'This lesson is no longer in the course. Choose another one.' : ''}
      hint={value ? 'Opens in the course player.' : 'With no lesson chosen, students see this as a label only.'}
    >
      <select
        value={value || ''}
        onChange={(event) => onChange(options.find((option) => option.nodeId === event.target.value) || null)}
        className={`${INPUT_STYLE} cursor-pointer`}
      >
        <option value="">{options.length > 0 ? 'Choose a lesson' : 'This course has no lessons yet'}</option>
        {isMissing && <option value={value}>Missing lesson</option>}
        {groups.map(([chapter, items]) => (
          <optgroup key={chapter} label={chapter || 'Lessons'}>
            {items.map((option) => (
              <option key={option.nodeId} value={option.nodeId}>
                {`${'- '.repeat(option.depth)}${option.label}`}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </Field>
  );
}

function ResourceFields({ resource, change, lessons }) {
  const chooseLesson = (option) => {
    // The label follows the lesson unless the admin typed their own
    const previous = lessons.find((item) => item.nodeId === resource.nodeId);
    const isOwnLabel = resource.text && resource.text !== previous?.label;
    change({ nodeId: option?.nodeId || '', text: isOwnLabel ? resource.text : option?.label || '' });
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Field label="Kind">
          <select
            value={resource.kind}
            onChange={(event) => change({ kind: event.target.value })}
            className={`${INPUT_STYLE} cursor-pointer`}
          >
            {RESOURCE_KINDS.map((kind) => (
              <option key={kind.value} value={kind.value}>{kind.label}</option>
            ))}
          </select>
        </Field>
        <div className="sm:col-span-2">
          <TextInput
            label="Label"
            value={resource.text}
            onChange={(text) => change({ text })}
            placeholder={resource.kind === 'tag' ? 'e.g. High-Yield Identities' : 'e.g. Formula Sheet'}
          />
        </div>
      </div>
      {resource.kind === 'video' && <LessonSelect value={resource.nodeId} options={lessons} onChange={chooseLesson} />}
      {(resource.kind === 'notes' || resource.kind === 'quiz') && (
        <TextInput
          label="Link"
          hint={
            resource.url
              ? 'Opens in a new tab.'
              : 'An https:// link, such as a PDF or a Google Form, or a page on this site. Without one, students see a label only.'
          }
          error={linkProblem(resource.url)}
          value={resource.url}
          onChange={(url) => change({ url })}
          placeholder="https://"
        />
      )}
    </div>
  );
}

/**
 * One roadmap: its card, its number of days and each day's steps.
 * takenDays holds the day counts the subject's other roadmaps already use.
 */
export default function RoadmapEditor({ roadmap, lessons, problems, takenDays, subject, onChange }) {
  const { confirm } = useDialog();
  const days = roadmap.days || [];
  const [chosenDay, setChosenDay] = useState(0);
  const [dayInput, setDayInput] = useState(String(days.length || 1));
  const [dayError, setDayError] = useState('');

  const current = Math.min(chosenDay, Math.max(days.length - 1, 0));
  const day = days[current];
  const counted = countPlan(roadmap);

  const change = (changes) => onChange({ ...roadmap, ...changes });
  const setDays = (next) => change({ days: next, duration: Math.max(next.length, 1) });
  const setDay = (index, changes) =>
    setDays(days.map((item, itemIndex) => (itemIndex === index ? { ...item, ...changes } : item)));

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
          message:
            removed === 1
              ? 'It has steps, and those steps will be removed.'
              : `${planned} of them have steps, and those steps will be removed.`,
          confirmLabel: 'Remove Days',
          tone: 'danger',
        });
        if (!ok) {
          setDayInput(String(days.length));
          return;
        }
      }
      setDays(days.slice(0, count));
    } else {
      setDays([...days, ...Array.from({ length: count - days.length }, blankDay)]);
    }
  };

  const fillFromLessons = async () => {
    if (days.some((item) => item.steps?.length > 0)) {
      const ok = await confirm({
        title: 'Replace the steps with lessons?',
        message: 'Each day gets the next lessons of the syllabus, and the steps it has now are replaced.',
        confirmLabel: 'Fill Days',
      });
      if (!ok) return;
    }
    setDays(spreadLessons(lessons, days.length > 0 ? days : [blankDay()]));
  };

  return (
    <div className="space-y-4">
      {problems.length > 0 && (
        <div
          role="alert"
          className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200"
        >
          <p className="text-xs font-bold mb-1">Fix this before saving:</p>
          <ul className="list-disc pl-4 space-y-0.5 text-xs">
            {problems.map((problem) => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <TextInput
          label="Title"
          required
          value={roadmap.title}
          onChange={(title) => change({ title })}
          error={roadmap.title?.trim() ? '' : 'Add a title. Students see it on the roadmap card.'}
        />
        <TextInput label="Level" value={roadmap.level} onChange={(level) => change({ level })} placeholder="e.g. INTERMEDIATE" />
        <TextInput
          label="Expected score"
          value={roadmap.expectedScore}
          onChange={(expectedScore) => change({ expectedScore })}
          placeholder="e.g. 60-65 / 75"
        />
      </div>
      <TextArea label="Description" rows={2} value={roadmap.desc} onChange={(desc) => change({ desc })} />

      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
          <span className={LABEL_STYLE}>Card numbers</span>
          <button type="button" onClick={() => change({ stats: counted })} className={SECONDARY_BUTTON}>
            <ListChecks size={14} />
            <span>Count from Plan</span>
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CARD_NUMBERS.map(([key, label]) => (
            <TextInput
              key={key}
              label={label}
              type="number"
              min="0"
              value={roadmap.stats?.[key]}
              onChange={(value) => change({ stats: { ...(roadmap.stats || {}), [key]: value } })}
            />
          ))}
        </div>
        <p className={`mt-1 ${HINT_STYLE}`}>
          The plan has {counted.modules} steps, {counted.videos} videos, {counted.notes} notes and {counted.tests} tests.
        </p>
      </div>

      <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
          <div className="min-w-0">
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
              <p role="alert" className="mt-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 max-w-sm">
                {dayError}
              </p>
            )}
          </div>
          <div className="md:text-right">
            <button
              type="button"
              onClick={fillFromLessons}
              disabled={lessons.length === 0}
              className={`${SECONDARY_BUTTON} md:ml-auto`}
            >
              <WandSparkles size={14} />
              <span>Fill Days from Lessons</span>
            </button>
            <p className={`mt-1 ${HINT_STYLE}`}>
              {lessons.length > 0
                ? 'Spreads the syllabus over the days in order. You can change any step after.'
                : 'Add lessons to this course to pick them here.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Choose a day">
          {days.map((item, index) => (
            <button
              key={index}
              type="button"
              aria-pressed={index === current}
              onClick={() => setChosenDay(index)}
              className={dayChipStyle(index === current, item.steps?.length > 0)}
            >
              Day {index + 1}
              {item.steps?.length > 0 ? ` · ${item.steps.length}` : ''}
            </button>
          ))}
        </div>

        {day && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                Day {current + 1} of {days.length}
              </h4>
              <div className="flex items-center">
                <button
                  type="button"
                  aria-label="Previous day"
                  disabled={current === 0}
                  onClick={() => setChosenDay(current - 1)}
                  className={ICON_BUTTON}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  aria-label="Next day"
                  disabled={current === days.length - 1}
                  onClick={() => setChosenDay(current + 1)}
                  className={ICON_BUTTON}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <TextInput
                label="Day title"
                value={day.title}
                onChange={(title) => setDay(current, { title })}
                placeholder="e.g. Matrices and Determinants"
              />
              <TextInput
                label="Note for the day"
                value={day.desc}
                onChange={(desc) => setDay(current, { desc })}
                placeholder="e.g. Revise every formula before you sleep"
              />
            </div>

            <div>
              <span className={`${LABEL_STYLE} mb-1.5`}>Steps</span>
              <RepeatList
                items={day.steps}
                onChange={(steps) => setDay(current, { steps })}
                blank={BLANK_STEP}
                addLabel="Add Step"
                itemTitle={(step) => step.title}
                renderItem={(step, changeStep) => (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <TextInput
                        label="Time"
                        value={step.time}
                        onChange={(time) => changeStep({ time })}
                        placeholder="e.g. 09:00-10:30 or 2 hours"
                      />
                      <div className="sm:col-span-2">
                        <TextInput
                          label="Title"
                          value={step.title}
                          onChange={(title) => changeStep({ title })}
                          error={step.title?.trim() ? '' : 'Add a step title.'}
                        />
                      </div>
                    </div>
                    <TextArea label="What to do" rows={2} value={step.desc} onChange={(desc) => changeStep({ desc })} />
                    <div>
                      <span className={`${LABEL_STYLE} mb-1.5`}>Resources</span>
                      <RepeatList
                        items={step.resources}
                        onChange={(resources) => changeStep({ resources })}
                        blank={BLANK_RESOURCE}
                        addLabel="Add Resource"
                        itemTitle={(resource) => resource.text}
                        renderItem={(resource, changeResource) => (
                          <ResourceFields resource={resource} change={changeResource} lessons={lessons} />
                        )}
                      />
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
