import React, { useCallback, useEffect, useState } from 'react';
import { MessageSquareQuote, RefreshCw, RotateCcw, Save } from 'lucide-react';
import useDialog from '../../../hooks/useDialog';
import { setStudentReviews } from '../../../hooks/useStudentReviews';
import {
  fetchAdminStudentReviews,
  resetAdminStudentReviews,
  saveAdminStudentReviews,
} from '../../../services/reviewsApi';
import { ReviewCard } from '../../home/WhyChooseMyMarksSection';
import { SkeletonForm } from '../AdminSkeleton';
import { PANEL_STYLE, PRIMARY_BUTTON, RepeatList, SECONDARY_BUTTON, TextArea, TextInput, Toggle } from '../courses/fields';

// The server checks the same limits
const MAX_REVIEWS = 40;
const MAX_TEXT = 400;
// About what fits in the card's three lines
const CARD_TEXT = 150;

const BLANK_REVIEW = { name: '', role: '', text: '', badge: 'Topper', visible: true };

const NO_WRAP = 'whitespace-nowrap shrink-0';

// Only the parts the server stores
const editable = (reviews) => ({
  heading: reviews.heading || '',
  subheading: reviews.subheading || '',
  items: (reviews.items || []).map((item) => ({
    name: item.name || '',
    role: item.role || '',
    text: item.text || '',
    badge: item.badge || '',
    visible: item.visible !== false,
  })),
});

const reviewProblems = (draft) => {
  const problems = [];
  if (draft.items.length > MAX_REVIEWS) problems.push(`The home page can show up to ${MAX_REVIEWS} reviews.`);
  draft.items.forEach((item, index) => {
    if (!item.name.trim()) problems.push(`Review ${index + 1} needs the student's name.`);
    if (!item.text.trim()) problems.push(`Review ${index + 1} needs what ${item.name.trim() || 'the student'} said.`);
  });
  return problems;
};

/**
 * Website Pages > Home Page: the "What Our Students Say" reviews
 */
