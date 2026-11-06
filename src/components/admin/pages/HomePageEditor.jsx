import React, { useCallback, useEffect, useState } from 'react';
import { ExternalLink, Home, RefreshCw, RotateCcw, Save } from 'lucide-react';
import useDialog from '../../../hooks/useDialog';
import { setHomePage } from '../../../hooks/useHomePage';
import { fetchAdminHomePage, resetAdminHomePage, saveAdminHomePage } from '../../../services/homeApi';
import { STEP_ICON_OPTIONS } from '../../../data/homePageOptions';
import HowToUse from '../../HowToUse';
import { ReviewCard, WhyChooseCardsSection } from '../../home/WhyChooseMyMarksSection';
import ImageField from '../courses/ImageField';
import { SkeletonForm } from '../AdminSkeleton';
import {
  CollapsiblePanel,
  Field,
  INPUT_STYLE,
  PANEL_STYLE,
  PRIMARY_BUTTON,
  RepeatList,
  SECONDARY_BUTTON,
  TextArea,
  TextInput,
  Toggle,
} from '../courses/fields';

// The server checks the same limits
const LIMITS = { steps: 8, whyChoose: 24, reviews: 40 };
const MAX_REVIEW_TEXT = 400;
// About what fits in a review card's three lines
const CARD_TEXT = 150;

const BLANK_STEP = { icon: 'book', title: '', text: '', visible: true };
const BLANK_CARD = { title: '', text: '', image: '', visible: true };
const BLANK_REVIEW = { name: '', role: '', text: '', badge: 'Topper', visible: true };

const NO_WRAP = 'whitespace-nowrap shrink-0';

// Only the parts the server stores
const editable = (home) => ({
  howToUse: {
    heading: home.howToUse?.heading || '',
    subheading: home.howToUse?.subheading || '',
    buttonLabel: home.howToUse?.buttonLabel || '',
    steps: (home.howToUse?.steps || []).map((item) => ({
      icon: item.icon || 'book',
      title: item.title || '',
      text: item.text || '',
      visible: item.visible !== false,
    })),
  },
  whyChoose: {
    heading: home.whyChoose?.heading || '',
    subheading: home.whyChoose?.subheading || '',
    items: (home.whyChoose?.items || []).map((item) => ({
      title: item.title || '',
      text: item.text || '',
      image: item.image || '',
      visible: item.visible !== false,
    })),
  },
  reviews: {
    heading: home.reviews?.heading || '',
    subheading: home.reviews?.subheading || '',
    items: (home.reviews?.items || []).map((item) => ({
      name: item.name || '',
      role: item.role || '',
      text: item.text || '',
      badge: item.badge || '',
      visible: item.visible !== false,
    })),
  },
});

// What stops each section from saving, as messages per section
const homeProblems = (draft) => {
  const howToUse = [];
  const { steps } = draft.howToUse;
  if (steps.length > LIMITS.steps) howToUse.push(`"How to Use" can show up to ${LIMITS.steps} steps.`);
  steps.forEach((item, index) => {
    if (!item.title.trim()) howToUse.push(`Step ${index + 1} of "How to Use" needs a title.`);
    else if (!item.text.trim()) howToUse.push(`The step "${item.title.trim()}" needs its text.`);
  });

  const whyChoose = [];
  const cards = draft.whyChoose.items;
  if (cards.length > LIMITS.whyChoose) whyChoose.push(`"Why Choose" can show up to ${LIMITS.whyChoose} cards.`);
  cards.forEach((item, index) => {
    if (!item.title.trim()) whyChoose.push(`Card ${index + 1} of "Why Choose" needs a title.`);
  });

  const reviews = [];
  const items = draft.reviews.items;
  if (items.length > LIMITS.reviews) reviews.push(`The home page can show up to ${LIMITS.reviews} reviews.`);
  items.forEach((item, index) => {
    if (!item.name.trim()) reviews.push(`Review ${index + 1} needs the student's name.`);
    if (!item.text.trim()) reviews.push(`Review ${index + 1} needs what ${item.name.trim() || 'the student'} said.`);
  });
  return { howToUse, whyChoose, reviews };
};

// The short note on a closed item that needs fixing
const stepProblem = (item) => (!item.title.trim() ? 'Needs a title' : !item.text.trim() ? 'Needs text' : '');
const cardProblem = (item) => (!item.title.trim() ? 'Needs a title' : '');
const reviewProblem = (item) =>
  !item.name.trim() ? 'Needs a name' : !item.text.trim() ? 'Needs what they said' : '';

const shownOnly = (items) => items.filter((item) => item.visible);

function Preview({ label = 'Preview this section', children }) {
  return (
    <details className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <summary className="px-3 py-2 text-xs font-bold text-blue-700 dark:text-blue-400 cursor-pointer select-none">
        {label}
      </summary>
      <div className="overflow-x-auto">{children}</div>
    </details>
  );
}

