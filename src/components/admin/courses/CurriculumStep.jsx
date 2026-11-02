import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Download,
  Edit,
  FileSpreadsheet,
  Plus,
  Save,
  Trash2,
  Video,
} from 'lucide-react';
import {
  fetchAdminCurriculum,
  importAdminCurriculum,
  saveAdminCurriculum,
} from '../../../services/courseApi';
import {
  Field,
  ICON_BUTTON,
  INPUT_STYLE,
  PANEL_STYLE,
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
  TextArea,
  TextInput,
  Toggle,
  moveItem,
} from './fields';

const TEMPLATE_ROWS = [
  'Chapter Number,Chapter Name,Topic Code,Topic Title,Topic Description,Keywords,YouTube Link',
  '1,Units and Measurements,1.1,Need for Measurement,Why we measure,"units, SI units",https://www.youtube.com/watch?v=VIDEO_ID',
  '1,Units and Measurements,1.2,Systems of Units,,,',
];

const blankNode = (code = '') => ({ code, title: 'New Topic', description: '', keywords: [], youtubeUrl: '', premium: false, video: '', children: [] });

const updateNodes = (nodes, path, change) =>
  nodes.map((node, index) => {
    if (index !== path[0]) return node;
    if (path.length === 1) return change(node);
    return { ...node, children: updateNodes(node.children || [], path.slice(1), change) };
  });

const updateList = (nodes, path, change) => {
  if (path.length === 0) return change(nodes);
  return updateNodes(nodes, path, (node) => ({ ...node, children: change(node.children || []) }));
};