export default function HomePageEditor({ showToast }) {
  const { confirm } = useDialog();
  const [draft, setDraft] = useState(null);
  const [savedCopy, setSavedCopy] = useState('');
  const [isDefault, setIsDefault] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const showLoaded = useCallback((reviews) => {
    const next = editable(reviews);
    setDraft(next);
    setSavedCopy(JSON.stringify(next));
    setIsDefault(Boolean(reviews.isDefault));
  }, []);

  const load = useCallback(
    () => fetchAdminStudentReviews().then(showLoaded).catch((error) => setLoadError(error.message)),
    [showLoaded]
  );

  useEffect(() => {
    load();
  }, [load]);

  const retry = () => {
    setLoadError('');
    load();
  };

  if (loadError) {
    return (
      <div className={`${PANEL_STYLE} text-center py-10`}>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{loadError}</p>
        <button type="button" onClick={retry} className={`${PRIMARY_BUTTON} mx-auto`}>
          <RefreshCw size={14} />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  if (!draft) return <SkeletonForm fields={5} label="Loading the reviews" />;

  const isChanged = JSON.stringify(draft) !== savedCopy;
  const problems = reviewProblems(draft);
  const shown = draft.items.filter((item) => item.visible);
  const setItems = (items) => setDraft((previous) => ({ ...previous, items }));

  const save = async () => {
    setIsSaving(true);
    try {
      const saved = await saveAdminStudentReviews(draft);
      showLoaded(saved);
      setStudentReviews(saved);
      showToast('Reviews saved. They now show on the home page.');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const reset = async () => {
    const ok = await confirm({
      title: 'Go back to the built-in reviews?',
      message: 'Your saved reviews will be removed from the home page.',
      confirmLabel: 'Use Built-in Reviews',
      tone: 'danger',
    });
    if (!ok) return;
    setIsSaving(true);
    try {
      const builtIn = await resetAdminStudentReviews();
      showLoaded(builtIn);
      setStudentReviews(builtIn);
      showToast('The built-in reviews are back on the home page.');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const saveButton = (
    <button
      type="button"
      onClick={save}
      disabled={!isChanged || isSaving || problems.length > 0}
      title={problems.length > 0 ? 'Fix the problems listed below first' : undefined}
      className={`${PRIMARY_BUTTON} ${NO_WRAP}`}
    >
      <Save size={14} />
      <span>{isSaving ? 'Saving...' : 'Save Reviews'}</span>
    </button>
  );

  return (
    <div className="space-y-5">
      <div className={`${PANEL_STYLE} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquareQuote size={18} className="text-blue-600" />
            <span>What Our Students Say</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            The student review cards near the bottom of the home page.
            {isDefault ? ' Showing the built-in reviews until you save.' : ''}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!isDefault && (
            <button type="button" onClick={reset} disabled={isSaving} className={`${SECONDARY_BUTTON} ${NO_WRAP}`}>
              <RotateCcw size={14} />
              <span>Use Built-in Reviews</span>
            </button>
          )}
          {saveButton}
        </div>
      </div>

      {isChanged && (
        <p className="text-xs font-bold text-amber-700 dark:text-amber-400">
          You have unsaved changes. Save them to show them on the home page.
        </p>
      )}

      <div className={`${PANEL_STYLE} grid grid-cols-1 md:grid-cols-2 gap-3`}>
        <TextInput
          label="Heading"
          value={draft.heading}
          onChange={(heading) => setDraft((previous) => ({ ...previous, heading }))}
          placeholder="What Our Students Say"
          maxLength={120}
        />
        <TextInput
          label="Subheading"
          value={draft.subheading}
          onChange={(subheading) => setDraft((previous) => ({ ...previous, subheading }))}
          placeholder="Thousands of intermediate students score top marks..."
          maxLength={300}
        />
      </div>

      <div className={`${PANEL_STYLE} space-y-3`}>
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white">Preview</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            The cards as they look on the home page, where they move slowly from right to left and stop when touched.
          </p>
        </div>
        {shown.length === 0 ? (
          <p className="text-center py-6 text-sm text-amber-700 dark:text-amber-400 font-semibold">
            No review is shown, so the home page hides this section.
          </p>
        ) : (
          <div className="rounded-2xl bg-[#e6f0fa] dark:bg-[#071328] p-4 overflow-x-auto" data-testid="reviews-preview">
            <div className="text-center mb-4">
              <p className="text-lg font-semibold text-slate-900 dark:text-white">{draft.heading}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">{draft.subheading}</p>
            </div>
            <div className="flex gap-3 w-max">
              {shown.map((item, index) => (
                <ReviewCard key={index} review={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={`${PANEL_STYLE} space-y-3`}>
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white">
            Reviews ({draft.items.length}, {shown.length} shown)
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Shown on the home page in this order. Turn one off to hide it without deleting it.
          </p>
        </div>

        {problems.length > 0 && (
          <div
            role="alert"
            data-testid="review-problems"
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

        <RepeatList
          items={draft.items}
          onChange={setItems}
          blank={BLANK_REVIEW}
          addLabel="Add Review"
          itemTitle={(item) => `${item.name || 'New review'}${item.visible ? '' : ' (hidden)'}`}
          renderItem={(item, change) => (
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <TextInput
                  label="Student name"
                  required
                  value={item.name}
                  onChange={(name) => change({ name })}
                  error={item.name.trim() ? '' : "Add the student's name."}
                  placeholder="e.g. K. Sai Varun"
                  maxLength={80}
                />
                <TextInput
                  label="Year and result"
                  value={item.role}
                  onChange={(role) => change({ role })}
                  placeholder="e.g. 1st Year Topper (99/100)"
                  maxLength={80}
                />
                <TextInput
                  label="Badge"
                  hint="Leave it empty for no badge."
                  value={item.badge}
                  onChange={(badge) => change({ badge })}
                  placeholder="e.g. Topper"
                  maxLength={20}
                />
              </div>
              <TextArea
                label="What they said"
                required
                rows={3}
                maxLength={MAX_TEXT}
                value={item.text}
                onChange={(text) => change({ text })}
                error={item.text.trim() ? '' : 'Add what the student said.'}
                hint={`${item.text.length}/${MAX_TEXT} characters.${
                  item.text.length > CARD_TEXT ? ' The card shows about the first 150, then "...".' : ''
                }`}
              />
              <Toggle label="Show on the home page" checked={item.visible} onChange={(visible) => change({ visible })} />
            </div>
          )}
        />
      </div>

      {isChanged && <div className="flex justify-end">{saveButton}</div>}
    </div>
  );
}
