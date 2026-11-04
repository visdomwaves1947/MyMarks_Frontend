import React, { useCallback, useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Edit, Eye, EyeOff, Plus, Trash2, X } from 'lucide-react';
import {
  createAdminStream,
  deleteAdminStream,
  fetchAdminStreams,
  saveAdminStreamOrder,
  updateAdminStream,
} from '../../../services/courseApi';
import { refreshCatalog } from '../../../hooks/useCatalog';
import { SkeletonRows } from '../AdminSkeleton';
import useDialog from '../../../hooks/useDialog';
import { ICON_BUTTON, PANEL_STYLE, PRIMARY_BUTTON, SECONDARY_BUTTON, TextArea, TextInput, moveItem } from './fields';

const BLANK_STREAM = {
  code: '',
  name: '',
  shortName: '',
  description: '',
  careerBadge: '',
  careerList: '',
};

export default function StreamsPanel({ showToast, onChanged }) {
  const { confirm, alert } = useDialog();
  const [streams, setStreams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setStreams(await fetchAdminStreams());
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const afterChange = async () => {
    await load();
    refreshCatalog();
    if (onChanged) onChanged();
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      if (form._id) {
        await updateAdminStream(form._id, form);
        showToast('Stream saved');
      } else {
        await createAdminStream(form);
        showToast('Stream added');
      }
      setForm(null);
      await afterChange();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleVisibility = async (stream) => {
    try {
      await updateAdminStream(stream._id, { status: stream.status === 'active' ? 'hidden' : 'active' });
      await afterChange();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  // A stream in use is hidden instead. The server also checks archived courses, and says why it refuses.
  const handleDelete = async (stream) => {
    if (stream.courseCount > 0) {
      await alert({
        title: `${stream.code} is in use`,
        message: `It is on ${stream.courseCount} ${stream.courseCount === 1 ? 'course' : 'courses'}, so it can't be deleted. Hide it instead, or take it off those courses first.`,
      });
      return;
    }
    const ok = await confirm({
      title: `Delete the ${stream.code} stream?`,
      message: 'This cannot be undone.',
      confirmLabel: 'Delete Stream',
      tone: 'danger',
    });
    if (!ok) return;
    try {
      await deleteAdminStream(stream._id);
      showToast('Stream deleted');
      await afterChange();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleMove = async (index, direction) => {
    const next = moveItem(streams, index, direction);
    setStreams(next);
    try {
      await saveAdminStreamOrder(next.map((stream) => stream._id));
      refreshCatalog();
    } catch (error) {
      showToast(error.message, 'error');
      await load();
    }
  };

  const setField = (key) => (value) => setForm({ ...form, [key]: value });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button type="button" onClick={() => setForm({ ...BLANK_STREAM })} className={PRIMARY_BUTTON}>
          <Plus size={15} />
          <span>Add Stream</span>
        </button>
      </div>

      {form && (
        <form onSubmit={handleSave} className={`${PANEL_STYLE} space-y-3`}>
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              {form._id ? `Edit ${form.code}` : 'New Stream'}
            </h4>
            <button type="button" aria-label="Close" onClick={() => setForm(null)} className={ICON_BUTTON}>
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextInput label="Code" required value={form.code} onChange={setField('code')} placeholder="e.g. MPC" maxLength={20} />
            <TextInput label="Name" required value={form.name} onChange={setField('name')} placeholder="e.g. Mathematics, Physics, Chemistry" />
            <TextInput label="Short name for menus" value={form.shortName} onChange={setField('shortName')} placeholder="e.g. Maths, Physics, Chem" />
            <TextInput label="Career badge" value={form.careerBadge} onChange={setField('careerBadge')} placeholder="e.g. Engineering & Tech" />
          </div>
          <TextArea label="Description" rows={2} value={form.description} onChange={setField('description')} />
          <TextArea label="Careers" rows={2} value={form.careerList} onChange={setField('careerList')} />

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setForm(null)} className={SECONDARY_BUTTON}>Cancel</button>
            <button type="submit" disabled={isSaving} className={PRIMARY_BUTTON}>
              {isSaving ? 'Saving...' : 'Save Stream'}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <SkeletonRows rows={6} label="Loading streams" />
      ) : (
      <div className={`${PANEL_STYLE} !p-0 overflow-hidden`}>
        {streams.map((stream, index) => (
          <div
            key={stream._id}
            className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0 border-slate-100 dark:border-slate-800/70"
          >
            <div className="flex flex-col">
              <button type="button" aria-label="Move up" disabled={index === 0} onClick={() => handleMove(index, -1)} className={ICON_BUTTON}>
                <ArrowUp size={13} />
              </button>
              <button type="button" aria-label="Move down" disabled={index === streams.length - 1} onClick={() => handleMove(index, 1)} className={ICON_BUTTON}>
                <ArrowDown size={13} />
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white text-sm">{stream.code}</span>
                {stream.status === 'hidden' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                    Hidden
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {stream.name} • {stream.courseCount} {stream.courseCount === 1 ? 'course' : 'courses'}
              </p>
            </div>

            <button
              type="button"
              aria-label={stream.status === 'active' ? `Hide ${stream.code}` : `Show ${stream.code}`}
              title={stream.status === 'active' ? 'Hide from the website' : 'Show on the website'}
              onClick={() => handleVisibility(stream)}
              className={ICON_BUTTON}
            >
              {stream.status === 'active' ? <Eye size={15} /> : <EyeOff size={15} />}
            </button>
            <button
              type="button"
              aria-label={`Edit ${stream.code}`}
              onClick={() => setForm({ ...BLANK_STREAM, ...stream })}
              className={ICON_BUTTON}
            >
              <Edit size={15} />
            </button>
            <button
              type="button"
              aria-label={`Delete ${stream.code}`}
              title={stream.courseCount ? 'In use: hide it instead, or take it off its courses first' : 'Delete'}
              onClick={() => handleDelete(stream)}
              className={`${ICON_BUTTON} hover:!text-rose-500`}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}

        {streams.length === 0 && (
          <p className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
            No streams yet. Click Add Stream to create the first one.
          </p>
        )}
      </div>
      )}
    </div>
  );
}
