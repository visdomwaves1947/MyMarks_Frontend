import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronDown, Eye, Plus, RefreshCw, Route, Save, Trash2 } from 'lucide-react';
import useDialog from '../../../hooks/useDialog';
import {
  fetchAdminCoursePage,
  fetchAdminRoadmapCourses,
  fetchAdminRoadmaps,
  saveAdminRoadmaps,
} from '../../../services/courseApi';
import { withExtraLessons } from '../../course/curriculumTree';
import { countPlan, daysLabel, hasPlan } from '../../course/roadmapPlan';
import { SkeletonForm } from '../AdminSkeleton';
import {
  ICON_BUTTON,
  INPUT_STYLE,
  PANEL_STYLE,
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
  TextInput,
  Toggle,
  moveItem,
} from '../courses/fields';
import RoadmapEditor from './RoadmapEditor';
import SubjectPicker from './SubjectPicker';
import { MAX_DAYS, dayCountProblem, editable, lessonOptions, newRoadmap, roadmapProblems } from './roadmapDrafts';

const QUICK_DAYS = [1, 3, 5, 7, 10, 15, 30];

const CHIP_STYLE = 'shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide';

const NO_WRAP = 'whitespace-nowrap shrink-0';

function LoadProblem({ message, onRetry }) {
  return (
    <div className={`${PANEL_STYLE} text-center py-10`}>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{message}</p>
      <button type="button" onClick={onRetry} className={`${PRIMARY_BUTTON} mx-auto`}>
        <RefreshCw size={14} />
        <span>Try Again</span>
      </button>
    </div>
  );
}

/**
 * Admin page for the study roadmaps on each course page: 1 day, 5 days, 30 days
 * or any number, each planned day by day with lessons, notes and tests.
 */
