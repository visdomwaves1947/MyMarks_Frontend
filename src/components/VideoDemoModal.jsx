import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Monitor, Sparkles, Play, Video, ExternalLink, BookOpen } from 'lucide-react';
import { fetchAdminVideos } from '../services/api';

export default function VideoDemoModal({ isOpen, onClose, onOpenBooking }) {
  const [activeTab, setActiveTab] = useState('simulation'); // 'simulation' | 'lectures'
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);

  useEffect(() => {
    if (isOpen) {
      let isMounted = true;
      setIsLoadingVideos(true);
      fetchAdminVideos({ status: 'published' })
        .then((res) => {
          if (isMounted && res && res.data && Array.isArray(res.data)) {
            setVideos(res.data);
            if (res.data.length > 0 && !selectedVideo) {
              setSelectedVideo(res.data[0]);
            }
          }
        })
        .catch((err) => console.warn('Could not load published videos for demo modal:', err))
        .finally(() => {
          if (isMounted) setIsLoadingVideos(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const subjects = ['all', 'Mathematics', 'Physics', 'Chemistry', 'Botany', 'General'];
  const filteredVideos = videos.filter(
    (v) => selectedSubject === 'all' || v.subject?.toLowerCase() === selectedSubject.toLowerCase()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#DFE7F2] dark:bg-[#131927] border border-[#BAC9DC] dark:border-[#243048] rounded-3xl shadow-2xl p-5 sm:p-7 text-left my-6 transition-colors duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white p-1.5 rounded-xl hover:bg-[#D2DFEE] dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setActiveTab('simulation')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'simulation'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <Monitor size={14} />
              <span>Interactive Classroom Tour</span>
            </button>

            <button
              onClick={() => setActiveTab('lectures')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'lectures'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <Video size={14} />
              <span>YouTube & Video Lectures ({videos.length})</span>
            </button>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {activeTab === 'simulation'
              ? 'See How A Live 1-on-1 Lesson Works'
              : 'Curriculum Video Lectures & Board Masterclasses'}
          </h3>
          <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm mt-0.5 font-medium">
            {activeTab === 'simulation'
              ? 'Real-time interactive whiteboarding, visual concept breakdown, and immediate doubt elimination.'
              : 'Verified faculty walkthroughs of high-weightage 7-mark IPE Board problems and core concepts.'}
          </p>
        </div>

        {/* TAB 1: SIMULATION */}
        {activeTab === 'simulation' && (
          <div>
            {/* Mock Interactive Classroom Video Simulation */}
            <div className="relative aspect-video rounded-2xl bg-[#D2DFEE] dark:bg-[#0D121F] border border-[#B8CADF] dark:border-[#243048] overflow-hidden flex flex-col justify-between p-4 my-4 shadow-inner">
              {/* Top Bar inside simulation */}
              <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 border-b border-[#B8CADF] dark:border-[#243048] pb-2 font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-slate-900 dark:text-white font-bold">Live Whiteboard #A-409</span>
                </div>
                <span className="font-mono text-indigo-800 dark:text-indigo-300 font-bold">Dr. Elena & Maya (Intermediate 1st Year)</span>
              </div>

              {/* Whiteboard content simulation */}
              <div className="my-auto py-2 text-center space-y-3">
                <div className="inline-block px-4 py-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800/70 font-mono text-indigo-950 dark:text-indigo-200 font-bold text-xs sm:text-sm shadow-xs">
                  lim (x→0) [sin(x) / x] = 1 &nbsp;|&nbsp; Visual Squeeze Theorem Proof
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 max-w-md mx-auto font-medium">
                  &quot;Notice how the arc length of the unit circle squeezes between cos(θ) and 1 as θ approaches zero...&quot;
                </div>
                <div className="flex justify-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded bg-[#C5D5E7] dark:bg-[#1E283D] text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/70">
                    ✓ Student Whiteboard Synced
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#C5D5E7] dark:bg-[#1E283D] text-[11px] font-mono font-bold text-purple-800 dark:text-purple-400 border border-purple-300 dark:border-purple-800/70">
                    ✓ Real-Time Audio & Video
                  </span>
                </div>
              </div>

              {/* Bottom Bar inside simulation */}
              <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 pt-2 border-t border-[#B8CADF] dark:border-[#243048] font-medium">
                <span>HD Classroom Audio/Video Active</span>
                <span>Recorded for Parent Review</span>
              </div>
            </div>

            {/* Quick Highlights */}
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-800 dark:text-slate-200 mb-5 font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Interactive graph manipulation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Session recordings available 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Step-by-step diagnostic breakdown</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>No software downloads needed</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ACTUAL UPLOADED YOUTUBE & VIDEO LECTURES */}
        {activeTab === 'lectures' && (
          <div className="my-3 space-y-4">
            {/* Subject Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {subjects.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                    selectedSubject === sub
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-white/70 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-white'
                  }`}
                >
                  {sub === 'all' ? 'All Subjects' : sub}
                </button>
              ))}
            </div>

            {/* Active Video Player */}
            {selectedVideo && (
              <div className="rounded-2xl overflow-hidden border border-[#B8CADF] dark:border-[#243048] bg-black">
                {selectedVideo.type === 'youtube' || selectedVideo.youtubeId ? (
                  <div className="relative aspect-video w-full bg-black">
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`}
                      title={selectedVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  </div>
                ) : selectedVideo.type === 'video' ? (
                  <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                    <video src={selectedVideo.url} controls autoPlay className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="p-6 text-center bg-slate-900 text-white flex flex-col items-center justify-center min-h-[220px]">
                    <h4 className="font-bold text-base mb-1">{selectedVideo.title}</h4>
                    <p className="text-xs text-slate-400 mb-4">{selectedVideo.description}</p>
                    <a
                      href={selectedVideo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <span>Open External Link</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                )}

                {/* Details bar */}
                <div className="p-3.5 bg-slate-900/90 text-white flex items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-bold text-sm text-white truncate max-w-md">{selectedVideo.title}</h4>
                    <p className="text-slate-400 text-[11px]">{selectedVideo.instructor} • {selectedVideo.chapter || selectedVideo.subject}</p>
                  </div>
                  {selectedVideo.duration && (
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px] shrink-0 font-bold">
                      {selectedVideo.duration}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Video Playlist Thumbnails Carousel/Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
              {filteredVideos.map((item) => (
                <div
                  key={item.id || item._id}
                  onClick={() => setSelectedVideo(item)}
                  className={`p-2 rounded-xl border cursor-pointer transition-all flex items-center gap-2 ${
                    selectedVideo?.id === item.id || selectedVideo?._id === item._id
                      ? 'bg-red-500/10 border-red-500/40 dark:bg-red-500/20'
                      : 'bg-white/60 dark:bg-slate-900/60 border-slate-300 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-slate-950 shrink-0">
                    {item.thumbnailUrl ? (
                      <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <Play size={12} fill="currentColor" />
                      </div>
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.title}</p>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">{item.subject} • {item.duration || 'Lecture'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-[#CAD8EA] dark:border-[#1E293B]">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-bold cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              if (onOpenBooking) onOpenBooking("Demo Trial");
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-md shadow-red-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Sparkles size={14} className="text-amber-300" />
            <span>Book 1-on-1 Free Live Demo</span>
          </button>
        </div>

      </div>
    </div>
  );
}
