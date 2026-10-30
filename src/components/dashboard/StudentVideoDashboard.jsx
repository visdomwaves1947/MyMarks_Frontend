import React, { useState, useEffect, useMemo } from 'react';
import {
  Play,
  Video,
  Film,
  Search,
  Filter,
  Sparkles,
  BookOpen,
  Clock,
  CheckCircle2,
  Lock,
  Unlock,
  ChevronRight,
  X,
  ExternalLink,
  Layers,
  GraduationCap,
  ShieldCheck,
  Maximize2
} from 'lucide-react';
import { fetchStudentVideos } from '../../services/api';

export default function StudentVideoDashboard({
  studentBoard = 'Both Boards',
  studentYear = '1st Year',
  onOpenBooking = null,
}) {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States - defaults to student's board and year if given
  const [selectedBoard, setSelectedBoard] = useState(() => {
    if (studentBoard && studentBoard.includes('Telangana')) return 'Telangana Intermediate';
    if (studentBoard && studentBoard.includes('Andhra')) return 'Andhra Pradesh Intermediate';
    return 'all';
  });

  const [selectedYear, setSelectedYear] = useState('all');

  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  // Load published videos from backend
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchStudentVideos()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setVideos(data);
        }
      })
      .catch((err) => console.warn('Could not load student videos:', err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Helper to extract YouTube ID
  const extractYouTubeId = (url) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = trimmed.match(regExp);
    return match && match[1] ? match[1] : '';
  };

  // Known standard syllabus chapters to detect custom / unrelated topics
  const standardSyllabusChapters = useMemo(() => [
    'functions', 'mathematical induction', 'matrices', 'complex numbers', 'de moivre',
    'quadratic', 'theory of equations', 'permutations', 'binomial', 'partial fractions',
    'measures of dispersion', 'probability', 'random variables', 'trigonometry', 'hyperbolic',
    'properties of triangles', 'locus', 'transformation of axes', 'straight line', 'pair of straight lines',
    'three dimensional', 'direction cosines', 'plane', 'limits', 'differentiation',
    'errors', 'tangents', 'mean value', 'integration', 'definite integrals',
    'differential equations', 'circles', 'system of circles', 'parabola', 'ellipse', 'hyperbola',
    'units and measurements', 'motion in a straight line', 'motion in a plane', 'laws of motion',
    'work, energy and power', 'system of particles', 'gravitation', 'mechanical properties',
    'thermal properties', 'thermodynamics', 'kinetic theory', 'oscillations', 'waves',
    'atomic structure', 'classification of elements', 'chemical bonding', 'states of matter',
    'stoichiometry', 'thermodynamics', 'chemical equilibrium', 'hydrogen', 's-block', 'p-block',
    'organic chemistry', 'environmental chemistry'
  ], []);

  // Check if a video has an unrelated/custom topic, chapter, or subject
  const isUnrelatedVideo = useCallback((v) => {
    if (!v) return false;
    if (v.isCustom) return true;
    const rawCh = (v.chapterName || v.chapter || '').toLowerCase().replace(/^chapter\s*\d+\s*:\s*/i, '').trim();
    if (!rawCh) return true; // No chapter specified -> extra lecture
    const matchesStandard = standardSyllabusChapters.some((s) => rawCh.includes(s) || s.includes(rawCh));
    return !matchesStandard;
  }, [standardSyllabusChapters]);

  // Filter & sort published videos (unrelated/custom topics always kept at the VERY LAST)
  const filteredVideos = useMemo(() => {
    const list = videos.filter((v) => {
      // Must be published
      if (v.status && v.status !== 'published') return false;

      const isCustom = isUnrelatedVideo(v);

      // Board filter (custom videos stay visible unless explicitly filtering other subjects)
      if (selectedBoard !== 'all' && !isCustom) {
        const isAP = selectedBoard === 'Andhra Pradesh Intermediate';
        const isTS = selectedBoard === 'Telangana Intermediate';
        const vBoard = v.board || 'Both Boards';

        if (isAP) {
          const matchAP =
            vBoard.includes('Andhra') ||
            vBoard === 'Both Boards' ||
            vBoard === 'All Boards';
          if (!matchAP) return false;
        } else if (isTS) {
          const matchTS =
            vBoard.includes('Telangana') ||
            vBoard === 'Both Boards' ||
            vBoard === 'All Boards';
          if (!matchTS) return false;
        }
      }

      // Year filter (custom / unrelated videos stay visible at the end so they are never missed)
      if (selectedYear !== 'all' && !isCustom) {
        const is1st = selectedYear === '1st Year';
        const is2nd = selectedYear === '2nd Year';
        const vYear = v.year || (v.classLevel && v.classLevel.includes('2nd') ? '2nd Year' : '1st Year');
        const vClass = v.classLevel || '';

        if (is1st) {
          const match1st =
            vYear === '1st Year' ||
            vClass.includes('1st') ||
            vClass.includes('First') ||
            vYear === 'Both Years' ||
            vClass === 'Both Years' ||
            vClass === 'All Levels';
          if (!match1st) return false;
        } else if (is2nd) {
          const match2nd =
            vYear === '2nd Year' ||
            vClass.includes('2nd') ||
            vClass.includes('Second') ||
            vYear === 'Both Years' ||
            vClass === 'Both Years' ||
            vClass === 'All Levels';
          if (!match2nd) return false;
        }
      }

      // Subject filter
      if (selectedSubject !== 'all') {
        if ((v.subject || '').toLowerCase() !== selectedSubject.toLowerCase()) {
          return false;
        }
      }

      // Search term
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchTitle = (v.title || '').toLowerCase().includes(q);
        const matchChapter = (v.chapter || '').toLowerCase().includes(q);
        const matchChapterName = (v.chapterName || '').toLowerCase().includes(q);
        const matchTopicNumber = (v.topicNumber || '').toLowerCase().includes(q);
        const matchTopic = (v.topicName || v.topic || '').toLowerCase().includes(q);
        const matchSubTopicNumber = (v.subTopicNumber || '').toLowerCase().includes(q);
        const matchSubTopic = (v.subTopicName || '').toLowerCase().includes(q);
        const matchSubSubTopicNumber = (v.subSubTopicNumber || '').toLowerCase().includes(q);
        const matchSubSubTopic = (v.subSubTopicName || '').toLowerCase().includes(q);
        const matchLesson = (v.lesson || '').toLowerCase().includes(q);
        const matchLessonName = (v.lessonName || '').toLowerCase().includes(q);
        const matchDesc = (v.description || '').toLowerCase().includes(q);
        const matchInstructor = (v.instructor || '').toLowerCase().includes(q);
        const matchTags = Array.isArray(v.tags) && v.tags.some(t => t.toLowerCase().includes(q));
        const matchKeywords = Array.isArray(v.keywords) && v.keywords.some(k => k.toLowerCase().includes(q));

        if (!matchTitle && !matchChapter && !matchChapterName && !matchTopicNumber && !matchTopic && !matchSubTopicNumber && !matchSubTopic && !matchSubSubTopicNumber && !matchSubSubTopic && !matchLesson && !matchLessonName && !matchDesc && !matchInstructor && !matchTags && !matchKeywords) {
          return false;
        }
      }

      return true;
    });

    // Sort: Standard curriculum videos first (0), custom / unrelated videos at the VERY LAST (1)
    return [...list].sort((a, b) => {
      const aCustom = isUnrelatedVideo(a) ? 1 : 0;
      const bCustom = isUnrelatedVideo(b) ? 1 : 0;
      if (aCustom !== bCustom) {
        return aCustom - bCustom;
      }
      return 0;
    });
  }, [videos, selectedBoard, selectedYear, selectedSubject, searchQuery, isUnrelatedVideo]);

  const subjectOptions = useMemo(() => {
    const base = [
      'all',
      'Mathematics',
      'Physics',
      'Chemistry',
      'Botany',
      'Zoology',
      'English',
      'Commerce',
      'Economics',
      'Civics',
      'General',
    ];
    const fromVideos = (videos || [])
      .map((v) => v.subject)
      .filter((s) => Boolean(s && s.trim()));
    return Array.from(new Set([...base, ...fromVideos]));
  }, [videos]);

  return (
    <div className="space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          HEADER & FILTER BAR
         ───────────────────────────────────────────────────────────── */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-sm transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20">
                <Video size={18} />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Curriculum Video Lectures & Masterclasses
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              High-definition IPE Board lessons, derivations, and question bank breakdowns from Visdom Waves senior faculty.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-cyan-300 text-xs font-bold flex items-center gap-1.5">
              <Sparkles size={12} className="text-blue-500" />
              <span>{filteredVideos.length} Active Masterclasses</span>
            </span>
          </div>
        </div>

        {/* Board & Year Toggle Switcher Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-5">
          {/* Board Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Intermediate Board
            </label>
            <select
              value={selectedBoard}
              onChange={(e) => setSelectedBoard(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">Both Boards (AP & TS Common)</option>
              <option value="Andhra Pradesh Intermediate">Andhra Pradesh (BIEAP)</option>
              <option value="Telangana Intermediate">Telangana (TSBIE)</option>
            </select>
          </div>

          {/* Year Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Intermediate Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Classes / Both Years</option>
              <option value="1st Year">1st Year (Junior Inter)</option>
              <option value="2nd Year">2nd Year (Senior Inter)</option>
            </select>
          </div>

          {/* Subject Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Subject Stream
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {subjectOptions.map((sub) => (
                <option key={sub} value={sub}>
                  {sub === 'all' ? 'All Curriculum Subjects' : sub}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Search Topics & Chapters
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. Calculus, Optics, MOT..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Quick Subject Pill Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 pb-1 scrollbar-none">
          {subjectOptions.map((sub) => (
            <button
              key={sub}
              type="button"
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedSubject === sub
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {sub === 'all' ? 'All Tracks' : sub}
            </button>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          VIDEO CARDS GRID
         ───────────────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-500">Loading published lectures...</p>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/50 text-blue-500 flex items-center justify-center mx-auto mb-4 border border-blue-200 dark:border-blue-900">
            <Film size={28} />
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
            No Published Lessons Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-5">
            No videos currently match your selected filters ({selectedBoard !== 'all' ? selectedBoard : 'All Boards'} • {selectedYear !== 'all' ? selectedYear : 'All Years'} • {selectedSubject !== 'all' ? selectedSubject : 'All Subjects'}).
          </p>
          <button
            onClick={() => {
              setSelectedBoard('all');
              setSelectedYear('all');
              setSelectedSubject('all');
              setSearchQuery('');
            }}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Reset Filters & View All
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVideos.map((v) => {
            const ytId = v.youtubeId || extractYouTubeId(v.url);
            const isYT = v.type === 'youtube' || Boolean(ytId);
            const defaultThumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '';
            const thumbSrc = v.thumbnailUrl || defaultThumb;

            return (
              <div
                key={v._id || v.id}
                className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video w-full bg-slate-900 overflow-hidden cursor-pointer" onClick={() => setActiveVideoModal(v)}>
                    {thumbSrc ? (
                      <img
                        src={thumbSrc}
                        alt={v.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-950 p-4">
                        <Video size={32} className="text-blue-500 mb-1" />
                        <span className="text-[11px] font-bold">Visdom Waves Video</span>
                      </div>
                    )}

                    {/* Dark gradient overlay for badges */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

                    {/* Play Button Icon on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-13 h-13 rounded-2xl bg-red-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-red-500 transition-all duration-300 border border-white/20">
                        <Play size={22} fill="currentColor" className="ml-0.5" />
                      </div>
                    </div>

                    {/* Top Left: Badges ("Barge") & Type Pill & Access Level */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap z-10">
                      {Boolean(v.badgeText?.trim()) && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md flex items-center gap-1">
                          {v.isVerifiedBadge && <ShieldCheck size={10} className="text-white" />}
                          <span>{v.badgeText}</span>
                        </span>
                      )}
                      {Boolean(v.badgeText?.trim()) && v.qualityBadge && (
                        <span className="px-1.5 py-0.5 rounded bg-black/75 text-[10px] font-bold text-amber-300 border border-amber-400/30">
                          {v.qualityBadge}
                        </span>
                      )}
                      {isYT ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-red-600 text-white flex items-center gap-1 shadow-md">
                          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                          <span>YouTube Lecture</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-600 text-white flex items-center gap-1 shadow-md">
                          <Film size={11} />
                          <span>HD Video</span>
                        </span>
                      )}

                      {v.isPremium ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 flex items-center gap-1 shadow-md">
                          <Lock size={10} />
                          <span>Premium</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-white flex items-center gap-1 shadow-md">
                          <Unlock size={10} />
                          <span>Free Preview</span>
                        </span>
                      )}
                    </div>

                    {/* Watermark Overlay on Card (Optional) */}
                    {Boolean(v.watermarkEnabled && v.watermarkText?.trim()) && (
                      <div
                        className={`absolute z-10 pointer-events-none select-none flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs border border-white/10 text-white/80 font-mono text-[9px] tracking-wider uppercase font-bold shadow-md max-w-[45%] truncate ${
                          v.watermarkPosition === 'top-left'
                            ? 'top-2.5 left-2.5'
                            : v.watermarkPosition === 'bottom-left'
                            ? 'bottom-2.5 left-2.5'
                            : v.watermarkPosition === 'bottom-right'
                            ? 'bottom-2.5 right-2.5'
                            : 'top-2.5 right-2.5'
                        }`}
                      >
                        <ShieldCheck size={10} className="text-blue-400 shrink-0" />
                        <span className="truncate">{v.watermarkText}</span>
                      </div>
                    )}

                    {/* Bottom Right: Duration */}
                    {v.duration && (
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 text-white font-mono text-[11px] font-bold shadow-md">
                        {v.duration}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 space-y-2.5">
                    {/* Board & Subject Badges */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-500/20 uppercase tracking-wider">
                          {v.subject || 'Subject'}
                        </span>
                        {isUnrelatedVideo(v) && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800 uppercase tracking-wider">
                            Special Topic
                          </span>
                        )}
                        {v.chapter && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                            {v.chapter}
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        {v.year || v.classLevel || 'Intermediate'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => setActiveVideoModal(v)}
                      className="font-black text-slate-900 dark:text-white text-sm sm:text-base group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
                    >
                      {v.title}
                    </h3>

                    {/* Topic Name & Sub Topic Name */}
                    {(v.topicName || v.subTopicName || v.subSubTopicName || v.lessonName || v.lesson) && (
                      <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-bold">
                        {v.topicName && (
                          <span className="text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900/50 truncate max-w-[200px]">
                            Topic {v.topicNumber ? `${v.topicNumber}: ` : ''}{v.topicName}
                          </span>
                        )}
                        {(v.subTopicName || v.lessonName || v.lesson) && (
                          <span className="text-indigo-600 dark:text-indigo-400 truncate">
                            {v.subTopicNumber ? `Sub ${v.subTopicNumber}: ` : ''}{v.subTopicName || v.lessonName || v.lesson}
                          </span>
                        )}
                        {v.subSubTopicName && (
                          <span className="text-slate-500 dark:text-slate-400 text-[10px] font-medium truncate">
                            {v.subSubTopicNumber ? `Sub-Sub ${v.subSubTopicNumber}: ` : ''}{v.subSubTopicName}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {v.description || 'Comprehensive conceptual breakdown with board blueprint exam proofs and solutions.'}
                    </p>

                    {/* Key Words / Tags */}
                    {((Array.isArray(v.keywords) && v.keywords.length > 0) || (Array.isArray(v.tags) && v.tags.length > 0)) && (
                      <div className="flex items-center gap-1 flex-wrap pt-0.5">
                        {(v.keywords?.length ? v.keywords : v.tags).slice(0, 3).map((kw, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                            #{kw}
                          </span>
                        ))}
                        {(v.keywords?.length ? v.keywords : v.tags).length > 3 && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            +{(v.keywords?.length ? v.keywords : v.tags).length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 sm:p-5 pt-0">
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                      {v.instructor || 'Visdom Waves Faculty'}
                    </span>

                    <button
                      onClick={() => setActiveVideoModal(v)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/25 transition-all cursor-pointer active:scale-95 shrink-0"
                    >
                      <Play size={13} fill="currentColor" />
                      <span>Watch Video</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          DEDICATED FULL VIDEO PLAYER MODAL
         ───────────────────────────────────────────────────────────── */}
      {activeVideoModal && (() => {
        const ytId = activeVideoModal.youtubeId || extractYouTubeId(activeVideoModal.url);
        const isYT = activeVideoModal.type === 'youtube' || Boolean(ytId);
        const isDirectVideo =
          activeVideoModal.type === 'video' ||
          Boolean(activeVideoModal.url && (activeVideoModal.url.includes('/uploads/') || /\.(mp4|webm|mov|ogg)$/i.test(activeVideoModal.url)));

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
              
              {/* Header */}
              <div className="shrink-0 px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/80 dark:bg-slate-950/80">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20">
                      {activeVideoModal.subject || 'Curriculum'}
                    </span>
                    {Boolean(activeVideoModal.badgeText?.trim()) && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md flex items-center gap-1">
                        {activeVideoModal.isVerifiedBadge && <ShieldCheck size={10} className="text-white" />}
                        <span>{activeVideoModal.badgeText}</span>
                      </span>
                    )}
                    {Boolean(activeVideoModal.badgeText?.trim()) && activeVideoModal.qualityBadge && (
                      <span className="px-1.5 py-0.5 rounded bg-black/60 text-[10px] font-bold text-amber-400 border border-amber-400/30">
                        {activeVideoModal.qualityBadge}
                      </span>
                    )}
                    <span className="text-xs font-bold text-slate-500">
                      {activeVideoModal.board || 'AP & TS Intermediate'}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
                    {activeVideoModal.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveVideoModal(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Video Player Box */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800 flex items-center justify-center relative">
                  {/* Anti-Piracy Watermark on Student Player (Optional) */}
                  {Boolean(activeVideoModal.watermarkEnabled && activeVideoModal.watermarkText?.trim()) && (
                    <div
                      className={`absolute z-20 pointer-events-none select-none flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/65 backdrop-blur-xs border border-white/10 text-white/80 font-mono text-[10px] sm:text-[11px] tracking-wider uppercase font-bold shadow-xl max-w-[45%] truncate ${
                        activeVideoModal.watermarkPosition === 'top-left'
                          ? 'top-4 left-4'
                          : activeVideoModal.watermarkPosition === 'bottom-left'
                          ? 'bottom-16 left-4'
                          : activeVideoModal.watermarkPosition === 'bottom-right'
                          ? 'bottom-16 right-4'
                          : 'top-4 right-4'
                      }`}
                    >
                      <ShieldCheck size={13} className="text-blue-400 shrink-0" />
                      <span className="truncate">{activeVideoModal.watermarkText}</span>
                    </div>
                  )}

                  {isYT && ytId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                      title={activeVideoModal.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  ) : isDirectVideo ? (
                    <video
                      controls
                      autoPlay
                      src={activeVideoModal.url}
                      className="w-full h-full object-contain bg-black"
                      poster={activeVideoModal.thumbnailUrl || undefined}
                    >
                      Your browser does not support HTML5 video streaming.
                    </video>
                  ) : (
                    <div className="text-center p-8 text-white space-y-3">
                      <ExternalLink size={36} className="mx-auto text-blue-400" />
                      <h4 className="font-bold text-base">External Educational Resource</h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        This lesson links to an external simulator or document drive.
                      </p>
                      <a
                        href={activeVideoModal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all"
                      >
                        <span>Open Resource in New Tab</span>
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  )}
                </div>

                {/* Lesson Metadata & Learning Points */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {activeVideoModal.chapter && (
                          <span className="text-xs font-bold text-slate-500">
                            {activeVideoModal.chapter}
                          </span>
                        )}
                        {activeVideoModal.topicName && (
                          <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                            Topic {activeVideoModal.topicNumber ? `${activeVideoModal.topicNumber}: ` : ''}{activeVideoModal.topicName}
                          </span>
                        )}
                        {(activeVideoModal.subTopicName || activeVideoModal.lessonName || activeVideoModal.lesson) && (
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            {activeVideoModal.subTopicNumber ? `Sub ${activeVideoModal.subTopicNumber}: ` : ''}{activeVideoModal.subTopicName || activeVideoModal.lessonName || activeVideoModal.lesson}
                          </span>
                        )}
                        {activeVideoModal.subSubTopicName && (
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            {activeVideoModal.subSubTopicNumber ? `Sub-Sub ${activeVideoModal.subSubTopicNumber}: ` : ''}{activeVideoModal.subSubTopicName}
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white">
                        {activeVideoModal.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      {activeVideoModal.duration && (
                        <span className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold flex items-center gap-1">
                          <Clock size={12} />
                          <span>{activeVideoModal.duration}</span>
                        </span>
                      )}
                      {activeVideoModal.isPremium ? (
                        <span className="px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-700 dark:text-amber-300 font-bold text-xs border border-amber-400/30">
                          Premium Class
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-500/30">
                          Free Preview
                        </span>
                      )}
                    </div>
                  </div>

                  {activeVideoModal.description && (
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {activeVideoModal.description}
                    </p>
                  )}

                  {/* Keywords Badges */}
                  {((Array.isArray(activeVideoModal.keywords) && activeVideoModal.keywords.length > 0) ||
                    (Array.isArray(activeVideoModal.tags) && activeVideoModal.tags.length > 0)) && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Key Words:</span>
                      {(activeVideoModal.keywords?.length ? activeVideoModal.keywords : activeVideoModal.tags).map((kw, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-cyan-300 border border-blue-200/60 dark:border-blue-800/60"
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Instructor: {activeVideoModal.instructor || 'Visdom Waves Faculty'}
                    </span>

                    {onOpenBooking && (
                      <button
                        onClick={() => {
                          setActiveVideoModal(null);
                          onOpenBooking(`Doubt Clearing: ${activeVideoModal.title}`);
                        }}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                      >
                        Book 1-on-1 Doubt Session for this Class
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