export default function RoadmapsTab({ showToast }) {
  const { confirm } = useDialog();
  const [courses, setCourses] = useState(null);
  const [listError, setListError] = useState('');
  const [courseId, setCourseId] = useState('');
  const [reloadCount, setReloadCount] = useState(0);
  const [loaded, setLoaded] = useState(null); // { course, chapters }
  const [loadError, setLoadError] = useState('');
  const [draft, setDraft] = useState(null);
  const [savedCopy, setSavedCopy] = useState('');
  const [openIndex, setOpenIndex] = useState(-1);
  const [customDays, setCustomDays] = useState('');
  const [addError, setAddError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const loadList = useCallback(
    () =>
      fetchAdminRoadmapCourses()
        // No subject opens by itself, so the admin always picks the one to change
        .then(setCourses)
        .catch((error) => setListError(error.message)),
    []
  );

  useEffect(() => {
    loadList();
  }, [loadList]);

  const retryList = () => {
    setListError('');
    loadList();
  };

  const showLoaded = useCallback((view) => {
    const next = editable(view);
    setDraft(next);
    setSavedCopy(JSON.stringify(next));
  }, []);

  useEffect(() => {
    if (!courseId) return undefined;
    let isCurrent = true;

    fetchAdminRoadmaps(courseId)
      .then(async (view) => {
        if (!isCurrent) return;
        showLoaded(view);
        setLoaded({ course: view.course, chapters: [] });
        // The lessons for the lesson picker. Without them the plan can still be written.
        const curriculum = await fetchAdminCoursePage(view.course.slug).catch(() => null);
        if (isCurrent && curriculum) setLoaded({ course: view.course, chapters: withExtraLessons(curriculum) });
      })
      .catch((error) => isCurrent && setLoadError(error.message));

    return () => {
      isCurrent = false;
    };
  }, [courseId, reloadCount, showLoaded]);

  const lessons = useMemo(() => lessonOptions(loaded?.chapters || []), [loaded]);
  const problems = useMemo(() => (draft ? roadmapProblems(draft.items) : []), [draft]);

  if (listError) return <LoadProblem message={listError} onRetry={retryList} />;
  if (!courses) return <SkeletonForm fields={5} label="Loading the roadmaps" />;

  if (courses.length === 0) {
    return (
      <div className={`${PANEL_STYLE} text-center py-10 text-sm text-slate-600 dark:text-slate-300`}>
        Add a course in Courses & Streams first. Each course has its own roadmaps.
      </div>
    );
  }

  const isChanged = Boolean(draft) && JSON.stringify(draft) !== savedCopy;
  const problemCount = problems.reduce((sum, list) => sum + list.length, 0);
  const subject = loaded?.course.name || 'This subject';
  const dayCounts = draft ? draft.items.map((item) => item.days.length) : [];
  const takenDays = (exceptIndex) => new Set(dayCounts.filter((_, index) => index !== exceptIndex));

  const chooseCourse = async (id) => {
    if (id === courseId) return;
    if (isChanged) {
      const ok = await confirm({
        title: 'Leave without saving?',
        message: 'Your changes to these roadmaps have not been saved.',
        confirmLabel: 'Discard Changes',
        tone: 'danger',
      });
      if (!ok) return;
    }
    setDraft(null);
    setLoaded(null);
    setLoadError('');
    setOpenIndex(-1);
    setAddError('');
    setCustomDays('');
    setCourseId(id);
  };

  const retryCourse = () => {
    setLoadError('');
    setReloadCount((count) => count + 1);
  };

  const setItems = (items) => setDraft((previous) => ({ ...previous, items }));
  const updateItem = (index, item) =>
    setDraft((previous) => ({ ...previous, items: previous.items.map((current, i) => (i === index ? item : current)) }));

  // Each roadmap of a subject has its own number of days
  const addRoadmap = (dayCount) => {
    const count = Number(dayCount);
    const problem = dayCountProblem(count, takenDays(-1), subject);
    setAddError(problem);
    if (problem) return false;
    setItems([...draft.items, newRoadmap(count, loaded.course.subject || loaded.course.name)]);
    setOpenIndex(draft.items.length);
    return true;
  };

  const addCustom = () => {
    if (addRoadmap(customDays)) setCustomDays('');
  };

  const move = (index, direction) => {
    const target = index + direction;
    setItems(moveItem(draft.items, index, direction));
    if (openIndex === index) setOpenIndex(target);
    else if (openIndex === target) setOpenIndex(index);
  };

  const remove = async (index) => {
    const ok = await confirm({
      title: `Delete "${draft.items[index].title || 'this roadmap'}"?`,
      message: 'Its days and steps are removed when you save.',
      confirmLabel: 'Delete',
      tone: 'danger',
    });
    if (!ok) return;
    setItems(draft.items.filter((_, itemIndex) => itemIndex !== index));
    setOpenIndex(-1);
    setAddError('');
  };

  const save = async () => {
    setIsSaving(true);
    try {
      const view = await saveAdminRoadmaps(courseId, draft);
      showLoaded(view);
      setCourses((list) =>
        list.map((course) =>
          course._id === courseId
            ? {
                ...course,
                isShown: view.isShown,
                roadmapCount: view.roadmaps.items.length,
                plannedCount: view.roadmaps.items.filter(hasPlan).length,
              }
            : course
        )
      );
      showToast('Roadmaps saved. They now show on the course page.');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className={`${PANEL_STYLE} flex flex-col xl:flex-row xl:items-end justify-between gap-4`}>
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Route size={18} className="text-blue-600" />
            <span>Study Roadmaps</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Day-by-day study plans for each subject, such as 1, 5, 10 or 30 days. Students open them from the course page.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end gap-2">
          <div className="sm:w-80">
            <SubjectPicker courses={courses} value={courseId} onChange={chooseCourse} />
          </div>
          {loaded && (
            <a
              href={`/courses/${loaded.course.slug}#roadmaps`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${SECONDARY_BUTTON} ${NO_WRAP}`}
            >
              <Eye size={14} />
              <span>Preview</span>
            </a>
          )}
          <button
            type="button"
            onClick={save}
            disabled={!isChanged || isSaving || problemCount > 0}
            title={problemCount > 0 ? 'Fix the problems listed below first' : undefined}
            className={`${PRIMARY_BUTTON} ${NO_WRAP}`}
          >
            <Save size={14} />
            <span>{isSaving ? 'Saving...' : 'Save Roadmaps'}</span>
          </button>
        </div>
      </div>

      {!courseId && (
        <div className={`${PANEL_STYLE} space-y-3`}>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Choose a subject</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Pick one above or here to see and build its roadmaps.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
            {courses.map((course) => (
              <button
                key={course._id}
                type="button"
                data-testid="roadmap-subject"
                onClick={() => chooseCourse(course._id)}
                className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-blue-400 text-left transition-colors cursor-pointer"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-slate-900 dark:text-white truncate">{course.name}</span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                    {course.roadmapCount === 0
                      ? 'No roadmaps yet'
                      : `${course.plannedCount} of ${course.roadmapCount} planned`}
                    {course.status === 'published' ? '' : ` · ${course.status}`}
                  </span>
                </span>
                <span
                  className={`${CHIP_STYLE} ${
                    course.roadmapCount > 0
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {course.roadmapCount} {course.roadmapCount === 1 ? 'roadmap' : 'roadmaps'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {loadError && <LoadProblem message={loadError} onRetry={retryCourse} />}
      {courseId && !loadError && !draft && <SkeletonForm fields={4} label="Loading this subject's roadmaps" />}

      {draft && loaded && (
        <>
          {isChanged && (
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400">
              You have unsaved changes. Save them to show them on the course page.
            </p>
          )}

          <div className={`${PANEL_STYLE} space-y-3`}>
            <Toggle
              label="Show roadmaps on the course page"
              hint="When this is off, students do not see the roadmaps section."
              checked={draft.isShown}
              onChange={(isShown) => setDraft((previous) => ({ ...previous, isShown }))}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <TextInput
                label="Heading"
                value={draft.heading}
                onChange={(heading) => setDraft((previous) => ({ ...previous, heading }))}
                placeholder={`${loaded.course.name} Revision Roadmaps`}
              />
              <TextInput
                label="Subheading"
                value={draft.subheading}
                onChange={(subheading) => setDraft((previous) => ({ ...previous, subheading }))}
                placeholder="Choose a study plan that fits your time before the exam."
              />
            </div>
          </div>

          <div className={`${PANEL_STYLE} space-y-3`}>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Roadmaps ({draft.items.length})</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Shown on the course page in this order. A card gets its Select Roadmap button once a day has a step.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Add a roadmap">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mr-1">Add a roadmap:</span>
                {QUICK_DAYS.map((count) => {
                  const isTaken = dayCounts.includes(count);
                  return (
                    <button
                      key={count}
                      type="button"
                      onClick={() => addRoadmap(count)}
                      disabled={isTaken}
                      title={isTaken ? `${subject} already has a roadmap of ${daysLabel(count).toLowerCase()}` : undefined}
                      className={`${SECONDARY_BUTTON} ${NO_WRAP}`}
                    >
                      <Plus size={13} />
                      <span>{daysLabel(count)}</span>
                    </button>
                  );
                })}
                <span className="inline-flex items-center gap-1.5 shrink-0">
                  <input
                    type="number"
                    min="1"
                    max={MAX_DAYS}
                    value={customDays}
                    onChange={(event) => {
                      setCustomDays(event.target.value);
                      setAddError('');
                    }}
                    onKeyDown={(event) => event.key === 'Enter' && customDays && addCustom()}
                    placeholder="Other"
                    aria-label="Days for a new roadmap"
                    aria-invalid={addError ? true : undefined}
                    className={`${INPUT_STYLE} !w-24 !py-2${addError ? ' !border-rose-400' : ''}`}
                  />
                  <button type="button" disabled={!customDays} onClick={addCustom} className={`${SECONDARY_BUTTON} ${NO_WRAP}`}>
                    <Plus size={13} />
                    <span>Add</span>
                  </button>
                </span>
              </div>
              {addError ? (
                <p role="alert" className="mt-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
                  {addError}
                </p>
              ) : (
                <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                  Each roadmap needs its own number of days, so the ones {subject} already has are greyed out.
                </p>
              )}
            </div>

            {problemCount > 0 && (
              <div
                role="alert"
                data-testid="roadmap-problems"
                className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200"
              >
                <p className="text-xs font-bold mb-1">
                  Fix {problemCount === 1 ? 'this problem' : `these ${problemCount} problems`} before saving:
                </p>
                <ul className="list-disc pl-4 space-y-0.5 text-xs">
                  {problems.flatMap((list, index) =>
                    list.map((problem) => (
                      <li key={`${index}-${problem}`}>
                        <button
                          type="button"
                          onClick={() => setOpenIndex(index)}
                          className="font-bold underline underline-offset-2 cursor-pointer"
                        >
                          {draft.items[index].title || `Roadmap ${index + 1}`}
                        </button>
                        : {problem}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}

            {draft.items.length === 0 && (
              <p className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
                No roadmaps for {loaded.course.name} yet. Add a 1, 5, 10 or 30 day roadmap above.
              </p>
            )}

            {draft.items.map((item, index) => {
              const isOpen = openIndex === index;
              const steps = countPlan(item).modules;

              return (
                <div
                  key={index}
                  data-testid="admin-roadmap"
                  className="rounded-2xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex items-center gap-2 px-3 py-2.5">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                      className="flex-1 min-w-0 flex flex-wrap items-center gap-2 text-left cursor-pointer"
                    >
                      <ChevronDown
                        size={16}
                        className={`shrink-0 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                      <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {item.title || 'Untitled roadmap'}
                      </span>
                      <span className={`${CHIP_STYLE} bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300`}>
                        {daysLabel(item.days.length)}
                      </span>
                      {item.level && (
                        <span className={`${CHIP_STYLE} bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300`}>
                          {item.level}
                        </span>
                      )}
                      <span
                        className={`${CHIP_STYLE} ${
                          steps > 0
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {steps > 0 ? `${steps} ${steps === 1 ? 'step' : 'steps'}` : 'No plan yet'}
                      </span>
                      {problems[index]?.length > 0 && (
                        <span className={`${CHIP_STYLE} bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300`}>
                          {problems[index].length === 1 ? '1 problem' : `${problems[index].length} problems`}
                        </span>
                      )}
                    </button>
                    <div className="flex items-center shrink-0">
                      <button
                        type="button"
                        aria-label="Move up"
                        disabled={index === 0}
                        onClick={() => move(index, -1)}
                        className={ICON_BUTTON}
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label="Move down"
                        disabled={index === draft.items.length - 1}
                        onClick={() => move(index, 1)}
                        className={ICON_BUTTON}
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label="Delete roadmap"
                        onClick={() => remove(index)}
                        className={`${ICON_BUTTON} hover:!text-rose-500`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="px-3 pb-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                      <RoadmapEditor
                        key={`${courseId}-${index}`}
                        roadmap={item}
                        lessons={lessons}
                        problems={problems[index] || []}
                        takenDays={takenDays(index)}
                        subject={subject}
                        onChange={(next) => updateItem(index, next)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {isChanged && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={save}
                disabled={isSaving || problemCount > 0}
                className={`${PRIMARY_BUTTON} ${NO_WRAP}`}
              >
                <Save size={14} />
                <span>{isSaving ? 'Saving...' : 'Save Roadmaps'}</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