/**
 * Website Pages > Home Page: "How to Use MyMarks", "Why Thousands Choose MyMarks" and
 * "What Our Students Say", saved together
 */
export default function HomePageEditor({ showToast }) {
  const { confirm } = useDialog();
  const [draft, setDraft] = useState(null);
  const [savedCopy, setSavedCopy] = useState('');
  const [isDefault, setIsDefault] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const showLoaded = useCallback((home) => {
    const next = editable(home);
    setDraft(next);
    setSavedCopy(JSON.stringify(next));
    setIsDefault(Boolean(home.isDefault));
  }, []);

  const load = useCallback(
    () => fetchAdminHomePage().then(showLoaded).catch((error) => setLoadError(error.message)),
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

  if (!draft) return <SkeletonForm fields={5} label="Loading the home page" />;

  const isChanged = JSON.stringify(draft) !== savedCopy;
  const sectionProblems = homeProblems(draft);
  const problems = [...sectionProblems.howToUse, ...sectionProblems.whyChoose, ...sectionProblems.reviews];
  const shownSteps = shownOnly(draft.howToUse.steps);
  const shownCards = shownOnly(draft.whyChoose.items);
  const shownReviews = shownOnly(draft.reviews.items);

  const setSection = (section, changes) =>
    setDraft((previous) => ({ ...previous, [section]: { ...previous[section], ...changes } }));

  const save = async () => {
    setIsSaving(true);
    try {
      const saved = await saveAdminHomePage(draft);
      showLoaded(saved);
      setHomePage(saved);
      showToast('Home page saved. The changes now show on the website.');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const reset = async () => {
    const ok = await confirm({
      title: 'Go back to the built-in home page sections?',
      message: 'Your saved steps, cards and reviews will be removed from the home page.',
      confirmLabel: 'Use Built-in Page',
      tone: 'danger',
    });
    if (!ok) return;
    setIsSaving(true);
    try {
      const builtIn = await resetAdminHomePage();
      showLoaded(builtIn);
      setHomePage(builtIn);
      showToast('The built-in home page is back on the website.');
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
      <span>{isSaving ? 'Saving...' : 'Save Home Page'}</span>
    </button>
  );

  return (
    <div className="space-y-5">
      <div className={`${PANEL_STYLE} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Home size={18} className="text-blue-600" />
            <span>Home Page</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            The "How to Use", "Why Thousands Choose" and "What Our Students Say" sections.
            {isDefault ? ' Showing the built-in page until you save.' : ''}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a href="/demo" target="_blank" rel="noopener noreferrer" className={`${SECONDARY_BUTTON} ${NO_WRAP}`}>
            <ExternalLink size={14} />
            <span>Open Page</span>
          </a>
          {!isDefault && (
            <button type="button" onClick={reset} disabled={isSaving} className={`${SECONDARY_BUTTON} ${NO_WRAP}`}>
              <RotateCcw size={14} />
              <span>Use Built-in Page</span>
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

      {problems.length > 0 && (
        <div
          role="alert"
          data-testid="home-problems"
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

      {/* How to Use MyMarks */}
      <CollapsiblePanel
        testId="home-how-to-use"
        title="How to Use MyMarks"
        summary={`${draft.howToUse.steps.length} steps, ${shownSteps.length} shown. The numbered steps under the news; the numbers follow their order.`}
        problemCount={sectionProblems.howToUse.length}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <TextInput
            label="Heading"
            value={draft.howToUse.heading}
            onChange={(heading) => setSection('howToUse', { heading })}
            maxLength={120}
          />
          <TextInput
            label="Text"
            value={draft.howToUse.subheading}
            onChange={(subheading) => setSection('howToUse', { subheading })}
            maxLength={300}
          />
          <TextInput
            label="Button"
            hint="Opens sign up. Leave it empty to hide the button."
            value={draft.howToUse.buttonLabel}
            onChange={(buttonLabel) => setSection('howToUse', { buttonLabel })}
            maxLength={40}
          />
        </div>
        <RepeatList
          items={draft.howToUse.steps}
          onChange={(steps) => setSection('howToUse', { steps })}
          blank={BLANK_STEP}
          addLabel="Add Step"
          collapsible
          itemProblem={stepProblem}
          itemTitle={(item) => `${item.title || 'New step'}${item.visible ? '' : ' (hidden)'}`}
          renderItem={(item, change) => (
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Field label="Icon">
                  <select
                    value={item.icon}
                    onChange={(event) => change({ icon: event.target.value })}
                    className={`${INPUT_STYLE} cursor-pointer`}
                  >
                    {STEP_ICON_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="sm:col-span-2">
                  <TextInput
                    label="Step title"
                    required
                    value={item.title}
                    onChange={(title) => change({ title })}
                    error={item.title.trim() ? '' : 'Add a title.'}
                    placeholder="e.g. Create Your Account"
                    maxLength={80}
                  />
                </div>
              </div>
              <TextArea
                label="Step text"
                required
                rows={2}
                value={item.text}
                onChange={(text) => change({ text })}
                error={item.text.trim() ? '' : 'Add the text.'}
                maxLength={240}
              />
              <Toggle label="Show on the home page" checked={item.visible} onChange={(visible) => change({ visible })} />
            </div>
          )}
        />
        {shownSteps.length > 0 && (
          <Preview>
            <HowToUse content={{ ...draft.howToUse, steps: shownSteps }} />
          </Preview>
        )}
      </CollapsiblePanel>

      {/* Why Thousands Choose MyMarks */}
      <CollapsiblePanel
        testId="home-why-choose"
        title="Why Thousands Choose MyMarks"
        summary={`${draft.whyChoose.items.length} cards, ${shownCards.length} shown. The picture cards, four in a row on a computer and two on a phone.`}
        problemCount={sectionProblems.whyChoose.length}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextInput
            label="Heading"
            value={draft.whyChoose.heading}
            onChange={(heading) => setSection('whyChoose', { heading })}
            maxLength={120}
          />
          <TextInput
            label="Text"
            value={draft.whyChoose.subheading}
            onChange={(subheading) => setSection('whyChoose', { subheading })}
            maxLength={300}
          />
        </div>
        <RepeatList
          items={draft.whyChoose.items}
          onChange={(items) => setSection('whyChoose', { items })}
          blank={BLANK_CARD}
          addLabel="Add Card"
          collapsible
          itemProblem={cardProblem}
          itemTitle={(item) => `${item.title || 'New card'}${item.visible ? '' : ' (hidden)'}`}
          renderItem={(item, change) => (
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <TextInput
                  label="Card title"
                  required
                  value={item.title}
                  onChange={(title) => change({ title })}
                  error={item.title.trim() ? '' : 'Add a title.'}
                  placeholder="e.g. Timed Mock Tests"
                  maxLength={80}
                />
                <TextInput
                  label="Card text"
                  value={item.text}
                  onChange={(text) => change({ text })}
                  placeholder="e.g. Real simulator of board examinations."
                  maxLength={160}
                />
              </div>
              <ImageField
                label="Picture"
                hint="A wide picture works best. Without one, the card shows a picture of books."
                value={{ url: item.image }}
                onChange={(image) => change({ image: image.url })}
              />
              <Toggle label="Show on the home page" checked={item.visible} onChange={(visible) => change({ visible })} />
            </div>
          )}
        />
        {shownCards.length > 0 && (
          <Preview>
            <WhyChooseCardsSection content={{ ...draft.whyChoose, items: shownCards }} />
          </Preview>
        )}
      </CollapsiblePanel>

      {/* What Our Students Say */}
      <CollapsiblePanel
        testId="home-reviews"
        title="What Our Students Say"
        summary={`${draft.reviews.items.length} reviews, ${shownReviews.length} shown. The moving review cards near the bottom of the home page.`}
        problemCount={sectionProblems.reviews.length}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextInput
            label="Heading"
            value={draft.reviews.heading}
            onChange={(heading) => setSection('reviews', { heading })}
            placeholder="What Our Students Say"
            maxLength={120}
          />
          <TextInput
            label="Text"
            value={draft.reviews.subheading}
            onChange={(subheading) => setSection('reviews', { subheading })}
            placeholder="Thousands of intermediate students score top marks..."
            maxLength={300}
          />
        </div>

        {shownReviews.length === 0 ? (
          <p className="text-center py-4 text-sm text-amber-700 dark:text-amber-400 font-semibold">
            No review is shown, so the home page hides this section.
          </p>
        ) : (
          <div className="rounded-2xl bg-[#e6f0fa] dark:bg-[#071328] p-4 overflow-x-auto" data-testid="reviews-preview">
            <div className="text-center mb-4">
              <p className="text-lg font-semibold text-slate-900 dark:text-white">{draft.reviews.heading}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">{draft.reviews.subheading}</p>
            </div>
            <div className="flex gap-3 w-max">
              {shownReviews.map((item, index) => (
                <ReviewCard key={index} review={item} />
              ))}
            </div>
          </div>
        )}

        <RepeatList
          items={draft.reviews.items}
          onChange={(items) => setSection('reviews', { items })}
          blank={BLANK_REVIEW}
          addLabel="Add Review"
          collapsible
          itemProblem={reviewProblem}
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
                maxLength={MAX_REVIEW_TEXT}
                value={item.text}
                onChange={(text) => change({ text })}
                error={item.text.trim() ? '' : 'Add what the student said.'}
                hint={`${item.text.length}/${MAX_REVIEW_TEXT} characters.${
                  item.text.length > CARD_TEXT ? ' The card shows about the first 150, then "...".' : ''
                }`}
              />
              <Toggle label="Show on the home page" checked={item.visible} onChange={(visible) => change({ visible })} />
            </div>
          )}
        />
      </CollapsiblePanel>

      {isChanged && <div className="flex justify-end">{saveButton}</div>}
    </div>
  );
}
