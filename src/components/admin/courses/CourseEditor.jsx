import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, ExternalLink, Save } from 'lucide-react';
import {
  createAdminCourse,
  fetchAdminCourse,
  setAdminCourseStatus,
  updateAdminCourse,
} from '../../../services/courseApi';
import { SkeletonForm } from '../AdminSkeleton';
import useDialog from '../../../hooks/useDialog';
import CourseCard from '../../course/CourseCard';
import CoursePageStep from './CoursePageStep';
import CurriculumStep from './CurriculumStep';
import ImageField from './ImageField';
import {
  CheckboxGroup,
  PANEL_STYLE,
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
  TextArea,
  TextInput,
  Toggle,
} from './fields';

const STEPS = ['Basics', 'Card', 'Page', 'Curriculum', 'Publish'];

const activeNames = (list) => list.filter((option) => option.status !== 'hidden').map((option) => option.name);

// The boards or years to tick: the active ones, plus any this course already has that is hidden or not in the list
const choicesFor = (list, selected) => {
  const active = activeNames(list);
  const kept = selected.filter((name) => !active.includes(name));
  return [
    ...active.map((name) => ({ value: name, label: name })),
    ...kept.map((name) => ({
      value: name,
      label: `${name} (${list.some((option) => option.name === name) ? 'hidden' : 'not in the list'})`,
    })),
  ];
};

const BLANK_COURSE = {
  name: '',
  slug: '',
  subject: '',
  streams: [],
  boards: [],
  years: [],
  shortDescription: '',
  thumbnail: { url: '', publicId: '', sourceUrl: '' },
  tagLabel: '',
  price: '',
  oldPrice: '',
  sellOnline: true,
  mostBought: false,
  bestValue: false,
  ownLink: '',
  practicalMarks: '',
  page: {},
  sections: {},
  seoTitle: '',
  seoDescription: '',
  status: 'draft',
  publishedAt: null,
};

const publishChecks = (form) => [
  { label: 'Course name', done: Boolean(form.name.trim()) },
  { label: 'Thumbnail', done: Boolean(form.thumbnail?.url) },
  { label: 'Price', done: form.price !== '' && form.price !== null && form.price !== undefined },
  { label: 'Short description', done: Boolean(form.shortDescription.trim()) },
];

