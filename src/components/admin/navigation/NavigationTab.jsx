import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown, Eye, RefreshCw, RotateCcw, Save } from 'lucide-react';
import useCatalog from '../../../hooks/useCatalog';
import useDialog from '../../../hooks/useDialog';
import { setNavigation } from '../../../hooks/useNavigationMenu';
import { fetchNavigation, resetAdminNavigation, saveAdminNavigation } from '../../../services/navigationApi';
import MegaMenuPanel from '../../nav/MegaMenuPanel';
import { resolveSections, sectionItems, upgradeNavigation } from '../../nav/menuSections';
import { SkeletonForm } from '../AdminSkeleton';
import {
  Field,
  INPUT_STYLE,
  PANEL_STYLE,
  PRIMARY_BUTTON,
  RepeatList,
  SECONDARY_BUTTON,
  TextInput,
  Toggle,
} from '../courses/fields';

const ICON_OPTIONS = [
  ['layers', 'Layers'],
  ['globe', 'Globe'],
  ['flask', 'Flask'],
  ['book', 'Book'],
  ['graduation', 'Graduation cap'],
  ['star', 'Award'],
];

const SOURCE_OPTIONS = [
  ['streams', 'Academic groups from Streams (automatic)'],
  ['languages', 'Courses in the Languages stream (automatic)'],
  ['custom', 'My own links'],
];

const BLANK_LINK = { label: '', href: '/', kind: 'link', visible: true };
const BLANK_SECTION = { title: '', icon: 'book', source: 'custom', visible: true, items: [] };
const BLANK_ITEM = { label: '', desc: '', href: '/', visible: true };
const blankMenu = (href) => ({ footerText: '', exploreLabel: 'Explore All', exploreHref: href || '', sections: [] });

const ADDRESS_HINT = 'A page on this site, such as /courses/maths, or a full https:// link.';

// Only the parts the server stores
const editable = (navigation) => ({ links: upgradeNavigation(navigation).links });

function Select({ label, value, onChange, options }) {
  return (
    <Field label={label}>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={`${INPUT_STYLE} cursor-pointer`}>
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </Field>
  );
}

const tabStyle = (isActive) =>
  `px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
    isActive
      ? 'bg-blue-600 border-blue-600 text-white'
      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-400'
  }`;

/**
 * Admin page for the website's top menu. Any top link can open its own dropdown, each with its own columns.
 */
