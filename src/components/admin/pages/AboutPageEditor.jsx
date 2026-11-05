import React, { useCallback, useEffect, useState } from 'react';
import { ExternalLink, RefreshCw, RotateCcw, Save, Users } from 'lucide-react';
import useDialog from '../../../hooks/useDialog';
import { setAboutPage } from '../../../hooks/useAboutPage';
import { fetchAdminAboutPage, resetAdminAboutPage, saveAdminAboutPage } from '../../../services/aboutApi';
import { CARD_COLOR_OPTIONS, LEADER_ICON_OPTIONS } from '../../../data/aboutPageOptions';
import { linkProblem } from '../../../utils/links';
import { LeaderCard } from '../../AboutUs';
import { LuminaryCard } from '../../SupportersSlider';
import ImageField from '../courses/ImageField';
import { SkeletonForm } from '../AdminSkeleton';
import {
  Field,
  INPUT_STYLE,
  LinesField,
  PANEL_STYLE,
  PRIMARY_BUTTON,
  RepeatList,
  SECONDARY_BUTTON,
  TextArea,
  TextInput,
  Toggle,
} from '../courses/fields';

// The server checks the same limits
const LIMITS = { leaders: 20, tags: 10, highlights: 6, inspirations: 30 };

const BLANK_LEADER = {
  name: '',
  role: '',
  icon: 'award',
  image: '',
  link: '',
  tagline: '',
  bio: '',
  tags: [],
  highlights: [],
  visible: true,
};
const BLANK_INSPIRATION = { name: '', badge: '', image: '', quote: '', color: 'amber', visible: true };

const NO_WRAP = 'whitespace-nowrap shrink-0';

// Only the parts the server stores
const editable = (about) => ({
  hero: {
    badge: about.hero?.badge || '',
    heading: about.hero?.heading || '',
    subheading: about.hero?.subheading || '',
  },
  leaders: (about.leaders || []).map((leader) => ({
    name: leader.name || '',
    role: leader.role || '',
    icon: leader.icon || 'award',
    image: leader.image || '',
    link: leader.link || '',
    tagline: leader.tagline || '',
    bio: leader.bio || '',
    tags: leader.tags || [],
    highlights: leader.highlights || [],
    visible: leader.visible !== false,
  })),
  inspirations: {
    badge: about.inspirations?.badge || '',
    heading: about.inspirations?.heading || '',
    subheading: about.inspirations?.subheading || '',
    items: (about.inspirations?.items || []).map((item) => ({
      name: item.name || '',
      badge: item.badge || '',
      image: item.image || '',
      quote: item.quote || '',
      color: item.color || 'amber',
      visible: item.visible !== false,
    })),
  },
});

const filled = (lines) => lines.filter((line) => line.trim());

const aboutProblems = (draft) => {
  const problems = [];
  if (draft.leaders.length > LIMITS.leaders) problems.push(`The page can show up to ${LIMITS.leaders} leaders.`);
  draft.leaders.forEach((leader, index) => {
    const who = leader.name.trim() || `Leader ${index + 1}`;
    if (!leader.name.trim()) problems.push(`Leader ${index + 1} needs a name.`);
    if (!leader.role.trim()) problems.push(`${who} needs a role.`);
    if (linkProblem(leader.link)) problems.push(`The Read more link of ${who} must start with https:// or be a page on this site.`);
    if (filled(leader.tags).length > LIMITS.tags) problems.push(`${who} has more than ${LIMITS.tags} tags.`);
    if (filled(leader.highlights).length > LIMITS.highlights) {
      problems.push(`${who} has more than ${LIMITS.highlights} impact points.`);
    }
  });

  const items = draft.inspirations.items;
  if (items.length > LIMITS.inspirations) problems.push(`The page can show up to ${LIMITS.inspirations} inspiration cards.`);
  items.forEach((item, index) => {
    if (!item.name.trim()) problems.push(`Inspiration card ${index + 1} needs a name.`);
    if (!item.quote.trim()) problems.push(`The card of ${item.name.trim() || `inspiration ${index + 1}`} needs a quote.`);
  });
  return problems;
};

// Empty lines are left out, as the server does when it saves
const forPreview = (leader) => ({ ...leader, tags: filled(leader.tags), highlights: filled(leader.highlights) });

