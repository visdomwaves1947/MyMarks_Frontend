import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Archive, ArrowDown, ArrowUp, Edit, ExternalLink, Plus, RotateCcw, Search, Send, Undo2 } from 'lucide-react';
import {
  fetchAdminCourseOptions,
  fetchAdminCourses,
  fetchAdminStreams,
  saveAdminCourseOrder,
  setAdminCourseStatus,
} from '../../../services/courseApi';
import { refreshCatalog } from '../../../hooks/useCatalog';
import { courseImage, showDefaultImage } from '../../../utils/courseImage';
import { SkeletonRows } from '../AdminSkeleton';
import CourseEditor from './CourseEditor';
import CourseFlags from '../../course/CourseFlags';
import StreamsPanel from './StreamsPanel';
import OptionsPanel from './OptionsPanel';
import { ICON_BUTTON, INPUT_STYLE, PANEL_STYLE, PRIMARY_BUTTON, moveItem } from './fields';

const STATUS_STYLES = {
  published: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
  draft: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
  archived: 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700',
};

const VIEW_TABS = [
  { id: 'courses', label: 'Courses' },
  { id: 'streams', label: 'Streams' },
  { id: 'boards', label: 'Boards' },
  { id: 'years', label: 'Years' },
];

/**
 * openRequest opens one course straight away, at a step and lesson, when the Videos page sends the admin here
 */