function TopicNode({ node, path, siblings, videos, onUpdate, onUpdateList }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const index = path[path.length - 1];
  const parentPath = path.slice(0, -1);
  const children = node.children || [];
  const set = (changes) => onUpdate(path, (current) => ({ ...current, ...changes }));

  const addChild = () => {
    onUpdateList(path, (list) => [...list, blankNode(`${node.code || ''}.${list.length + 1}`.replace(/^\./, ''))]);
    setIsOpen(true);
  };

  return (
    <li>
      <div className="flex items-center gap-1 py-1">
        {children.length > 0 ? (
          <button type="button" aria-label="Show subtopics" aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)} className={ICON_BUTTON}>
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <span className="w-[26px] shrink-0" />
        )}

        <span className="min-w-0 flex-1 text-xs text-slate-800 dark:text-slate-200 truncate">
          <span className="font-mono text-blue-600 dark:text-blue-400 mr-1.5">{node.code}</span>
          {node.title}
        </span>

        {(node.youtubeUrl || node.video) && <Video size={13} className="text-emerald-500 shrink-0" aria-label="Has a lesson" />}

        <button type="button" aria-label={`Edit ${node.title}`} onClick={() => setIsEditing(!isEditing)} className={ICON_BUTTON}>
          <Edit size={14} />
        </button>
        <button type="button" aria-label={`Add subtopic to ${node.title}`} onClick={addChild} className={ICON_BUTTON}>
          <Plus size={14} />
        </button>
        <button
          type="button"
          aria-label="Move up"
          disabled={index === 0}
          onClick={() => onUpdateList(parentPath, (list) => moveItem(list, index, -1))}
          className={`${ICON_BUTTON} hidden sm:block`}
        >
          <ArrowUp size={14} />
        </button>
        <button
          type="button"
          aria-label="Move down"
          disabled={index === siblings - 1}
          onClick={() => onUpdateList(parentPath, (list) => moveItem(list, index, 1))}
          className={`${ICON_BUTTON} hidden sm:block`}
        >
          <ArrowDown size={14} />
        </button>
        <button
          type="button"
          aria-label={`Remove ${node.title}`}
          onClick={() => onUpdateList(parentPath, (list) => list.filter((_, itemIndex) => itemIndex !== index))}
          className={`${ICON_BUTTON} hover:!text-rose-500`}
        >
          <Trash2 size={14} />
        </button>
      </div>

      {isEditing && (
        <div className="ml-7 mb-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <TextInput label="Code" value={node.code} onChange={(code) => set({ code })} />
            <div className="sm:col-span-3">
              <TextInput label="Title" value={node.title} onChange={(title) => set({ title })} />
            </div>
          </div>
          <TextArea label="Description" rows={2} value={node.description} onChange={(description) => set({ description })} />
          <TextInput
            label="Keywords"
            hint="Separate with commas. Students can search by these."
            value={(node.keywords || []).join(', ')}
            onChange={(value) => set({ keywords: value.split(',').map((word) => word.trimStart()) })}
          />
          <TextInput
            label="YouTube link"
            value={node.youtubeUrl}
            onChange={(youtubeUrl) => set({ youtubeUrl })}
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <Field label="Or link an uploaded video" hint="Its premium setting decides who can play it.">
            <select value={node.video || ''} onChange={(event) => set({ video: event.target.value })} className={INPUT_STYLE}>
              <option value="">No linked video</option>
              {videos.map((video) => (
                <option key={video._id} value={video._id}>{video.title}</option>
              ))}
            </select>
          </Field>
          <Toggle
            label="Premium lesson"
            hint="Only enrolled students should reach this, so visitors see it locked."
            checked={node.premium}
            onChange={(premium) => set({ premium })}
          />
        </div>
      )}

      {isOpen && children.length > 0 && (
        <ul className="ml-5 border-l border-slate-200 dark:border-slate-800 pl-1">
          {children.map((child, childIndex) => (
            <TopicNode
              key={child.nodeId || childIndex}
              node={child}
              path={[...path, childIndex]}
              siblings={children.length}
              videos={videos}
              onUpdate={onUpdate}
              onUpdateList={onUpdateList}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function ChapterRow({ chapter, index, total, videos, onChange, onMove, onRemove }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const topics = chapter.topics || [];

  const setTopics = (nextTopics) => onChange({ ...chapter, topics: nextTopics });
  const onUpdate = (path, change) => setTopics(updateNodes(topics, path, change));
  const onUpdateList = (path, change) => setTopics(updateList(topics, path, change));

  const addTopic = () => {
    setTopics([...topics, blankNode(`${chapter.number}.${topics.length + 1}`)]);
    setIsOpen(true);
  };

  return (
    <div data-testid="curriculum-chapter" className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="flex items-center gap-1 px-2 py-2 bg-slate-50 dark:bg-slate-950/60">
        <button type="button" aria-label={`Show topics in ${chapter.name}`} aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)} className={ICON_BUTTON}>
          {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        </button>
        <span className="min-w-0 flex-1 text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
          {chapter.number}. {chapter.name}
          <span className="ml-2 font-medium text-slate-500">({topics.length})</span>
        </span>
        <button type="button" aria-label={`Edit ${chapter.name}`} onClick={() => setIsEditing(!isEditing)} className={ICON_BUTTON}>
          <Edit size={14} />
        </button>
        <button type="button" aria-label="Move chapter up" disabled={index === 0} onClick={() => onMove(index, -1)} className={ICON_BUTTON}>
          <ArrowUp size={14} />
        </button>
        <button type="button" aria-label="Move chapter down" disabled={index === total - 1} onClick={() => onMove(index, 1)} className={ICON_BUTTON}>
          <ArrowDown size={14} />
        </button>
        <button type="button" aria-label={`Remove ${chapter.name}`} onClick={() => onRemove(index)} className={`${ICON_BUTTON} hover:!text-rose-500`}>
          <Trash2 size={14} />
        </button>
      </div>

      {isEditing && (
        <div className="p-3 space-y-2 border-t border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <TextInput label="Number" value={chapter.number} onChange={(number) => onChange({ ...chapter, number })} />
            <div className="sm:col-span-3">
              <TextInput label="Chapter name" value={chapter.name} onChange={(name) => onChange({ ...chapter, name })} />
            </div>
          </div>
          <TextArea
            label="Description"
            rows={2}
            value={chapter.description}
            onChange={(description) => onChange({ ...chapter, description })}
          />
        </div>
      )}

      {isOpen && (
        <div className="p-2 border-t border-slate-200 dark:border-slate-800">
          <ul>
            {topics.map((node, nodeIndex) => (
              <TopicNode
                key={node.nodeId || nodeIndex}
                node={node}
                path={[nodeIndex]}
                siblings={topics.length}
                videos={videos}
                onUpdate={onUpdate}
                onUpdateList={onUpdateList}
              />
            ))}
          </ul>
          <button type="button" onClick={addTopic} className={`${SECONDARY_BUTTON} mt-2`}>
            <Plus size={14} />
            <span>Add Topic</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function CurriculumStep({ courseId, showToast, onSaveDraft }) {
  const [chapters, setChapters] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(courseId));
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [pendingImport, setPendingImport] = useState(null);
  const fileInput = useRef(null);

  const load = useCallback(async () => {
    if (!courseId) return;
    try {
      const data = await fetchAdminCurriculum(courseId);
      setChapters(data.chapters);
      setVideos(data.videos);
      setIsDirty(false);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [courseId, showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const change = (next) => {
    setChapters(next);
    setIsDirty(true);
  };

  const addChapter = () =>
    change([...chapters, { number: String(chapters.length + 1), name: 'New Chapter', description: '', topics: [] }]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await saveAdminCurriculum(courseId, chapters);
      setChapters(result.chapters);
      setIsDirty(false);
      showToast(`Saved ${result.counts.chapters} chapters and ${result.counts.topics} topics`);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChooseFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (isDirty && !window.confirm('You have unsaved chapter changes. Importing will use the last saved chapters. Continue?')) {
      return;
    }

    setIsSaving(true);
    try {
      const preview = await importAdminCurriculum(courseId, file, { preview: true, mode: 'merge' });
      setPendingImport({ file, mode: 'merge', preview });
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleModeChange = async (mode) => {
    setIsSaving(true);
    try {
      const preview = await importAdminCurriculum(courseId, pendingImport.file, { preview: true, mode });
      setPendingImport({ ...pendingImport, mode, preview });
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmImport = async () => {
    setIsSaving(true);
    try {
      const result = await importAdminCurriculum(courseId, pendingImport.file, {
        preview: false,
        mode: pendingImport.mode,
      });
      showToast(`Imported ${result.imported.chapters} chapters and ${result.imported.topics} topics`);
      setPendingImport(null);
      await load();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob([`﻿${TEMPLATE_ROWS.join('\r\n')}`], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'chapters-template.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (!courseId) {
    return (
      <div className={`${PANEL_STYLE} text-center space-y-3`}>
        <p className="text-sm text-slate-600 dark:text-slate-300">Save this course first, then you can add its chapters.</p>
        <button type="button" onClick={onSaveDraft} className={`${PRIMARY_BUTTON} mx-auto`}>Save Draft</button>
      </div>
    );
  }

  if (isLoading) {
    return <p className="py-12 text-center text-sm text-slate-500">Loading chapters...</p>;
  }

  return (
    <div className="space-y-3">
      <div className={`${PANEL_STYLE} flex flex-wrap items-center justify-between gap-2`}>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          {chapters.length} {chapters.length === 1 ? 'chapter' : 'chapters'}
          {isDirty ? ' • Unsaved changes' : ''}
        </p>
        <div className="flex flex-wrap gap-2">
          <input
            ref={fileInput}
            type="file"
            data-testid="curriculum-file-input"
            accept=".xlsx,.csv"
            onChange={handleChooseFile}
            className="hidden"
          />
          <button type="button" onClick={downloadTemplate} className={SECONDARY_BUTTON}>
            <Download size={14} />
            <span>Template</span>
          </button>
          <button type="button" disabled={isSaving} onClick={() => fileInput.current?.click()} className={SECONDARY_BUTTON}>
            <FileSpreadsheet size={14} />
            <span>Import Excel</span>
          </button>
          <button type="button" disabled={isSaving || !isDirty} onClick={handleSave} className={PRIMARY_BUTTON}>
            <Save size={14} />
            <span>{isSaving ? 'Saving...' : 'Save Chapters'}</span>
          </button>
        </div>
      </div>

      {pendingImport && (
        <div data-testid="import-preview" className={`${PANEL_STYLE} space-y-3`}>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">Import preview: {pendingImport.file.name}</h4>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Found {pendingImport.preview.imported.chapters} chapters and {pendingImport.preview.imported.topics} topics.
            After import this course will have {pendingImport.preview.total.chapters} chapters and {pendingImport.preview.total.topics} topics.
          </p>

          <div className="flex flex-wrap gap-4">
            {[
              ['merge', 'Add to current chapters'],
              ['replace', 'Replace all chapters'],
            ].map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="import-mode"
                  checked={pendingImport.mode === value}
                  onChange={() => handleModeChange(value)}
                  className="accent-blue-600"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>

          {pendingImport.preview.problems.length > 0 && (
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 max-h-40 overflow-y-auto">
              <p className="text-xs font-bold text-amber-800 dark:text-amber-300 mb-1">
                {pendingImport.preview.problems.length} rows need checking:
              </p>
              <ul className="text-[11px] text-amber-800 dark:text-amber-300 space-y-0.5">
                {pendingImport.preview.problems.map((problem) => (
                  <li key={`${problem.row}-${problem.message}`}>Row {problem.row}: {problem.message}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setPendingImport(null)} className={SECONDARY_BUTTON}>Cancel</button>
            <button type="button" disabled={isSaving} onClick={handleConfirmImport} className={PRIMARY_BUTTON}>Confirm Import</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {chapters.map((chapter, index) => (
          <ChapterRow
            key={chapter.chapterId || index}
            chapter={chapter}
            index={index}
            total={chapters.length}
            videos={videos}
            onChange={(next) => change(chapters.map((item, itemIndex) => (itemIndex === index ? next : item)))}
            onMove={(from, direction) => change(moveItem(chapters, from, direction))}
            onRemove={(from) => change(chapters.filter((_, itemIndex) => itemIndex !== from))}
          />
        ))}
      </div>

      <button type="button" onClick={addChapter} className={SECONDARY_BUTTON}>
        <Plus size={14} />
        <span>Add Chapter</span>
      </button>
    </div>
  );
}