function Select({ label, value, options, onChange }) {
  return (
    <Field label={label}>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={`${INPUT_STYLE} cursor-pointer`}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

function SectionTitle({ title, text }) {
  return (
    <div>
      <h3 className="text-sm font-black text-slate-900 dark:text-white">{title}</h3>
      {text && <p className="text-[11px] text-slate-500 dark:text-slate-400">{text}</p>}
    </div>
  );
}

/**
 * Website Pages > About Us: the hero text, the leader cards and the "Pioneering Minds" slider
 */
export default function AboutPageEditor({ showToast }) {
  const { confirm } = useDialog();
  const [draft, setDraft] = useState(null);
  const [savedCopy, setSavedCopy] = useState('');
  const [isDefault, setIsDefault] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const showLoaded = useCallback((about) => {
    const next = editable(about);
    setDraft(next);
    setSavedCopy(JSON.stringify(next));
    setIsDefault(Boolean(about.isDefault));
  }, []);

  const load = useCallback(
    () => fetchAdminAboutPage().then(showLoaded).catch((error) => setLoadError(error.message)),
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

  if (!draft) return <SkeletonForm fields={6} label="Loading the About Us page" />;

  const isChanged = JSON.stringify(draft) !== savedCopy;
  const problems = aboutProblems(draft);
  const shownLeaders = draft.leaders.filter((leader) => leader.visible).length;
  const shownCards = draft.inspirations.items.filter((item) => item.visible);

  const setHero = (changes) => setDraft((previous) => ({ ...previous, hero: { ...previous.hero, ...changes } }));
  const setLeaders = (leaders) => setDraft((previous) => ({ ...previous, leaders }));
  const setInspirations = (changes) =>
    setDraft((previous) => ({ ...previous, inspirations: { ...previous.inspirations, ...changes } }));

  const save = async () => {
    setIsSaving(true);
    try {
      const saved = await saveAdminAboutPage(draft);
      showLoaded(saved);
      setAboutPage(saved);
      showToast('About Us page saved. The changes now show on the website.');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const reset = async () => {
    const ok = await confirm({
      title: 'Go back to the built-in About Us page?',
      message: 'Your saved leaders, cards and text will be removed from the website.',
      confirmLabel: 'Use Built-in Page',
      tone: 'danger',
    });
    if (!ok) return;
    setIsSaving(true);
    try {
      const builtIn = await resetAdminAboutPage();
      showLoaded(builtIn);
      setAboutPage(builtIn);
      showToast('The built-in About Us page is back on the website.');
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
      <span>{isSaving ? 'Saving...' : 'Save About Us'}</span>
    </button>
  );

  return (
    <div className="space-y-5">
      <div className={`${PANEL_STYLE} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users size={18} className="text-blue-600" />
            <span>About Us Page</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            The text at the top, the leader cards and the "Pioneering Minds" slider.
            {isDefault ? ' Showing the built-in page until you save.' : ''}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a href="/aboutus" target="_blank" rel="noopener noreferrer" className={`${SECONDARY_BUTTON} ${NO_WRAP}`}>
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
          You have unsaved changes. Save them to show them on the About Us page.
        </p>
      )}

      {problems.length > 0 && (
        <div
          role="alert"
          data-testid="about-problems"
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

      <div className={`${PANEL_STYLE} space-y-3`}>
        <SectionTitle title="Top of the page" text="The box over the picture at the top of the About Us page." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextInput label="Badge" value={draft.hero.badge} onChange={(badge) => setHero({ badge })} maxLength={80} />
          <TextInput label="Heading" value={draft.hero.heading} onChange={(heading) => setHero({ heading })} maxLength={160} />
        </div>
        <TextArea
          label="Text"
          rows={2}
          value={draft.hero.subheading}
          onChange={(subheading) => setHero({ subheading })}
          maxLength={400}
        />
      </div>

      <div className={`${PANEL_STYLE} space-y-3`}>
        <SectionTitle
          title={`Leader cards (${draft.leaders.length}, ${shownLeaders} shown)`}
          text="Shown in this order. Turn one off to hide it without deleting it. Open the preview under a card to see it as visitors do."
        />
        <RepeatList
          items={draft.leaders}
          onChange={setLeaders}
          blank={BLANK_LEADER}
          addLabel="Add Leader"
          itemTitle={(leader) => `${leader.name || 'New leader'}${leader.visible ? '' : ' (hidden)'}`}
          renderItem={(leader, change) => (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <TextInput
                  label="Name"
                  required
                  value={leader.name}
                  onChange={(name) => change({ name })}
                  error={leader.name.trim() ? '' : 'Add a name.'}
                  placeholder="e.g. Prof. S. Ramachandram"
                  maxLength={80}
                />
                <TextInput
                  label="Role"
                  required
                  value={leader.role}
                  onChange={(role) => change({ role })}
                  error={leader.role.trim() ? '' : 'Add a role.'}
                  placeholder="e.g. Head of Advisory Board"
                  maxLength={100}
                />
                <Select label="Icon" value={leader.icon} options={LEADER_ICON_OPTIONS} onChange={(icon) => change({ icon })} />
              </div>
              <ImageField
                label="Photo"
                hint="A square photo of the face works best. Without one, the card shows the initials."
                value={{ url: leader.image }}
                onChange={(image) => change({ image: image.url })}
              />
              <TextArea
                label="Tagline"
                hint="The highlighted line under the name."
                rows={2}
                value={leader.tagline}
                onChange={(tagline) => change({ tagline })}
                maxLength={400}
              />
              <TextArea
                label="Leadership profile"
                rows={4}
                value={leader.bio}
                onChange={(bio) => change({ bio })}
                maxLength={1500}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <LinesField
                  label="Strategic impact points"
                  hint="One per line. Three fit the card best."
                  rows={3}
                  value={leader.highlights}
                  onChange={(highlights) => change({ highlights })}
                />
                <LinesField
                  label="Tags"
                  hint={`One per line, up to ${LIMITS.tags}.`}
                  rows={3}
                  value={leader.tags}
                  onChange={(tags) => change({ tags })}
                />
              </div>
              <TextInput
                label="Read more link"
                hint="Leave it empty to hide the button."
                value={leader.link}
                onChange={(link) => change({ link })}
                error={linkProblem(leader.link)}
                placeholder="https://www.visdomwaves.com/leadership-team/..."
              />
              <Toggle label="Show on the About Us page" checked={leader.visible} onChange={(visible) => change({ visible })} />
              <details className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <summary className="px-3 py-2 text-xs font-bold text-blue-700 dark:text-blue-400 cursor-pointer select-none">
                  Preview this card
                </summary>
                <div className="p-3 sm:p-4 bg-[#EBF0F7] dark:bg-[#070B14]">
                  <LeaderCard leader={forPreview(leader)} />
                </div>
              </details>
            </div>
          )}
        />
      </div>

      <div className={`${PANEL_STYLE} space-y-3`}>
        <SectionTitle
          title={`Pioneering Minds slider (${draft.inspirations.items.length}, ${shownCards.length} shown)`}
          text="The moving row of cards at the bottom of the page. With every card off, the slider is hidden."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextInput
            label="Badge"
            value={draft.inspirations.badge}
            onChange={(badge) => setInspirations({ badge })}
            maxLength={80}
          />
          <TextInput
            label="Heading"
            value={draft.inspirations.heading}
            onChange={(heading) => setInspirations({ heading })}
            maxLength={160}
          />
        </div>
        <TextArea
          label="Text"
          rows={2}
          value={draft.inspirations.subheading}
          onChange={(subheading) => setInspirations({ subheading })}
          maxLength={400}
        />

        {shownCards.length > 0 && (
          <div className="rounded-2xl bg-[#EBF0F7] dark:bg-[#070B14] p-4 overflow-x-auto" data-testid="inspirations-preview">
            <div className="flex gap-4 w-max">
              {shownCards.map((item, index) => (
                <LuminaryCard key={index} item={item} number={index + 1} />
              ))}
            </div>
          </div>
        )}

        <RepeatList
          items={draft.inspirations.items}
          onChange={(items) => setInspirations({ items })}
          blank={BLANK_INSPIRATION}
          addLabel="Add Card"
          itemTitle={(item) => `${item.name || 'New card'}${item.visible ? '' : ' (hidden)'}`}
          renderItem={(item, change) => (
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <TextInput
                  label="Name"
                  required
                  value={item.name}
                  onChange={(name) => change({ name })}
                  error={item.name.trim() ? '' : 'Add a name.'}
                  placeholder="e.g. Dr. A.P.J. Abdul Kalam"
                  maxLength={80}
                />
                <TextInput
                  label="Badge"
                  value={item.badge}
                  onChange={(badge) => change({ badge })}
                  placeholder="e.g. Space Exploration Pioneer"
                  maxLength={60}
                />
                <Select label="Colour" value={item.color} options={CARD_COLOR_OPTIONS} onChange={(color) => change({ color })} />
              </div>
              <ImageField
                label="Photo"
                hint="A square photo works best. Without one, the card shows the initials."
                value={{ url: item.image }}
                onChange={(image) => change({ image: image.url })}
              />
              <TextArea
                label="Quote"
                required
                rows={2}
                value={item.quote}
                onChange={(quote) => change({ quote })}
                error={item.quote.trim() ? '' : 'Add a quote.'}
                hint="The card shows about three short lines."
                maxLength={300}
              />
              <Toggle label="Show in the slider" checked={item.visible} onChange={(visible) => change({ visible })} />
            </div>
          )}
        />
      </div>

      {isChanged && <div className="flex justify-end">{saveButton}</div>}
    </div>
  );
}