export default function CoursesTab({ showToast, onChanged, openRequest = null }) {
  const [request, setRequest] = useState(openRequest);
  const [view, setView] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [streams, setStreams] = useState([]);
  const [courseOptions, setCourseOptions] = useState({ boards: [], years: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [streamFilter, setStreamFilter] = useState('all');
  const [editingId, setEditingId] = useState(openRequest?.id || null); // course id, 'new' or null

  const load = useCallback(async () => {
    try {
      const [courseList, streamList, optionLists] = await Promise.all([
        fetchAdminCourses(),
        fetchAdminStreams(),
        fetchAdminCourseOptions(),
      ]);
      setCourses(courseList);
      setStreams(streamList);
      setCourseOptions(optionLists);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const closeEditor = useCallback(() => {
    setEditingId(null);
    setRequest(null);
  }, []);

  const afterChange = useCallback(async () => {
    await load();
    refreshCatalog();
    if (onChanged) onChanged();
  }, [load, onChanged]);

  const visibleCourses = useMemo(() => {
    const term = search.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' ? course.status !== 'archived' : course.status === statusFilter);
      const matchesStream =
        streamFilter === 'all' || (course.streams || []).some((stream) => stream._id === streamFilter);
      const matchesSearch = !term || course.name.toLowerCase().includes(term);
      return matchesStatus && matchesStream && matchesSearch;
    });
  }, [courses, search, statusFilter, streamFilter]);

  // Moving needs the whole list on screen, or the saved order would skip hidden courses
  const canReorder = !search.trim() && statusFilter === 'active' && streamFilter === 'all';

  const handleStatus = async (course, status) => {
    try {
      await setAdminCourseStatus(course._id, status);
      showToast(`${course.name} is now ${status}`);
      await afterChange();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleMove = async (index, direction) => {
    const next = moveItem(visibleCourses, index, direction);
    const archived = courses.filter((course) => course.status === 'archived');
    setCourses([...next, ...archived]);
    try {
      await saveAdminCourseOrder([...next, ...archived].map((course) => course._id));
      refreshCatalog();
    } catch (error) {
      showToast(error.message, 'error');
      await load();
    }
  };

  if (editingId) {
    return (
      <CourseEditor
        courseId={editingId === 'new' ? null : editingId}
        streams={streams}
        boards={courseOptions.boards}
        years={courseOptions.years}
        showToast={showToast}
        onChanged={afterChange}
        onClose={closeEditor}
        initialStep={request?.id === editingId ? request.step : 0}
        focusNodeId={request?.id === editingId ? request.nodeId : null}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="inline-flex p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800">
        {VIEW_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setView(tab.id)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              view === tab.id ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {view === 'streams' ? (
        <StreamsPanel showToast={showToast} onChanged={afterChange} />
      ) : view === 'boards' || view === 'years' ? (
        <OptionsPanel key={view} kind={view === 'boards' ? 'board' : 'year'} showToast={showToast} onChanged={afterChange} />
      ) : (
        <>
          {/* Filter Bar */}
          <div className={`${PANEL_STYLE} flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3`}>
            <div className="relative grow max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className={`${INPUT_STYLE} pl-10`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <select
                aria-label="Filter by status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className={`${INPUT_STYLE} !w-auto cursor-pointer`}
              >
                <option value="active">Draft and Published</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
                <option value="all">All</option>
              </select>

              <select
                aria-label="Filter by stream"
                value={streamFilter}
                onChange={(event) => setStreamFilter(event.target.value)}
                className={`${INPUT_STYLE} !w-auto cursor-pointer`}
              >
                <option value="all">All Streams</option>
                {streams.map((stream) => (
                  <option key={stream._id} value={stream._id}>{stream.code}</option>
                ))}
              </select>

              <button type="button" onClick={() => setEditingId('new')} className={PRIMARY_BUTTON}>
                <Plus size={15} />
                <span>Add Course</span>
              </button>
            </div>
          </div>

          {/* Course List */}
          {isLoading ? (
            <SkeletonRows rows={7} label="Loading courses" />
          ) : (
          <div className={`${PANEL_STYLE} !p-0 overflow-hidden`}>
            {visibleCourses.map((course, index) => (
              <div
                key={course._id}
                data-testid="admin-course-row"
                className="flex flex-wrap sm:flex-nowrap items-center gap-3 px-3 sm:px-4 py-3 border-b last:border-b-0 border-slate-100 dark:border-slate-800/70"
              >
                {canReorder && (
                  <div className="flex flex-col">
                    <button type="button" aria-label={`Move ${course.name} up`} disabled={index === 0} onClick={() => handleMove(index, -1)} className={ICON_BUTTON}>
                      <ArrowUp size={13} />
                    </button>
                    <button type="button" aria-label={`Move ${course.name} down`} disabled={index === visibleCourses.length - 1} onClick={() => handleMove(index, 1)} className={ICON_BUTTON}>
                      <ArrowDown size={13} />
                    </button>
                  </div>
                )}

                <img
                  src={courseImage(course.thumbnail?.url, 160)}
                  alt=""
                  loading="lazy"
                  onError={showDefaultImage}
                  className="w-14 h-14 rounded-xl object-cover shrink-0 bg-slate-100 dark:bg-slate-800"
                />

                <div className="min-w-0 flex-1 basis-40">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm truncate">{course.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${STATUS_STYLES[course.status]}`}>
                      {course.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {(course.streams || []).map((stream) => stream.code).join(' / ') || 'No stream'}
                    {course.price !== null && course.price !== undefined ? ` • ₹${course.price}` : ' • No price'}
                    {course.ownLink ? ' • Own link' : ''}
                  </p>
                  <CourseFlags course={course} className="mt-1" />
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-auto">
                  <button type="button" aria-label={`Edit ${course.name}`} title="Edit" onClick={() => setEditingId(course._id)} className={ICON_BUTTON}>
                    <Edit size={16} />
                  </button>

                  <a
                    href={`/courses/${course.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Preview ${course.name}`}
                    title="Preview"
                    className={ICON_BUTTON}
                  >
                    <ExternalLink size={16} />
                  </a>

                  {course.status === 'draft' && (
                    <button type="button" aria-label={`Publish ${course.name}`} title="Publish" onClick={() => handleStatus(course, 'published')} className={ICON_BUTTON}>
                      <Send size={16} />
                    </button>
                  )}
                  {course.status === 'published' && (
                    <button type="button" aria-label={`Unpublish ${course.name}`} title="Move back to draft" onClick={() => handleStatus(course, 'draft')} className={ICON_BUTTON}>
                      <Undo2 size={16} />
                    </button>
                  )}
                  {course.status === 'archived' ? (
                    <button type="button" aria-label={`Restore ${course.name}`} title="Restore as a draft" onClick={() => handleStatus(course, 'draft')} className={ICON_BUTTON}>
                      <RotateCcw size={16} />
                    </button>
                  ) : (
                    <button type="button" aria-label={`Archive ${course.name}`} title="Archive" onClick={() => handleStatus(course, 'archived')} className={ICON_BUTTON}>
                      <Archive size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {visibleCourses.length === 0 && (
              <p className="py-14 text-center text-slate-400 dark:text-slate-500 text-sm">
                No courses found. Click Add Course to create one.
              </p>
            )}
          </div>
          )}
        </>
      )}
    </div>
  );
}
