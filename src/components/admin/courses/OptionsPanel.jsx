import React, { useCallback, useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Check, Edit, Eye, EyeOff, Plus, Trash2, X } from 'lucide-react';
import {
  createAdminCourseOption,
  deleteAdminCourseOption,
  fetchAdminCourseOptions,
  saveAdminCourseOptionOrder,
  updateAdminCourseOption,
} from '../../../services/courseApi';
import { SkeletonRows } from '../AdminSkeleton';
import useDialog from '../../../hooks/useDialog';
import { ICON_BUTTON, INPUT_STYLE, PANEL_STYLE, PRIMARY_BUTTON, moveItem } from './fields';

const KINDS = {
  board: { listKey: 'boards', label: 'Board', plural: 'Boards', example: 'e.g. CBSE' },
  year: { listKey: 'years', label: 'Year', plural: 'Years', example: 'e.g. Bridge Course' },
};

/**
 * Boards or years a course can be ticked for. Hiding one keeps it on the courses that have it.
 */
export default function OptionsPanel({ kind, showToast, onChanged }) {
  const { listKey, label, plural, example } = KINDS[kind];
  const { confirm } = useDialog();
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [editing, setEditing] = useState(null); // { id, name }
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setOptions((await fetchAdminCourseOptions())[listKey]);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [listKey, showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const afterChange = async () => {
    await load();
    if (onChanged) onChanged();
  };

  const run = async (work, message) => {
    setIsSaving(true);
    try {
      const result = await work();
      if (message) showToast(typeof message === 'function' ? message(result) : message);
      await afterChange();
      return true;
    } catch (error) {
      showToast(error.message, 'error');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const add = async (event) => {
    event.preventDefault();
    if (!newName.trim()) return;
    if (await run(() => createAdminCourseOption(kind, newName), `${label} added`)) setNewName('');
  };

  const rename = async (event) => {
    event.preventDefault();
    const done = await run(
      () => updateAdminCourseOption(editing.id, { name: editing.name }),
      (result) =>
        result.coursesUpdated
          ? `${label} renamed on ${result.coursesUpdated} ${result.coursesUpdated === 1 ? 'course' : 'courses'}`
          : `${label} renamed`
    );
    if (done) setEditing(null);
  };

  const remove = async (option) => {
    const used = option.courseCount
      ? `It will also be taken off ${option.courseCount} ${option.courseCount === 1 ? 'course' : 'courses'}. `
      : '';
    const ok = await confirm({
      title: `Delete "${option.name}"?`,
      message: `${used}This cannot be undone.`,
      confirmLabel: `Delete ${label}`,
      tone: 'danger',
    });
    if (!ok) return;
    run(
      () => deleteAdminCourseOption(option._id),
      (result) =>
        result.coursesUpdated
          ? `${label} deleted and taken off ${result.coursesUpdated} ${result.coursesUpdated === 1 ? 'course' : 'courses'}`
          : `${label} deleted`
    );
  };

  const toggleVisibility = (option) =>
    run(() => updateAdminCourseOption(option._id, { status: option.status === 'active' ? 'hidden' : 'active' }));

  const move = async (index, direction) => {
    const next = moveItem(options, index, direction);
    setOptions(next);
    try {
      await saveAdminCourseOptionOrder(next.map((option) => option._id));
      if (onChanged) onChanged();
    } catch (error) {
      showToast(error.message, 'error');
      await load();
    }
  };

  return (
    <div className="space-y-4" aria-label={`${plural} list`} role="region">
      <form onSubmit={add} className={`${PANEL_STYLE} flex flex-col sm:flex-row sm:items-end gap-3`}>
        <label className="block flex-1">
          <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">New {label.toLowerCase()} name</span>
          <input
            type="text"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder={example}
            maxLength={60}
            className={INPUT_STYLE}
          />
        </label>
        <button type="submit" disabled={isSaving || !newName.trim()} className={PRIMARY_BUTTON}>
          <Plus size={15} />
          <span>Add {label}</span>
        </button>
      </form>

      <p className="text-[11px] text-slate-500 dark:text-slate-400 px-1">
        These are the {plural.toLowerCase()} you can tick on a course. Renaming one also renames it on its courses. Hiding one takes it off the
        list for new courses, and courses that already have it keep it. Deleting one also takes it off its courses.
      </p>

      {isLoading ? (
        <SkeletonRows rows={3} label={`Loading ${plural.toLowerCase()}`} />
      ) : (
        <div className={`${PANEL_STYLE} !p-0 overflow-hidden`}>
          {options.map((option, index) => (
            <div
              key={option._id}
              data-testid="course-option"
              className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0 border-slate-100 dark:border-slate-800/70"
            >
              <div className="flex flex-col">
                <button type="button" aria-label="Move up" disabled={index === 0} onClick={() => move(index, -1)} className={ICON_BUTTON}>
                  <ArrowUp size={13} />
                </button>
                <button type="button" aria-label="Move down" disabled={index === options.length - 1} onClick={() => move(index, 1)} className={ICON_BUTTON}>
                  <ArrowDown size={13} />
                </button>
              </div>

              {editing?.id === option._id ? (
                <form onSubmit={rename} className="flex-1 flex items-center gap-2 min-w-0">
                  <input
                    type="text"
                    aria-label={`New name for ${option.name}`}
                    value={editing.name}
                    onChange={(event) => setEditing({ ...editing, name: event.target.value })}
                    maxLength={60}
                    autoFocus
                    className={INPUT_STYLE}
                  />
                  <button type="submit" disabled={isSaving || !editing.name.trim()} aria-label="Save name" className={ICON_BUTTON}>
                    <Check size={16} />
                  </button>
                  <button type="button" aria-label="Cancel" onClick={() => setEditing(null)} className={ICON_BUTTON}>
                    <X size={16} />
                  </button>
                </form>
              ) : (
                <>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{option.name}</span>
                      {option.status === 'hidden' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">Hidden</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {option.courseCount} {option.courseCount === 1 ? 'course' : 'courses'}
                    </p>
                  </div>

                  <button
                    type="button"
                    aria-label={option.status === 'active' ? `Hide ${option.name}` : `Show ${option.name}`}
                    title={option.status === 'active' ? 'Hide from the course editor' : 'Show in the course editor'}
                    onClick={() => toggleVisibility(option)}
                    className={ICON_BUTTON}
                  >
                    {option.status === 'active' ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button
                    type="button"
                    aria-label={`Rename ${option.name}`}
                    onClick={() => setEditing({ id: option._id, name: option.name })}
                    className={ICON_BUTTON}
                  >
                    <Edit size={15} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${option.name}`}
                    title="Delete"
                    disabled={isSaving}
                    onClick={() => remove(option)}
                    className={`${ICON_BUTTON} hover:!text-rose-500`}
                  >
                    <Trash2 size={15} />
                  </button>
                </>
              )}
            </div>
          ))}

          {options.length === 0 && (
            <p className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">No {plural.toLowerCase()} yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
