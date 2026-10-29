import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Play, 
  ExternalLink, 
  Search, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  Tv,
  Tag,
  Sparkles,
  ListTree,
  Compass,
  Video,
  Languages,
  BookMarked,
  Info,
  Feather
} from 'lucide-react';
import { fetchStudentVideos } from '../../services/api';

// Extract YouTube ID from multiple URL formats
function extractYouTubeId(url) {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = trimmed.match(regExp);
  return match && match[1] ? match[1] : '';
}

// Helper to normalize strings for accent-insensitive and case-insensitive search
const normalize = (str) => 
  (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Pre-configured French Chapter-Wise Video Lectures & Prescribed Keywords
const RAW_TOPICS_DATA = [
  {
    id: 'jumelage-niveau-1',
    number: '1',
    name: 'Jumelage – Niveau 1',
    chapterTitle: '1 Jumelage – Niveau 1',
    description: 'Foundational textbook syllabus, greetings, introductions, school environment, daily routines, and hiking vocabulary.',
    color: 'from-blue-600 to-indigo-600',
    badgeColor: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    videos: [
      {
        id: '1-0',
        code: '1.0',
        title: 'Textbook: Jumelage – Niveau 1',
        description: 'Comprehensive foundational introduction to Jumelage Niveau 1, core greetings, polite French expressions, and self-introduction structures.',
        url: 'https://youtu.be/sZ3rsbhAnhY?si=m5DIoBNJNu_5N6VL',
        videoId: 'sZ3rsbhAnhY',
        keywords: [
          'bonjour (hello)',
          'salut (hi)',
          'merci (thank you)',
          's’il vous plaît (please)',
          'au revoir (goodbye)',
          'se présenter (introduce oneself)',
          'français (French)',
          'Jumelage – Niveau 1',
          'French textbook overview'
        ]
      },
      {
        id: '1-1',
        code: '1.1',
        title: 'Unité 1 – Leçon 1 : Autour de l’école',
        description: 'Classroom items, school environment, teacher-student interactions, and verbs for learning and studying French effectively.',
        url: 'https://youtu.be/zWNC1LlQNbs?si=TnRGnWHlAvxdbFqu',
        videoId: 'zWNC1LlQNbs',
        keywords: [
          'l’école (school)',
          'la classe (classroom)',
          'un professeur (teacher)',
          'un élève (student)',
          'un livre (book)',
          'un cahier (notebook)',
          'un stylo (pen)',
          'une règle (ruler)',
          'apprendre (to learn)',
          'étudier (to study)',
          'Autour de l’école',
          'Unité 1 Leçon 1'
        ]
      },
      {
        id: '1-2',
        code: '1.2',
        title: 'Unité 1 – Leçon 2 : La vie quotidienne',
        description: 'Everyday routines, reflexive daily actions from waking up to sleeping, telling time, and conversational vocabulary for daily schedules.',
        url: 'https://youtu.be/zWNC1LlQNbs?si=a-iVYB4ag78K1wXj',
        videoId: 'zWNC1LlQNbs',
        keywords: [
          'se réveiller (wake up)',
          'se lever (get up)',
          'prendre le petit-déjeuner (have breakfast)',
          'aller à l’école (go to school)',
          'déjeuner (have lunch)',
          'rentrer (return home)',
          'faire ses devoirs (do homework)',
          'dîner (have dinner)',
          'se coucher (go to bed)',
          'tous les jours (every day)',
          'La vie quotidienne',
          'Unité 1 Leçon 2'
        ]
      },
      {
        id: '1-3',
        code: '1.3',
        title: 'Unité 1 – Leçon 3 : Une randonnée',
        description: 'Outdoor hiking and trekking terminology, mountain landscapes, forest paths, packing essentials, and travel action verbs.',
        url: 'https://youtu.be/CCLooO_X7zI?si=Fxkyms7m2BgCm2b8',
        videoId: 'CCLooO_X7zI',
        keywords: [
          'une randonnée (hike)',
          'marcher (to walk)',
          'la montagne (mountain)',
          'le chemin (path)',
          'la forêt (forest)',
          'un sac à dos (backpack)',
          'une bouteille d’eau (water bottle)',
          'partir (to leave)',
          'arriver (to arrive)',
          'se reposer (to rest)',
          'la nature (nature)',
          'Une randonnée',
          'Unité 1 Leçon 3'
        ]
      }
    ]
  },
  {
    id: 'french-grammar',
    number: '2',
    name: 'Grammaire Française',
    chapterTitle: '2 Grammaire Française',
    description: 'French qualifying adjectives, gender & number agreement, prescribed textbook verb conjugations, demonstrative and interrogative adjectives.',
    color: 'from-indigo-600 to-violet-600',
    badgeColor: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    videos: [
      {
        id: '2-1',
        code: '2.1',
        title: 'Grammar – Adjectives',
        description: 'Rules of qualifying French adjectives, masculine/feminine endings, singular/plural agreements, and sentence position guidelines.',
        url: 'https://youtu.be/XZhFmmYUdbs?si=SyU7NtzHJ9caEza_',
        videoId: 'XZhFmmYUdbs',
        keywords: [
          'grand / grande (big, tall)',
          'petit / petite (small)',
          'beau / belle (beautiful)',
          'bon / bonne (good)',
          'jeune (young)',
          'vieux / vieille (old)',
          'intéressant / intéressante (interesting)',
          'heureux / heureuse (happy)',
          'adjective agreement in gender and number',
          'French adjectives'
        ]
      },
      {
        id: '2-2',
        code: '2.2',
        title: 'Grammar – Verbs from the specified textbook pages',
        description: 'High-frequency regular and irregular French verb conjugations (être, avoir, aller, faire, etc.) strictly matching prescribed textbook pages.',
        url: 'https://youtu.be/O-wHPMbbwrI?si=3hxUiTBpuk4IxRWj',
        videoId: 'O-wHPMbbwrI',
        keywords: [
          'être (to be)',
          'avoir (to have)',
          'aller (to go)',
          'faire (to do/make)',
          'parler (to speak)',
          'aimer (to like)',
          'habiter (to live)',
          'prendre (to take)',
          'se lever (to get up)',
          'se coucher (to go to bed)',
          'revise only verbs and forms from the prescribed textbook pages',
          'French verbs conjugation'
        ]
      },
      {
        id: '2-3',
        code: '2.3',
        title: 'Demonstrative adjectives (listed; syllabus says no questions)',
        description: 'Essential reference guide for French demonstrative adjectives (ce, cet, cette, ces), usage before consonants vs vowels/mute h.',
        url: 'https://youtu.be/64vBXVkO2_s?si=_YhOr5kfYFDaMZCC',
        videoId: '64vBXVkO2_s',
        keywords: [
          'ce (this/that, masculine before consonant)',
          'cet (this/that, masculine before vowel or mute h)',
          'cette (this/that, feminine)',
          'ces (these/those)',
          'demonstrative adjectives',
          'adjectifs démonstratifs',
          'syllabus says no questions',
          'included for reference only'
        ]
      },
      {
        id: '2-4',
        code: '2.4',
        title: 'Interrogative adjectives (listed; syllabus says no questions)',
        description: 'French interrogative adjective forms (quel, quelle, quels, quelles), masculine/feminine and singular/plural classification for reference.',
        url: 'https://youtu.be/myheLpSXvDM?si=IIVQBxJSrcxbaUVz',
        videoId: 'myheLpSXvDM',
        keywords: [
          'quel (which/what, masculine singular)',
          'quelle (feminine singular)',
          'quels (masculine plural)',
          'quelles (feminine plural)',
          'interrogative adjectives',
          'adjectifs interrogatifs',
          'syllabus says no questions',
          'included for reference only'
        ]
      }
    ]
  }
];

// Preserved Academic French Course Modules for Enrollment Tracks
const FRENCH_MODULES = [
  {
    id: 'fre-1st-year',
    name: '1st Year Junior French',
    category: 'AP / TS Intermediate',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop',
    color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    desc: 'Complete coverage of Jumelage Niveau 1: Unité 1 lessons, Autour de l’école, La vie quotidienne, Une randonnée, greetings, and basic grammar for 100/100 marks.'
  },
  {
    id: 'fre-2nd-year',
    name: '2nd Year Senior French',
    category: 'AP / TS Intermediate',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=600&auto=format&fit=crop',
    color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    desc: 'Senior Inter French Prose, Culture, Dialogues, Advanced Tenses (Passé Composé, Imparfait, Futur Simple), Comprehension, and Letter Writing for board exams.'
  },
  {
    id: 'fre-grammar',
    name: 'Grammaire & Conjugation Mastery',
    category: 'Core Language',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop',
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    desc: 'Master Adjectives agreement, Irregular Verbs (être, avoir, aller, faire), Demonstratives, Interrogatives, Prepositions, and Negation without rote memorization.'
  },
  {
    id: 'fre-comprehension',
    name: 'French Comprehension & Dialogue',
    category: 'Critical Thinking',
    image: 'https://images.unsplash.com/photo-1471970471555-19d4b113e9ed?q=80&w=600&auto=format&fit=crop',
    color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    desc: 'Unseen French passages, reading comprehension strategies, dialogue formation, translation blueprints, and accurate punctuation rules.'
  }
];

// Clean and Responsive Video Card for French Curriculum Grid
function FrenchVideoCard({ video, isSearching, onSelectVideo, onKeywordClick }) {
  const handlePlay = () => {
    onSelectVideo(video);
  };

  const thumbnailUrl = video.thumbnailUrl || (
    video.videoId 
      ? `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`
      : 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop'
  );

  return (
    <div className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80 dark:border-slate-800 hover:-translate-y-1">
      
      {/* Thumbnail Container */}
      <div 
        onClick={handlePlay}
        className="relative aspect-video w-full overflow-hidden bg-slate-900 cursor-pointer"
      >
        <img
          src={thumbnailUrl}
          alt={video.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop';
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-85 group-hover:opacity-65 transition-opacity" />

        {/* Lesson Code Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          <div className="px-2.5 py-1 rounded-lg backdrop-blur-md bg-black/65 text-white font-mono text-xs font-bold border border-white/15 flex items-center gap-1.5 shadow-sm">
            <Layers size={12} className="text-amber-400" />
            <span>Lesson {video.code}</span>
          </div>
          {video.isDbUploaded && (
            <div className="px-2 py-0.5 rounded-lg bg-emerald-600/95 text-white font-sans text-[10px] font-extrabold border border-emerald-400/50 shadow-sm flex items-center gap-1">
              <CheckCircle2 size={10} />
              <span>Admin Uploaded</span>
            </div>
          )}
        </div>

        {/* Center Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/40 group-hover:scale-115 transition-transform duration-300 ring-4 ring-white/30">
            <Play size={20} className="ml-0.5 fill-white" />
          </div>
        </div>

        {/* YouTube Video Badge */}
        <div className="absolute bottom-2.5 right-3 text-[11px] font-bold text-white/90 drop-shadow flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse"></span>
          <span>YouTube Lecture</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Main Chapter Badge */}
          <div className="text-[11px] font-extrabold tracking-wider uppercase text-amber-600 dark:text-amber-400 mb-2 flex items-center justify-between">
            <span>{video.chapterTitle || `${video.topicNumber} French Syllabus`}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-extrabold border border-amber-200/60 dark:border-amber-800/60">
              Intermediate
            </span>
          </div>

          {/* Title */}
          <h3 
            onClick={handlePlay}
            className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer leading-snug mb-2"
            title={video.title}
          >
            <span className="text-amber-600 dark:text-amber-400 font-extrabold mr-1.5">{video.code}:</span>
            {video.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
            {video.description}
          </p>

          {/* Keywords / Vocabulary Pills */}
          {video.keywords && video.keywords.length > 0 && (
            <div className="mb-3">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 flex items-center gap-1">
                <Tag size={10} />
                <span>Vocabulary & Keywords ({video.keywords.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto scrollbar-none">
                {video.keywords.slice(0, 4).map((kw, i) => (
                  <button
                    key={i}
                    onClick={() => onKeywordClick && onKeywordClick(kw)}
                    className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-slate-700 dark:text-slate-300 hover:text-amber-800 dark:hover:text-amber-300 text-[11px] font-medium border border-slate-200/60 dark:border-slate-700/60 transition-colors cursor-pointer"
                    title={`Click to filter by "${kw}"`}
                  >
                    <span>{kw}</span>
                  </button>
                ))}
                {video.keywords.length > 4 && (
                  <span 
                    onClick={handlePlay}
                    className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-[10px] font-bold border border-amber-200/50 dark:border-amber-800/50 cursor-pointer hover:underline"
                  >
                    +{video.keywords.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Matching Keyword Indicator when searching */}
          {isSearching && video.matchedKeyword && (
            <div className="mb-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-[10px] font-semibold border border-amber-200/60 dark:border-amber-800/60 max-w-full truncate">
              <Tag size={10} className="shrink-0" />
              <span className="truncate">Matches: {video.matchedKeyword}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
          <button
            onClick={handlePlay}
            className="flex-1 py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm shadow-amber-600/20"
          >
            <Play size={14} className="fill-white" />
            <span>Watch Lecture</span>
          </button>

          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
            title={`Open ${video.title} on YouTube (clickable)`}
            aria-label={`Open ${video.title} on YouTube`}
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}

// Full-Page Interactive French Classroom Lecture Player
function FullPageLecturePlayer({ initialVideo, onClose, onEnroll, allVideos = [] }) {
  const [currentVideo, setCurrentVideo] = useState(initialVideo);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  const currentIndex = allVideos.findIndex(v => v.id === currentVideo.id);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentVideo(allVideos[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < allVideos.length - 1) {
      setCurrentVideo(allVideos[currentIndex + 1]);
    }
  };

  const filteredPlaylist = useMemo(() => {
    if (!searchFilter.trim()) return allVideos;
    const q = normalize(searchFilter);
    return allVideos.filter(v => 
      normalize(v.title).includes(q) || 
      normalize(v.code).includes(q) ||
      (v.keywords && v.keywords.some(k => normalize(k).includes(q)))
    );
  }, [allVideos, searchFilter]);

  const displayVideoId = currentVideo.videoId || extractYouTubeId(currentVideo.url);
  const displayUrl = currentVideo.url;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col overflow-hidden animate-fadeIn">
      {/* Top Classroom Bar */}
      <div className="px-4 sm:px-6 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold transition-colors cursor-pointer shrink-0"
            title="Return to syllabus"
          >
            <ChevronLeft size={16} />
            <span>Back to Syllabus</span>
          </button>

          <span className="text-slate-700 hidden sm:inline">|</span>

          {/* Breadcrumb Path */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 overflow-x-auto scrollbar-none whitespace-nowrap">
            <Compass size={13} className="text-amber-400 shrink-0" />
            <span className="text-slate-400">{currentVideo.chapterTitle || 'French Curriculum'}</span>
            <span className="text-slate-600">›</span>
            <span className="font-bold text-amber-400">
              Lesson {currentVideo.code}: {currentVideo.title}
            </span>
          </div>
        </div>

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              sidebarOpen 
                ? 'bg-amber-600/30 text-amber-300 border border-amber-500/30' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title={sidebarOpen ? 'Hide Syllabus Sidebar' : 'Show Syllabus Sidebar'}
          >
            <ListTree size={14} />
            <span className="hidden md:inline">{sidebarOpen ? 'Hide Syllabus' : 'Show Syllabus'}</span>
          </button>

          <a
            href={displayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink size={14} />
            <span className="hidden sm:inline">YouTube</span>
          </a>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close lecture"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Full Page Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Side: Video Theater Player & Detailed Lesson Notes */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-black/40 scrollbar-thin scrollbar-thumb-slate-800">
          {/* Responsive 16:9 Video Container */}
          <div className="relative w-full aspect-video max-h-[64vh] bg-black flex items-center justify-center shadow-2xl">
            {displayVideoId ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${displayVideoId}?autoplay=1&rel=0`}
                title={currentVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            ) : (
              <div className="text-slate-400 text-sm">Video media unavailable</div>
            )}
          </div>

          {/* Lesson Details & Interactive Controls */}
          <div className="p-5 sm:p-8 space-y-6 max-w-5xl mx-auto w-full">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-amber-600 text-white font-mono text-xs font-black shadow-sm shadow-amber-600/30">
                    Lesson {currentVideo.code}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {currentVideo.chapterTitle}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {currentVideo.title}
                </h1>
              </div>

              {/* Sequential Navigation Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex <= 0}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ChevronLeft size={16} /> Prev Lesson
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentIndex >= allVideos.length - 1}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  Next Lesson <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Description / Lesson Content Box */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md">
              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider mb-2">
                <Sparkles size={14} className="text-amber-400" />
                <span>Lecture Overview & Board Syllabus Context</span>
              </div>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                {currentVideo.description}
              </p>

              {/* Full Keywords & Vocabulary with French & English Meanings */}
              {currentVideo.keywords && currentVideo.keywords.length > 0 && (
                <div className="pt-3 border-t border-slate-800">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Languages size={13} className="text-amber-400" />
                    <span>Prescribed Textbook Keywords & Translations</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentVideo.keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-amber-200 font-medium text-xs shadow-xs"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Ask Doubt Action Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/60 border border-amber-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-0.5">
                  Have doubts in Lesson {currentVideo.code}: {currentVideo.title}?
                </h3>
                <p className="text-xs text-amber-200/80">
                  Connect with experienced French faculty for 1-on-1 grammar analysis, correct pronunciation, and worksheet reviews.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  if (onEnroll) onEnroll(`French Help: Topic ${currentVideo.code} - ${currentVideo.title}`);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0 shadow-lg shadow-amber-600/25"
              >
                <span>Ask Doubt in this Topic</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Dedicated Syllabus Hierarchy Sidebar */}
        {sidebarOpen && (
          <aside className="w-full lg:w-[380px] xl:w-[420px] bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 overflow-hidden shadow-2xl">
            {/* Sidebar Header */}
            <div className="p-4 bg-slate-900/95 border-b border-slate-800 space-y-3 shrink-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-amber-400">
                    French Video Syllabus
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 font-mono text-xs font-bold border border-amber-800/60 shadow-xs">
                  {allVideos.length} Lectures
                </span>
              </div>

              {/* Search Filter input */}
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter lessons or vocabulary..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-800 text-white text-xs border border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder:text-slate-500 transition-all"
                />
                {searchFilter && (
                  <button
                    onClick={() => setSearchFilter('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Playlist items list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-slate-700">
              {filteredPlaylist.map((vid) => {
                const isActive = vid.id === currentVideo.id;
                return (
                  <div
                    key={vid.id}
                    onClick={() => setCurrentVideo(vid)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-amber-600/20 border-amber-500 text-white shadow-md'
                        : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <div className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-400'
                      }`}>
                        <Play size={11} className={isActive ? 'fill-white' : 'fill-slate-400'} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="font-mono text-[10px] font-black px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800/60">
                            {vid.code}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium truncate">
                            {vid.chapterTitle}
                          </span>
                        </div>
                        <h5 className={`text-xs font-bold leading-snug line-clamp-2 ${isActive ? 'text-amber-300 font-black' : 'text-white'}`}>
                          {vid.title}
                        </h5>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

export default function FrenchCurriculum({ onEnroll, currentUser }) {
  const [selectedTopicId, setSelectedTopicId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);
  const [dbVideos, setDbVideos] = useState([]);
  const [isLoadingDb, setIsLoadingDb] = useState(false);

  // State for Academic Modules cards
  const [activeEnroll, setActiveEnroll] = useState(null);
  const [activeExplore, setActiveExplore] = useState(null);

  // Fetch published videos for French matching DB if any
  const loadDbVideos = useCallback(() => {
    setIsLoadingDb(true);
    fetchStudentVideos({ subject: 'French' })
      .then((data) => {
        if (Array.isArray(data)) {
          setDbVideos(data);
        }
      })
      .catch((err) => console.warn('Could not load French database videos:', err))
      .finally(() => {
        setIsLoadingDb(false);
      });
  }, []);

  useEffect(() => {
    loadDbVideos();
  }, [loadDbVideos]);

  // Listen to video updates from Admin panel
  useEffect(() => {
    const handleUpdate = () => {
      loadDbVideos();
    };
    window.addEventListener('mymarks_video_updated', handleUpdate);
    return () => window.removeEventListener('mymarks_video_updated', handleUpdate);
  }, [loadDbVideos]);

  // Merge default topics with database videos
  const topicsData = useMemo(() => {
    const chapters = JSON.parse(JSON.stringify(RAW_TOPICS_DATA));
    if (!dbVideos || dbVideos.length === 0) return chapters;

    const activeVideos = dbVideos.filter((v) => v.status !== 'archived' && !v.isArchived);

    activeVideos.forEach((v, idx) => {
      const vYtId = v.youtubeId || extractYouTubeId(v.url);
      const parsedKeywords = Array.isArray(v.keywords)
        ? v.keywords
        : typeof v.keywords === 'string'
        ? v.keywords.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      // Find matching chapter or add to general chapter
      let chapterNum = v.chapterNumber ? Number(v.chapterNumber) : (v.chapterName && /grammar/i.test(v.chapterName) ? 2 : 1);
      let matchedChapter = chapters.find(c => Number(c.number) === chapterNum) || chapters[0];

      const cleanTitle = (v.title || v.chapterName || `French Video ${idx + 1}`).trim();
      const existing = matchedChapter.videos.find(vid => 
        (vid.url && vid.url === v.url) || 
        (vid.videoId && vid.videoId === vYtId) ||
        (vid.title && vid.title.toLowerCase() === cleanTitle.toLowerCase())
      );

      if (existing) {
        existing.url = v.url || existing.url;
        existing.videoId = vYtId || existing.videoId;
        existing.title = cleanTitle || existing.title;
        existing.isDbUploaded = true;
        if (parsedKeywords.length) existing.keywords = parsedKeywords;
      } else {
        matchedChapter.videos.push({
          id: v._id ? `db-${v._id}` : `fre-vid-${matchedChapter.number}-${idx}`,
          code: `${matchedChapter.number}.${matchedChapter.videos.length + 1}`,
          title: cleanTitle,
          description: v.description || `Lecture on ${cleanTitle}`,
          url: v.url,
          videoId: vYtId,
          keywords: parsedKeywords,
          isDbUploaded: true
        });
      }
    });

    return chapters;
  }, [dbVideos]);

  // Flatten all merged videos
  const allVideos = useMemo(() => {
    return topicsData.flatMap((topic) =>
      topic.videos.map((video) => ({
        ...video,
        topicId: topic.id,
        topicName: topic.name,
        chapterTitle: topic.chapterTitle || `${topic.number} ${topic.name}`,
        topicNumber: topic.number,
        topicColor: topic.color,
        badgeColor: topic.badgeColor
      }))
    );
  }, [topicsData]);

  // Search and filter logic
  const { filteredVideos, isSearching } = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    const isSearching = trimmedQuery.length > 0;

    let list = allVideos;

    if (!isSearching && selectedTopicId !== 'all') {
      list = list.filter((v) => v.topicId === selectedTopicId);
      return { filteredVideos: list, isSearching };
    }

    if (isSearching) {
      const rawLower = trimmedQuery.toLowerCase();
      const normQ = normalize(trimmedQuery);
      const queryTokens = normQ.split(' ').filter(Boolean);

      const matches = allVideos
        .map((video) => {
          const titleNorm = normalize(video.title);
          const codeNorm = normalize(video.code);
          const topicNorm = normalize(video.topicName);
          const keywordsNorm = (video.keywords || []).map((k) => normalize(k));

          const directTitleMatch =
            video.title.toLowerCase().includes(rawLower) || titleNorm.includes(normQ);
          const directCodeMatch =
            video.code.toLowerCase().includes(rawLower) || codeNorm.includes(normQ);
          const directTopicMatch =
            video.topicName.toLowerCase().includes(rawLower) || topicNorm.includes(normQ);

          const matchedKeywords = (video.keywords || []).filter((kw) => {
            const kwNorm = normalize(kw);
            return kw.toLowerCase().includes(rawLower) || kwNorm.includes(normQ);
          });

          const allTokensMatch =
            queryTokens.length > 0 &&
            queryTokens.every((token) => {
              return (
                titleNorm.includes(token) ||
                codeNorm.includes(token) ||
                topicNorm.includes(token) ||
                keywordsNorm.some((kw) => kw.includes(token))
              );
            });

          const isMatch =
            directTitleMatch ||
            directCodeMatch ||
            directTopicMatch ||
            matchedKeywords.length > 0 ||
            allTokensMatch;

          if (isMatch) {
            return {
              ...video,
              matchedKeyword: matchedKeywords[0] || (directTitleMatch ? null : video.keywords && video.keywords[0])
            };
          }
          return null;
        })
        .filter(Boolean);

      if (selectedTopicId !== 'all') {
        const tabFiltered = matches.filter((v) => v.topicId === selectedTopicId);
        if (tabFiltered.length > 0) {
          return { filteredVideos: tabFiltered, isSearching };
        }
      }

      return { filteredVideos: matches, isSearching };
    }

    return { filteredVideos: list, isSearching };
  }, [allVideos, selectedTopicId, searchQuery]);

  return (
    <section id="french-curriculum" className="py-16 sm:py-24 bg-[#EBF0F7] dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-bold mb-4 border border-amber-200/60 dark:border-amber-800/60">
            <Tv size={15} />
            <span>AP & TS Intermediate French Video Lectures</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            French Chapter-Wise Video Lectures
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg font-medium">
            Explore topic-by-topic concept explanations, textbook lessons (Jumelage – Niveau 1), grammar rules, verbs, and vocabulary with high-yield video solutions.
          </p>

          {/* Sample Demo Notice Banner */}
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-600/70 shadow-md text-amber-950 dark:text-amber-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center sm:items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0 shadow-sm">
                <Sparkles size={20} className="animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-amber-900 dark:text-amber-200">
                  Sample Demo Video Lectures & Prescribed Vocabulary
                </h4>
                <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300/90 mt-0.5 leading-relaxed">
                  These are curated demo video lectures covering Jumelage Niveau 1 and French Grammar. <strong>Enroll now</strong> for complete 100/100 score booster sheets and 1-on-1 doubt clearing!
                </p>
              </div>
            </div>
            
            <button
              onClick={() => onEnroll && onEnroll('French Full Course - All Chapters Access')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-extrabold shadow-md shadow-amber-500/30 transition-all hover:scale-105 cursor-pointer shrink-0 inline-flex items-center gap-1.5"
            >
              <span>Enroll Now</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Filter Controls: Topic Tabs & Smart Keyword Search Bar */}
        <div className="mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Topic Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedTopicId('all')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedTopicId === 'all' && !isSearching
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              All Topics ({allVideos.length})
            </button>
            {topicsData.map((topic) => {
              const isActive = selectedTopicId === topic.id && !isSearching;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25 scale-[1.02]'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {topic.chapterTitle || `${topic.number}. ${topic.name}`} ({topic.videos.length})
                </button>
              );
            })}
          </div>

          {/* Smart Keyword Search Bar */}
          <div className="relative w-full lg:w-96 shrink-0">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search topic or keyword (e.g. bonjour, être, Adjectives, 1.1...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder:text-slate-400 shadow-xs"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Search Results Notification Banner */}
        {isSearching && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-medium">
              <Search size={14} className="text-amber-600 dark:text-amber-400" />
              <span>
                Found <strong className="font-bold text-amber-700 dark:text-amber-300">{filteredVideos.length}</strong> related {filteredVideos.length === 1 ? 'lesson' : 'lessons'} for "<em>{searchQuery}</em>"
              </span>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              Clear filter <X size={12} />
            </button>
          </div>
        )}

        {/* Video Cards Grid */}
        {filteredVideos.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <BookOpen className="w-12 h-12 mx-auto text-slate-400 mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No matching French videos found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
              Try searching with keywords like <strong>bonjour</strong>, <strong>l’école</strong>, <strong>se réveiller</strong>, <strong>être</strong>, or <strong>Adjectives</strong>.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedTopicId('all'); }}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Reset Search & View All ({allVideos.length})
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <FrenchVideoCard
                key={video.id}
                video={video}
                isSearching={isSearching}
                onSelectVideo={setActiveVideo}
                onKeywordClick={(keyword) => setSearchQuery(keyword)}
              />
            ))}
          </div>
        )}

        {/* Bottom Doubt Clearing & Live Tuition CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-amber-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 border border-amber-700/30 text-white relative overflow-hidden shadow-xl">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-semibold mb-3">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span>Live 1-on-1 Faculty Assistance</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">
                Need Personal Mentorship or Have Doubts in French?
              </h3>
              <p className="text-amber-200/80 text-sm sm:text-base max-w-2xl">
                Get 1-on-1 doubt clarification, pronounciation guidance, step-by-step board presentation techniques, and customized chapter worksheets to score 100/100 in French.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              <button
                onClick={() => onEnroll && onEnroll('French 1-on-1 Live Doubt & Board Coaching')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-amber-500/25 cursor-pointer"
              >
                <span>Book 1-on-1 Doubt Session</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Academic French Modules & Tracks Overview Section */}
        <div className="mt-20 pt-16 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 text-xs sm:text-sm font-bold mb-4">
              <BookMarked size={14} />
              <span>Full French Course Tracks</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
              French Academic Modules & Coaching Tracks
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-medium">
              Explore our structured intermediate board modules for Junior & Senior French, complete grammar masterclasses, and intensive exam score boosters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FRENCH_MODULES.map((mod) => {
              const isEnrolling = activeEnroll === mod.id;
              const isExploring = activeExplore === mod.id;

              return (
                <div key={mod.id} className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 h-[380px] group hover:-translate-y-1 relative">
                  <div 
                    className="h-40 w-full overflow-hidden relative shrink-0 cursor-pointer"
                    onClick={() => setActiveExplore(mod.id)}
                  >
                    <img src={mod.image} alt={mod.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                    <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md bg-white/20 text-white">
                      <BookOpen size={20} />
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1 relative overflow-hidden">
                    <div className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
                      {mod.category}
                    </div>
                    <h4 
                      className="text-lg font-bold text-slate-900 dark:text-white mb-2 cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                      onClick={() => setActiveExplore(mod.id)}
                    >
                      {mod.name}
                    </h4>

                    {/* Default View */}
                    <div className={`flex flex-col mt-auto transition-opacity duration-300 ${isExploring || isEnrolling ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                        {mod.desc}
                      </p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setActiveExplore(mod.id)}
                          className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <Info size={14} /> Explore
                        </button>
                        <button 
                          onClick={() => setActiveEnroll(mod.id)}
                          className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer"
                        >
                          Enroll <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Explore View */}
                    <div className={`absolute inset-0 bg-white dark:bg-slate-900 p-5 flex flex-col z-10 transition-transform duration-300 ${isExploring ? 'translate-y-0' : 'translate-y-full'}`}>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{mod.name} Overview</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed overflow-y-auto pr-1 mb-4 flex-1 scrollbar-thin">
                        {mod.desc}
                      </p>
                      <button 
                        onClick={() => setActiveExplore(null)}
                        className="w-full mt-auto py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ChevronLeft size={14} /> Back
                      </button>
                    </div>

                    {/* Enroll View */}
                    <div className={`absolute inset-0 bg-white dark:bg-slate-900 p-5 flex flex-col z-10 transition-transform duration-300 ${isEnrolling ? 'translate-y-0' : 'translate-y-full'}`}>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-3 text-center">Select Track for {mod.name}</h4>
                      <div className="flex flex-col gap-2 flex-1 justify-center">
                        <button 
                          onClick={() => {
                            setActiveEnroll(null);
                            onEnroll && onEnroll(`${mod.name} - Regular Batch`);
                          }}
                          className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm shadow-amber-500/20"
                        >
                          Regular Board Batch
                        </button>
                        <button 
                          onClick={() => {
                            setActiveEnroll(null);
                            onEnroll && onEnroll(`${mod.name} - Intensive Score Booster`);
                          }}
                          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm shadow-indigo-500/20"
                        >
                          100/100 Intensive Booster
                        </button>
                      </div>
                      <button 
                        onClick={() => setActiveEnroll(null)}
                        className="w-full mt-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Full Page Lecture Player with Collapsible Hierarchy Syllabus Navigation */}
      {activeVideo && (
        <FullPageLecturePlayer
          initialVideo={activeVideo}
          allVideos={allVideos}
          onClose={() => setActiveVideo(null)}
          onEnroll={onEnroll}
        />
      )}

    </section>
  );
}