export default function NavigationTab({ showToast }) {
  const { confirm } = useDialog();
  const { courses, streams } = useCatalog();
  const catalog = useMemo(() => ({ courses, streams }), [courses, streams]);
  const [draft, setDraft] = useState(null);
  const [savedCopy, setSavedCopy] = useState('');
  const [isDefault, setIsDefault] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [chosenMenu, setChosenMenu] = useState(-1);

  const showLoaded = useCallback((navigation) => {
    setDraft(editable(navigation));
    setSavedCopy(JSON.stringify(editable(navigation)));
    setIsDefault(Boolean(navigation.isDefault));
  }, []);

  const load = useCallback(
    () => fetchNavigation().then(showLoaded).catch((error) => setLoadError(error.message)),
    [showLoaded]
  );

  useEffect(() => {
    load();
  }, [load]);

  const retry = () => {
    setLoadError('');
    load();
  };

  // Positions of the links that open a dropdown, and the one being edited and previewed
  const menuIndexes = useMemo(
    () => (draft ? draft.links.map((link, index) => (link.kind === 'menu' ? index : -1)).filter((index) => index >= 0) : []),
    [draft]
  );
  const selected = menuIndexes.includes(chosenMenu) ? chosenMenu : (menuIndexes[0] ?? -1);
  const selectedLink = selected >= 0 ? draft.links[selected] : null;
  const selectedMenu = selectedLink?.menu || blankMenu(selectedLink?.href);

  const previewSections = useMemo(
    () => (selectedLink ? resolveSections(selectedLink.menu, catalog, { keepEmpty: true }) : []),
    [selectedLink, catalog]
  );

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

  if (!draft) return <SkeletonForm fields={6} label="Loading the menu" />;

  const isChanged = JSON.stringify(draft) !== savedCopy;

  const setLinks = (links) => setDraft((previous) => ({ ...previous, links }));
  const setSelectedMenu = (changes) =>
    setDraft((previous) => ({
      ...previous,
      links: previous.links.map((link, index) =>
        index === selected ? { ...link, menu: { ...(link.menu || blankMenu(link.href)), ...changes } } : link
      ),
    }));

  const save = async () => {
    setIsSaving(true);
    try {
      const saved = await saveAdminNavigation(draft);
      showLoaded(saved);
      setNavigation(saved);
      showToast('Menu saved. It now shows on the website.');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const reset = async () => {
    const ok = await confirm({
      title: 'Go back to the built-in menu?',
      message: 'Your saved menu changes will be removed from the website.',
      confirmLabel: 'Reset Menu',
      tone: 'danger',
    });
    if (!ok) return;
    setIsSaving(true);
    try {
      const builtIn = await resetAdminNavigation();
      showLoaded(builtIn);
      setNavigation(builtIn);
      showToast('The built-in menu is back on the website.');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const dropdownTabs = (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a dropdown">
      {menuIndexes.map((index) => (
        <button
          key={index}
          type="button"
          aria-pressed={index === selected}
          onClick={() => setChosenMenu(index)}
          className={tabStyle(index === selected)}
        >
          <span>{draft.links[index].label || 'New link'}</span>
          <ChevronDown size={13} />
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className={`${PANEL_STYLE} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Website Menu</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            The links at the top of every page and their dropdowns.
            {isDefault ? ' Showing the built-in menu until you save.' : ''}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {isChanged && <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Unsaved changes</span>}
          <button type="button" onClick={reset} disabled={isSaving || isDefault} className={SECONDARY_BUTTON}>
            <RotateCcw size={14} />
            <span>Reset to Built-in</span>
          </button>
          <button type="button" onClick={save} disabled={isSaving || !isChanged} className={PRIMARY_BUTTON}>
            <Save size={14} />
            <span>{isSaving ? 'Saving...' : 'Save Menu'}</span>
          </button>
        </div>
      </div>

      {/* Live preview */}
      <section className={`${PANEL_STYLE} space-y-4`} aria-label="Menu preview">
        <div className="flex flex-wrap items-center gap-2">
          <Eye size={15} className="text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-black text-slate-900 dark:text-white">Preview</h3>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Updates as you type. Click a dropdown link to see it.</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-2xl bg-blue-50 dark:bg-slate-950 border border-blue-100 dark:border-slate-800">
          {draft.links.map((link, index) =>
            link.visible === false ? null : link.kind === 'menu' ? (
              <button
                key={index}
                type="button"
                aria-pressed={index === selected}
                onClick={() => setChosenMenu(index)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
                  index === selected
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-800 dark:text-slate-200 hover:text-blue-600'
                }`}
              >
                {link.label || 'New link'}
                <ChevronDown size={13} className="text-blue-600 dark:text-blue-400" />
              </button>
            ) : (
              <span key={index} className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200">
                {link.label || 'New link'}
              </span>
            )
          )}
        </div>

        {!selectedLink ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No link opens a dropdown. Tick "Opens a dropdown" on a top link to add one.
          </p>
        ) : previewSections.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="min-w-[560px] max-w-[820px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg py-2">
              <MegaMenuPanel sections={previewSections} menu={selectedMenu} onNavigate={(event) => event.preventDefault()} />
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            The "{selectedLink.label}" dropdown has no columns yet, so on the website the link opens its page directly.
          </p>
        )}
      </section>

      {/* Top links */}
      <section className={`${PANEL_STYLE} space-y-4`} aria-label="Top links">
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white">Top Links</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Shown left to right in this order. Up to 8. Any of them can open its own dropdown.
          </p>
        </div>
        <RepeatList
          items={draft.links}
          onChange={setLinks}
          blank={BLANK_LINK}
          addLabel="Add Link"
          itemTitle={(link) => `${link.label || 'New link'}${link.kind === 'menu' ? ' (opens a dropdown)' : ''}`}
          renderItem={(link, update) => (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TextInput label="Name" required value={link.label} onChange={(label) => update({ label })} maxLength={40} />
                <TextInput label="Address" required value={link.href} onChange={(href) => update({ href })} hint={ADDRESS_HINT} />
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <Toggle label="Show on the website" checked={link.visible} onChange={(visible) => update({ visible })} />
                <Toggle
                  label="Opens a dropdown"
                  checked={link.kind === 'menu'}
                  onChange={(isMenu) => {
                    if (!isMenu) return update({ kind: 'link' });
                    update({ kind: 'menu', menu: link.menu || blankMenu(link.href) });
                    setChosenMenu(draft.links.indexOf(link));
                  }}
                />
              </div>
            </div>
          )}
        />
      </section>

      {/* Dropdowns */}
      <section className={`${PANEL_STYLE} space-y-4`} aria-label="Dropdowns">
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white">Dropdowns</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Each link marked "Opens a dropdown" has its own. Pick one to edit it. Up to 4 columns each.
          </p>
        </div>

        {!selectedLink ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">No link opens a dropdown yet.</p>
        ) : (
          <>
            {dropdownTabs}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <TextInput label="Footer text" value={selectedMenu.footerText} onChange={(footerText) => setSelectedMenu({ footerText })} maxLength={60} />
              <TextInput label="Explore link name" value={selectedMenu.exploreLabel} onChange={(exploreLabel) => setSelectedMenu({ exploreLabel })} maxLength={30} />
              <TextInput label="Explore link address" value={selectedMenu.exploreHref} onChange={(exploreHref) => setSelectedMenu({ exploreHref })} />
            </div>

            <RepeatList
              items={selectedMenu.sections}
              onChange={(sections) => setSelectedMenu({ sections })}
              blank={BLANK_SECTION}
              addLabel="Add Column"
              itemTitle={(section) => section.title || 'New column'}
              renderItem={(section, update) => {
                const automatic = section.source !== 'custom' ? sectionItems(section, catalog) : [];
                return (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <TextInput label="Column title" required value={section.title} onChange={(title) => update({ title })} maxLength={40} />
                      <Select label="Icon" value={section.icon} onChange={(icon) => update({ icon })} options={ICON_OPTIONS} />
                      <Select label="Links come from" value={section.source} onChange={(source) => update({ source })} options={SOURCE_OPTIONS} />
                    </div>
                    <Toggle label="Show this column" checked={section.visible} onChange={(visible) => update({ visible })} />

                    {section.source === 'custom' && !section.items.some((item) => item.visible !== false) && (
                      <p className="px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-[11px] font-semibold text-amber-800 dark:text-amber-300">
                        Add at least one link to show this column on the website.
                      </p>
                    )}

                    {section.source === 'custom' ? (
                      <RepeatList
                        items={section.items}
                        onChange={(items) => update({ items })}
                        blank={BLANK_ITEM}
                        addLabel="Add Link to Column"
                        itemTitle={(item) => item.label || 'New link'}
                        renderItem={(item, updateItem) => (
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <TextInput label="Link name" required value={item.label} onChange={(label) => updateItem({ label })} maxLength={60} />
                              <TextInput label="Small text below" value={item.desc} onChange={(desc) => updateItem({ desc })} maxLength={80} />
                              <TextInput label="Link address" required value={item.href} onChange={(href) => updateItem({ href })} />
                            </div>
                            <Toggle label="Show this link" checked={item.visible} onChange={(visible) => updateItem({ visible })} />
                          </div>
                        )}
                      />
                    ) : (
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700">
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                          These links update by themselves from Courses &amp; Streams. Choose "My own links" to type them yourself.
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {automatic.length === 0 ? (
                            <span className="text-xs text-slate-500 dark:text-slate-400">Nothing to show yet.</span>
                          ) : (
                            automatic.map((item) => (
                              <span key={item.href} className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200">
                                {item.name}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }}
            />
          </>
        )}
      </section>
    </div>
  );
}