export default function CourseEditor({
  courseId,
  streams,
  boards = [],
  years = [],
  showToast,
  onChanged,
  onClose,
  initialStep = 0,
  focusNodeId = null,
}) {
  const { confirm } = useDialog();
  const [id, setId] = useState(courseId);
  // A new course starts with every active board and year ticked
  const [form, setForm] = useState(() => ({ ...BLANK_COURSE, boards: activeNames(boards), years: activeNames(years) }));
  const [step, setStep] = useState(initialStep);
  const [isLoading, setIsLoading] = useState(Boolean(courseId));
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [problem, setProblem] = useState('');

  useEffect(() => {
    if (!courseId) return undefined;
    let isCurrent = true;

    fetchAdminCourse(courseId)
      .then(({ course }) => {
        if (isCurrent) setForm({ ...BLANK_COURSE, ...course, price: course.price ?? '', oldPrice: course.oldPrice ?? '' });
      })
      .catch((error) => {
        showToast(error.message, 'error');
        onClose();
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [courseId, onClose, showToast]);

  const update = (changes) => {
    setForm((current) => ({ ...current, ...changes }));
    setIsDirty(true);
  };

  const setField = (key) => (value) => update({ [key]: value });

  const streamOptions = useMemo(
    () => streams.map((stream) => ({ value: stream._id, label: stream.code })),
    [streams]
  );

  const previewCard = {
    ...form,
    thumbnail: form.thumbnail?.url,
    streams: streams.filter((stream) => form.streams.includes(stream._id)),
  };

  const save = async () => {
    setIsSaving(true);
    setProblem('');
    try {
      const saved = id ? await updateAdminCourse(id, form) : await createAdminCourse(form);
      setId(saved._id);
      setForm((current) => ({ ...current, slug: saved.slug, status: saved.status, publishedAt: saved.publishedAt }));
      setIsDirty(false);
      if (onChanged) onChanged();
      return saved;
    } catch (error) {
      setProblem(error.message);
      showToast(error.message, 'error');
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    if (await save()) showToast('Course saved');
  };

  const handleStatus = async (status) => {
    const saved = await save();
    if (!saved) return;

    setIsSaving(true);
    try {
      const updated = await setAdminCourseStatus(saved._id, status);
      setForm((current) => ({ ...current, status: updated.status, publishedAt: updated.publishedAt }));
      showToast(`Course is now ${status}`);
      if (onChanged) onChanged();
    } catch (error) {
      setProblem(error.message);
      showToast(error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = async () => {
    if (
      !isDirty ||
      (await confirm({
        title: 'Leave without saving?',
        message: 'Your changes to this course will be lost.',
        confirmLabel: 'Leave',
        cancelLabel: 'Keep Editing',
        tone: 'danger',
      }))
    ) {
      onClose();
    }
  };

  if (isLoading) {
    return <SkeletonForm fields={6} label="Loading course" />;
  }

  const checks = publishChecks(form);
  const isReady = checks.every((check) => check.done);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button type="button" onClick={handleClose} className={SECONDARY_BUTTON}>
            <ArrowLeft size={14} />
            <span>All Courses</span>
          </button>
          <h3 className="font-black text-slate-900 dark:text-white text-base sm:text-lg truncate">
            {form.name || 'New Course'}
          </h3>
        </div>
        <button type="button" disabled={isSaving || !form.name.trim()} onClick={handleSave} className={PRIMARY_BUTTON}>
          <Save size={14} />
          <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
        </button>
      </div>

      {/* Step Tabs */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {STEPS.map((name, index) => (
          <button
            key={name}
            type="button"
            onClick={() => setStep(index)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              step === index
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {index + 1}. {name}
          </button>
        ))}
      </div>

      {problem && (
        <p role="alert" className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-700 dark:text-rose-300">
          {problem}
        </p>
      )}

      {step === 0 && (
        <div className={`${PANEL_STYLE} space-y-4`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput label="Course name" required value={form.name} onChange={setField('name')} placeholder="e.g. Physics" maxLength={120} />
            <TextInput
              label="Subject"
              hint="Videos are grouped by this name. Leave it empty to use the course name."
              value={form.subject}
              onChange={setField('subject')}
              placeholder="e.g. Physics"
              maxLength={80}
            />
          </div>

          <TextInput
            label="Web address"
            hint={
              form.publishedAt
                ? 'This is locked because the course has been published, so shared links keep working.'
                : 'Created from the name. It locks once the course is published.'
            }
            value={form.slug}
            onChange={setField('slug')}
            disabled={Boolean(form.publishedAt)}
            placeholder="e.g. physics"
          />

          <CheckboxGroup
            label="Streams"
            hint={streamOptions.length === 0 ? 'No streams yet. Add them under the Streams view.' : ''}
            options={streamOptions}
            selected={form.streams}
            onChange={setField('streams')}
          />
          <CheckboxGroup
            label="Boards"
            hint={boards.length === 0 ? 'No boards yet. Add them under the Boards view.' : ''}
            options={choicesFor(boards, form.boards)}
            selected={form.boards}
            onChange={setField('boards')}
          />
          <CheckboxGroup
            label="Years"
            hint={years.length === 0 ? 'No years yet. Add them under the Years view.' : ''}
            options={choicesFor(years, form.years)}
            selected={form.years}
            onChange={setField('years')}
          />

          <TextArea
            label="Short description"
            required
            value={form.shortDescription}
            onChange={setField('shortDescription')}
            maxLength={400}
          />
        </div>
      )}

      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className={`${PANEL_STYLE} lg:col-span-2 space-y-4`}>
            <ImageField
              label="Thumbnail *"
              hint="JPG, PNG or WebP, up to 5 MB."
              value={form.thumbnail}
              onChange={setField('thumbnail')}
            />

            <TextInput
              label="Own link"
              hint="Leave empty to open the course page. Use an https link or a page on this site, such as /practicals. Outside links open in a new tab."
              value={form.ownLink}
              onChange={setField('ownLink')}
              placeholder="https://..."
            />

            <div className="grid grid-cols-2 gap-4">
              <TextInput label="Price (₹)" required type="number" min="0" value={form.price} onChange={setField('price')} />
              <TextInput label="Old price (₹)" type="number" min="0" value={form.oldPrice} onChange={setField('oldPrice')} />
            </div>

            <Toggle
              label="Sell online"
              hint="On: students buy this course online, and only its first free lessons play until they do. Off: every lesson is open to signed-in students. A course without a price is never sold."
              checked={form.sellOnline !== false}
              onChange={setField('sellOnline')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput
                label="Card tag"
                hint="Leave empty to show the stream codes."
                value={form.tagLabel}
                onChange={setField('tagLabel')}
                placeholder="e.g. MPC / BiPC"
                maxLength={40}
              />
              <TextInput
                label="Practical marks"
                value={form.practicalMarks}
                onChange={setField('practicalMarks')}
                placeholder="e.g. 30 Marks"
                maxLength={20}
              />
            </div>

            <div className="space-y-2.5 pt-1">
              <Toggle
                label="Most Bought"
                hint="Public claim, so set it only when it is true. One per stream."
                checked={form.mostBought}
                onChange={setField('mostBought')}
              />
              <Toggle
                label="Best Value"
                hint="Public claim, so set it only when it is true. One per stream."
                checked={form.bestValue}
                onChange={setField('bestValue')}
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Card preview</p>
            <div className="max-w-[260px]">
              <CourseCard course={previewCard} />
            </div>
          </div>
        </div>
      )}

      {step === 2 && <CoursePageStep form={form} update={update} />}

      {step === 3 && <CurriculumStep courseId={id} showToast={showToast} onSaveDraft={handleSave} focusNodeId={focusNodeId} />}

      {step === 4 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className={`${PANEL_STYLE} space-y-3`}>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Publish check</h4>
            <ul className="space-y-1.5">
              {checks.map((check) => (
                <li key={check.label} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {check.done ? (
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  ) : (
                    <Circle size={16} className="text-rose-400 shrink-0" />
                  )}
                  <span>{check.label}</span>
                </li>
              ))}
            </ul>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Status: <strong className="text-slate-800 dark:text-slate-200">{form.status}</strong>
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {form.status !== 'published' && (
                <button type="button" disabled={isSaving || !isReady} onClick={() => handleStatus('published')} className={PRIMARY_BUTTON}>
                  Publish Course
                </button>
              )}
              {form.status === 'published' && (
                <button type="button" disabled={isSaving} onClick={() => handleStatus('draft')} className={SECONDARY_BUTTON}>
                  Move Back to Draft
                </button>
              )}
              {form.status !== 'archived' && id && (
                <button type="button" disabled={isSaving} onClick={() => handleStatus('archived')} className={SECONDARY_BUTTON}>
                  Archive
                </button>
              )}
              {id && (
                <a href={`/courses/${form.slug}`} target="_blank" rel="noopener noreferrer" className={SECONDARY_BUTTON}>
                  <ExternalLink size={14} />
                  <span>Preview Page</span>
                </a>
              )}
            </div>
          </div>

          <div className={`${PANEL_STYLE} space-y-3`}>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Search and sharing</h4>
            <TextInput
              label="Search title"
              hint="Leave empty to use the course name."
              value={form.seoTitle}
              onChange={setField('seoTitle')}
              maxLength={120}
            />
            <TextArea
              label="Search description"
              hint="Shown on Google and when the link is shared. Leave empty to use the short description."
              rows={3}
              value={form.seoDescription}
              onChange={setField('seoDescription')}
              maxLength={320}
            />
          </div>
        </div>
      )}

      {/* Step Navigation */}
      <div className="flex items-center justify-between">
        <button type="button" disabled={step === 0} onClick={() => setStep(step - 1)} className={SECONDARY_BUTTON}>
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>
        <button type="button" disabled={step === STEPS.length - 1} onClick={() => setStep(step + 1)} className={SECONDARY_BUTTON}>
          <span>Next</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
