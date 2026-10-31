import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import {
  Users,
  BookOpen,
  Calendar,
  Shield,
  ShieldCheck,
  Search,
  Plus,
  Trash2,
  Edit,
  Eye,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronRight,
  LogOut,
  ExternalLink,
  Lock,
  Unlock,
  Settings,
  Database,
  GraduationCap,
  Phone,
  Mail,
  Building2,
  Filter,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  Check,
  Layers,
  FileSpreadsheet,
  Activity,
  CalendarDays,
  UserCheck,
  SlidersHorizontal,
  FolderGit2,
  Sun,
  Moon,
  Video,
  Play,
  Film,
  Link2,
  FileText,
  Copy,
  Maximize2,
  Minimize2,
  UploadCloud,
  Upload,
  Image as ImageIcon,
  LayoutGrid,
  Table,
  Award,
  MessageSquare,
  Bell,
  Clock,
  Globe,
  FileDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import {
  fetchAdminStats,
  fetchAdminUsers,
  createAdminUserApi,
  updateAdminUserApi,
  deleteAdminUserApi,
  fetchAdminBookings,
  updateAdminBookingApi,
  deleteAdminBookingApi,
  fetchCourses,
  createContentApi,
  updateContentApi,
  deleteContentApi,
  triggerSeed,
  checkApiHealth,
  fetchAdminVideos,
  createAdminVideoApi,
  updateAdminVideoApi,
  toggleAdminVideoStatusApi,
  deleteAdminVideoApi,
  seedAdminVideosApi,
  uploadMediaFileApi,
} from "../services/api";
import { TOPICS_DATA } from "../components/maths/MathsCurriculum";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminSidebar from "../components/admin/AdminSidebar";

export default function AdminPage({
  currentUser = null,
  onLogout,
  onOpenSignIn,
  theme: propTheme,
  toggleTheme: propToggleTheme,
}) {
  const navigate = useNavigate();

  // Internal theme tracking & fallback
  const [internalTheme, setInternalTheme] = useState(() => {
    try {
      return (
        localStorage.getItem("mla_theme") ||
        (document.documentElement.classList.contains("dark") ? "dark" : "light")
      );
    } catch {
      return "dark";
    }
  });

  const activeTheme = propTheme || internalTheme;

  const handleToggleTheme = () => {
    if (propToggleTheme) {
      propToggleTheme();
    } else {
      const next = activeTheme === "dark" ? "light" : "dark";
      setInternalTheme(next);
      const root = document.documentElement;
      if (next === "dark") {
        root.classList.add("dark");
        root.setAttribute("data-theme", "dark");
      } else {
        root.classList.remove("dark");
        root.setAttribute("data-theme", "light");
      }
      try {
        localStorage.setItem("mla_theme", next);
      } catch (e) {
        console.warn(e);
      }
    }
  };

  // Authentication State: check if user is already logged in via normal sign-in or admin token
  const [isAdminAuthed, setIsAdminAuthed] = useState(() => {
    try {
      const savedUser = localStorage.getItem("mla_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === "admin" || parsed.email === "md@visdomwaves.com") {
          return true;
        }
      }
      return (
        sessionStorage.getItem("mymarks_admin_auth") === "true" ||
        localStorage.getItem("mymarks_admin_auth") === "true"
      );
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (
      currentUser &&
      (currentUser.role === "admin" ||
        currentUser.email === "md@visdomwaves.com")
    ) {
      setIsAdminAuthed(true);
    }
  }, [currentUser]);

  // Active Tab: 'dashboard' | 'students' | 'courses' | 'bookings' | 'settings'
  const [activeTab, setActiveTab] = useState("dashboard");

  // Loading & Refresh State
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [apiStatus, setApiStatus] = useState({ online: true, latency: 45 });

  // Data States
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalContent: 0,
    totalBookings: 0,
    serverUptime: 0,
    boardDistribution: [],
    yearDistribution: [],
  });
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [videos, setVideos] = useState([]);

  // Toast Notifications
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  }, []);

  // Filter & Search States
  const [userSearch, setUserSearch] = useState("");
  const [boardFilter, setBoardFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  const [courseSearch, setCourseSearch] = useState("");
  const [courseCategory, setCourseCategory] = useState("all");

  const [bookingFilter, setBookingFilter] = useState("all");

  const [videoSearch, setVideoSearch] = useState("");
  const [videoTypeFilter, setVideoTypeFilter] = useState("all");
  const [videoSubjectFilter, setVideoSubjectFilter] = useState("all");
  const [videoBoardFilter, setVideoBoardFilter] = useState("all");
  const [videoYearFilter, setVideoYearFilter] = useState("all");
  const [videoStatusFilter, setVideoStatusFilter] = useState("all");
  const [videoViewMode, setVideoViewMode] = useState("grid"); // 'grid' | 'table'

  // Modals
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userModalMode, setUserModalMode] = useState("create"); // 'create' | 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewUserDetail, setViewUserDetail] = useState(null);

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseModalMode, setCourseModalMode] = useState("create");
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoModalMode, setVideoModalMode] = useState("create");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [previewVideoModal, setPreviewVideoModal] = useState(null);
  const [copiedVideoId, setCopiedVideoId] = useState(null);

  // Video Upload & Full Screen Studio States
  const [isVideoFullScreen, setIsVideoFullScreen] = useState(true); // Automatically open full screen studio
  const [videoStudioStep, setVideoStudioStep] = useState(1); // 1: Media, 2: Thumbnail, 3: Curriculum, 4: Settings, 5: Preview
  const [videoSourceMode, setVideoSourceMode] = useState("upload"); // 'upload' | 'url'
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [videoUploadInfo, setVideoUploadInfo] = useState(null);
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const [thumbUploadProgress, setThumbUploadProgress] = useState(0);
  const [videoDragOver, setVideoDragOver] = useState(false);
  const [thumbDragOver, setThumbDragOver] = useState(false);
  const [youtubeError, setYoutubeError] = useState("");
  const [showTopicSection, setShowTopicSection] = useState(false); // Toggle Topic & Sub Topic section (+/-)
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { type: 'user'|'course'|'booking'|'video', id, title }

  // Old Videos Storage & Replace State
  const [replaceExistingVideo, setReplaceExistingVideo] = useState(true); // Optional replace & archive old video
  const [isArchiveStorageModalOpen, setIsArchiveStorageModalOpen] =
    useState(false);
  const [archiveSearch, setArchiveSearch] = useState("");
  const [archiveFilterLevel, setArchiveFilterLevel] = useState("all");

  // Helper to extract YouTube ID
  const extractYouTubeId = useCallback((url) => {
    if (!url) return "";
    const trimmed = url.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
    const regExp =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = trimmed.match(regExp);
    return match && match[1] ? match[1] : "";
  }, []);

  // Safe thumbnail helper that guards against broken YouTube thumbnail 404s
  const getSafeThumbnailUrl = useCallback(
    (rawThumbUrl, ytId) => {
      let thumb = (rawThumbUrl || "").trim();
      let id = (ytId || extractYouTubeId(thumb) || "").trim();

      // Map known dead/404 YouTube IDs to active educational video IDs
      const BAD_IDS = [
        "2TzFm9u5e10",
        "WUvTyaaNjfo",
        "YV8R-iEwI10",
        "s8z_gV4d1Y0",
        "012s6N3B6xM",
        "vQ881vB7x6k",
        "o10h4_k86M0",
        "j49s-jEw1Y0",
        "k29B_v16-9M",
        "w40B_v16-9M",
        "1m4q_3y-89k",
      ];
      if (BAD_IDS.includes(id) || BAD_IDS.some((bad) => thumb.includes(bad))) {
        id = "3-s0IwdDcgE";
        thumb = "https://img.youtube.com/vi/3-s0IwdDcgE/hqdefault.jpg";
      }
      if (thumb && !BAD_IDS.some((bad) => thumb.includes(bad))) {
        return thumb;
      }
      if (id && !BAD_IDS.includes(id)) {
        return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
      }
      return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80";
    },
    [extractYouTubeId],
  );

  // Stepper helper for Topic Number (e.g. 1.0, 1.1, 2.0)
  const stepTopicNumber = useCallback((currentVal, delta) => {
    const str = String(currentVal || "1.0").trim();
    const parts = str.split(".");
    if (parts.length === 1) {
      const major = parseInt(parts[0], 10) || 1;
      const next = delta > 0 ? major + 1 : Math.max(1, major - 1);
      return `${next}.0`;
    }
    const major = parseInt(parts[0], 10) || 1;
    const minor = parseInt(parts[1], 10) || 0;
    const nextMinor = delta > 0 ? minor + 1 : Math.max(0, minor - 1);
    return `${major}.${nextMinor}`;
  }, []);

  // Stepper helper for Sub Topic Number (e.g. 1.0.0, 1.0.1, 1.1.0)
  const stepSubTopicNumber = useCallback((currentVal, delta) => {
    const str = String(currentVal || "1.0.0").trim();
    const parts = str.split(".");
    if (parts.length === 1) {
      const major = parseInt(parts[0], 10) || 1;
      const next = delta > 0 ? major + 1 : Math.max(1, major - 1);
      return `${next}.0.0`;
    }
    if (parts.length === 2) {
      const major = parseInt(parts[0], 10) || 1;
      const minor = parseInt(parts[1], 10) || 0;
      const sub = delta > 0 ? 1 : 0;
      return `${major}.${minor}.${sub}`;
    }
    const major = parseInt(parts[0], 10) || 1;
    const minor = parseInt(parts[1], 10) || 0;
    const sub = parseInt(parts[2], 10) || 0;
    const nextSub = delta > 0 ? sub + 1 : Math.max(0, sub - 1);
    return `${major}.${minor}.${nextSub}`;
  }, []);

  // Stepper helper for Sub Sub Topic Number (e.g. 1.0.0.0, 1.0.0.1, 1.1.0.0)
  const stepSubSubTopicNumber = useCallback((currentVal, delta) => {
    const str = String(currentVal || "1.0.0.0").trim();
    const parts = str.split(".");
    if (parts.length === 1) {
      const major = parseInt(parts[0], 10) || 1;
      const next = delta > 0 ? major + 1 : Math.max(1, major - 1);
      return `${next}.0.0.0`;
    }
    if (parts.length === 2) {
      const major = parseInt(parts[0], 10) || 1;
      const minor = parseInt(parts[1], 10) || 0;
      const sub = delta > 0 ? 1 : 0;
      return `${major}.${minor}.${sub}.0`;
    }
    if (parts.length === 3) {
      const major = parseInt(parts[0], 10) || 1;
      const minor = parseInt(parts[1], 10) || 0;
      const sub = parseInt(parts[2], 10) || 0;
      const subSub = delta > 0 ? 1 : 0;
      return `${major}.${minor}.${sub}.${subSub}`;
    }
    const major = parseInt(parts[0], 10) || 1;
    const minor = parseInt(parts[1], 10) || 0;
    const sub = parseInt(parts[2], 10) || 0;
    const subSub = parseInt(parts[3], 10) || 0;
    const nextSubSub = delta > 0 ? subSub + 1 : Math.max(0, subSub - 1);
    return `${major}.${minor}.${sub}.${nextSubSub}`;
  }, []);

  // Helper to sync curriculum fields without modifying saved keywords
  const syncCurriculumKeywords = useCallback((prevForm, fieldUpdates) => {
    return { ...prevForm, ...fieldUpdates };
  }, []);

  // Helper to save a typed keyword into videoForm.keywords and show it under Summary
  const handleSaveKeywordToSummary = useCallback((keywordValue, fieldKey) => {
    if (!keywordValue || !String(keywordValue).trim()) return;
    const incomingList = String(keywordValue)
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    if (incomingList.length === 0) return;

    setVideoForm((prev) => {
      const currentList =
        typeof prev.keywords === "string"
          ? prev.keywords
              .split(",")
              .map((k) => k.trim())
              .filter(Boolean)
          : Array.isArray(prev.keywords)
            ? prev.keywords.map((k) => String(k).trim()).filter(Boolean)
            : [];
      const seen = new Set(currentList.map((k) => k.toLowerCase()));
      incomingList.forEach((kw) => {
        if (!seen.has(kw.toLowerCase())) {
          seen.add(kw.toLowerCase());
          currentList.push(kw);
        }
      });
      const updatedStr = currentList.join(", ");
      return {
        ...prev,
        keywords: updatedStr,
        tags: updatedStr,
      };
    });

    if (fieldKey) {
      setSavedKeyFeedback((prev) => ({ ...prev, [fieldKey]: true }));
      setTimeout(() => {
        setSavedKeyFeedback((prev) => ({ ...prev, [fieldKey]: false }));
      }, 1500);
    }
  }, []);

  // Helper to remove a single keyword from the saved list under Summary
  const handleRemoveKeywordFromSummary = useCallback((keywordToRemove) => {
    setVideoForm((prev) => {
      const currentList =
        typeof prev.keywords === "string"
          ? prev.keywords
              .split(",")
              .map((k) => k.trim())
              .filter(Boolean)
          : Array.isArray(prev.keywords)
            ? prev.keywords.map((k) => String(k).trim()).filter(Boolean)
            : [];
      const filtered = currentList.filter(
        (k) => k.toLowerCase() !== String(keywordToRemove).toLowerCase(),
      );
      const updatedStr = filtered.join(", ");
      return {
        ...prev,
        keywords: updatedStr,
        tags: updatedStr,
      };
    });
  }, []);

  // User Form Data
  const initialUserForm = {
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    board: "Andhra Pradesh Intermediate",
    year: "First Year",
    collegeName: "",
    hallTicketNumber: "",
    fatherName: "",
    fatherMobile: "",
    relationship: "Father",
    dob: "",
    aadhaarNumber: "",
    studyMonthYear: "June, 2026",
    role: "student",
  };
  const [userForm, setUserForm] = useState(initialUserForm);

  // Course Form Data
  const initialCourseForm = {
    title: "",
    type: "course",
    category: "mpc",
    level: "Intermediate 1st Year",
    description: "",
    lessonsCount: 36,
    durationWeeks: 12,
    rating: 4.9,
    tag: "Core Track",
    instructor: {
      name: "Faculty Lead",
      title: "Senior Subject Educator",
    },
    popular: true,
    status: "published",
  };
  const [courseForm, setCourseForm] = useState(initialCourseForm);

  // Video & Resource Form Data with Step 4 Lesson Settings
  const initialVideoForm = {
    title: "",
    uploadLevel: "chapter", // 'chapter' | 'topic' | 'subTopic' | 'subSubTopic'
    code: "1.0",
    type: "youtube", // 'youtube' | 'video' | 'link' | 'drive' | 'document'
    url: "",
    subject: "Mathematics",
    board: "Both Boards", // 'Andhra Pradesh Intermediate' | 'Telangana Intermediate' | 'Both Boards'
    classLevel: "Intermediate 1st Year",
    year: "1st Year", // '1st Year' | '2nd Year' | 'Both Years'
    chapterNumber: 1,
    chapterName: "",
    chapter: "",
    chapterKeyword: "",
    topicNumber: "1.0",
    topicName: "",
    topicKeyword: "",
    subTopicNumber: "1.0.0",
    subTopicName: "",
    subTopicKeyword: "",
    subSubTopicNumber: "1.0.0.0",
    subSubTopicName: "",
    subSubTopicKeyword: "",
    lesson: "Lesson 1",
    lessonName: "Lesson 1",
    description: "",
    duration: "45 mins",
    instructor: "Visdom Waves Faculty",
    keywords: "",
    tags: "",
    customKeywords: "",
    linkType: "Lecture Video",
    thumbnailUrl: "",
    isFeatured: false,
    isPremium: false,
    status: "published", // 'published' | 'draft' | 'archived' | 'hidden'

    // Step 4 – Lesson Settings
    freePreview: true,
    premiumContent: false,
    allowPdfDownload: true,
    allowVideoDownload: false,
    allowAssignmentDownload: true,
    estimatedDuration: "45 Minutes",
    difficultyLevel: "Intermediate", // 'Beginner' | 'Intermediate' | 'Advanced'
    releaseDate: "",
    expiryDate: "",
    lessonOrder: "Lesson 1",
    completionRequirement: "Video Only", // 'Video Only' | 'Video + PDF' | 'Video + Quiz' | 'Complete All'
    certificateEligible: true,
    progressTracking: true,
    studentNotifications: true,
    parentNotification: false,
    attendanceRequired: "Optional", // 'Optional' | 'Required'
    commentsEnabled: true,
    discussionForumEnabled: true,
    liveClassPlatform: "None", // 'None' | 'Google Meet' | 'Zoom' | 'Microsoft Teams'
    liveClassLink: "",
    seoSlug: "",
    seoMetaTitle: "",
    seoMetaDescription: "",

    // Watermark & Anti-Piracy Protection (Optional)
    watermarkEnabled: false,
    watermarkText: "",
    watermarkPosition: "top-right", // 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

    // Badges ("Barge") & Highlighting (Optional)
    badgeText: "",
    badgeColor: "blue",
    isVerifiedBadge: false,
    qualityBadge: "1080p Full HD",
  };
  const [videoForm, setVideoForm] = useState(initialVideoForm);
  const [savedKeyFeedback, setSavedKeyFeedback] = useState({});

  // Separate media per hierarchy level: Chapter, Topic, Sub Topic, Sub Sub Topic
  const initialLevelMedia = {
    chapter: {
      url: "",
      type: "youtube",
      thumbnailUrl: "",
      originalName: "",
      isUploading: false,
      progress: 0,
    },
    topic: {
      url: "",
      type: "youtube",
      thumbnailUrl: "",
      originalName: "",
      isUploading: false,
      progress: 0,
    },
    subTopic: {
      url: "",
      type: "youtube",
      thumbnailUrl: "",
      originalName: "",
      isUploading: false,
      progress: 0,
    },
    subSubTopic: {
      url: "",
      type: "youtube",
      thumbnailUrl: "",
      originalName: "",
      isUploading: false,
      progress: 0,
    },
  };

  const [levelMedia, setLevelMedia] = useState(initialLevelMedia);
  const [activeUploadContext, setActiveUploadContext] = useState("chapter"); // 'chapter' | 'topic' | 'subTopic' | 'subSubTopic'

  // Quick YouTube Modal State (attached from Curriculum Info row buttons)
  const [quickYoutubeModal, setQuickYoutubeModal] = useState({
    isOpen: false,
    context: "",
    contextLabel: "",
    url: "",
  });

  const handleRemoveLevelMedia = useCallback((context) => {
    setLevelMedia((prev) => ({
      ...prev,
      [context]: {
        url: "",
        type: "youtube",
        thumbnailUrl: "",
        originalName: "",
        isUploading: false,
        progress: 0,
      },
    }));
    showToast(
      `Removed video from ${context === "chapter" ? "Chapter" : context === "topic" ? "Topic" : context === "subTopic" ? "Sub Topic" : "Sub Sub Topic"}`,
      "info",
    );
  }, []);

  const handleOpenYouTubeModal = useCallback(
    (context = "chapter", label = "") => {
      setActiveUploadContext(context);
      setVideoForm((prev) => {
        let nextTitle = prev.title;
        if (!nextTitle) {
          if (context === "topic" && prev.topicName) {
            nextTitle = prev.topicName;
          } else if (
            context === "subTopic" &&
            (prev.subTopicName || prev.lessonName)
          ) {
            nextTitle = prev.subTopicName || prev.lessonName;
          } else if (context === "subSubTopic" && prev.subSubTopicName) {
            nextTitle = prev.subSubTopicName;
          } else if (prev.chapterName) {
            nextTitle = prev.chapterName;
          }
        }
        return {
          ...prev,
          uploadLevel: context,
          title: nextTitle || prev.title,
        };
      });

      setQuickYoutubeModal({
        isOpen: true,
        context,
        contextLabel: label || "Curriculum Item",
        url:
          levelMedia[context]?.url ||
          (videoForm.uploadLevel === context ? videoForm.url : ""),
      });
    },
    [levelMedia, videoForm.uploadLevel, videoForm.url],
  );

  const handleTriggerVideoUpload = useCallback(
    (context = "chapter", label = "") => {
      setActiveUploadContext(context);
      setVideoForm((prev) => {
        let nextTitle = prev.title;
        if (!nextTitle) {
          if (context === "topic" && prev.topicName) {
            nextTitle = prev.topicName;
          } else if (
            context === "subTopic" &&
            (prev.subTopicName || prev.lessonName)
          ) {
            nextTitle = prev.subTopicName || prev.lessonName;
          } else if (context === "subSubTopic" && prev.subSubTopicName) {
            nextTitle = prev.subSubTopicName;
          } else if (prev.chapterName) {
            nextTitle = prev.chapterName;
          }
        }
        return {
          ...prev,
          uploadLevel: context,
          title: nextTitle || prev.title,
        };
      });

      const input = document.getElementById("admin-video-file-input");
      if (input) {
        input.value = "";
        input.click();
      }
    },
    [],
  );

  const handleTriggerThumbUpload = useCallback((context = "chapter") => {
    setActiveUploadContext(context);
    const input = document.getElementById("admin-thumb-file-input");
    if (input) {
      input.value = "";
      input.click();
    }
  }, []);

  // Small Action Buttons on Right Side of Save: YouTube URL, Upload video, and Thumbnail
  const renderMediaActionButtons = useCallback(
    (context, label) => {
      const media = levelMedia[context] || {};
      const isThisYt =
        (media.type === "youtube" || Boolean(extractYouTubeId(media.url))) &&
        Boolean(media.url);
      const isThisVideo = media.type === "video" && Boolean(media.url);
      const isThisThumb = Boolean(media.thumbnailUrl);
      const isRowUploading = Boolean(media.isUploading);
      const rowProgress = media.progress || 0;

      return (
        <div className="flex flex-col gap-1.5 shrink-0">
          <div className="flex items-center gap-1.5 shrink-0 flex-wrap sm:flex-nowrap">
            {/* YouTube URL Small Button */}
            <button
              type="button"
              onClick={() => handleOpenYouTubeModal(context, label)}
              className={`h-[42px] px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs select-none active:scale-95 whitespace-nowrap ${
                isThisYt
                  ? "bg-red-600 text-white shadow-red-500/25 border border-red-600 ring-2 ring-red-400/30"
                  : "bg-red-50 hover:bg-red-100/90 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60"
              }`}
              title={
                isThisYt
                  ? `YouTube URL Linked: ${media.url}`
                  : `Attach YouTube Video URL for ${label}`
              }
            >
              <svg
                className="w-3.5 h-3.5 fill-current shrink-0"
                viewBox="0 0 24 24"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span>{isThisYt ? "YouTube URL ✓" : "YouTube URL"}</span>
            </button>

            {/* Upload Video Small Button */}
            <button
              type="button"
              disabled={isRowUploading || isUploadingVideo}
              onClick={() => handleTriggerVideoUpload(context, label)}
              className={`h-[42px] px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs select-none active:scale-95 whitespace-nowrap ${
                isThisVideo
                  ? "bg-blue-600 text-white shadow-blue-500/25 border border-blue-600 ring-2 ring-blue-400/30"
                  : "bg-blue-50 hover:bg-blue-100/90 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-900/60"
              } ${isRowUploading ? "opacity-70 cursor-wait" : ""}`}
              title={
                isThisVideo
                  ? `Video Uploaded: ${media.originalName || media.url}`
                  : `Upload Video File for ${label}`
              }
            >
              {isRowUploading ? (
                <RefreshCw
                  size={13}
                  className="animate-spin text-blue-600 dark:text-cyan-300 shrink-0"
                />
              ) : (
                <Upload size={13} className="shrink-0" />
              )}
              <span>
                {isRowUploading
                  ? `Uploading ${rowProgress}%`
                  : isThisVideo
                    ? "Upload video ✓"
                    : "Upload video"}
              </span>
            </button>

            {/* Upload Thumbnail Small Button */}
            <button
              type="button"
              disabled={isUploadingThumb}
              onClick={() => handleTriggerThumbUpload(context)}
              className={`h-[42px] px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs select-none active:scale-95 whitespace-nowrap ${
                isThisThumb
                  ? "bg-purple-600 text-white shadow-purple-500/25 border border-purple-600 ring-2 ring-purple-400/30"
                  : "bg-purple-50 hover:bg-purple-100/90 dark:bg-purple-950/40 dark:hover:bg-purple-900/60 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-900/60"
              } ${isUploadingThumb ? "opacity-70 cursor-wait" : ""}`}
              title={
                isThisThumb
                  ? `Thumbnail Active: ${media.thumbnailUrl}`
                  : `Upload Custom Thumbnail for ${label}`
              }
            >
              {isUploadingThumb ? (
                <RefreshCw
                  size={13}
                  className="animate-spin text-purple-600 dark:text-purple-300 shrink-0"
                />
              ) : (
                <ImageIcon size={13} className="shrink-0" />
              )}
              <span>{isThisThumb ? "Thumbnail ✓" : "Thumbnail"}</span>
            </button>
          </div>

          {/* Attached Video Chip Indicator with Clear button */}
          {media.url && (
            <div className="flex items-center justify-between gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold animate-in fade-in">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <span
                  className="truncate max-w-[200px]"
                  title={media.originalName || media.url}
                >
                  {media.type === "youtube" ? "YouTube" : "Video"}:{" "}
                  {media.originalName ||
                    (media.url.length > 25
                      ? media.url.substring(0, 25) + "..."
                      : media.url)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveLevelMedia(context)}
                className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 px-1 font-black cursor-pointer text-xs"
                title="Detach video from this level"
              >
                ×
              </button>
            </div>
          )}
        </div>
      );
    },
    [
      levelMedia,
      handleOpenYouTubeModal,
      handleTriggerVideoUpload,
      handleTriggerThumbUpload,
      handleRemoveLevelMedia,
      isUploadingVideo,
      isUploadingThumb,
    ],
  );

  // Load all data
  const loadAdminData = useCallback(async () => {
    setIsRefreshing(true);
    const start = performance.now();
    try {
      // 1. Stats
      const statsRes = await fetchAdminStats();
      if (statsRes.success) {
        setStats(statsRes.stats);
      }

      // 2. Users
      const usersRes = await fetchAdminUsers({ limit: 100 });
      if (usersRes.success && Array.isArray(usersRes.users)) {
        setUsers(usersRes.users);
      }

      // 3. Courses
      const coursesRes = await fetchCourses("all");
      if (Array.isArray(coursesRes.courses)) {
        setCourses(coursesRes.courses);
      }

      // 4. Bookings
      const bookingsRes = await fetchAdminBookings();
      if (bookingsRes.success && Array.isArray(bookingsRes.bookings)) {
        setBookings(bookingsRes.bookings);
      }

      // 5. Videos & Links
      const videosRes = await fetchAdminVideos({ limit: 100 });
      if (videosRes.success && Array.isArray(videosRes.data)) {
        const sanitized = videosRes.data.map((v) => {
          let t = v.thumbnailUrl || "";
          let u = v.url || "";
          let yt =
            v.youtubeId || extractYouTubeId(u) || extractYouTubeId(t) || "";
          if (
            t.includes("2TzFm9u5e10") ||
            u.includes("2TzFm9u5e10") ||
            yt === "2TzFm9u5e10"
          ) {
            t = "https://img.youtube.com/vi/bHIhgxav9LY/hqdefault.jpg";
            u = "https://www.youtube.com/watch?v=bHIhgxav9LY";
            yt = "bHIhgxav9LY";
          }
          if (
            t.includes("WUvTyaaNjfo") ||
            u.includes("WUvTyaaNjfo") ||
            yt === "WUvTyaaNjfo"
          ) {
            t = "https://img.youtube.com/vi/jQUrfmX0uko/hqdefault.jpg";
            u = "https://www.youtube.com/watch?v=jQUrfmX0uko";
            yt = "jQUrfmX0uko";
          }
          return { ...v, thumbnailUrl: t, url: u, youtubeId: yt };
        });
        setVideos(sanitized);
      }

      const elapsed = Math.round(performance.now() - start);
      setApiStatus({ online: true, latency: elapsed });
    } catch (err) {
      console.warn("Failed to load admin data:", err);
      setApiStatus({ online: false, latency: 0 });
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (isAdminAuthed) {
      loadAdminData();
    }
  }, [isAdminAuthed, loadAdminData]);

  const handleAdminLogout = () => {
    try {
      localStorage.removeItem("mymarks_admin_auth");
      sessionStorage.removeItem("mymarks_admin_auth");
      localStorage.removeItem("mymarks_admin_token");
      sessionStorage.removeItem("mymarks_admin_token");
      localStorage.removeItem("mla_user");
    } catch (e) {
      console.warn(e);
    }
    setIsAdminAuthed(false);
    showToast("Logged out of Admin Hub", "info");
    if (onLogout) {
      onLogout();
    } else {
      navigate("/demo");
    }
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !userSearch ||
        (u.fullName || "").toLowerCase().includes(userSearch.toLowerCase()) ||
        (u.email || "").toLowerCase().includes(userSearch.toLowerCase()) ||
        (u.mobileNumber || "").includes(userSearch) ||
        (u.collegeName || "")
          .toLowerCase()
          .includes(userSearch.toLowerCase()) ||
        (u.hallTicketNumber || "")
          .toLowerCase()
          .includes(userSearch.toLowerCase());

      const matchBoard =
        boardFilter === "all" ||
        (u.board || "").toLowerCase().includes(boardFilter.toLowerCase());

      const matchYear =
        yearFilter === "all" ||
        (u.year || "").toLowerCase().includes(yearFilter.toLowerCase());

      return matchSearch && matchBoard && matchYear;
    });
  }, [users, userSearch, boardFilter, yearFilter]);

  // Filtered Courses
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        !courseSearch ||
        (c.title || "").toLowerCase().includes(courseSearch.toLowerCase()) ||
        (c.description || "")
          .toLowerCase()
          .includes(courseSearch.toLowerCase());

      const matchCategory =
        courseCategory === "all" ||
        (c.category || "").toLowerCase() === courseCategory.toLowerCase();

      return matchSearch && matchCategory;
    });
  }, [courses, courseSearch, courseCategory]);

  // Filtered Videos & Resources
  const filteredVideos = useMemo(() => {
    return videos.filter((v) => {
      const q = videoSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        (v.title || "").toLowerCase().includes(q) ||
        (v.chapter || "").toLowerCase().includes(q) ||
        (v.chapterName || "").toLowerCase().includes(q) ||
        (v.topicName || v.topic || "").toLowerCase().includes(q) ||
        (v.subTopicName || "").toLowerCase().includes(q) ||
        (v.lesson || "").toLowerCase().includes(q) ||
        (v.lessonName || "").toLowerCase().includes(q) ||
        (v.instructor || "").toLowerCase().includes(q) ||
        (v.subject || "").toLowerCase().includes(q) ||
        (v.board || "").toLowerCase().includes(q) ||
        (v.description || "").toLowerCase().includes(q) ||
        (Array.isArray(v.keywords) &&
          v.keywords.some((k) => k.toLowerCase().includes(q))) ||
        (Array.isArray(v.tags) &&
          v.tags.some((t) => t.toLowerCase().includes(q)));

      const matchType = videoTypeFilter === "all" || v.type === videoTypeFilter;
      const matchSubject =
        videoSubjectFilter === "all" ||
        (v.subject || "").toLowerCase() === videoSubjectFilter.toLowerCase();

      const matchBoard =
        videoBoardFilter === "all" ||
        (v.board || "")
          .toLowerCase()
          .includes(videoBoardFilter.toLowerCase()) ||
        v.board === "Both Boards" ||
        v.board === "All Boards";

      const matchYear =
        videoYearFilter === "all" ||
        (v.year || "").toLowerCase().includes(videoYearFilter.toLowerCase()) ||
        (v.classLevel || "")
          .toLowerCase()
          .includes(videoYearFilter.toLowerCase()) ||
        v.year === "Both Years" ||
        v.classLevel === "Both Years" ||
        v.classLevel === "All Levels";

      const matchStatus =
        videoStatusFilter === "all"
          ? v.status !== "archived" && !v.isArchived
          : videoStatusFilter === "archived"
            ? v.status === "archived" || v.isArchived
            : (v.status || "published").toLowerCase() ===
              videoStatusFilter.toLowerCase();

      return (
        matchSearch &&
        matchType &&
        matchSubject &&
        matchBoard &&
        matchYear &&
        matchStatus
      );
    });
  }, [
    videos,
    videoSearch,
    videoTypeFilter,
    videoSubjectFilter,
    videoBoardFilter,
    videoYearFilter,
    videoStatusFilter,
  ]);

  // Old Videos Storage: all preserved, replaced, and archived videos
  const archivedVideos = useMemo(() => {
    return videos.filter((v) => v.status === "archived" || v.isArchived);
  }, [videos]);

  // Filtered list within Old Videos Storage modal
  const filteredArchivedVideos = useMemo(() => {
    return archivedVideos.filter((v) => {
      const q = archiveSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        (v.title || "").toLowerCase().includes(q) ||
        (v.code || "").toLowerCase().includes(q) ||
        (v.chapter || "").toLowerCase().includes(q) ||
        (v.chapterName || "").toLowerCase().includes(q) ||
        (v.topicName || v.topic || "").toLowerCase().includes(q) ||
        (v.subTopicName || "").toLowerCase().includes(q) ||
        (v.subSubTopicName || "").toLowerCase().includes(q) ||
        (v.replacedByTitle || "").toLowerCase().includes(q) ||
        (v.replacedByCode || "").toLowerCase().includes(q);

      const matchLevel =
        archiveFilterLevel === "all" ||
        (v.uploadLevel || "").toLowerCase() ===
          archiveFilterLevel.toLowerCase();

      return matchSearch && matchLevel;
    });
  }, [archivedVideos, archiveSearch, archiveFilterLevel]);

  // Detect active existing videos matching the current hierarchy levels being uploaded
  const existingVideosForHierarchy = useMemo(() => {
    const results = [];
    const chNum = Number(videoForm.chapterNumber) || 1;
    const tCode = String(videoForm.topicNumber || "1.0").trim();
    const stCode = String(videoForm.subTopicNumber || "1.0.0").trim();
    const sstCode = String(videoForm.subSubTopicNumber || "1.0.0.0").trim();

    // Active videos (not archived)
    const activeList = videos.filter(
      (v) =>
        (v._id || v.id) !== (selectedVideo?._id || selectedVideo?.id) &&
        v.status !== "archived" &&
        !v.isArchived,
    );

    // Topic check
    if (
      levelMedia.topic?.url?.trim() ||
      (!levelMedia.chapter?.url &&
        !levelMedia.subTopic?.url &&
        !levelMedia.subSubTopic?.url &&
        videoForm.url?.trim())
    ) {
      const match = activeList.find(
        (v) =>
          (v.code && v.code.trim() === tCode) ||
          (String(v.topicNumber || "").trim() === tCode &&
            Number(v.chapterNumber) === chNum),
      );
      if (match) {
        results.push({
          level: "topic",
          label: `Topic ${tCode}`,
          code: tCode,
          existingVideo: match,
        });
      } else if (TOPICS_DATA && Array.isArray(TOPICS_DATA)) {
        const defaultCh = TOPICS_DATA.find((c) => Number(c.number) === chNum);
        if (defaultCh && Array.isArray(defaultCh.videos)) {
          const defaultItem = defaultCh.videos.find((dv) => dv.code === tCode);
          if (defaultItem) {
            results.push({
              level: "topic",
              label: `Topic ${tCode}`,
              code: tCode,
              existingVideo: {
                title: defaultItem.title,
                code: tCode,
                chapterNumber: chNum,
                isDefaultCurriculum: true,
              },
            });
          }
        }
      }
    }

    // Sub Topic check
    if (levelMedia.subTopic?.url?.trim()) {
      const match = activeList.find(
        (v) =>
          (v.code && v.code.trim() === stCode) ||
          (String(v.subTopicNumber || "").trim() === stCode &&
            Number(v.chapterNumber) === chNum),
      );
      if (match) {
        results.push({
          level: "subTopic",
          label: `Sub Topic ${stCode}`,
          code: stCode,
          existingVideo: match,
        });
      }
    }

    // Sub Sub Topic check
    if (levelMedia.subSubTopic?.url?.trim()) {
      const match = activeList.find(
        (v) =>
          (v.code && v.code.trim() === sstCode) ||
          (String(v.subSubTopicNumber || "").trim() === sstCode &&
            Number(v.chapterNumber) === chNum),
      );
      if (match) {
        results.push({
          level: "subSubTopic",
          label: `Sub Sub Topic ${sstCode}`,
          code: sstCode,
          existingVideo: match,
        });
      }
    }

    // Chapter check
    if (levelMedia.chapter?.url?.trim()) {
      const match = activeList.find(
        (v) =>
          (v.code && v.code.trim() === String(chNum)) ||
          (Number(v.chapterNumber) === chNum &&
            (v.uploadLevel === "chapter" || (!v.topicNumber && !v.topicName))),
      );
      if (match) {
        results.push({
          level: "chapter",
          label: `Chapter ${chNum}`,
          code: String(chNum),
          existingVideo: match,
        });
      }
    }

    return results;
  }, [
    videos,
    videoForm.chapterNumber,
    videoForm.topicNumber,
    videoForm.subTopicNumber,
    videoForm.subSubTopicNumber,
    levelMedia,
    videoForm.url,
    selectedVideo,
  ]);

  // User Actions
  const handleOpenAddUser = () => {
    setUserModalMode("create");
    setUserForm(initialUserForm);
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (user) => {
    setUserModalMode("edit");
    setSelectedUser(user);
    setUserForm({
      fullName: user.fullName || user.name || "",
      email: user.email || "",
      mobileNumber: user.mobileNumber || user.phone || "",
      password: "",
      board: user.board || "Andhra Pradesh Intermediate",
      year: user.year || "First Year",
      collegeName: user.collegeName || user.college || "",
      hallTicketNumber: user.hallTicketNumber || user.hallTicket || "",
      fatherName: user.fatherName || "",
      fatherMobile: user.fatherMobile || "",
      relationship: user.relationship || "Father",
      dob: user.dob || "",
      aadhaarNumber: user.aadhaarNumber || "",
      studyMonthYear: user.studyMonthYear || "June, 2026",
      role: user.role || "student",
    });
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (userModalMode === "create") {
        const res = await createAdminUserApi(userForm);
        showToast("Student registered successfully!");
      } else {
        await updateAdminUserApi(selectedUser._id || selectedUser.id, userForm);
        showToast("Student profile updated successfully!");
      }
      setIsUserModalOpen(false);
      await loadAdminData();
    } catch (err) {
      showToast(err.message || "Operation failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    setIsLoading(true);
    try {
      await deleteAdminUserApi(id);
      showToast("Student deleted successfully");
      setDeleteConfirm(null);
      await loadAdminData();
    } catch (err) {
      showToast(err.message || "Delete failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Course Actions
  const handleOpenAddCourse = () => {
    setCourseModalMode("create");
    setCourseForm(initialCourseForm);
    setIsCourseModalOpen(true);
  };

  const handleOpenEditCourse = (course) => {
    setCourseModalMode("edit");
    setSelectedCourse(course);
    setCourseForm({
      title: course.title || "",
      type: course.type || "course",
      category: course.category || "mpc",
      level: course.level || "Intermediate 1st Year",
      description: course.description || "",
      lessonsCount: course.lessonsCount || 36,
      durationWeeks: course.durationWeeks || 12,
      rating: course.rating || 4.9,
      tag: course.tag || "Core Track",
      instructor: {
        name: course.instructor?.name || course.instructor || "Faculty Lead",
        title:
          course.instructor?.title ||
          course.instructorTitle ||
          "Senior Subject Educator",
      },
      popular: !!course.popular,
      status: course.status || "published",
    });
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (courseModalMode === "create") {
        await createContentApi(courseForm);
        showToast("New course curriculum added successfully!");
      } else {
        await updateContentApi(
          selectedCourse.id || selectedCourse._id,
          courseForm,
        );
        showToast("Course updated successfully!");
      }
      setIsCourseModalOpen(false);
      await loadAdminData();
    } catch (err) {
      showToast(err.message || "Failed to save course", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    setIsLoading(true);
    try {
      await deleteContentApi(id);
      showToast("Course removed successfully");
      setDeleteConfirm(null);
      await loadAdminData();
    } catch (err) {
      showToast(err.message || "Delete failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Video & Resource Actions
  const handleOpenAddVideo = (mode = "upload", step = 1) => {
    setVideoModalMode("create");
    setVideoForm(initialVideoForm);
    setLevelMedia(initialLevelMedia);
    setActiveUploadContext("chapter");
    setVideoSourceMode(mode);
    setVideoStudioStep(step);
    setIsVideoFullScreen(true); // Automatically open in full screen
    setVideoUploadProgress(0);
    setVideoUploadInfo(null);
    setYoutubeError("");
    setShowTopicSection(false);
    setIsVideoModalOpen(true);
  };

  const handleOpenEditVideo = (video) => {
    setVideoModalMode("edit");
    setSelectedVideo(video);
    setVideoStudioStep(1);
    setIsVideoFullScreen(true); // Automatically open in full screen
    const isYt =
      video.type === "youtube" || Boolean(extractYouTubeId(video.url));
    setVideoSourceMode(
      isYt
        ? "url"
        : video.url && video.url.includes("/uploads/videos/")
          ? "upload"
          : "url",
    );
    setVideoUploadProgress(0);
    setYoutubeError("");
    setShowTopicSection(
      Boolean(
        video.topicName ||
        video.subTopicName ||
        video.subSubTopicName ||
        video.topic ||
        video.lessonName,
      ),
    );
    let chNum = 1;
    let chName = video.chapterName || video.chapter || "";
    if (video.chapterNumber) {
      chNum = Number(video.chapterNumber) || 1;
    } else if (video.chapter) {
      const match = String(video.chapter).match(
        /^(?:Chapter\s*)?(\d+)(?:\s*[:.\-]\s*(.*))?$/i,
      );
      if (match) {
        chNum = parseInt(match[1], 10) || 1;
        if (match[2]) chName = match[2].trim();
      }
    }
    const subTopic =
      video.subTopicName || video.lessonName || video.lesson || "";
    const topNum = video.topicNumber || "1.0";
    const subNum = video.subTopicNumber || "1.0.0";
    const subSubNum = video.subSubTopicNumber || "1.0.0.0";
    const subSubName = video.subSubTopicName || "";
    const detectedLevel =
      video.uploadLevel ||
      (subSubName
        ? "subSubTopic"
        : subTopic
          ? "subTopic"
          : video.topicName || video.topic
            ? "topic"
            : "chapter");

    setLevelMedia({
      chapter:
        detectedLevel === "chapter"
          ? {
              url: video.url || "",
              type: video.type || "youtube",
              thumbnailUrl: video.thumbnailUrl || "",
              originalName: video.title || "",
            }
          : { url: "", type: "youtube", thumbnailUrl: "", originalName: "" },
      topic:
        detectedLevel === "topic"
          ? {
              url: video.url || "",
              type: video.type || "youtube",
              thumbnailUrl: video.thumbnailUrl || "",
              originalName: video.title || "",
            }
          : { url: "", type: "youtube", thumbnailUrl: "", originalName: "" },
      subTopic:
        detectedLevel === "subTopic"
          ? {
              url: video.url || "",
              type: video.type || "youtube",
              thumbnailUrl: video.thumbnailUrl || "",
              originalName: video.title || "",
            }
          : { url: "", type: "youtube", thumbnailUrl: "", originalName: "" },
      subSubTopic:
        detectedLevel === "subSubTopic"
          ? {
              url: video.url || "",
              type: video.type || "youtube",
              thumbnailUrl: video.thumbnailUrl || "",
              originalName: video.title || "",
            }
          : { url: "", type: "youtube", thumbnailUrl: "", originalName: "" },
    });
    setActiveUploadContext(detectedLevel);

    setVideoForm({
      title: video.title || "",
      uploadLevel: detectedLevel,
      code:
        video.code ||
        (detectedLevel === "subSubTopic"
          ? subSubNum
          : detectedLevel === "subTopic"
            ? subNum
            : detectedLevel === "topic"
              ? topNum
              : String(chNum)),
      type: video.type || (isYt ? "youtube" : "video"),
      url: video.url || "",
      subject: video.subject || "Mathematics",
      board: video.board || "Both Boards",
      classLevel: video.classLevel || "Intermediate 1st Year",
      year:
        video.year ||
        (video.classLevel && video.classLevel.includes("2nd")
          ? "2nd Year"
          : "1st Year"),
      chapterNumber: chNum,
      chapterName: chName,
      chapter:
        video.chapter ||
        (chName ? `Chapter ${chNum}: ${chName}` : `Chapter ${chNum}`),
      chapterKeyword: chName || "",
      topicNumber: topNum,
      topicName: video.topicName || video.topic || "",
      topicKeyword: video.topicName || video.topic || "",
      subTopicNumber: subNum,
      subTopicName: subTopic,
      subTopicKeyword: subTopic || "",
      subSubTopicNumber: subSubNum,
      subSubTopicName: subSubName,
      subSubTopicKeyword: subSubName || "",
      lesson: subTopic || "Lesson 1",
      lessonName: subTopic || "Lesson 1",
      description: video.description || "",
      duration: video.duration || video.estimatedDuration || "45 mins",
      instructor: video.instructor || "Visdom Waves Faculty",
      keywords:
        Array.isArray(video.keywords) && video.keywords.length > 0
          ? video.keywords.join(", ")
          : Array.isArray(video.tags)
            ? video.tags.join(", ")
            : video.keywords || video.tags || "",
      tags:
        Array.isArray(video.tags) && video.tags.length > 0
          ? video.tags.join(", ")
          : Array.isArray(video.keywords)
            ? video.keywords.join(", ")
            : video.tags || video.keywords || "",
      customKeywords:
        Array.isArray(video.customKeywords) && video.customKeywords.length > 0
          ? video.customKeywords.join(", ")
          : video.customKeywords || "",
      linkType: video.linkType || "Lecture Video",
      thumbnailUrl: video.thumbnailUrl || "",
      isFeatured: !!video.isFeatured,
      isPremium:
        video.isPremium !== undefined
          ? video.isPremium
          : video.premiumContent || false,
      status: video.status || "published",

      // Step 4 Settings
      freePreview:
        video.freePreview !== undefined ? video.freePreview : !video.isPremium,
      premiumContent:
        video.premiumContent !== undefined
          ? video.premiumContent
          : !!video.isPremium,
      allowPdfDownload:
        video.allowPdfDownload !== undefined ? video.allowPdfDownload : true,
      allowVideoDownload:
        video.allowVideoDownload !== undefined
          ? video.allowVideoDownload
          : false,
      allowAssignmentDownload:
        video.allowAssignmentDownload !== undefined
          ? video.allowAssignmentDownload
          : true,
      estimatedDuration:
        video.estimatedDuration || video.duration || "45 Minutes",
      difficultyLevel: video.difficultyLevel || "Intermediate",
      releaseDate: video.releaseDate || "",
      expiryDate: video.expiryDate || "",
      lessonOrder: video.lessonOrder || video.lesson || "Lesson 1",
      completionRequirement: video.completionRequirement || "Video Only",
      certificateEligible:
        video.certificateEligible !== undefined
          ? video.certificateEligible
          : true,
      progressTracking:
        video.progressTracking !== undefined ? video.progressTracking : true,
      studentNotifications:
        video.studentNotifications !== undefined
          ? video.studentNotifications
          : true,
      parentNotification:
        video.parentNotification !== undefined
          ? video.parentNotification
          : false,
      attendanceRequired: video.attendanceRequired || "Optional",
      commentsEnabled:
        video.commentsEnabled !== undefined ? video.commentsEnabled : true,
      discussionForumEnabled:
        video.discussionForumEnabled !== undefined
          ? video.discussionForumEnabled
          : true,
      liveClassPlatform: video.liveClassPlatform || "None",
      liveClassLink: video.liveClassLink || "",
      seoSlug: video.seo?.slug || video.slug || "",
      seoMetaTitle: video.seo?.metaTitle || "",
      seoMetaDescription: video.seo?.metaDescription || "",

      // Watermark & Badges ("Barge") - Optional
      watermarkEnabled:
        video.watermarkEnabled !== undefined
          ? Boolean(video.watermarkEnabled)
          : false,
      watermarkText: video.watermarkText || "",
      watermarkPosition: video.watermarkPosition || "top-right",
      badgeText: video.badgeText || "",
      badgeColor: video.badgeColor || "blue",
      isVerifiedBadge:
        video.isVerifiedBadge !== undefined
          ? Boolean(video.isVerifiedBadge)
          : false,
      qualityBadge: video.qualityBadge || "1080p Full HD",
    });
    setIsVideoModalOpen(true);
  };

  const handleToggleVideoStatus = async (video) => {
    const nextStatus = video.status === "published" ? "draft" : "published";
    try {
      await toggleAdminVideoStatusApi(video.id || video._id, nextStatus);
      showToast(
        nextStatus === "published"
          ? "Video published to Student Dashboard!"
          : "Video moved to Drafts",
        "info",
      );
      setVideos((prev) =>
        prev.map((v) =>
          v.id === video.id || v._id === video._id
            ? { ...v, status: nextStatus }
            : v,
        ),
      );
    } catch (err) {
      showToast(err.message || "Failed to update status", "error");
    }
  };

  // Restore an archived video back to active curriculum (swaps with current if one is active)
  const handleRestoreArchivedVideo = async (videoToRestore) => {
    if (!videoToRestore) return;
    const vidTitle = videoToRestore.title || "this video";
    if (!window.confirm(`Restore "${vidTitle}" back as the active video?`))
      return;

    setIsLoading(true);
    try {
      // Find if an active video currently occupies this node code
      const currentActive = videos.find(
        (v) =>
          (v._id || v.id) !== (videoToRestore._id || videoToRestore.id) &&
          v.status === "published" &&
          !v.isArchived &&
          ((v.code &&
            videoToRestore.code &&
            v.code.trim() === videoToRestore.code.trim()) ||
            (v.topicNumber &&
              videoToRestore.topicNumber &&
              v.topicNumber === videoToRestore.topicNumber &&
              Number(v.chapterNumber) ===
                Number(videoToRestore.chapterNumber))),
      );

      // If active video exists, swap it by archiving the current one to storage
      if (currentActive) {
        await updateAdminVideoApi(currentActive._id || currentActive.id, {
          status: "archived",
          isArchived: true,
          archivedAt: new Date().toISOString(),
          replacedByTitle: videoToRestore.title || "",
          replacedByCode: videoToRestore.code || "",
        });
      }

      // Activate the restored video
      await updateAdminVideoApi(videoToRestore._id || videoToRestore.id, {
        status: "published",
        isArchived: false,
        archivedAt: null,
      });

      showToast(`Restored "${vidTitle}" to active curriculum!`);
      try {
        window.dispatchEvent(
          new CustomEvent("mymarks_video_updated", { detail: videoToRestore }),
        );
      } catch {}
      await loadAdminData();
    } catch (err) {
      showToast(err.message || "Failed to restore video", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a video permanently from storage
  const handleDeleteArchivedVideo = async (id, title) => {
    if (
      !window.confirm(
        `Permanently delete "${title || "this video"}" from storage? This cannot be undone.`,
      )
    )
      return;
    setIsLoading(true);
    try {
      await deleteAdminVideoApi(id);
      showToast("Video permanently removed from storage");
      await loadAdminData();
    } catch (err) {
      showToast(err.message || "Delete failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Video file upload handler
  const handleVideoFileSelect = async (file) => {
    if (!file) return;

    // Validate video type
    const validVideoTypes = [
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "video/x-matroska",
      "video/ogg",
    ];
    const isVideo =
      validVideoTypes.includes(file.type) ||
      /\.(mp4|webm|mov|mkv|avi|ogg|ogv)$/i.test(file.name);
    if (!isVideo) {
      showToast(
        "Please select a valid video file (.mp4, .webm, .mov, .mkv)",
        "error",
      );
      return;
    }

    // Auto extract duration and auto-populate title if empty
    try {
      const tempVideo = document.createElement("video");
      tempVideo.preload = "metadata";
      tempVideo.src = URL.createObjectURL(file);
      tempVideo.onloadedmetadata = () => {
        const totalSec = Math.round(tempVideo.duration);
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        const durStr =
          mins > 0
            ? `${mins} mins ${secs > 0 ? secs + "s" : ""}`.trim()
            : `${secs}s`;
        setVideoForm((prev) => ({
          ...prev,
          duration:
            prev.duration && prev.duration !== "45 mins"
              ? prev.duration
              : durStr,
          estimatedDuration:
            prev.estimatedDuration && prev.estimatedDuration !== "45 Minutes"
              ? prev.estimatedDuration
              : `${mins} Minutes`,
        }));
      };
    } catch (e) {
      console.warn("Could not extract duration metadata:", e);
    }

    // Auto-fill title if empty
    if (!videoForm.title) {
      const cleanName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      setVideoForm((prev) => ({ ...prev, title: cleanName }));
    }

    setIsUploadingVideo(true);
    setVideoUploadProgress(1);

    const ctx = activeUploadContext || "chapter";
    setLevelMedia((prev) => ({
      ...prev,
      [ctx]: { ...prev[ctx], isUploading: true, progress: 1 },
    }));

    try {
      const res = await uploadMediaFileApi(file, (percent) => {
        setVideoUploadProgress(percent);
        setLevelMedia((prev) => ({
          ...prev,
          [ctx]: { ...prev[ctx], progress: percent },
        }));
      });

      if (res.success && res.data?.url) {
        setLevelMedia((prev) => ({
          ...prev,
          [ctx]: {
            url: res.data.url,
            type: "video",
            thumbnailUrl: prev[ctx]?.thumbnailUrl || "",
            originalName: file.name,
            isUploading: false,
            progress: 100,
          },
        }));

        setVideoForm((prev) => ({
          ...prev,
          url: res.data.url,
          type: "video",
          uploadLevel: ctx,
        }));
        setVideoUploadInfo({
          originalName: file.name,
          sizeMb: (file.size / (1024 * 1024)).toFixed(2),
          url: res.data.url,
        });
        const ctxLabel =
          ctx === "chapter"
            ? "Chapter"
            : ctx === "topic"
              ? "Topic"
              : ctx === "subTopic"
                ? "Sub Topic"
                : "Sub Sub Topic";
        showToast(`Video uploaded successfully for ${ctxLabel}!`);
      } else {
        throw new Error(res.message || "Upload failed");
      }
    } catch (err) {
      console.error("Video upload failed:", err);
      showToast(
        err.message || "Video upload failed. Check server connection.",
        "error",
      );
    } finally {
      setLevelMedia((prev) => ({
        ...prev,
        [ctx]: { ...prev[ctx], isUploading: false },
      }));
      setIsUploadingVideo(false);
    }
  };

  // Thumbnail image upload handler
  const handleThumbFileSelect = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file (JPG, PNG, WebP)", "error");
      return;
    }

    const ctx = activeUploadContext || "chapter";
    setIsUploadingThumb(true);
    setThumbUploadProgress(1);

    try {
      const res = await uploadMediaFileApi(file, (percent) => {
        setThumbUploadProgress(percent);
      });

      if (res.success && res.data?.url) {
        setLevelMedia((prev) => ({
          ...prev,
          [ctx]: {
            ...prev[ctx],
            thumbnailUrl: res.data.url,
          },
        }));
        setVideoForm((prev) => ({
          ...prev,
          thumbnailUrl: res.data.url,
        }));
        const ctxLabel =
          ctx === "chapter"
            ? "Chapter"
            : ctx === "topic"
              ? "Topic"
              : ctx === "subTopic"
                ? "Sub Topic"
                : "Sub Sub Topic";
        showToast(`Thumbnail uploaded successfully for ${ctxLabel}!`);
      } else {
        throw new Error(res.message || "Thumbnail upload failed");
      }
    } catch (err) {
      console.error("Thumbnail upload failed:", err);
      showToast(err.message || "Thumbnail upload failed", "error");
    } finally {
      setIsUploadingThumb(false);
    }
  };

  const handleSaveVideo = async (e) => {
    e.preventDefault();
    setYoutubeError("");

    const chNum = Number(videoForm.chapterNumber) || 1;
    const cleanChName = (videoForm.chapterName || "").trim();
    const effectiveChapter = cleanChName
      ? `Chapter ${chNum}: ${cleanChName}`
      : videoForm.chapter || `Chapter ${chNum}`;

    const effectiveTopic = (videoForm.topicName || "").trim();
    const effectiveSubTopic = (
      videoForm.subTopicName ||
      videoForm.lessonName ||
      videoForm.lesson ||
      ""
    ).trim();
    const effectiveSubSubTopic = (videoForm.subSubTopicName || "").trim();

    // Collect all separate videos configured across Chapter, Topic, Sub Topic, and Sub Sub Topic
    const itemsToSave = [];

    if (levelMedia.chapter?.url?.trim()) {
      itemsToSave.push({
        level: "chapter",
        code: String(chNum),
        title: cleanChName
          ? `Chapter ${chNum}: ${cleanChName}`
          : videoForm.title || `Chapter ${chNum}`,
        media: levelMedia.chapter,
      });
    }

    if (levelMedia.topic?.url?.trim()) {
      itemsToSave.push({
        level: "topic",
        code: String(videoForm.topicNumber || "1.0").trim(),
        title:
          effectiveTopic ||
          videoForm.title ||
          `Topic ${videoForm.topicNumber || "1.0"}`,
        media: levelMedia.topic,
      });
    }

    if (levelMedia.subTopic?.url?.trim()) {
      itemsToSave.push({
        level: "subTopic",
        code: String(videoForm.subTopicNumber || "1.0.0").trim(),
        title:
          effectiveSubTopic ||
          videoForm.title ||
          `Sub Topic ${videoForm.subTopicNumber || "1.0.0"}`,
        media: levelMedia.subTopic,
      });
    }

    if (levelMedia.subSubTopic?.url?.trim()) {
      itemsToSave.push({
        level: "subSubTopic",
        code: String(videoForm.subSubTopicNumber || "1.0.0.0").trim(),
        title:
          effectiveSubSubTopic ||
          videoForm.title ||
          `Sub Sub Topic ${videoForm.subSubTopicNumber || "1.0.0.0"}`,
        media: levelMedia.subSubTopic,
      });
    }

    // Fallback if none in levelMedia but videoForm.url is set
    if (itemsToSave.length === 0 && videoForm.url?.trim()) {
      let fallbackLevel = videoForm.uploadLevel;
      if (!fallbackLevel || fallbackLevel === "chapter") {
        if (effectiveSubSubTopic) fallbackLevel = "subSubTopic";
        else if (effectiveSubTopic) fallbackLevel = "subTopic";
        else if (effectiveTopic) fallbackLevel = "topic";
        else fallbackLevel = "chapter";
      }

      let fallbackCode = "1.0";
      if (fallbackLevel === "subSubTopic")
        fallbackCode = String(videoForm.subSubTopicNumber || "1.0.0.0").trim();
      else if (fallbackLevel === "subTopic")
        fallbackCode = String(videoForm.subTopicNumber || "1.0.0").trim();
      else if (fallbackLevel === "topic")
        fallbackCode = String(videoForm.topicNumber || "1.0").trim();
      else fallbackCode = String(chNum);

      let fallbackTitle = (videoForm.title || "").trim();
      if (!fallbackTitle) {
        if (fallbackLevel === "subSubTopic")
          fallbackTitle = effectiveSubSubTopic;
        else if (fallbackLevel === "subTopic")
          fallbackTitle = effectiveSubTopic;
        else if (fallbackLevel === "topic") fallbackTitle = effectiveTopic;
        else
          fallbackTitle = cleanChName ? `Chapter ${chNum}: ${cleanChName}` : "";
      }

      itemsToSave.push({
        level: fallbackLevel,
        code: fallbackCode,
        title: fallbackTitle || `${videoForm.subject} Lecture`,
        media: {
          url: videoForm.url,
          type: videoForm.type,
          thumbnailUrl: videoForm.thumbnailUrl,
        },
      });
    }

    if (itemsToSave.length === 0) {
      showToast(
        "Please attach or upload at least one video (Chapter, Topic, Sub Topic, or Sub Sub Topic)",
        "error",
      );
      setVideoStudioStep(1);
      return;
    }

    setIsLoading(true);
    try {
      const rawKeywords =
        videoForm.keywords !== undefined && videoForm.keywords !== ""
          ? videoForm.keywords
          : videoForm.tags || "";
      const parsedKeywords =
        typeof rawKeywords === "string"
          ? rawKeywords
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : Array.isArray(rawKeywords)
            ? rawKeywords.map((t) => String(t).trim()).filter(Boolean)
            : [];

      const rawCustomKeywords = videoForm.customKeywords || "";
      const parsedCustomKeywords =
        typeof rawCustomKeywords === "string"
          ? rawCustomKeywords
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : Array.isArray(rawCustomKeywords)
            ? rawCustomKeywords.map((t) => String(t).trim()).filter(Boolean)
            : [];

      // Also gather individual box keywords:
      const boxKeywords = [
        videoForm.chapterKeyword,
        videoForm.topicKeyword,
        videoForm.subTopicKeyword,
        videoForm.subSubTopicKeyword,
      ]
        .map((k) => (k ? String(k).trim() : ""))
        .filter(Boolean);

      // Combine curriculum, individual box keywords, and custom search keywords for indexing
      const combinedKeywords = [];
      const seenKw = new Set();
      [...boxKeywords, ...parsedKeywords, ...parsedCustomKeywords].forEach(
        (kw) => {
          const lower = kw.toLowerCase();
          if (!seenKw.has(lower)) {
            seenKw.add(lower);
            combinedKeywords.push(kw);
          }
        },
      );

      const finalKeywords =
        combinedKeywords.length > 0 ? combinedKeywords : ["General"];

      if (videoModalMode === "create") {
        for (const item of itemsToSave) {
          const ytId = extractYouTubeId(item.media.url);
          const payload = {
            ...videoForm,
            uploadLevel: item.level,
            code: item.code,
            title: item.title,
            url: item.media.url,
            type: item.media.type || (ytId ? "youtube" : "video"),
            thumbnailUrl:
              item.media.thumbnailUrl ||
              (ytId
                ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
                : videoForm.thumbnailUrl),
            chapterNumber: chNum,
            chapterName: cleanChName,
            chapter: effectiveChapter,
            topicNumber: String(videoForm.topicNumber || "1.0").trim(),
            topicName: effectiveTopic,
            subTopicNumber: String(videoForm.subTopicNumber || "1.0.0").trim(),
            subTopicName: effectiveSubTopic,
            subSubTopicNumber: String(
              videoForm.subSubTopicNumber || "1.0.0.0",
            ).trim(),
            subSubTopicName: effectiveSubSubTopic,
            lesson: effectiveSubTopic || "Lesson 1",
            lessonName: effectiveSubTopic || "Lesson 1",
            keywords: finalKeywords,
            tags: finalKeywords,
            customKeywords: parsedCustomKeywords,
            isPremium: videoForm.premiumContent || videoForm.isPremium,
            seo: {
              slug: videoForm.seoSlug || "",
              metaTitle: videoForm.seoMetaTitle || "",
              metaDescription: videoForm.seoMetaDescription || "",
            },
          };

          if (ytId) {
            payload.youtubeId = ytId;
            payload.type = "youtube";
            payload.embedUrl = `https://www.youtube.com/embed/${ytId}`;
            if (!payload.thumbnailUrl) {
              payload.thumbnailUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
            }
          } else if (
            payload.type === "video" ||
            payload.url.includes("/uploads/")
          ) {
            payload.type = "video";
            if (!payload.embedUrl) {
              payload.embedUrl = payload.url;
            }
          }

          // If replacement mode is enabled, archive any existing active video at this code level to Old Videos Storage
          if (replaceExistingVideo) {
            const existingVideo = videos.find(
              (v) =>
                (v._id || v.id) !== (selectedVideo?._id || selectedVideo?.id) &&
                v.status !== "archived" &&
                !v.isArchived &&
                ((v.code && item.code && v.code.trim() === item.code.trim()) ||
                  (item.level === "topic" &&
                    String(v.topicNumber || "").trim() === item.code &&
                    Number(v.chapterNumber) === chNum) ||
                  (item.level === "subTopic" &&
                    String(v.subTopicNumber || "").trim() === item.code &&
                    Number(v.chapterNumber) === chNum) ||
                  (item.level === "subSubTopic" &&
                    String(v.subSubTopicNumber || "").trim() === item.code &&
                    Number(v.chapterNumber) === chNum) ||
                  (item.level === "chapter" &&
                    Number(v.chapterNumber) === chNum &&
                    (v.uploadLevel === "chapter" ||
                      (!v.topicNumber && !v.topicName)))),
            );

            if (existingVideo) {
              try {
                await updateAdminVideoApi(
                  existingVideo._id || existingVideo.id,
                  {
                    status: "archived",
                    isArchived: true,
                    archivedAt: new Date().toISOString(),
                    replacedByTitle: item.title,
                    replacedByCode: item.code,
                  },
                );
              } catch (archErr) {
                console.warn(
                  "[Admin] Failed to move old video to storage:",
                  archErr,
                );
              }
            } else if (TOPICS_DATA && Array.isArray(TOPICS_DATA)) {
              // Archive standard curriculum video if replacing a default lesson
              const defaultCh = TOPICS_DATA.find(
                (c) => Number(c.number) === chNum,
              );
              if (defaultCh && Array.isArray(defaultCh.videos)) {
                const defaultItem = defaultCh.videos.find(
                  (dv) =>
                    (dv.code && dv.code.trim() === item.code.trim()) ||
                    (item.level === "topic" && dv.code === `${chNum}.0`),
                );
                if (defaultItem) {
                  try {
                    await createAdminVideoApi({
                      title: defaultItem.title,
                      url: defaultItem.url,
                      type: "youtube",
                      youtubeId:
                        defaultItem.videoId ||
                        extractYouTubeId(defaultItem.url),
                      thumbnailUrl:
                        defaultItem.thumbnailUrl ||
                        (defaultItem.videoId
                          ? `https://img.youtube.com/vi/${defaultItem.videoId}/hqdefault.jpg`
                          : ""),
                      subject: "Mathematics",
                      board: videoForm.board || "Both Boards",
                      classLevel:
                        videoForm.classLevel || "Intermediate 1st Year",
                      year: videoForm.year || "1st Year",
                      chapterNumber: chNum,
                      chapterName: cleanChName,
                      chapter: effectiveChapter,
                      topicNumber:
                        defaultItem.code ||
                        String(videoForm.topicNumber || "1.0").trim(),
                      topicName: defaultItem.title,
                      uploadLevel: item.level,
                      code: defaultItem.code || item.code,
                      description: defaultItem.description || "",
                      status: "archived",
                      isArchived: true,
                      archivedAt: new Date().toISOString(),
                      replacedByTitle: item.title,
                      replacedByCode: item.code,
                    });
                  } catch (defArchErr) {
                    console.warn(
                      "[Admin] Failed to archive default curriculum item:",
                      defArchErr,
                    );
                  }
                }
              }
            }
          }

          await createAdminVideoApi(payload);
          try {
            window.dispatchEvent(
              new CustomEvent("mymarks_video_updated", { detail: payload }),
            );
          } catch {}
        }

        showToast(
          itemsToSave.length > 1
            ? `Successfully published ${itemsToSave.length} separate videos across Chapter, Topic & Subtopics!`
            : "New video published successfully!",
        );
      } else {
        // Edit mode - save primary item
        const primaryItem = itemsToSave[0];
        const ytId = extractYouTubeId(primaryItem.media.url);
        const payload = {
          ...videoForm,
          uploadLevel: primaryItem.level,
          code: primaryItem.code,
          title: primaryItem.title,
          url: primaryItem.media.url,
          type: primaryItem.media.type || (ytId ? "youtube" : "video"),
          thumbnailUrl:
            primaryItem.media.thumbnailUrl ||
            (ytId
              ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
              : videoForm.thumbnailUrl),
          chapterNumber: chNum,
          chapterName: cleanChName,
          chapter: effectiveChapter,
          topicNumber: String(videoForm.topicNumber || "1.0").trim(),
          topicName: effectiveTopic,
          subTopicNumber: String(videoForm.subTopicNumber || "1.0.0").trim(),
          subTopicName: effectiveSubTopic,
          subSubTopicNumber: String(
            videoForm.subSubTopicNumber || "1.0.0.0",
          ).trim(),
          subSubTopicName: effectiveSubSubTopic,
          lesson: effectiveSubTopic || "Lesson 1",
          lessonName: effectiveSubTopic || "Lesson 1",
          keywords: finalKeywords,
          tags: finalKeywords,
          customKeywords: parsedCustomKeywords,
          isPremium: videoForm.premiumContent || videoForm.isPremium,
          seo: {
            slug: videoForm.seoSlug || "",
            metaTitle: videoForm.seoMetaTitle || "",
            metaDescription: videoForm.seoMetaDescription || "",
          },
        };

        if (ytId) {
          payload.youtubeId = ytId;
          payload.type = "youtube";
          payload.embedUrl = `https://www.youtube.com/embed/${ytId}`;
          if (!payload.thumbnailUrl) {
            payload.thumbnailUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
          }
        } else if (
          payload.type === "video" ||
          payload.url.includes("/uploads/")
        ) {
          payload.type = "video";
          if (!payload.embedUrl) {
            payload.embedUrl = payload.url;
          }
        }

        await updateAdminVideoApi(
          selectedVideo.id || selectedVideo._id,
          payload,
        );
        showToast("Video / link details updated successfully!");
      }

      setIsVideoModalOpen(false);
      await loadAdminData();
    } catch (err) {
      showToast(err.message || "Failed to save video", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVideo = async (id) => {
    setIsLoading(true);
    try {
      await deleteAdminVideoApi(id);
      showToast("Video removed successfully");
      setDeleteConfirm(null);
      await loadAdminData();
    } catch (err) {
      showToast(err.message || "Delete failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeedVideos = async () => {
    if (
      !window.confirm(
        "Seed standard curriculum lecture videos and study materials?",
      )
    )
      return;
    setIsLoading(true);
    try {
      await seedAdminVideosApi();
      showToast("Standard lecture videos & links seeded successfully!");
      await loadAdminData();
    } catch (err) {
      showToast("Seed failed: " + err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyVideoLink = (url, id) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedVideoId(id);
    showToast("Link copied to clipboard!");
    setTimeout(() => setCopiedVideoId(null), 2500);
  };

  // Seed Initial Content
  const handleSeedContent = async () => {
    if (
      !window.confirm("Seed standard curriculum content into MongoDB database?")
    )
      return;
    setIsLoading(true);
    try {
      const res = await triggerSeed();
      showToast("Curriculum seeded successfully!");
      await loadAdminData();
    } catch (err) {
      showToast("Seed failed: " + err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Export Users to CSV
  const handleExportCSV = () => {
    if (!users.length) {
      showToast("No student records to export", "error");
      return;
    }

    const headers = [
      "Full Name",
      "Email",
      "Mobile Number",
      "Board",
      "Intermediate Year",
      "College Name",
      "Hall Ticket No",
      "Father Name",
      "Father Mobile",
      "Date of Birth",
      "Registration Date",
    ];

    const rows = users.map((u) => [
      `"${u.fullName || u.name || ""}"`,
      `"${u.email || ""}"`,
      `"${u.mobileNumber || u.phone || ""}"`,
      `"${u.board || ""}"`,
      `"${u.year || ""}"`,
      `"${u.collegeName || u.college || ""}"`,
      `"${u.hallTicketNumber || u.hallTicket || ""}"`,
      `"${u.fatherName || ""}"`,
      `"${u.fatherMobile || ""}"`,
      `"${u.dob || ""}"`,
      `"${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `MyMarks_Students_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Students list exported to CSV successfully!");
  };

  // ─────────────────────────────────────────────────────────────
  // RENDER: Admin Auth Gate (redirect to main sign in if not logged in)
  // ─────────────────────────────────────────────────────────────
  if (!isAdminAuthed) {
    return <Navigate to="/signin" state={{ from: "/admin" }} replace />;
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER: Full Admin Dashboard
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="h-screen w-full max-w-full bg-[#E6F0FA] dark:bg-[#070B14] text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white transition-colors duration-200 overflow-hidden overflow-x-hidden">
      {/* Toast Notification Container */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[9999] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border text-sm font-semibold transition-all animate-bounce ${
            toast.type === "error"
              ? "bg-rose-50 dark:bg-rose-950/90 text-rose-700 dark:text-rose-200 border-rose-200 dark:border-rose-800"
              : toast.type === "info"
                ? "bg-blue-50 dark:bg-blue-950/90 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-800"
                : "bg-emerald-50 dark:bg-emerald-950/90 text-emerald-700 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle
              size={18}
              className="text-rose-500 dark:text-rose-400 shrink-0"
            />
          ) : (
            <CheckCircle2
              size={18}
              className="text-emerald-500 dark:text-emerald-400 shrink-0"
            />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Main Navigation Header - Fixed at Top */}
      <AdminNavbar
        currentUser={currentUser}
        theme={activeTheme}
        toggleTheme={handleToggleTheme}
        onLogout={handleAdminLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        apiStatus={apiStatus}
      />

      {/* Left Vertical Navigation Sidebar - Fixed at left-0 top-[122px] (desktop) / top bar (mobile/tablet) */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        usersCount={users.length}
        coursesCount={courses.length}
        videosCount={videos.length}
        bookingsCount={bookings.length}
        apiStatus={apiStatus}
      />

      {/* Main Body Workspace Content Area - The ONLY scrollable element on the page */}
      <main
        id="admin-workspace-scroll"
        className="mt-[98px] xs:mt-[104px] sm:mt-[118px] md:mt-[122px] lg:ml-60 xl:ml-64 h-[calc(100vh-98px)] xs:h-[calc(100vh-104px)] sm:h-[calc(100vh-118px)] md:h-[calc(100vh-122px)] lg:h-[calc(100vh-122px)] overflow-y-auto overflow-x-hidden p-3.5 sm:p-6 lg:p-8 flex flex-col gap-6 min-w-0"
      >
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
          {/* ─────────────────────────────────────────────────────────────
            TAB 1: DASHBOARD & OVERVIEW
           ───────────────────────────────────────────────────────────── */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Top KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {/* Card 1: Students */}
                {/* Card 1: Students */}
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/80 shadow-sm dark:shadow-none relative overflow-hidden group hover:border-blue-500/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Total Registered Students
                    </span>
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20">
                      <GraduationCap size={20} />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                      {users.length}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
                      Active in DB
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    AP & TS Intermediate First & Second Year scholars
                  </p>
                </div>

                {/* Card 2: Curriculum Items */}
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/80 shadow-sm dark:shadow-none relative overflow-hidden group hover:border-amber-500/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Curriculum Subjects & Modules
                    </span>
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      <BookOpen size={20} />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                      {courses.length}
                    </span>
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                      16+ Subjects
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    MPC, BiPC, CEC, MEC, HEC, Languages & Practicals
                  </p>
                </div>

                {/* Card 3: Videos, YouTube & Links */}
                <div
                  onClick={() => setActiveTab("videos")}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/80 shadow-sm dark:shadow-none relative overflow-hidden group hover:border-indigo-500/40 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Videos & Links
                    </span>
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                      <Video size={20} />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                      {videos.length}
                    </span>
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      Media Vault
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    YouTube lectures, direct videos & study links
                  </p>
                </div>

                {/* Card 4: Bookings */}
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/80 shadow-sm dark:shadow-none relative overflow-hidden group hover:border-blue-500/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Assessment & Demo Requests
                    </span>
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      <Calendar size={20} />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                      {bookings.length}
                    </span>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      Incoming
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Parents & student diagnostic session bookings
                  </p>
                </div>

                {/* Card 5: Database Status */}
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/80 shadow-sm dark:shadow-none relative overflow-hidden group hover:border-emerald-500/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Database Cluster
                    </span>
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <Database size={20} />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      Atlas Live
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 truncate">
                    cluster0.vquspbp.mongodb.net
                  </p>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="p-5 rounded-3xl bg-white dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 border border-slate-200/90 dark:border-slate-800 shadow-sm dark:shadow-none flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Quick Operations
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Instant administrative shortcuts for daily platform
                    operations
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={handleOpenAddUser}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                  >
                    <Plus size={15} />
                    <span>Register New Student</span>
                  </button>

                  <button
                    onClick={handleOpenAddCourse}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer shadow-xs dark:shadow-none"
                  >
                    <Plus size={15} />
                    <span>Add Course / Subject</span>
                  </button>

                  <button
                    onClick={handleExportCSV}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer shadow-xs dark:shadow-none"
                  >
                    <FileSpreadsheet size={15} />
                    <span>Export Students CSV</span>
                  </button>

                  <button
                    onClick={handleSeedContent}
                    className="px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center gap-1.5 border border-amber-500/30 transition-all cursor-pointer"
                  >
                    <Sparkles size={15} />
                    <span>Seed Demo Curriculum</span>
                  </button>
                </div>
              </div>

              {/* Two Column Layout: Recent Registrations & Board Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Recent Students (2 Cols) */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/80 shadow-sm dark:shadow-none flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base">
                          Recent Registered Students
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Latest students who signed up on MyMarks
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab("students")}
                        className="text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 flex items-center gap-1 cursor-pointer"
                      >
                        <span>View All ({users.length})</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {users.slice(0, 5).map((user) => (
                        <div
                          key={user._id || user.id}
                          className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                              {(user.fullName || user.name || "S")
                                .split(" ")
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join("")
                                .toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                                {user.fullName || user.name}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {user.email} •{" "}
                                {user.mobileNumber || user.phone || "No Phone"}
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300">
                              {user.board || "AP Intermediate"}
                            </span>
                            <span className="block text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                              {user.createdAt
                                ? new Date(user.createdAt).toLocaleDateString()
                                : "Active"}
                            </span>
                          </div>
                        </div>
                      ))}

                      {users.length === 0 && (
                        <div className="py-10 text-center text-slate-500 text-sm">
                          No students registered yet. Click &quot;Register New
                          Student&quot; to add one.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Academic Streams & Boards Breakdown */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/80 shadow-sm dark:shadow-none flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                      Board Enrollment
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                      Distribution across educational boards
                    </p>

                    <div className="space-y-3">
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          <span>Andhra Pradesh Intermediate (BIEAP)</span>
                          <span className="text-slate-900 dark:text-white">
                            {
                              users.filter((u) =>
                                (u.board || "").includes("Andhra"),
                              ).length
                            }
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-red-500 rounded-full"
                            style={{
                              width: `${
                                users.length
                                  ? (users.filter((u) =>
                                      (u.board || "").includes("Andhra"),
                                    ).length /
                                      users.length) *
                                    100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          <span>Telangana Intermediate (TSBIE)</span>
                          <span className="text-slate-900 dark:text-white">
                            {
                              users.filter((u) =>
                                (u.board || "").includes("Telangana"),
                              ).length
                            }
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{
                              width: `${
                                users.length
                                  ? (users.filter((u) =>
                                      (u.board || "").includes("Telangana"),
                                    ).length /
                                      users.length) *
                                    100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          <span>CBSE / National Boards</span>
                          <span className="text-slate-900 dark:text-white">
                            {
                              users.filter((u) =>
                                (u.board || "").includes("CBSE"),
                              ).length
                            }
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{
                              width: `${
                                users.length
                                  ? (users.filter((u) =>
                                      (u.board || "").includes("CBSE"),
                                    ).length /
                                      users.length) *
                                    100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
                    <span>Target Exam: IPE 2026</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      100% Verified DB
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
            TAB 2: STUDENTS DIRECTORY
           ───────────────────────────────────────────────────────────── */}
          {activeTab === "students" && (
            <div className="space-y-4">
              {/* Action & Filter Bar */}
              <div className="p-4 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-sm dark:shadow-none flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 transition-colors duration-200">
                {/* Search Box */}
                <div className="relative grow max-w-md">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  />
                  <input
                    type="text"
                    placeholder="Search student by name, email, phone, college..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium focus:bg-white dark:focus:bg-slate-950"
                  />
                </div>

                {/* Filters & Add Button */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Board Filter */}
                  <select
                    value={boardFilter}
                    onChange={(e) => setBoardFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer shadow-xs dark:shadow-none"
                  >
                    <option value="all">All Boards</option>
                    <option value="Andhra">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                    <option value="CBSE">CBSE</option>
                  </select>

                  {/* Year Filter */}
                  <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer shadow-xs dark:shadow-none"
                  >
                    <option value="all">All Years</option>
                    <option value="First">First Year</option>
                    <option value="Second">Second Year</option>
                  </select>

                  <button
                    onClick={handleExportCSV}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-emerald-700 dark:text-emerald-400 border border-slate-300 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs dark:shadow-none"
                  >
                    <Download size={14} />
                    <span>CSV</span>
                  </button>

                  <button
                    onClick={handleOpenAddUser}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                  >
                    <Plus size={15} />
                    <span>Add Student</span>
                  </button>
                </div>
              </div>

              {/* Students Table */}
              <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/80 overflow-hidden shadow-sm dark:shadow-xl transition-colors duration-200">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-bold tracking-wider">
                        <th className="py-3.5 px-4">Student Name</th>
                        <th className="py-3.5 px-4">Contact Info</th>
                        <th className="py-3.5 px-4">Board & Year</th>
                        <th className="py-3.5 px-4">College</th>
                        <th className="py-3.5 px-4">Parent Info</th>
                        <th className="py-3.5 px-4">Registered Date</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {filteredUsers.map((user) => (
                        <tr
                          key={user._id || user.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
                        >
                          {/* Student Name */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                                {(user.fullName || user.name || "ST")
                                  .split(" ")
                                  .map((n) => n[0])
                                  .slice(0, 2)
                                  .join("")
                                  .toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                                  {user.fullName || user.name}
                                </div>
                                <div className="text-[11px] text-slate-500">
                                  {user.role === "admin" ? (
                                    <span className="text-amber-500 dark:text-amber-400 font-bold">
                                      Admin
                                    </span>
                                  ) : (
                                    "Student Scholar"
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Contact */}
                          <td className="py-3.5 px-4">
                            <div className="text-slate-800 dark:text-slate-300 font-medium">
                              {user.email}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {user.mobileNumber || user.phone || "—"}
                            </div>
                          </td>

                          {/* Board & Year */}
                          <td className="py-3.5 px-4">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-300 mb-0.5">
                              {user.board || "AP Intermediate"}
                            </span>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {user.year || "First Year"}
                            </div>
                          </td>

                          {/* College */}
                          <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                            {user.collegeName || user.college || "—"}
                          </td>

                          {/* Parent Info */}
                          <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-xs">
                            {user.fatherName ? (
                              <div>
                                <span className="font-semibold text-slate-800 dark:text-slate-300">
                                  {user.fatherName}
                                </span>
                                <span className="block text-[10px] text-slate-400 dark:text-slate-500">
                                  {user.fatherMobile || "—"}
                                </span>
                              </div>
                            ) : (
                              "—"
                            )}
                          </td>

                          {/* Date */}
                          <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-xs">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString()
                              : "—"}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* View Details */}
                              <button
                                onClick={() => setViewUserDetail(user)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                title="View Full Profile Details"
                              >
                                <Eye size={15} />
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => handleOpenEditUser(user)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                title="Edit Student"
                              >
                                <Edit size={15} />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() =>
                                  setDeleteConfirm({
                                    type: "user",
                                    id: user._id || user.id,
                                    title: user.fullName || user.name,
                                  })
                                }
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                title="Delete Student"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filteredUsers.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm"
                          >
                            No student records matching your search or filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
            TAB 3: CURRICULUM & COURSES
           ───────────────────────────────────────────────────────────── */}
          {activeTab === "courses" && (
            <div className="space-y-4">
              {/* Filter Bar */}
              <div className="p-4 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-sm dark:shadow-none flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 transition-colors duration-200">
                <div className="relative grow max-w-md">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  />
                  <input
                    type="text"
                    placeholder="Search subject or course module..."
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium focus:bg-white dark:focus:bg-slate-950"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <select
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer shadow-xs dark:shadow-none"
                  >
                    <option value="all">All Academic Categories</option>
                    <option value="mpc">MPC Track</option>
                    <option value="bipc">BiPC Track</option>
                    <option value="cec">CEC Track</option>
                    <option value="mec">MEC Track</option>
                    <option value="hec">HEC Track</option>
                    <option value="languages">Languages</option>
                    <option value="practicals">Lab Practicals</option>
                    <option value="elementary">Foundational</option>
                    <option value="middle">Middle Track</option>
                    <option value="high">High School</option>
                    <option value="competitive">Competitive / Olympiad</option>
                  </select>

                  <button
                    onClick={handleSeedContent}
                    className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Sparkles size={14} />
                    <span>Seed Standard Content</span>
                  </button>

                  <button
                    onClick={handleOpenAddCourse}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                  >
                    <Plus size={15} />
                    <span>Add Course</span>
                  </button>
                </div>
              </div>

              {/* Courses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCourses.map((c) => (
                  <div
                    key={c.id || c._id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/80 shadow-sm dark:shadow-none flex flex-col justify-between hover:border-red-400/50 dark:hover:border-slate-700 transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 uppercase tracking-wider">
                          {c.category || "Curriculum"}
                        </span>
                        <span className="text-xs text-amber-500 dark:text-amber-400 font-bold">
                          ★ {c.rating || 4.9}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                        {c.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                        {c.description ||
                          "Comprehensive curriculum modules designed for exam mastery."}
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>{c.level || "Intermediate"}</span>
                        <span>{c.lessonsCount || 36} Lessons</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold truncate max-w-[150px]">
                        {c.instructor?.name || c.instructor || "Faculty Lead"}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditCourse(c)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Edit Course"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirm({
                              type: "course",
                              id: c.id || c._id,
                              title: c.title,
                            })
                          }
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Delete Course"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredCourses.length === 0 && (
                  <div className="col-span-full py-16 text-center text-slate-400 dark:text-slate-500 text-sm">
                    No courses found in this category. Click &quot;Seed Standard
                    Content&quot; or &quot;Add Course&quot; to populate.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
            TAB 4: VIDEOS, YOUTUBE & CURRICULUM MANAGEMENT
           ───────────────────────────────────────────────────────────── */}
          {activeTab === "videos" && (
            <div className="space-y-5">
              {/* KPI Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Total Media
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                      {videos.length}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                    <Video size={18} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      Published
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {
                        videos.filter(
                          (v) => v.status === "published" && !v.isArchived,
                        ).length
                      }
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <CheckCircle2 size={18} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                      Drafts
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
                      {
                        videos.filter(
                          (v) => v.status === "draft" && !v.isArchived,
                        ).length
                      }
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    <FileText size={18} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                      YouTube
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-red-600 dark:text-red-400 mt-0.5">
                      {
                        videos.filter(
                          (v) =>
                            (v.type === "youtube" ||
                              Boolean(extractYouTubeId(v.url))) &&
                            !v.isArchived,
                        ).length
                      }
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      MP4 Uploads
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {
                        videos.filter(
                          (v) =>
                            (v.type === "video" ||
                              (v.url && v.url.includes("/uploads/"))) &&
                            !v.isArchived,
                        ).length
                      }
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    <Film size={18} />
                  </div>
                </div>

                {/* 6th Card: Old Videos Storage */}
                <button
                  type="button"
                  onClick={() => setIsArchiveStorageModalOpen(true)}
                  className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-purple-600/15 hover:from-purple-500/20 hover:to-indigo-500/25 border border-purple-500/25 dark:border-purple-500/40 shadow-xs flex items-center justify-between text-left transition-all cursor-pointer group col-span-2 sm:col-span-1"
                  title="Click to manage preserved old videos in storage"
                >
                  <div>
                    <p className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1">
                      <span>Old Videos</span>
                      <ArrowUpRight
                        size={11}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400 mt-0.5">
                      {archivedVideos.length}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                    <FolderGit2 size={18} />
                  </div>
                </button>
              </div>

              {/* Filter Bar & Action Controls */}
              <div className="p-4 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-sm dark:shadow-none space-y-3 transition-colors duration-200">
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                  {/* Search Bar */}
                  <div className="relative flex-1 min-w-[220px]">
                    <Search
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                    />
                    <input
                      type="text"
                      placeholder="Search by title, subject, chapter, lesson, educator, or keywords..."
                      value={videoSearch}
                      onChange={(e) => setVideoSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium focus:bg-white dark:focus:bg-slate-950"
                    />
                    {videoSearch && (
                      <button
                        onClick={() => setVideoSearch("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs font-bold"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Primary Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    {/* Old Videos Storage Button */}
                    <button
                      onClick={() => setIsArchiveStorageModalOpen(true)}
                      className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/25 transition-all cursor-pointer whitespace-nowrap"
                      title="Open Old Videos Storage to see and restore replaced videos"
                    >
                      <FolderGit2 size={14} />
                      <span>Old Videos Storage</span>
                      {archivedVideos.length > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/25 text-white text-[10px] font-black">
                          {archivedVideos.length}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => handleOpenAddVideo("upload")}
                      className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/25 transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Upload size={14} />
                      <span>Upload Video File</span>
                    </button>

                    <button
                      onClick={() => handleOpenAddVideo("url")}
                      className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-600/25 transition-all cursor-pointer whitespace-nowrap"
                    >
                      <svg
                        className="w-3.5 h-3.5 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                      <span>Add YouTube Video</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsVideoFullScreen(true);
                        handleOpenAddVideo("upload");
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                      title="Open full-screen studio"
                    >
                      <Maximize2 size={13} />
                      <span className="hidden sm:inline">Studio</span>
                    </button>

                    <button
                      onClick={handleSeedVideos}
                      className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                      title="Seed sample curriculum lectures"
                    >
                      <Sparkles size={13} />
                      <span className="hidden sm:inline">Seed Videos</span>
                    </button>
                  </div>
                </div>

                {/* Filter Pills & View Mode Switcher */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Board Filter */}
                    <select
                      value={videoBoardFilter}
                      onChange={(e) => setVideoBoardFilter(e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs"
                    >
                      <option value="all">All Boards (AP & TS)</option>
                      <option value="Andhra Pradesh">AP Intermediate</option>
                      <option value="Telangana">TS Intermediate</option>
                    </select>

                    {/* Year Filter */}
                    <select
                      value={videoYearFilter}
                      onChange={(e) => setVideoYearFilter(e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs"
                    >
                      <option value="all">All Years</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                    </select>

                    {/* Subject Filter */}
                    <select
                      value={videoSubjectFilter}
                      onChange={(e) => setVideoSubjectFilter(e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs"
                    >
                      <option value="all">All Subjects</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Botany">Botany</option>
                      <option value="Zoology">Zoology</option>
                      <option value="English">English</option>
                      <option value="Commerce">Commerce</option>
                      <option value="Economics">Economics</option>
                      <option value="Civics">Civics</option>
                      <option value="History">History</option>
                      <option value="General">General</option>
                    </select>

                    {/* Status Filter */}
                    <select
                      value={videoStatusFilter}
                      onChange={(e) => setVideoStatusFilter(e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs"
                    >
                      <option value="all">
                        Active Videos (
                        {
                          videos.filter(
                            (v) => v.status !== "archived" && !v.isArchived,
                          ).length
                        }
                        )
                      </option>
                      <option value="published">Published</option>
                      <option value="draft">Drafts</option>
                      <option value="archived">
                        Old Videos Storage ({archivedVideos.length})
                      </option>
                    </select>

                    {/* Type Filter */}
                    <select
                      value={videoTypeFilter}
                      onChange={(e) => setVideoTypeFilter(e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs"
                    >
                      <option value="all">All Media Types</option>
                      <option value="youtube">YouTube Videos</option>
                      <option value="video">Direct MP4 Videos</option>
                      <option value="drive">Drive & PDFs</option>
                      <option value="link">Study Links</option>
                    </select>
                  </div>

                  {/* View Mode Toggle: Grid vs Table */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
                    <button
                      onClick={() => setVideoViewMode("grid")}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        videoViewMode === "grid"
                          ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                      }`}
                      title="Grid Card View"
                    >
                      <LayoutGrid size={15} />
                      <span className="hidden sm:inline">Grid</span>
                    </button>
                    <button
                      onClick={() => setVideoViewMode("table")}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        videoViewMode === "table"
                          ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                      }`}
                      title="Table View"
                    >
                      <Table size={15} />
                      <span className="hidden sm:inline">Table</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Metrics Bar */}
              <div className="flex items-center justify-between text-xs font-semibold px-2 text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span>
                    Showing{" "}
                    <strong className="text-slate-900 dark:text-white font-bold">
                      {filteredVideos.length}
                    </strong>{" "}
                    of {videos.length} videos
                  </span>
                  {(videoBoardFilter !== "all" ||
                    videoYearFilter !== "all" ||
                    videoSubjectFilter !== "all" ||
                    videoStatusFilter !== "all" ||
                    videoTypeFilter !== "all" ||
                    videoSearch) && (
                    <button
                      onClick={() => {
                        setVideoSearch("");
                        setVideoBoardFilter("all");
                        setVideoYearFilter("all");
                        setVideoSubjectFilter("all");
                        setVideoStatusFilter("all");
                        setVideoTypeFilter("all");
                      }}
                      className="text-blue-600 dark:text-blue-400 underline font-bold ml-1 cursor-pointer"
                    >
                      Reset all filters
                    </button>
                  )}
                </div>
              </div>

              {/* ─── VIEW 1: RESPONSIVE CARDS GRID ─── */}
              {videoViewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredVideos.map((v) => {
                    const ytId = extractYouTubeId(v.url) || v.youtubeId;
                    const isYouTube = v.type === "youtube" || Boolean(ytId);
                    const isDrive =
                      v.type === "drive" ||
                      Boolean(v.url && v.url.includes("drive.google.com"));
                    const isDirectVideo =
                      v.type === "video" ||
                      Boolean(
                        v.url &&
                        (v.url.includes("/uploads/") ||
                          /\.(mp4|webm|mov|mkv|ogg|ogv|m4v)(\?.*)?$/i.test(
                            v.url,
                          )),
                      );
                    const thumb = getSafeThumbnailUrl(v.thumbnailUrl, ytId);

                    return (
                      <div
                        key={v.id || v._id}
                        className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/80 shadow-sm dark:shadow-none flex flex-col justify-between hover:border-blue-400/50 dark:hover:border-blue-500/40 transition-all group overflow-hidden"
                      >
                        <div>
                          {/* Thumbnail Container */}
                          <div
                            className="relative aspect-video w-full bg-slate-950 overflow-hidden cursor-pointer"
                            onClick={() => setPreviewVideoModal(v)}
                          >
                            {thumb ? (
                              <img
                                src={thumb}
                                alt={v.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src =
                                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-slate-400">
                                <Video
                                  size={36}
                                  className="text-blue-500 opacity-80 mb-1"
                                />
                                <span className="text-xs font-semibold">
                                  {v.subject || "Curriculum Video"}
                                </span>
                              </div>
                            )}

                            {/* Hover Play Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-xs">
                              <div className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-xl shadow-blue-950/60 transform group-hover:scale-110 transition-transform duration-300">
                                <Play
                                  size={20}
                                  fill="currentColor"
                                  className="ml-1"
                                />
                              </div>
                            </div>

                            {/* Top Left Badges: Media Type & Premium */}
                            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                              {isYouTube ? (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-600/90 text-white flex items-center gap-1 shadow-md backdrop-blur-xs">
                                  <svg
                                    className="w-3 h-3 fill-current"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                  </svg>
                                  <span>YouTube</span>
                                </span>
                              ) : isDirectVideo ? (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-600/90 text-white flex items-center gap-1 shadow-md backdrop-blur-xs">
                                  <Film size={11} />
                                  <span>MP4 Video</span>
                                </span>
                              ) : isDrive ? (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600/90 text-white flex items-center gap-1 shadow-md backdrop-blur-xs">
                                  <FileText size={11} />
                                  <span>Drive Notes</span>
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-600/90 text-white flex items-center gap-1 shadow-md backdrop-blur-xs">
                                  <Link2 size={11} />
                                  <span>Study Link</span>
                                </span>
                              )}

                              {v.isPremium ? (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-400 text-slate-950 shadow-md">
                                  ★ Premium
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500 text-white shadow-md">
                                  Free Preview
                                </span>
                              )}
                            </div>

                            {/* Top Right: Status Badge Button (Click to Toggle or Restore) */}
                            <div className="absolute top-2.5 right-2.5">
                              {v.status === "archived" || v.isArchived ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRestoreArchivedVideo(v);
                                  }}
                                  className="px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer transition-all shadow-md bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1"
                                  title="Click to restore this old video back as active video"
                                >
                                  <RefreshCw size={10} />
                                  <span>Archived</span>
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleVideoStatus(v);
                                  }}
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer transition-all shadow-md ${
                                    v.status === "published"
                                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                      : "bg-amber-600 text-white hover:bg-amber-700"
                                  }`}
                                  title={
                                    v.status === "published"
                                      ? "Click to unpublish (move to draft)"
                                      : "Click to publish to student dashboard"
                                  }
                                >
                                  {v.status === "published"
                                    ? "● Published"
                                    : "○ Draft"}
                                </button>
                              )}
                            </div>

                            {/* Bottom Right: Duration */}
                            {v.duration && (
                              <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 text-white font-mono text-[11px] font-bold shadow-md backdrop-blur-xs">
                                {v.duration}
                              </div>
                            )}
                          </div>

                          {/* Content Body */}
                          <div className="p-4 sm:p-5">
                            {/* Subject, Board & Class badges */}
                            <div className="flex items-center gap-1.5 flex-wrap mb-2">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 uppercase tracking-wider">
                                {v.subject || "Subject"}
                              </span>

                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                                {v.board && v.board.includes("Andhra")
                                  ? "AP Board"
                                  : v.board && v.board.includes("Telangana")
                                    ? "TS Board"
                                    : "AP & TS"}
                              </span>

                              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                {v.year || v.classLevel || "Intermediate"}
                              </span>
                            </div>

                            {/* Chapter, Topic & Sub Topic info */}
                            <div className="space-y-1 mb-1.5">
                              {(v.chapter || v.topicName) && (
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate">
                                  {v.chapter && (
                                    <span className="truncate">
                                      {v.chapter}
                                    </span>
                                  )}
                                  {v.chapter && v.topicName && (
                                    <span className="text-slate-400">•</span>
                                  )}
                                  {v.topicName && (
                                    <span className="text-blue-600 dark:text-cyan-400 font-semibold truncate bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded text-[10px]">
                                      Topic{" "}
                                      {v.topicNumber
                                        ? `${v.topicNumber}: `
                                        : ""}
                                      {v.topicName}
                                    </span>
                                  )}
                                </div>
                              )}
                              {(v.subTopicName || v.lessonName || v.lesson) && (
                                <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 truncate">
                                  {v.subTopicNumber
                                    ? `Sub ${v.subTopicNumber}: `
                                    : ""}
                                  {v.subTopicName || v.lessonName || v.lesson}
                                </div>
                              )}
                              {v.subSubTopicName && (
                                <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate">
                                  {v.subSubTopicNumber
                                    ? `Sub-Sub ${v.subSubTopicNumber}: `
                                    : ""}
                                  {v.subSubTopicName}
                                </div>
                              )}
                            </div>

                            {/* Video Title */}
                            <h4
                              onClick={() => setPreviewVideoModal(v)}
                              className="font-bold text-slate-900 dark:text-white text-sm sm:text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
                            >
                              {v.title}
                            </h4>

                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                              {v.description ||
                                "Comprehensive curriculum video breakdown, solved board problems, and high-yield derivations."}
                            </p>

                            {/* Key Words / Tags */}
                            {((Array.isArray(v.keywords) &&
                              v.keywords.length > 0) ||
                              (Array.isArray(v.tags) && v.tags.length > 0)) && (
                              <div className="flex items-center gap-1 flex-wrap mt-2 pt-1">
                                {(v.keywords?.length ? v.keywords : v.tags)
                                  .slice(0, 4)
                                  .map((kw, i) => (
                                    <span
                                      key={i}
                                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
                                    >
                                      #{kw}
                                    </span>
                                  ))}
                                {(v.keywords?.length ? v.keywords : v.tags)
                                  .length > 4 && (
                                  <span className="text-[10px] text-slate-400 font-medium">
                                    +
                                    {(v.keywords?.length ? v.keywords : v.tags)
                                      .length - 4}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Educator info */}
                            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                              <span className="font-semibold truncate max-w-[170px] text-slate-700 dark:text-slate-300">
                                {v.instructor || "Visdom Waves Lead"}
                              </span>
                              {ytId && (
                                <span className="text-[10px] font-mono text-slate-400 truncate">
                                  ID: {ytId}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="p-4 pt-0 sm:p-5 sm:pt-0">
                          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                            <button
                              onClick={() => setPreviewVideoModal(v)}
                              className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Play size={13} fill="currentColor" />
                              <span>Preview</span>
                            </button>

                            <div className="flex items-center gap-1">
                              {v.status === "archived" || v.isArchived ? (
                                <button
                                  onClick={() => handleRestoreArchivedVideo(v)}
                                  className="p-1.5 rounded-lg text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors cursor-pointer"
                                  title="Restore this video back to active curriculum"
                                >
                                  <RefreshCw size={15} />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleToggleVideoStatus(v)}
                                  className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                                    v.status === "published"
                                      ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                                      : "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                                  }`}
                                  title={
                                    v.status === "published"
                                      ? "Unpublish video"
                                      : "Publish video"
                                  }
                                >
                                  <CheckCircle2 size={15} />
                                </button>
                              )}

                              <button
                                onClick={() =>
                                  handleCopyVideoLink(v.url, v.id || v._id)
                                }
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                title="Copy Video / Link URL"
                              >
                                <Copy
                                  size={15}
                                  className={
                                    copiedVideoId === (v.id || v._id)
                                      ? "text-emerald-500"
                                      : ""
                                  }
                                />
                              </button>

                              <button
                                onClick={() => handleOpenEditVideo(v)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                title="Edit Video Details"
                              >
                                <Edit size={15} />
                              </button>

                              <button
                                onClick={() =>
                                  setDeleteConfirm({
                                    type: "video",
                                    id: v.id || v._id,
                                    title: v.title,
                                  })
                                }
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                title="Delete Video"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ─── VIEW 2: COMPREHENSIVE TABLE VIEW ─── */}
              {videoViewMode === "table" && (
                <div className="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold text-[10px]">
                          <th className="py-3 px-4">Video & Details</th>
                          <th className="py-3 px-4">Subject</th>
                          <th className="py-3 px-4">Board & Year</th>
                          <th className="py-3 px-4">Source</th>
                          <th className="py-3 px-4">Access</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300 font-medium">
                        {filteredVideos.map((v) => {
                          const ytId = extractYouTubeId(v.url) || v.youtubeId;
                          const isYouTube =
                            v.type === "youtube" || Boolean(ytId);
                          const thumb = getSafeThumbnailUrl(
                            v.thumbnailUrl,
                            ytId,
                          );

                          return (
                            <tr
                              key={v.id || v._id}
                              className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3 min-w-[240px]">
                                  <div
                                    className="w-16 h-10 rounded-lg bg-slate-950 overflow-hidden shrink-0 cursor-pointer relative group"
                                    onClick={() => setPreviewVideoModal(v)}
                                  >
                                    {thumb ? (
                                      <img
                                        src={thumb}
                                        alt={v.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.onerror = null;
                                          e.currentTarget.src =
                                            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80";
                                        }}
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                                        <Video size={16} />
                                      </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <Play
                                        size={12}
                                        fill="white"
                                        className="text-white"
                                      />
                                    </div>
                                  </div>
                                  <div className="min-w-0">
                                    <p
                                      onClick={() => setPreviewVideoModal(v)}
                                      className="font-bold text-slate-900 dark:text-white truncate hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                                    >
                                      {v.title}
                                    </p>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                      {v.chapter}{" "}
                                      {v.topicName
                                        ? `• Topic ${v.topicNumber ? v.topicNumber + ": " : ""}${v.topicName}`
                                        : ""}{" "}
                                      {v.subTopicName ||
                                      v.lessonName ||
                                      v.lesson
                                        ? `• Sub ${v.subTopicNumber ? v.subTopicNumber + ": " : ""}${v.subTopicName || v.lessonName || v.lesson}`
                                        : ""}{" "}
                                      {v.subSubTopicName
                                        ? `• Sub-Sub ${v.subSubTopicNumber ? v.subSubTopicNumber + ": " : ""}${v.subSubTopicName}`
                                        : ""}{" "}
                                      {v.duration ? `(${v.duration})` : ""}
                                    </p>
                                    {((Array.isArray(v.keywords) &&
                                      v.keywords.length > 0) ||
                                      (Array.isArray(v.tags) &&
                                        v.tags.length > 0)) && (
                                      <div className="flex items-center gap-1 flex-wrap mt-0.5">
                                        {(v.keywords?.length
                                          ? v.keywords
                                          : v.tags
                                        )
                                          .slice(0, 3)
                                          .map((kw, i) => (
                                            <span
                                              key={i}
                                              className="text-[9px] px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium"
                                            >
                                              #{kw}
                                            </span>
                                          ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                                  {v.subject}
                                </span>
                              </td>

                              <td className="py-3 px-4 whitespace-nowrap">
                                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                  {v.board && v.board.includes("Andhra")
                                    ? "AP Board"
                                    : v.board && v.board.includes("Telangana")
                                      ? "TS Board"
                                      : "AP & TS"}
                                </div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                  {v.year || v.classLevel || "Intermediate"}
                                </div>
                              </td>

                              <td className="py-3 px-4 whitespace-nowrap">
                                {isYouTube ? (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 flex items-center gap-1 w-max">
                                    <svg
                                      className="w-3 h-3 fill-current"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                    <span>YouTube</span>
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 flex items-center gap-1 w-max">
                                    <Film size={11} />
                                    <span>MP4 Video</span>
                                  </span>
                                )}
                              </td>

                              <td className="py-3 px-4 whitespace-nowrap">
                                {v.isPremium ? (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                                    Premium
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                                    Free
                                  </span>
                                )}
                              </td>

                              <td className="py-3 px-4 whitespace-nowrap">
                                {v.status === "archived" || v.isArchived ? (
                                  <button
                                    onClick={() =>
                                      handleRestoreArchivedVideo(v)
                                    }
                                    className="px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30 hover:bg-purple-500/25 flex items-center gap-1"
                                    title="Click to restore this old video to active curriculum"
                                  >
                                    <RefreshCw size={10} />
                                    <span>Archived</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleToggleVideoStatus(v)}
                                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                                      v.status === "published"
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20"
                                    }`}
                                    title="Click to toggle status"
                                  >
                                    {v.status === "published"
                                      ? "● Published"
                                      : "○ Draft"}
                                  </button>
                                )}
                              </td>

                              <td className="py-3 px-4 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1">
                                  {(v.status === "archived" ||
                                    v.isArchived) && (
                                    <button
                                      onClick={() =>
                                        handleRestoreArchivedVideo(v)
                                      }
                                      className="p-1.5 rounded-lg text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors cursor-pointer"
                                      title="Restore from Storage"
                                    >
                                      <RefreshCw size={14} />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => setPreviewVideoModal(v)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                    title="Play Video"
                                  >
                                    <Play size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleOpenEditVideo(v)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                    title="Edit Video"
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      setDeleteConfirm({
                                        type: "video",
                                        id: v.id || v._id,
                                        title: v.title,
                                      })
                                    }
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                    title="Delete Video"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {filteredVideos.length === 0 && (
                <div className="py-16 text-center text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3 border border-blue-200 dark:border-blue-500/20">
                    <Video size={32} />
                  </div>
                  <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                    No videos match your criteria
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Adjust your search terms or board/subject filters, or click
                    below to upload an educational video or add a YouTube
                    lesson.
                  </p>
                  <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
                    <button
                      onClick={() => handleOpenAddVideo("upload")}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                    >
                      <Upload size={14} />
                      <span>Upload Video File</span>
                    </button>
                    <button
                      onClick={() => handleOpenAddVideo("url")}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-600/30 transition-all cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Add YouTube Link</span>
                    </button>
                    <button
                      onClick={handleSeedVideos}
                      className="px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Sparkles size={14} />
                      <span>Seed Curriculum Videos</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
            TAB 4: BOOKINGS & INQUIRIES
           ───────────────────────────────────────────────────────────── */}
          {activeTab === "bookings" && (
            <div className="space-y-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-sm dark:shadow-none flex items-center justify-between transition-colors duration-200">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Assessment & Demo Inquiries
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Requests submitted by students/parents for diagnostic
                    assessment and 1-on-1 demo
                  </p>
                </div>
                <button
                  onClick={loadAdminData}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs dark:shadow-none"
                >
                  <RefreshCw size={14} />
                  <span>Refresh Requests</span>
                </button>
              </div>

              <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/80 overflow-hidden shadow-sm dark:shadow-xl transition-colors duration-200">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-bold tracking-wider">
                        <th className="py-3.5 px-4">Inquiry Title / Student</th>
                        <th className="py-3.5 px-4">Subject Track</th>
                        <th className="py-3.5 px-4">Grade / Board</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Submitted Date</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {bookings.map((b) => (
                        <tr
                          key={b._id || b.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900 dark:text-white">
                              {b.title}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {b.metadata?.email ||
                                b.metadata?.parentEmail ||
                                b.description}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                            {b.metadata?.goalArea ||
                              b.metadata?.subject ||
                              "Diagnostic Math"}
                          </td>

                          <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                            {b.metadata?.gradeLevel || "Intermediate"}
                          </td>

                          <td className="py-3.5 px-4">
                            <select
                              value={b.status || "Pending"}
                              onChange={async (e) => {
                                const newStatus = e.target.value;
                                await updateAdminBookingApi(b._id || b.id, {
                                  status: newStatus,
                                });
                                showToast(
                                  `Booking status changed to ${newStatus}`,
                                );
                                await loadAdminData();
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer shadow-xs dark:shadow-none"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Scheduled">Scheduled</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </td>

                          <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-xs">
                            {b.createdAt
                              ? new Date(b.createdAt).toLocaleDateString()
                              : "Recent"}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={async () => {
                                if (
                                  window.confirm("Delete this booking record?")
                                ) {
                                  await deleteAdminBookingApi(b._id || b.id);
                                  showToast("Booking deleted");
                                  await loadAdminData();
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              title="Delete Booking"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}

                      {bookings.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm"
                          >
                            No pending diagnostic assessments or bookings.
                            Requests from the Booking modal appear here.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
            TAB 5: PLATFORM & SYSTEM SECURITY
           ───────────────────────────────────────────────────────────── */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Site Privacy Gate Controls */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/80 shadow-sm dark:shadow-none transition-colors duration-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-2xl bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20">
                      <ShieldCheck size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        Site Privacy Gate
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Manage confidential preview protection
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          Authorized Master User
                        </span>
                        <p className="text-[11px] text-slate-500">
                          Master user authorized to unlock site
                        </p>
                      </div>
                      <code className="text-red-600 dark:text-red-400 font-mono text-[11px] bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded border border-red-200 dark:border-red-500/20">
                        md@visdomwaves.com
                      </code>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          Master Passcode
                        </span>
                        <p className="text-[11px] text-slate-500">
                          Confidential password for site preview
                        </p>
                      </div>
                      <code className="text-amber-600 dark:text-amber-400 font-mono text-[11px] bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded border border-amber-200 dark:border-amber-500/20">
                        Md@1947
                      </code>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          localStorage.removeItem("site_privacy_access");
                          sessionStorage.removeItem("site_privacy_access");
                          showToast(
                            "Website privacy lock engaged. Access gate will show on next visit.",
                          );
                        }}
                        className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 cursor-pointer transition-colors shadow-xs dark:shadow-none"
                      >
                        <Lock size={14} />
                        <span>Lock Live Website Immediately</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Database & Infrastructure Diagnostics */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/80 shadow-sm dark:shadow-none transition-colors duration-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <Database size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        Backend & Database Status
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Live MongoDB connection and server metrics
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">
                        API Health Status:
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                        Online (200 OK)
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">
                        Database Engine:
                      </span>
                      <span className="text-slate-800 dark:text-slate-200 font-mono">
                        MongoDB Atlas 8.12
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">
                        Total Registered Documents:
                      </span>
                      <span className="text-slate-900 dark:text-white font-bold">
                        {users.length + courses.length + bookings.length}{" "}
                        Records
                      </span>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={async () => {
                          const health = await checkApiHealth();
                          showToast(
                            `Health Check: ${health.status.toUpperCase()}`,
                          );
                        }}
                        className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 cursor-pointer transition-colors shadow-xs dark:shadow-none"
                      >
                        <Activity size={14} />
                        <span>Ping API Health Check</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          MODAL: ADD / EDIT STUDENT
         ───────────────────────────────────────────────────────────── */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 transition-colors duration-200">
            <button
              onClick={() => setIsUserModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {userModalMode === "create"
                  ? "Register New Student"
                  : "Edit Student Profile"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Full academic credentials and intermediate registration details
              </p>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={userForm.fullName}
                    onChange={(e) =>
                      setUserForm({ ...userForm, fullName: e.target.value })
                    }
                    placeholder="e.g. Varun Bhargav"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium focus:bg-white dark:focus:bg-slate-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={userForm.email}
                    onChange={(e) =>
                      setUserForm({ ...userForm, email: e.target.value })
                    }
                    placeholder="student@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium focus:bg-white dark:focus:bg-slate-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={userForm.mobileNumber}
                    onChange={(e) =>
                      setUserForm({ ...userForm, mobileNumber: e.target.value })
                    }
                    placeholder="9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium focus:bg-white dark:focus:bg-slate-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Account Password{" "}
                    {userModalMode === "edit" && "(Leave blank to keep)"}
                  </label>
                  <input
                    type="password"
                    required={userModalMode === "create"}
                    value={userForm.password}
                    onChange={(e) =>
                      setUserForm({ ...userForm, password: e.target.value })
                    }
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium focus:bg-white dark:focus:bg-slate-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Educational Board
                  </label>
                  <select
                    value={userForm.board}
                    onChange={(e) =>
                      setUserForm({ ...userForm, board: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer shadow-xs dark:shadow-none"
                  >
                    <option value="Andhra Pradesh Intermediate">
                      Andhra Pradesh Intermediate (BIEAP)
                    </option>
                    <option value="Telangana Intermediate">
                      Telangana Intermediate (TSBIE)
                    </option>
                    <option value="CBSE Board">Central Board (CBSE)</option>
                    <option value="ICSE / Other">ICSE / State Board</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Intermediate Year
                  </label>
                  <select
                    value={userForm.year}
                    onChange={(e) =>
                      setUserForm({ ...userForm, year: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer shadow-xs dark:shadow-none"
                  >
                    <option value="First Year">
                      First Year (Junior Inter)
                    </option>
                    <option value="Second Year">
                      Second Year (Senior Inter)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Junior College Name
                  </label>
                  <input
                    type="text"
                    value={userForm.collegeName}
                    onChange={(e) =>
                      setUserForm({ ...userForm, collegeName: e.target.value })
                    }
                    placeholder="e.g. Narayana Junior College"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium focus:bg-white dark:focus:bg-slate-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Hall Ticket Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={userForm.hallTicketNumber}
                    onChange={(e) =>
                      setUserForm({
                        ...userForm,
                        hallTicketNumber: e.target.value,
                      })
                    }
                    placeholder="e.g. 2401234567"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium focus:bg-white dark:focus:bg-slate-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Father / Guardian Name
                  </label>
                  <input
                    type="text"
                    value={userForm.fatherName}
                    onChange={(e) =>
                      setUserForm({ ...userForm, fatherName: e.target.value })
                    }
                    placeholder="Father Name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium focus:bg-white dark:focus:bg-slate-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Father / Guardian Mobile
                  </label>
                  <input
                    type="tel"
                    value={userForm.fatherMobile}
                    onChange={(e) =>
                      setUserForm({ ...userForm, fatherMobile: e.target.value })
                    }
                    placeholder="Parent Phone"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium focus:bg-white dark:focus:bg-slate-950"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer shadow-xs dark:shadow-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isLoading
                    ? "Saving..."
                    : userModalMode === "create"
                      ? "Register Student"
                      : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: ADD / EDIT COURSE
         ───────────────────────────────────────────────────────────── */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 transition-colors duration-200">
            <button
              onClick={() => setIsCourseModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {courseModalMode === "create"
                  ? "Add Curriculum Topic / Course"
                  : "Edit Course"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Configure curriculum details, grade level and faculty
              </p>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Course / Subject Title *
                </label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, title: e.target.value })
                  }
                  placeholder="e.g. Mathematics 2A - Calculus & Complex Numbers"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium focus:bg-white dark:focus:bg-slate-950"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Category Stream
                  </label>
                  <select
                    value={courseForm.category}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, category: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer shadow-xs dark:shadow-none"
                  >
                    <option value="mpc">MPC (Maths, Physics, Chem)</option>
                    <option value="bipc">BiPC (Botany, Zoology)</option>
                    <option value="cec">CEC (Commerce, Eco, Civics)</option>
                    <option value="mec">MEC (Maths, Eco, Commerce)</option>
                    <option value="hec">HEC (History, Eco, Civics)</option>
                    <option value="languages">Languages</option>
                    <option value="practicals">Lab Practicals</option>
                    <option value="elementary">Elementary Foundation</option>
                    <option value="competitive">Competitive / Olympiad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Target Level / Grade
                  </label>
                  <input
                    type="text"
                    value={courseForm.level}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, level: e.target.value })
                    }
                    placeholder="e.g. Intermediate 2nd Year"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium focus:bg-white dark:focus:bg-slate-950"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Curriculum Description
                </label>
                <textarea
                  rows={3}
                  value={courseForm.description}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Comprehensive breakdown of syllabus concepts, problem-solving, and Board questions."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium focus:bg-white dark:focus:bg-slate-950"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Lessons Count
                  </label>
                  <input
                    type="number"
                    value={courseForm.lessonsCount}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        lessonsCount: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium focus:bg-white dark:focus:bg-slate-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Duration (Weeks)
                  </label>
                  <input
                    type="number"
                    value={courseForm.durationWeeks}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        durationWeeks: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium focus:bg-white dark:focus:bg-slate-950"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer shadow-xs dark:shadow-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isLoading
                    ? "Saving..."
                    : courseModalMode === "create"
                      ? "Publish Course"
                      : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: UPLOAD / EDIT VIDEO, YOUTUBE & FULL-SCREEN STUDIO
         ───────────────────────────────────────────────────────────── */}
      {isVideoModalOpen && (
        <div
          className={
            isVideoFullScreen
              ? "fixed inset-0 z-50 flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden animate-in fade-in duration-200"
              : "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md overflow-hidden animate-in fade-in duration-150"
          }
        >
          <div
            className={
              isVideoFullScreen
                ? "w-full h-full flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden"
                : "relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 transition-all duration-200"
            }
          >
            {/* Hidden native file inputs for direct device uploading */}
            <input
              type="file"
              id="admin-video-file-input"
              accept="video/mp4,video/webm,video/quicktime,video/x-matroska,video/ogg,video/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0])
                  handleVideoFileSelect(e.target.files[0]);
              }}
            />
            <input
              type="file"
              id="admin-thumb-file-input"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0])
                  handleThumbFileSelect(e.target.files[0]);
              }}
            />

            {/* Studio Header (Sticky) */}
            <div className="shrink-0 px-5 sm:px-8 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
                  <Video size={20} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
                      {videoModalMode === "create"
                        ? "Lesson Studio • Create & Publish Content"
                        : "Edit Lesson / Video Details"}
                    </h3>
                    <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      Step {videoStudioStep} of 3
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {videoStudioStep === 1 &&
                      "Step 1: Define academic curriculum info, board, year, video, and thumbnail"}
                    {videoStudioStep === 2 &&
                      "Step 2: Configure lesson settings, visibility, downloads, and SEO"}
                    {videoStudioStep === 3 &&
                      "Step 3: Live student dashboard card preview before publishing"}
                  </p>
                </div>
              </div>

              {/* Controls: Full Screen Toggle + Close */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsVideoFullScreen((prev) => !prev)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-200 dark:border-slate-700 shadow-xs"
                  title={
                    isVideoFullScreen
                      ? "Exit Full Screen Studio"
                      : "Open in Full Screen Studio"
                  }
                >
                  {isVideoFullScreen ? (
                    <Minimize2 size={14} />
                  ) : (
                    <Maximize2 size={14} />
                  )}
                  <span className="hidden sm:inline">
                    {isVideoFullScreen ? "Exit Full Screen" : "Full Screen"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  title="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Studio Stepper Bar (3 Steps) */}
            <div className="shrink-0 px-4 sm:px-8 py-2.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
              {[
                { step: 1, label: "1. Curriculum Info", icon: BookOpen },
                { step: 2, label: "2. Lesson Settings", icon: Settings },
                { step: 3, label: "3. Student Preview", icon: Eye },
              ].map(({ step, label, icon: Icon }) => {
                const isActive = videoStudioStep === step;
                const isPassed = videoStudioStep > step;

                return (
                  <button
                    key={step}
                    type="button"
                    onClick={() => setVideoStudioStep(step)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                        : isPassed
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                    }`}
                  >
                    <Icon size={13} />
                    <span>{label}</span>
                    {isPassed && (
                      <Check size={12} className="text-emerald-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Studio Form & Content */}
            <form
              onSubmit={handleSaveVideo}
              className="flex-1 flex flex-col min-h-0 overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
                {/* ─────────────────────────────────────────────────────────
                    STEP 1: CURRICULUM INFORMATION (FULL SCREEN STUDIO)
                   ───────────────────────────────────────────────────────── */}
                {videoStudioStep === 1 && (
                  <div className="w-full space-y-6 animate-in fade-in duration-150">
                    <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 sm:p-7 shadow-sm space-y-6">
                      <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <BookOpen size={16} className="text-blue-500" />
                          <span>Curriculum & Academic Metadata</span>
                        </h4>
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          Full Screen Curriculum Studio
                        </span>
                      </div>

                      {/* Row 1: Target Intermediate Board, Intermediate Year, Subject Name (Side by Side) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            Target Intermediate Board *
                          </label>
                          <select
                            value={videoForm.board}
                            onChange={(e) =>
                              setVideoForm({
                                ...videoForm,
                                board: e.target.value,
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs font-medium"
                          >
                            <option value="Both Boards">
                              Both Boards (AP & TS Common Syllabus)
                            </option>
                            <option value="Andhra Pradesh Intermediate">
                              Andhra Pradesh (BIEAP)
                            </option>
                            <option value="Telangana Intermediate">
                              Telangana (TSBIE)
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            Intermediate Year *
                          </label>
                          <select
                            value={videoForm.year}
                            onChange={(e) => {
                              const y = e.target.value;
                              setVideoForm({
                                ...videoForm,
                                year: y,
                                classLevel:
                                  y === "1st Year"
                                    ? "Intermediate 1st Year"
                                    : y === "2nd Year"
                                      ? "Intermediate 2nd Year"
                                      : "Both Years",
                              });
                            }}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs font-medium"
                          >
                            <option value="1st Year">
                              1st Year (Junior Inter)
                            </option>
                            <option value="2nd Year">
                              2nd Year (Senior Inter)
                            </option>
                            <option value="Both Years">
                              Both Years (Comprehensive)
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            Subject Name *
                          </label>
                          <select
                            value={videoForm.subject}
                            onChange={(e) =>
                              setVideoForm({
                                ...videoForm,
                                subject: e.target.value,
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs font-medium"
                          >
                            <option value="Mathematics">Mathematics</option>
                            <option value="Physics">Physics</option>
                            <option value="Chemistry">Chemistry</option>
                            <option value="Botany">Botany</option>
                            <option value="Zoology">Zoology</option>
                            <option value="English">English</option>
                            <option value="Commerce">Commerce</option>
                            <option value="Economics">Economics</option>
                            <option value="Civics">Civics</option>
                            <option value="History">History</option>
                            <option value="General">
                              General / Platform Demo
                            </option>
                          </select>
                        </div>
                      </div>

                      {/* Row 2: Chapter Name, Number & Key Word with YouTube URL & Upload video on right of Save */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
                          <span>
                            Chapter Name, Number & Key Word{" "}
                            <span className="text-rose-500">*</span>
                          </span>
                          <span className="text-[10px] font-normal text-slate-400">
                            Right: Key Word (Save) & Media Actions (YouTube URL
                            / Upload video / Thumbnail)
                          </span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
                          {/* Stepper & Number Box for Chapter */}
                          <div className="md:col-span-3 lg:col-span-2 xl:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-between gap-1 shadow-xs h-[42px]">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 pl-0.5 shrink-0">
                              Chapter No:
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              {/* Decrease button */}
                              <button
                                type="button"
                                onClick={() => {
                                  const current = Math.max(
                                    1,
                                    (Number(videoForm.chapterNumber) || 1) - 1,
                                  );
                                  setVideoForm((prev) =>
                                    syncCurriculumKeywords(prev, {
                                      chapterNumber: current,
                                      chapter: prev.chapterName
                                        ? `Chapter ${current}: ${prev.chapterName}`
                                        : `Chapter ${current}`,
                                    }),
                                  );
                                }}
                                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer select-none active:scale-95 shrink-0"
                                title="Decrease Chapter Number"
                              >
                                –
                              </button>

                              {/* Direct typed input box for Chapter Number */}
                              <input
                                type="number"
                                min="1"
                                value={videoForm.chapterNumber || 1}
                                onChange={(e) => {
                                  const num = Math.max(
                                    1,
                                    parseInt(e.target.value, 10) || 1,
                                  );
                                  setVideoForm((prev) =>
                                    syncCurriculumKeywords(prev, {
                                      chapterNumber: num,
                                      chapter: prev.chapterName
                                        ? `Chapter ${num}: ${prev.chapterName}`
                                        : `Chapter ${num}`,
                                    }),
                                  );
                                }}
                                className="w-12 h-7 text-center font-black text-xs sm:text-sm bg-blue-50 dark:bg-slate-950 border border-blue-200 dark:border-slate-800 rounded-lg text-blue-600 dark:text-cyan-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />

                              {/* Increase button */}
                              <button
                                type="button"
                                onClick={() => {
                                  const current =
                                    (Number(videoForm.chapterNumber) || 1) + 1;
                                  setVideoForm((prev) =>
                                    syncCurriculumKeywords(prev, {
                                      chapterNumber: current,
                                      chapter: prev.chapterName
                                        ? `Chapter ${current}: ${prev.chapterName}`
                                        : `Chapter ${current}`,
                                    }),
                                  );
                                }}
                                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer select-none active:scale-95 shrink-0"
                                title="Increase Chapter Number"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Chapter Name Input */}
                          <div className="md:col-span-4 lg:col-span-4 xl:col-span-4">
                            <input
                              type="text"
                              value={videoForm.chapterName || ""}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") e.preventDefault();
                              }}
                              onChange={(e) => {
                                const name = e.target.value;
                                const num =
                                  Number(videoForm.chapterNumber) || 1;
                                setVideoForm((prev) =>
                                  syncCurriculumKeywords(prev, {
                                    chapterName: name,
                                    chapter: name
                                      ? `Chapter ${num}: ${name}`
                                      : `Chapter ${num}`,
                                  }),
                                );
                              }}
                              placeholder="Chapter Name (e.g. FUNCTION / Thermodynamics)"
                              className="w-full h-[42px] px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium shadow-xs"
                            />
                          </div>

                          {/* Chapter Key Word Box with Save */}
                          <div className="md:col-span-5 lg:col-span-3 xl:col-span-3 relative flex items-center">
                            <input
                              type="text"
                              value={videoForm.chapterKeyword || ""}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleSaveKeywordToSummary(
                                    videoForm.chapterKeyword,
                                    "chapterKeyword",
                                  );
                                }
                              }}
                              onChange={(e) => {
                                const val = e.target.value;
                                setVideoForm((prev) => ({
                                  ...prev,
                                  chapterKeyword: val,
                                }));
                              }}
                              placeholder="Chapter Key Word"
                              className="w-full h-[42px] px-3 pr-20 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-cyan-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold shadow-xs"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleSaveKeywordToSummary(
                                  videoForm.chapterKeyword,
                                  "chapterKeyword",
                                )
                              }
                              className={`absolute right-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer select-none active:scale-95 ${
                                savedKeyFeedback.chapterKeyword
                                  ? "bg-emerald-600 text-white shadow-emerald-500/25"
                                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25"
                              }`}
                              title="Save this keyword to Summary"
                            >
                              {savedKeyFeedback.chapterKeyword
                                ? "Saved ✓"
                                : "Save"}
                            </button>
                          </div>

                          {/* Right Side of Save: Small Buttons for YouTube URL & Upload video */}
                          <div className="md:col-span-12 lg:col-span-3 xl:col-span-3 flex items-center gap-2 flex-wrap">
                            {renderMediaActionButtons(
                              "chapter",
                              `Chapter ${videoForm.chapterNumber || 1}: ${videoForm.chapterName || ""}`,
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Topic & Sub Topic Section with '+' and '-' Toggle */}
                      <div className="rounded-2xl border border-dashed border-blue-200 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20 p-4 sm:p-5 transition-all space-y-4">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                              Topic & Sub Topic Details
                            </span>
                            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                              (Optional)
                            </span>
                          </div>

                          {/* "+" and "-" Toggle button */}
                          <button
                            type="button"
                            onClick={() => setShowTopicSection((prev) => !prev)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 text-xs font-bold text-blue-600 dark:text-cyan-400 transition-all cursor-pointer shadow-xs active:scale-95"
                            title={
                              showTopicSection
                                ? "Press – to close Topic & Sub Topic"
                                : "Press + to open Topic & Sub Topic"
                            }
                          >
                            <span className="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-cyan-300 flex items-center justify-center font-black text-sm select-none">
                              {showTopicSection ? "–" : "+"}
                            </span>
                            <span>
                              {showTopicSection
                                ? "– Close Topic & Sub Topic"
                                : "+ Add Topic & Sub Topic"}
                            </span>
                          </button>
                        </div>

                        {showTopicSection && (
                          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-4 animate-in fade-in duration-150">
                            {/* Row 3: Topic Name, Number & Key Word (NO STAR) */}
                            <div className="space-y-1.5">
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
                                <span>Topic Name, Number & Key Word</span>
                                <span className="text-[10px] font-normal text-blue-500 dark:text-cyan-400">
                                  Right: Key Word (Save) & Media Actions
                                  (YouTube URL / Upload video / Thumbnail)
                                </span>
                              </label>
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
                                {/* Stepper & Types Box for Topic */}
                                <div className="md:col-span-3 lg:col-span-2 xl:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-between gap-1 shadow-xs h-[42px]">
                                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 pl-0.5 shrink-0">
                                    Topic No:
                                  </span>
                                  <div className="flex items-center gap-1 shrink-0">
                                    {/* Decrease button */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const next = stepTopicNumber(
                                          videoForm.topicNumber || "1.0",
                                          -1,
                                        );
                                        setVideoForm((prev) =>
                                          syncCurriculumKeywords(prev, {
                                            topicNumber: next,
                                          }),
                                        );
                                      }}
                                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer select-none active:scale-95 shrink-0"
                                      title="Decrease Topic Number (e.g. 1.1 -> 1.0)"
                                    >
                                      –
                                    </button>

                                    {/* Direct typed input box for Topic Number */}
                                    <input
                                      type="text"
                                      value={
                                        videoForm.topicNumber !== undefined
                                          ? videoForm.topicNumber
                                          : "1.0"
                                      }
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setVideoForm((prev) =>
                                          syncCurriculumKeywords(prev, {
                                            topicNumber: val,
                                          }),
                                        );
                                      }}
                                      placeholder="1.0"
                                      className="w-14 h-7 text-center font-black text-xs sm:text-sm bg-blue-50 dark:bg-slate-950 border border-blue-200 dark:border-slate-800 rounded-lg text-blue-600 dark:text-cyan-400 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                                    />

                                    {/* Increase button */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const next = stepTopicNumber(
                                          videoForm.topicNumber || "1.0",
                                          1,
                                        );
                                        setVideoForm((prev) =>
                                          syncCurriculumKeywords(prev, {
                                            topicNumber: next,
                                          }),
                                        );
                                      }}
                                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer select-none active:scale-95 shrink-0"
                                      title="Increase Topic Number (e.g. 1.0 -> 1.1)"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>

                                {/* Topic Name Input */}
                                <div className="md:col-span-4 lg:col-span-4 xl:col-span-4">
                                  <input
                                    type="text"
                                    value={videoForm.topicName || ""}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") e.preventDefault();
                                    }}
                                    onChange={(e) => {
                                      const top = e.target.value;
                                      const sub = videoForm.subTopicName || "";
                                      setVideoForm((prev) =>
                                        syncCurriculumKeywords(prev, {
                                          topicName: top,
                                          title: sub ? `${top}: ${sub}` : top,
                                        }),
                                      );
                                    }}
                                    placeholder="Topic Name (e.g. Carnot Engine & Cycles / Functions)"
                                    className="w-full h-[42px] px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium shadow-xs"
                                  />
                                </div>

                                {/* Topic Key Word Box with Save */}
                                <div className="md:col-span-5 lg:col-span-3 xl:col-span-3 relative flex items-center">
                                  <input
                                    type="text"
                                    value={videoForm.topicKeyword || ""}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleSaveKeywordToSummary(
                                          videoForm.topicKeyword,
                                          "topicKeyword",
                                        );
                                      }
                                    }}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setVideoForm((prev) => ({
                                        ...prev,
                                        topicKeyword: val,
                                      }));
                                    }}
                                    placeholder="Topic Key Word"
                                    className="w-full h-[42px] px-3 pr-20 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-cyan-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold shadow-xs"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleSaveKeywordToSummary(
                                        videoForm.topicKeyword,
                                        "topicKeyword",
                                      )
                                    }
                                    className={`absolute right-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer select-none active:scale-95 ${
                                      savedKeyFeedback.topicKeyword
                                        ? "bg-emerald-600 text-white shadow-emerald-500/25"
                                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25"
                                    }`}
                                    title="Save this keyword to Summary"
                                  >
                                    {savedKeyFeedback.topicKeyword
                                      ? "Saved ✓"
                                      : "Save"}
                                  </button>
                                </div>

                                {/* Right Side of Save: Small Buttons for YouTube URL & Upload video */}
                                <div className="md:col-span-12 lg:col-span-3 xl:col-span-3 flex items-center gap-2 flex-wrap">
                                  {renderMediaActionButtons(
                                    "topic",
                                    `Topic ${videoForm.topicNumber || "1.0"}: ${videoForm.topicName || ""}`,
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Row 4: Sub Topic Name, Number & Key Word (NO STAR) */}
                            <div className="space-y-1.5">
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
                                <span>Sub Topic Name, Number & Key Word</span>
                                <span className="text-[10px] font-normal text-slate-400">
                                  Right: Key Word (Save) & Media Actions
                                  (YouTube URL / Upload video / Thumbnail)
                                </span>
                              </label>
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
                                {/* Stepper & Types Box for Sub Topic */}
                                <div className="md:col-span-3 lg:col-span-2 xl:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-between gap-1 shadow-xs h-[42px]">
                                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 pl-0.5 shrink-0">
                                    Sub Topic No:
                                  </span>
                                  <div className="flex items-center gap-1 shrink-0">
                                    {/* Decrease button */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const next = stepSubTopicNumber(
                                          videoForm.subTopicNumber || "1.0.0",
                                          -1,
                                        );
                                        setVideoForm((prev) =>
                                          syncCurriculumKeywords(prev, {
                                            subTopicNumber: next,
                                          }),
                                        );
                                      }}
                                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer select-none active:scale-95 shrink-0"
                                      title="Decrease Sub Topic Number (e.g. 1.0.1 -> 1.0.0)"
                                    >
                                      –
                                    </button>

                                    {/* Direct typed input box for Sub Topic Number */}
                                    <input
                                      type="text"
                                      value={
                                        videoForm.subTopicNumber !== undefined
                                          ? videoForm.subTopicNumber
                                          : "1.0.0"
                                      }
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setVideoForm((prev) =>
                                          syncCurriculumKeywords(prev, {
                                            subTopicNumber: val,
                                          }),
                                        );
                                      }}
                                      placeholder="1.0.0"
                                      className="w-16 h-7 text-center font-black text-xs sm:text-sm bg-blue-50 dark:bg-slate-950 border border-blue-200 dark:border-slate-800 rounded-lg text-blue-600 dark:text-cyan-400 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                                    />

                                    {/* Increase button */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const next = stepSubTopicNumber(
                                          videoForm.subTopicNumber || "1.0.0",
                                          1,
                                        );
                                        setVideoForm((prev) =>
                                          syncCurriculumKeywords(prev, {
                                            subTopicNumber: next,
                                          }),
                                        );
                                      }}
                                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer select-none active:scale-95 shrink-0"
                                      title="Increase Sub Topic Number (e.g. 1.0.0 -> 1.0.1)"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>

                                {/* Sub Topic Name Input */}
                                <div className="md:col-span-4 lg:col-span-4 xl:col-span-4">
                                  <input
                                    type="text"
                                    value={
                                      videoForm.subTopicName !== undefined
                                        ? videoForm.subTopicName
                                        : videoForm.lessonName ||
                                          videoForm.lesson ||
                                          ""
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") e.preventDefault();
                                    }}
                                    onChange={(e) => {
                                      const sub = e.target.value;
                                      const top = videoForm.topicName || "";
                                      setVideoForm((prev) =>
                                        syncCurriculumKeywords(prev, {
                                          subTopicName: sub,
                                          lessonName: sub,
                                          lesson: sub,
                                          title: top ? `${top}: ${sub}` : sub,
                                        }),
                                      );
                                    }}
                                    placeholder="Sub Topic Name (e.g. Derivation of Carnot Efficiency / Domain Calculation)"
                                    className="w-full h-[42px] px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium shadow-xs"
                                  />
                                </div>

                                {/* Sub Topic Key Word Box with Save */}
                                <div className="md:col-span-5 lg:col-span-3 xl:col-span-3 relative flex items-center">
                                  <input
                                    type="text"
                                    value={videoForm.subTopicKeyword || ""}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleSaveKeywordToSummary(
                                          videoForm.subTopicKeyword,
                                          "subTopicKeyword",
                                        );
                                      }
                                    }}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setVideoForm((prev) => ({
                                        ...prev,
                                        subTopicKeyword: val,
                                      }));
                                    }}
                                    placeholder="Sub Topic Key Word"
                                    className="w-full h-[42px] px-3 pr-20 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-cyan-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold shadow-xs"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleSaveKeywordToSummary(
                                        videoForm.subTopicKeyword,
                                        "subTopicKeyword",
                                      )
                                    }
                                    className={`absolute right-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer select-none active:scale-95 ${
                                      savedKeyFeedback.subTopicKeyword
                                        ? "bg-emerald-600 text-white shadow-emerald-500/25"
                                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25"
                                    }`}
                                    title="Save this keyword to Summary"
                                  >
                                    {savedKeyFeedback.subTopicKeyword
                                      ? "Saved ✓"
                                      : "Save"}
                                  </button>
                                </div>

                                {/* Right Side of Save: Small Buttons for YouTube URL & Upload video */}
                                <div className="md:col-span-12 lg:col-span-3 xl:col-span-3 flex items-center gap-2 flex-wrap">
                                  {renderMediaActionButtons(
                                    "subTopic",
                                    `Sub Topic ${videoForm.subTopicNumber || "1.0.0"}: ${videoForm.subTopicName || ""}`,
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Row 5: Sub Sub Topic Name, Number & Key Word (NO STAR) */}
                            <div className="space-y-1.5">
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
                                <span>
                                  Sub Sub Topic Name, Number & Key Word
                                </span>
                                <span className="text-[10px] font-normal text-slate-400">
                                  Right: Key Word (Save) & Media Actions
                                  (YouTube URL / Upload video / Thumbnail)
                                </span>
                              </label>
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
                                {/* Stepper & Types Box for Sub Sub Topic */}
                                <div className="md:col-span-3 lg:col-span-2 xl:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-between gap-1 shadow-xs h-[42px]">
                                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 pl-0.5 shrink-0">
                                    Sub Sub No:
                                  </span>
                                  <div className="flex items-center gap-1 shrink-0">
                                    {/* Decrease button */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const next = stepSubSubTopicNumber(
                                          videoForm.subSubTopicNumber ||
                                            "1.0.0.0",
                                          -1,
                                        );
                                        setVideoForm((prev) =>
                                          syncCurriculumKeywords(prev, {
                                            subSubTopicNumber: next,
                                          }),
                                        );
                                      }}
                                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer select-none active:scale-95 shrink-0"
                                      title="Decrease Sub Sub Topic Number (e.g. 1.0.0.1 -> 1.0.0.0)"
                                    >
                                      –
                                    </button>

                                    {/* Direct typed input box for Sub Sub Topic Number */}
                                    <input
                                      type="text"
                                      value={
                                        videoForm.subSubTopicNumber !==
                                        undefined
                                          ? videoForm.subSubTopicNumber
                                          : "1.0.0.0"
                                      }
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setVideoForm((prev) =>
                                          syncCurriculumKeywords(prev, {
                                            subSubTopicNumber: val,
                                          }),
                                        );
                                      }}
                                      placeholder="1.0.0.0"
                                      className="w-18 h-7 text-center font-black text-xs sm:text-sm bg-blue-50 dark:bg-slate-950 border border-blue-200 dark:border-slate-800 rounded-lg text-blue-600 dark:text-cyan-400 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                                    />

                                    {/* Increase button */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const next = stepSubSubTopicNumber(
                                          videoForm.subSubTopicNumber ||
                                            "1.0.0.0",
                                          1,
                                        );
                                        setVideoForm((prev) =>
                                          syncCurriculumKeywords(prev, {
                                            subSubTopicNumber: next,
                                          }),
                                        );
                                      }}
                                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer select-none active:scale-95 shrink-0"
                                      title="Increase Sub Sub Topic Number (e.g. 1.0.0.0 -> 1.0.0.1)"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>

                                {/* Sub Sub Topic Name Input */}
                                <div className="md:col-span-4 lg:col-span-4 xl:col-span-4">
                                  <input
                                    type="text"
                                    value={videoForm.subSubTopicName || ""}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") e.preventDefault();
                                    }}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setVideoForm((prev) =>
                                        syncCurriculumKeywords(prev, {
                                          subSubTopicName: val,
                                        }),
                                      );
                                    }}
                                    placeholder="Sub Sub Topic Name (e.g. Special Cases & Exceptions / Problem Types)"
                                    className="w-full h-[42px] px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium shadow-xs"
                                  />
                                </div>

                                {/* Sub Sub Topic Key Word Box with Save */}
                                <div className="md:col-span-5 lg:col-span-3 xl:col-span-3 relative flex items-center">
                                  <input
                                    type="text"
                                    value={videoForm.subSubTopicKeyword || ""}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleSaveKeywordToSummary(
                                          videoForm.subSubTopicKeyword,
                                          "subSubTopicKeyword",
                                        );
                                      }
                                    }}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setVideoForm((prev) => ({
                                        ...prev,
                                        subSubTopicKeyword: val,
                                      }));
                                    }}
                                    placeholder="Sub Sub Topic Key Word"
                                    className="w-full h-[42px] px-3 pr-20 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-cyan-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold shadow-xs"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleSaveKeywordToSummary(
                                        videoForm.subSubTopicKeyword,
                                        "subSubTopicKeyword",
                                      )
                                    }
                                    className={`absolute right-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer select-none active:scale-95 ${
                                      savedKeyFeedback.subSubTopicKeyword
                                        ? "bg-emerald-600 text-white shadow-emerald-500/25"
                                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25"
                                    }`}
                                    title="Save this keyword to Summary"
                                  >
                                    {savedKeyFeedback.subSubTopicKeyword
                                      ? "Saved ✓"
                                      : "Save"}
                                  </button>
                                </div>

                                {/* Right Side of Save: Small Buttons for YouTube URL & Upload video */}
                                <div className="md:col-span-12 lg:col-span-3 xl:col-span-3 flex items-center gap-2 flex-wrap">
                                  {renderMediaActionButtons(
                                    "subSubTopic",
                                    `Sub Sub Topic ${videoForm.subSubTopicNumber || "1.0.0.0"}: ${videoForm.subSubTopicName || ""}`,
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Attached Media & Thumbnail Status Banner */}
                      {(videoForm.url || videoForm.thumbnailUrl) && (
                        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/20 space-y-3 animate-in fade-in">
                          {/* Attached Video Status */}
                          {videoForm.url && (
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                  <CheckCircle2 size={16} />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                      {videoForm.type === "youtube" ||
                                      Boolean(extractYouTubeId(videoForm.url))
                                        ? "YouTube Video Attached"
                                        : "Video File Uploaded"}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                      Video Linked ✓
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-600 dark:text-slate-300 truncate max-w-md lg:max-w-xl font-mono mt-0.5">
                                    {videoForm.type === "youtube" ||
                                    Boolean(extractYouTubeId(videoForm.url))
                                      ? videoForm.url
                                      : videoUploadInfo?.originalName ||
                                        videoForm.url}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setVideoForm((prev) => ({
                                      ...prev,
                                      url: "",
                                    }));
                                    setVideoUploadInfo(null);
                                    showToast(
                                      "Video unlinked from lesson",
                                      "info",
                                    );
                                  }}
                                  className="px-2.5 py-1.5 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors cursor-pointer"
                                  title="Unlink video"
                                >
                                  Unlink Video
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Attached Thumbnail Status */}
                          {videoForm.thumbnailUrl && (
                            <div
                              className={`flex items-center justify-between gap-3 flex-wrap ${videoForm.url ? "pt-2.5 border-t border-emerald-500/15" : ""}`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-12 h-8 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-purple-500/30">
                                  <img
                                    src={videoForm.thumbnailUrl}
                                    alt="Thumbnail preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src =
                                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80";
                                    }}
                                  />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                      Custom Thumbnail Active
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                                      Thumbnail ✓
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate max-w-md lg:max-w-xl font-mono mt-0.5">
                                    {videoForm.thumbnailUrl}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={handleTriggerThumbUpload}
                                  className="px-2.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-xs font-bold transition-all cursor-pointer"
                                  title="Change thumbnail image"
                                >
                                  Change Image
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setVideoForm((prev) => ({
                                      ...prev,
                                      thumbnailUrl: "",
                                    }));
                                    showToast("Thumbnail removed", "info");
                                  }}
                                  className="px-2.5 py-1.5 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors cursor-pointer"
                                  title="Remove thumbnail"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Video Uploading Progress Bar */}
                      {isUploadingVideo && (
                        <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-2 animate-in fade-in">
                          <div className="flex items-center justify-between text-xs font-bold text-blue-700 dark:text-cyan-300">
                            <span className="flex items-center gap-1.5">
                              <RefreshCw size={13} className="animate-spin" />
                              <span>Uploading Video File to Storage...</span>
                            </span>
                            <span>{videoUploadProgress}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-blue-200 dark:bg-blue-900 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-150"
                              style={{ width: `${videoUploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Thumbnail Uploading Progress Bar */}
                      {isUploadingThumb && (
                        <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 space-y-2 animate-in fade-in">
                          <div className="flex items-center justify-between text-xs font-bold text-purple-700 dark:text-purple-300">
                            <span className="flex items-center gap-1.5">
                              <RefreshCw size={13} className="animate-spin" />
                              <span>
                                Uploading Thumbnail Image to Storage...
                              </span>
                            </span>
                            <span>{thumbUploadProgress}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-purple-200 dark:bg-purple-900 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-150"
                              style={{ width: `${thumbUploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Row 6: Description & Summary */}
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            Description & Summary
                          </label>
                          <textarea
                            rows={3}
                            value={videoForm.description}
                            onChange={(e) =>
                              setVideoForm({
                                ...videoForm,
                                description: e.target.value,
                              })
                            }
                            placeholder="Outline of topics covered, 7-mark question proofs, board blueprints and key takeaways."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                          />
                        </div>

                        {/* Saved Key Words shown directly under Description & Summary */}
                        <div className="rounded-2xl border border-blue-200/80 dark:border-blue-900/40 bg-blue-50/30 dark:bg-blue-950/20 p-3.5 space-y-2">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                                <span>Saved Key Words</span>
                                {(() => {
                                  const list =
                                    typeof videoForm.keywords === "string"
                                      ? videoForm.keywords
                                          .split(",")
                                          .map((k) => k.trim())
                                          .filter(Boolean)
                                      : Array.isArray(videoForm.keywords)
                                        ? videoForm.keywords
                                            .map((k) => String(k).trim())
                                            .filter(Boolean)
                                        : [];
                                  return (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-cyan-300">
                                      {list.length}
                                    </span>
                                  );
                                })()}
                              </span>
                            </div>
                            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                              Saved from Chapter / Topic / Sub Topic Key Word
                              boxes
                            </span>
                          </div>

                          {(() => {
                            const list =
                              typeof videoForm.keywords === "string"
                                ? videoForm.keywords
                                    .split(",")
                                    .map((k) => k.trim())
                                    .filter(Boolean)
                                : Array.isArray(videoForm.keywords)
                                  ? videoForm.keywords
                                      .map((k) => String(k).trim())
                                      .filter(Boolean)
                                  : [];

                            if (list.length === 0) {
                              return (
                                <div className="text-xs text-slate-400 dark:text-slate-500 italic py-1">
                                  No key words saved yet. Enter a key word in
                                  Chapter, Topic, or Sub Topic and click{" "}
                                  <span className="font-semibold text-blue-600 dark:text-cyan-400">
                                    "Save"
                                  </span>
                                  .
                                </div>
                              );
                            }

                            return (
                              <div className="flex items-center gap-2 flex-wrap pt-1">
                                {list.map((kw, i) => (
                                  <span
                                    key={`saved-kw-${i}`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-900 shadow-2xs"
                                  >
                                    <span>#{kw}</span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemoveKeywordFromSummary(kw)
                                      }
                                      className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-full w-4 h-4 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                                      title={`Remove "${kw}"`}
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Active Video Detection & Replace Option Card */}
                    <div
                      className={`p-4 rounded-2xl border transition-all ${
                        existingVideosForHierarchy.length > 0
                          ? "bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border-amber-500/30 dark:border-amber-400/30"
                          : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              existingVideosForHierarchy.length > 0
                                ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                                : "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                            }`}
                          >
                            <FolderGit2 size={18} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                Video Replacement &amp; Archive Control
                              </span>
                              {existingVideosForHierarchy.length > 0 ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                                  {existingVideosForHierarchy.length} Active
                                  Video
                                  {existingVideosForHierarchy.length > 1
                                    ? "s"
                                    : ""}{" "}
                                  Already Present
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                  Ready to Publish
                                </span>
                              )}
                            </div>

                            {existingVideosForHierarchy.length > 0 ? (
                              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                                An active video already exists for this lesson:
                                {existingVideosForHierarchy.map((item) => (
                                  <strong
                                    key={item.code}
                                    className="ml-1 text-slate-900 dark:text-white"
                                  >
                                    [{item.code}] &quot;
                                    {item.existingVideo.title}&quot;
                                  </strong>
                                ))}
                              </p>
                            ) : (
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                If an existing video is present at this code
                                level (e.g. 1.0: Ordered Pairs), choose whether
                                to replace and store the old video.
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Interactive Toggle Option */}
                        <label className="flex items-center gap-2.5 cursor-pointer select-none bg-white dark:bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs shrink-0 hover:border-purple-400 dark:hover:border-purple-500 transition-colors">
                          <input
                            type="checkbox"
                            checked={replaceExistingVideo}
                            onChange={(e) =>
                              setReplaceExistingVideo(e.target.checked)
                            }
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
                          />
                          <div className="text-left">
                            <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                              Replace &amp; Store Old Video
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">
                              {replaceExistingVideo
                                ? "Old video will be preserved in Old Videos Storage"
                                : "Keep both as separate lesson items"}
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setVideoStudioStep(2)}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/25 transition-all cursor-pointer"
                      >
                        <span>Next: Step 2 (Lesson Settings)</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ─────────────────────────────────────────────────────────
                    STEP 2: LESSON SETTINGS (EXACT USER SPECIFICATIONS)
                   ───────────────────────────────────────────────────────── */}
                {videoStudioStep === 2 && (
                  <div className="w-full space-y-6 animate-in fade-in duration-150">
                    <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 sm:p-7 shadow-sm space-y-6">
                      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Settings size={17} className="text-blue-500" />
                          <span>Step 2 – Lesson Settings & Permissions</span>
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Configure student access controls, completion
                          requirements, and notifications.
                        </p>
                      </div>

                      {/* 1. Visibility */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                          Visibility
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {[
                            { value: "draft", label: "Draft", color: "amber" },
                            {
                              value: "published",
                              label: "Published",
                              color: "emerald",
                            },
                            {
                              value: "archived",
                              label: "Archived",
                              color: "slate",
                            },
                            {
                              value: "hidden",
                              label: "Hidden",
                              color: "purple",
                            },
                          ].map(({ value, label, color }) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() =>
                                setVideoForm({ ...videoForm, status: value })
                              }
                              className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                                videoForm.status === value
                                  ? color === "emerald"
                                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/25"
                                    : color === "amber"
                                      ? "bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/25"
                                      : color === "purple"
                                        ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/25"
                                        : "bg-slate-700 text-white border-slate-700"
                                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 2 & 3. Free Preview vs Premium Content */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                            Free Preview
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setVideoForm({
                                  ...videoForm,
                                  freePreview: true,
                                  isPremium: false,
                                  premiumContent: false,
                                })
                              }
                              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                videoForm.freePreview
                                  ? "bg-emerald-600 text-white shadow-xs"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                              }`}
                            >
                              ON
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setVideoForm({
                                  ...videoForm,
                                  freePreview: false,
                                })
                              }
                              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                !videoForm.freePreview
                                  ? "bg-slate-700 text-white shadow-xs"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                              }`}
                            >
                              OFF
                            </button>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                            Premium Content
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setVideoForm({
                                  ...videoForm,
                                  premiumContent: true,
                                  isPremium: true,
                                  freePreview: false,
                                })
                              }
                              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                videoForm.premiumContent || videoForm.isPremium
                                  ? "bg-amber-500 text-slate-950 font-black shadow-xs"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                              }`}
                            >
                              ON
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setVideoForm({
                                  ...videoForm,
                                  premiumContent: false,
                                  isPremium: false,
                                })
                              }
                              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                !(
                                  videoForm.premiumContent ||
                                  videoForm.isPremium
                                )
                                  ? "bg-slate-700 text-white shadow-xs"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                              }`}
                            >
                              OFF
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Estimated Duration & Difficulty Level */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            Estimated Duration
                          </label>
                          <input
                            type="text"
                            value={videoForm.estimatedDuration}
                            onChange={(e) =>
                              setVideoForm({
                                ...videoForm,
                                estimatedDuration: e.target.value,
                                duration: e.target.value,
                              })
                            }
                            placeholder="Example: 45 Minutes"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            Difficulty Level
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {["Beginner", "Intermediate", "Advanced"].map(
                              (lvl) => (
                                <button
                                  key={lvl}
                                  type="button"
                                  onClick={() =>
                                    setVideoForm({
                                      ...videoForm,
                                      difficultyLevel: lvl,
                                    })
                                  }
                                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                                    videoForm.difficultyLevel === lvl
                                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                                  }`}
                                >
                                  {lvl}
                                </button>
                              ),
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 9 & 10. Release Date & Expiry Date */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <Calendar size={13} className="text-blue-500" />
                            <span>Release Date (Publish Date)</span>
                          </label>
                          <input
                            type="date"
                            value={videoForm.releaseDate}
                            onChange={(e) =>
                              setVideoForm({
                                ...videoForm,
                                releaseDate: e.target.value,
                              })
                            }
                            className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <Clock size={13} className="text-amber-500" />
                            <span>Expiry Date (Optional)</span>
                          </label>
                          <input
                            type="date"
                            value={videoForm.expiryDate}
                            onChange={(e) =>
                              setVideoForm({
                                ...videoForm,
                                expiryDate: e.target.value,
                              })
                            }
                            className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                          />
                        </div>
                      </div>

                      {/* 11 & 12. Lesson Order & Completion Requirement */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            Lesson Order
                          </label>
                          <input
                            type="text"
                            value={videoForm.lessonOrder}
                            onChange={(e) =>
                              setVideoForm({
                                ...videoForm,
                                lessonOrder: e.target.value,
                                lesson: e.target.value,
                              })
                            }
                            placeholder="Example: Lesson 1, Lesson 2, Lesson 3"
                            className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            Completion Requirement
                          </label>
                          <select
                            value={videoForm.completionRequirement}
                            onChange={(e) =>
                              setVideoForm({
                                ...videoForm,
                                completionRequirement: e.target.value,
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs"
                          >
                            <option value="Video Only">Video Only</option>
                            <option value="Video + PDF">Video + PDF</option>
                            <option value="Video + Quiz">Video + Quiz</option>
                            <option value="Complete All">Complete All</option>
                          </select>
                        </div>
                      </div>

                      {/* Progress Tracking, Notifications, Attendance */}
                      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          {/* Progress Tracking */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              Progress Tracking
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setVideoForm({
                                  ...videoForm,
                                  progressTracking: !videoForm.progressTracking,
                                })
                              }
                              className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer transition-all ${
                                videoForm.progressTracking
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                              }`}
                            >
                              {videoForm.progressTracking
                                ? "Enabled"
                                : "Disabled"}
                            </button>
                          </div>

                          {/* Attendance Required */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              Attendance Required
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setVideoForm({
                                  ...videoForm,
                                  attendanceRequired:
                                    videoForm.attendanceRequired === "Required"
                                      ? "Optional"
                                      : "Required",
                                })
                              }
                              className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer transition-all ${
                                videoForm.attendanceRequired === "Required"
                                  ? "bg-indigo-600 text-white"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                              }`}
                            >
                              {videoForm.attendanceRequired || "Optional"}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {/* Student Notifications */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                              <Bell size={14} className="text-blue-500" />
                              <span>Student Notifications</span>
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setVideoForm({
                                  ...videoForm,
                                  studentNotifications:
                                    !videoForm.studentNotifications,
                                })
                              }
                              className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer transition-all ${
                                videoForm.studentNotifications
                                  ? "bg-emerald-600 text-white"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                              }`}
                            >
                              {videoForm.studentNotifications
                                ? "Notify Students"
                                : "Silent"}
                            </button>
                          </div>

                          {/* Parent Notification */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                              <Mail size={14} className="text-purple-500" />
                              <span>Parent Notification</span>
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setVideoForm({
                                  ...videoForm,
                                  parentNotification:
                                    !videoForm.parentNotification,
                                })
                              }
                              className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer transition-all ${
                                videoForm.parentNotification
                                  ? "bg-purple-600 text-white"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                              }`}
                            >
                              {videoForm.parentNotification
                                ? "Send Message"
                                : "Disabled"}
                            </button>
                          </div>

                          {/* Comments & Discussion */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                              <MessageSquare
                                size={14}
                                className="text-blue-500"
                              />
                              <span>Comments</span>
                            </span>
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  setVideoForm({
                                    ...videoForm,
                                    commentsEnabled: true,
                                  })
                                }
                                className={`px-2 py-1 rounded-md text-xs font-bold cursor-pointer transition-all ${
                                  videoForm.commentsEnabled
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                }`}
                              >
                                Enable
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setVideoForm({
                                    ...videoForm,
                                    commentsEnabled: false,
                                  })
                                }
                                className={`px-2 py-1 rounded-md text-xs font-bold cursor-pointer transition-all ${
                                  !videoForm.commentsEnabled
                                    ? "bg-slate-700 text-white"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                }`}
                              >
                                Disable
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 18 & 19. Discussion Forum & Live Class Link */}
                      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                              Discussion Forum
                            </span>
                            <p className="text-[11px] text-slate-500">
                              Allow students to ask doubts for this lesson
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                setVideoForm({
                                  ...videoForm,
                                  discussionForumEnabled: true,
                                })
                              }
                              className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                                videoForm.discussionForumEnabled
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                              }`}
                            >
                              Enable
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setVideoForm({
                                  ...videoForm,
                                  discussionForumEnabled: false,
                                })
                              }
                              className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                                !videoForm.discussionForumEnabled
                                  ? "bg-slate-700 text-white"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                              }`}
                            >
                              Disable
                            </button>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            Live Class Link Platform
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {[
                              "None",
                              "Google Meet",
                              "Zoom",
                              "Microsoft Teams",
                            ].map((plat) => (
                              <button
                                key={plat}
                                type="button"
                                onClick={() =>
                                  setVideoForm({
                                    ...videoForm,
                                    liveClassPlatform: plat,
                                  })
                                }
                                className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                                  videoForm.liveClassPlatform === plat
                                    ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                    : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                                }`}
                              >
                                {plat}
                              </button>
                            ))}
                          </div>

                          {videoForm.liveClassPlatform !== "None" && (
                            <input
                              type="url"
                              value={videoForm.liveClassLink}
                              onChange={(e) =>
                                setVideoForm({
                                  ...videoForm,
                                  liveClassLink: e.target.value,
                                })
                              }
                              placeholder={`Paste ${videoForm.liveClassPlatform} URL (e.g. https://meet.google.com/...)`}
                              className="w-full mt-2 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          )}
                        </div>
                      </div>

                      {/* 21. Watermark & Anti-Piracy Settings (Optional) */}
                      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                              <ShieldCheck
                                size={14}
                                className="text-emerald-500"
                              />
                              <span>
                                Anti-Piracy Watermark Protection{" "}
                                <span className="text-[10px] text-slate-400 font-normal normal-case">
                                  (Optional)
                                </span>
                              </span>
                            </span>
                            <p className="text-[11px] text-slate-500">
                              Optionally overlay a dynamic copyright/licensing
                              watermark on the video player
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                setVideoForm({
                                  ...videoForm,
                                  watermarkEnabled: true,
                                  watermarkText:
                                    videoForm.watermarkText ||
                                    "MyMarks • Protected Content",
                                })
                              }
                              className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                                videoForm.watermarkEnabled
                                  ? "bg-emerald-600 text-white shadow-xs"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                              }`}
                            >
                              Enable
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setVideoForm({
                                  ...videoForm,
                                  watermarkEnabled: false,
                                })
                              }
                              className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                                !videoForm.watermarkEnabled
                                  ? "bg-slate-700 text-white shadow-xs"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                              }`}
                            >
                              Disable
                            </button>
                          </div>
                        </div>

                        {videoForm.watermarkEnabled && (
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                                Watermark Text (Optional)
                              </label>
                              <input
                                type="text"
                                value={videoForm.watermarkText}
                                onChange={(e) =>
                                  setVideoForm({
                                    ...videoForm,
                                    watermarkText: e.target.value,
                                  })
                                }
                                placeholder="e.g. MyMarks • Protected Content"
                                className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              />
                            </div>

                            <div>
                              <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                                Watermark Position
                              </label>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                                {[
                                  { pos: "top-right", label: "Top Right" },
                                  { pos: "top-left", label: "Top Left" },
                                  {
                                    pos: "bottom-right",
                                    label: "Bottom Right",
                                  },
                                  { pos: "bottom-left", label: "Bottom Left" },
                                ].map(({ pos, label }) => (
                                  <button
                                    key={pos}
                                    type="button"
                                    onClick={() =>
                                      setVideoForm({
                                        ...videoForm,
                                        watermarkPosition: pos,
                                      })
                                    }
                                    className={`py-1 px-1.5 rounded-md text-[11px] font-bold border transition-all cursor-pointer text-center ${
                                      videoForm.watermarkPosition === pos
                                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                                        : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                                    }`}
                                  >
                                    {label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 22. Badges & Highlighting ("Barge") (Optional) */}
                      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Award size={14} className="text-amber-500" />
                          <span>
                            Lesson Badges & Accreditations (Barge){" "}
                            <span className="text-[10px] text-slate-400 font-normal normal-case">
                              (Optional)
                            </span>
                          </span>
                        </span>

                        <div className="space-y-2">
                          <label className="text-[11px] font-semibold text-slate-500 block">
                            Quick-Select Badge Presets
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                setVideoForm({
                                  ...videoForm,
                                  badgeText: "",
                                  isVerifiedBadge: false,
                                })
                              }
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                                !videoForm.badgeText
                                  ? "bg-slate-700 text-white border-slate-700 shadow-xs"
                                  : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300"
                              }`}
                            >
                              None (No Badge)
                            </button>
                            {[
                              "Verified Curriculum",
                              "High Yield 2026",
                              "Board Exam Special",
                              "Top Rated",
                              "PYQ Solved",
                              "Formula Sheet Included",
                            ].map((preset) => (
                              <button
                                key={preset}
                                type="button"
                                onClick={() =>
                                  setVideoForm({
                                    ...videoForm,
                                    badgeText: preset,
                                    isVerifiedBadge:
                                      preset.includes("Verified"),
                                  })
                                }
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                                  videoForm.badgeText === preset
                                    ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                    : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                                }`}
                              >
                                {preset}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <div>
                            <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                              Custom Badge Text (Optional)
                            </label>
                            <input
                              type="text"
                              value={videoForm.badgeText}
                              onChange={(e) =>
                                setVideoForm({
                                  ...videoForm,
                                  badgeText: e.target.value,
                                })
                              }
                              placeholder="Leave blank for no badge (Optional)"
                              className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                              Verified Content Badge
                            </label>
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  setVideoForm({
                                    ...videoForm,
                                    isVerifiedBadge: true,
                                  })
                                }
                                className={`flex-1 py-1 px-2 rounded-md text-xs font-bold cursor-pointer transition-all ${
                                  videoForm.isVerifiedBadge
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                }`}
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setVideoForm({
                                    ...videoForm,
                                    isVerifiedBadge: false,
                                  })
                                }
                                className={`flex-1 py-1 px-2 rounded-md text-xs font-bold cursor-pointer transition-all ${
                                  !videoForm.isVerifiedBadge
                                    ? "bg-slate-700 text-white"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                }`}
                              >
                                No
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                              Resolution Quality Badge
                            </label>
                            <select
                              value={videoForm.qualityBadge}
                              onChange={(e) =>
                                setVideoForm({
                                  ...videoForm,
                                  qualityBadge: e.target.value,
                                })
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                            >
                              <option value="1080p Full HD">
                                1080p Full HD
                              </option>
                              <option value="4K Ultra HD">4K Ultra HD</option>
                              <option value="720p HD">720p HD</option>
                              <option value="Standard Def">Standard Def</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setVideoStudioStep(1)}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ArrowLeft size={14} />
                        <span>Back: Step 1 (Curriculum Info)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setVideoStudioStep(3)}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/25 transition-all cursor-pointer"
                      >
                        <span>Next: Step 3 (Live Student Preview)</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ─────────────────────────────────────────────────────────
                    STEP 3: LIVE STUDENT CARD PREVIEW
                   ───────────────────────────────────────────────────────── */}
                {videoStudioStep === 3 && (
                  <div className="w-full space-y-6 animate-in fade-in duration-150">
                    <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-2 border border-blue-500/30">
                        <Eye size={24} />
                      </div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white">
                        Step 3 – Live Student Dashboard Card Preview
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg mx-auto mt-1">
                        This is the exact interactive card that students will
                        see in their dashboard when this lesson is published.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      {/* Left: Exact Student Dashboard Card Preview */}
                      <div className="md:col-span-7">
                        <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
                          <div>
                            {/* Thumbnail Container */}
                            <div
                              className="relative aspect-video w-full bg-slate-900 overflow-hidden cursor-pointer"
                              onClick={() =>
                                setPreviewVideoModal({
                                  ...videoForm,
                                  id: "preview-modal-test",
                                })
                              }
                            >
                              {videoForm.thumbnailUrl ? (
                                <img
                                  src={videoForm.thumbnailUrl}
                                  alt={videoForm.title || "Lesson thumbnail"}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop";
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-950 p-4">
                                  <Video
                                    size={32}
                                    className="text-blue-500 mb-1"
                                  />
                                  <span className="text-[11px] font-bold">
                                    Visdom Waves Video
                                  </span>
                                </div>
                              )}

                              {/* Dark gradient overlay for badges */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

                              {/* Play Button Icon on Hover */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-13 h-13 rounded-2xl bg-red-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-red-500 transition-all duration-300 border border-white/20">
                                  <Play
                                    size={22}
                                    fill="currentColor"
                                    className="ml-0.5"
                                  />
                                </div>
                              </div>

                              {/* Top Left: Badges ("Barge") & Type Pill & Access Level */}
                              <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap z-10">
                                {Boolean(videoForm.badgeText?.trim()) && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md flex items-center gap-1">
                                    {videoForm.isVerifiedBadge && (
                                      <ShieldCheck
                                        size={10}
                                        className="text-white"
                                      />
                                    )}
                                    <span>{videoForm.badgeText}</span>
                                  </span>
                                )}
                                {Boolean(videoForm.badgeText?.trim()) &&
                                  videoForm.qualityBadge && (
                                    <span className="px-1.5 py-0.5 rounded bg-black/75 text-[10px] font-bold text-amber-300 border border-amber-400/30">
                                      {videoForm.qualityBadge}
                                    </span>
                                  )}
                                {videoForm.type === "youtube" ||
                                Boolean(extractYouTubeId(videoForm.url)) ? (
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-red-600 text-white flex items-center gap-1 shadow-md">
                                    <svg
                                      className="w-3 h-3 fill-current"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                    <span>YouTube Lecture</span>
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-600 text-white flex items-center gap-1 shadow-md">
                                    <Film size={11} />
                                    <span>HD Video</span>
                                  </span>
                                )}

                                {videoForm.premiumContent ||
                                videoForm.isPremium ? (
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
                              {Boolean(
                                videoForm.watermarkEnabled &&
                                videoForm.watermarkText?.trim(),
                              ) && (
                                <div
                                  className={`absolute z-10 pointer-events-none select-none flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs border border-white/10 text-white/80 font-mono text-[9px] tracking-wider uppercase font-bold shadow-md max-w-[45%] truncate ${
                                    videoForm.watermarkPosition === "top-left"
                                      ? "top-2.5 left-2.5"
                                      : videoForm.watermarkPosition ===
                                          "bottom-left"
                                        ? "bottom-2.5 left-2.5"
                                        : videoForm.watermarkPosition ===
                                            "bottom-right"
                                          ? "bottom-2.5 right-2.5"
                                          : "top-2.5 right-2.5"
                                  }`}
                                >
                                  <ShieldCheck
                                    size={10}
                                    className="text-blue-400 shrink-0"
                                  />
                                  <span className="truncate">
                                    {videoForm.watermarkText}
                                  </span>
                                </div>
                              )}

                              {/* Bottom Right: Duration */}
                              {(videoForm.estimatedDuration ||
                                videoForm.duration) && (
                                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 text-white font-mono text-[11px] font-bold shadow-md">
                                  {videoForm.estimatedDuration ||
                                    videoForm.duration}
                                </div>
                              )}
                            </div>

                            {/* Body Content */}
                            <div className="p-4 sm:p-5 space-y-2.5">
                              {/* Board & Subject Badges */}
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-500/20 uppercase tracking-wider">
                                    {videoForm.subject || "Subject"}
                                  </span>
                                  {videoForm.chapter && (
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                                      {videoForm.chapter}
                                    </span>
                                  )}
                                </div>

                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                  {videoForm.year ||
                                    videoForm.classLevel ||
                                    "Intermediate"}
                                </span>
                              </div>

                              {/* Title */}
                              <h3
                                onClick={() =>
                                  setPreviewVideoModal({
                                    ...videoForm,
                                    id: "preview-modal-test",
                                  })
                                }
                                className="font-black text-slate-900 dark:text-white text-sm sm:text-base group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
                              >
                                {videoForm.title || "Untitled Lesson"}
                              </h3>

                              {/* Lesson or Sub-unit */}
                              {videoForm.lesson && (
                                <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                                  {videoForm.lesson}
                                </p>
                              )}

                              {/* Description */}
                              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                {videoForm.description ||
                                  "Comprehensive conceptual breakdown with board blueprint exam proofs and solutions."}
                              </p>
                            </div>
                          </div>

                          {/* Footer Action */}
                          <div className="p-4 sm:p-5 pt-0">
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
                              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                                {videoForm.instructor || "Visdom Waves Faculty"}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewVideoModal({
                                    ...videoForm,
                                    id: "preview-modal-test",
                                  })
                                }
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/25 transition-all cursor-pointer active:scale-95 shrink-0"
                              >
                                <Play size={13} fill="currentColor" />
                                <span>Watch Video</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Pre-publish Inspection Checklist */}
                      <div className="md:col-span-5 space-y-4">
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 shadow-sm space-y-3">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                            Lesson Verification Summary
                          </span>

                          <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                              <span className="text-slate-500">
                                Visibility:
                              </span>
                              <span className="font-bold uppercase text-emerald-600 dark:text-emerald-400">
                                {videoForm.status}
                              </span>
                            </div>

                            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                              <span className="text-slate-500">Access:</span>
                              <span className="font-bold text-slate-900 dark:text-white">
                                {videoForm.premiumContent || videoForm.isPremium
                                  ? "★ Premium Only"
                                  : "Free Preview"}
                              </span>
                            </div>

                            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                              <span className="text-slate-500">
                                Highlight Badge:
                              </span>
                              <span className="font-bold text-slate-900 dark:text-white">
                                {videoForm.badgeText?.trim() ? (
                                  <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
                                    <Award
                                      size={12}
                                      className="text-amber-500"
                                    />
                                    <span>
                                      {videoForm.badgeText} (
                                      {videoForm.qualityBadge})
                                    </span>
                                  </span>
                                ) : (
                                  <span className="text-slate-400 font-normal">
                                    None (Optional)
                                  </span>
                                )}
                              </span>
                            </div>

                            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                              <span className="text-slate-500">Watermark:</span>
                              <span className="font-bold text-slate-900 dark:text-white">
                                {videoForm.watermarkEnabled &&
                                videoForm.watermarkText?.trim() ? (
                                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                                    <ShieldCheck size={12} /> Active (
                                    {videoForm.watermarkPosition})
                                  </span>
                                ) : (
                                  <span className="text-slate-400 font-normal">
                                    Disabled (Optional)
                                  </span>
                                )}
                              </span>
                            </div>

                            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                              <span className="text-slate-500">Duration:</span>
                              <span className="font-bold text-slate-900 dark:text-white">
                                {videoForm.estimatedDuration ||
                                  videoForm.duration ||
                                  "—"}
                              </span>
                            </div>

                            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                              <span className="text-slate-500">
                                Difficulty:
                              </span>
                              <span className="font-bold text-slate-900 dark:text-white">
                                {videoForm.difficultyLevel}
                              </span>
                            </div>

                            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                              <span className="text-slate-500">
                                Completion:
                              </span>
                              <span className="font-bold text-slate-900 dark:text-white">
                                {videoForm.completionRequirement}
                              </span>
                            </div>

                            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                              <span className="text-slate-500">
                                Student Notification:
                              </span>
                              <span className="font-bold text-slate-900 dark:text-white">
                                {videoForm.studentNotifications
                                  ? "Notify"
                                  : "Silent"}
                              </span>
                            </div>

                            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                              <span className="text-slate-500">
                                Parent Notification:
                              </span>
                              <span className="font-bold text-slate-900 dark:text-white">
                                {videoForm.parentNotification
                                  ? "Send Message"
                                  : "Disabled"}
                              </span>
                            </div>

                            {/* Attached Media Checklist per Hierarchy Level */}
                            <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                                Attached Videos per Hierarchy:
                              </span>
                              <div className="space-y-1">
                                {[
                                  {
                                    key: "chapter",
                                    label: `1. Chapter (${videoForm.chapterName || "Chapter " + (videoForm.chapterNumber || 1)})`,
                                  },
                                  {
                                    key: "topic",
                                    label: `2. Topic (${videoForm.topicName || "Topic " + (videoForm.topicNumber || "1.0")})`,
                                  },
                                  {
                                    key: "subTopic",
                                    label: `3. Sub Topic (${videoForm.subTopicName || "Sub Topic " + (videoForm.subTopicNumber || "1.0.0")})`,
                                  },
                                  {
                                    key: "subSubTopic",
                                    label: `4. Sub Sub Topic (${videoForm.subSubTopicName || "Sub Sub " + (videoForm.subSubTopicNumber || "1.0.0.0")})`,
                                  },
                                ].map((item) => {
                                  const m = levelMedia[item.key];
                                  const hasVid = Boolean(m?.url);
                                  return (
                                    <div
                                      key={item.key}
                                      className="flex items-center justify-between text-[11px] py-0.5"
                                    >
                                      <span className="text-slate-600 dark:text-slate-400 truncate max-w-[190px]">
                                        {item.label}
                                      </span>
                                      {hasVid ? (
                                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 shrink-0">
                                          ✓{" "}
                                          {m.type === "youtube"
                                            ? "YouTube"
                                            : "Video"}
                                        </span>
                                      ) : (
                                        <span className="text-slate-400 dark:text-slate-500 italic shrink-0">
                                          Not Attached
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Replacement Mode Indicator */}
                            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
                              <span className="text-slate-500 font-medium">
                                Replacement Action:
                              </span>
                              <span
                                className={`font-bold ${replaceExistingVideo ? "text-purple-600 dark:text-purple-400" : "text-slate-600 dark:text-slate-400"}`}
                              >
                                {replaceExistingVideo
                                  ? "Replace & Store Old Video ✓"
                                  : "Keep Both as Separate"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Direct Submit Callout */}
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-2 text-center">
                          <CheckCircle2
                            size={24}
                            className="text-emerald-500 mx-auto"
                          />
                          <h5 className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                            Ready to Publish Content
                          </h5>
                          <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                            Click &quot;Publish Video / Lesson&quot; below to
                            save and update the curriculum in real time.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setVideoStudioStep(2)}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ArrowLeft size={14} />
                        <span>Back: Step 2 (Lesson Settings)</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isLoading || isUploadingVideo}
                        className="px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                      >
                        <CheckCircle2 size={16} />
                        <span>
                          {videoModalMode === "create"
                            ? "Publish Video / Lesson"
                            : "Save Changes"}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Studio Action Footer (Always Sticky at Bottom) */}
              <div className="shrink-0 px-5 sm:px-8 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Step {videoStudioStep}/3:{" "}
                    {videoStudioStep === 1
                      ? "Curriculum Info"
                      : videoStudioStep === 2
                        ? "Lesson Settings"
                        : "Student Preview"}
                  </span>
                  <span>•</span>
                  <span>
                    {videoForm.board && videoForm.board.includes("Andhra")
                      ? "AP"
                      : videoForm.board && videoForm.board.includes("Telangana")
                        ? "TS"
                        : "AP & TS"}
                  </span>
                  <span>•</span>
                  <span>{videoForm.subject}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  {videoStudioStep > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setVideoStudioStep((prev) => Math.max(1, prev - 1))
                      }
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <ArrowLeft size={13} />
                      <span>Previous</span>
                    </button>
                  )}

                  {videoStudioStep < 3 && (
                    <button
                      type="button"
                      onClick={() =>
                        setVideoStudioStep((prev) => Math.min(3, prev + 1))
                      }
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>Next Step</span>
                      <ArrowRight size={13} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsVideoModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer shadow-xs dark:shadow-none"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading || isUploadingVideo}
                    className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isLoading ? (
                      <span>Saving...</span>
                    ) : isUploadingVideo ? (
                      <span>Uploading Video...</span>
                    ) : videoModalMode === "create" ? (
                      <span>Publish Video / Lesson</span>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          QUICK YOUTUBE MODAL (FROM CURRICULUM INFO ROW BUTTONS)
         ───────────────────────────────────────────────────────────── */}
      {quickYoutubeModal.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-900 dark:text-slate-100">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-500/20">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Attach YouTube Video URL
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {quickYoutubeModal.contextLabel || "Curriculum Item"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setQuickYoutubeModal({
                    isOpen: false,
                    context: "",
                    contextLabel: "",
                    url: "",
                  })
                }
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Input & Paste */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Enter or Paste YouTube Video URL *
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={quickYoutubeModal.url}
                  onChange={(e) =>
                    setQuickYoutubeModal((prev) => ({
                      ...prev,
                      url: e.target.value,
                    }))
                  }
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const url = quickYoutubeModal.url.trim();
                      const id = extractYouTubeId(url);
                      if (!id && url) {
                        showToast(
                          "Please enter a valid YouTube video URL",
                          "error",
                        );
                        return;
                      }
                      const ctx =
                        quickYoutubeModal.context ||
                        activeUploadContext ||
                        "chapter";
                      const thumb = id
                        ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
                        : "";

                      setLevelMedia((prev) => ({
                        ...prev,
                        [ctx]: {
                          ...prev[ctx],
                          url,
                          type: "youtube",
                          thumbnailUrl: thumb || prev[ctx]?.thumbnailUrl || "",
                          isUploading: false,
                          progress: 0,
                        },
                      }));

                      setVideoForm((prev) => ({
                        ...prev,
                        uploadLevel: ctx,
                        url,
                        type: "youtube",
                        thumbnailUrl: thumb || prev.thumbnailUrl,
                      }));
                      setVideoSourceMode("url");
                      setQuickYoutubeModal({
                        isOpen: false,
                        context: "",
                        contextLabel: "",
                        url: "",
                      });
                      const ctxLabel =
                        ctx === "chapter"
                          ? "Chapter"
                          : ctx === "topic"
                            ? "Topic"
                            : ctx === "subTopic"
                              ? "Sub Topic"
                              : "Sub Sub Topic";
                      showToast(`YouTube video attached for ${ctxLabel}!`);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const text = await navigator.clipboard.readText();
                      if (text)
                        setQuickYoutubeModal((prev) => ({
                          ...prev,
                          url: text,
                        }));
                    } catch (e) {
                      console.warn(e);
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                  title="Paste from clipboard"
                >
                  Paste
                </button>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Supports standard watch links, youtu.be shortlinks, live streams
                and YouTube Shorts.
              </p>
            </div>

            {/* Live Preview if valid ID */}
            {(() => {
              const id = extractYouTubeId(quickYoutubeModal.url);
              if (!id) return null;
              return (
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                  <img
                    src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
                    alt="YouTube thumbnail preview"
                    className="w-24 h-16 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300">
                      YouTube ID: {id}
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 truncate font-medium">
                      HQ Artwork preview ready
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              {(() => {
                const ctx =
                  quickYoutubeModal.context || activeUploadContext || "chapter";
                const hasExisting = Boolean(levelMedia[ctx]?.url);
                return hasExisting ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleRemoveLevelMedia(ctx);
                      setQuickYoutubeModal({
                        isOpen: false,
                        context: "",
                        contextLabel: "",
                        url: "",
                      });
                    }}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 cursor-pointer"
                  >
                    Remove Video
                  </button>
                ) : (
                  <div />
                );
              })()}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setQuickYoutubeModal({
                      isOpen: false,
                      context: "",
                      contextLabel: "",
                      url: "",
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const url = quickYoutubeModal.url.trim();
                    const id = extractYouTubeId(url);
                    if (!id && url) {
                      showToast(
                        "Please enter a valid YouTube video URL",
                        "error",
                      );
                      return;
                    }
                    const ctx =
                      quickYoutubeModal.context ||
                      activeUploadContext ||
                      "chapter";
                    const thumb = id
                      ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
                      : "";

                    setLevelMedia((prev) => ({
                      ...prev,
                      [ctx]: {
                        ...prev[ctx],
                        url,
                        type: "youtube",
                        thumbnailUrl: thumb || prev[ctx]?.thumbnailUrl || "",
                        isUploading: false,
                        progress: 0,
                      },
                    }));

                    setVideoForm((prev) => ({
                      ...prev,
                      uploadLevel: ctx,
                      url,
                      type: "youtube",
                      thumbnailUrl: thumb || prev.thumbnailUrl,
                    }));
                    setVideoSourceMode("url");
                    setQuickYoutubeModal({
                      isOpen: false,
                      context: "",
                      contextLabel: "",
                      url: "",
                    });
                    const ctxLabel =
                      ctx === "chapter"
                        ? "Chapter"
                        : ctx === "topic"
                          ? "Topic"
                          : ctx === "subTopic"
                            ? "Sub Topic"
                            : "Sub Sub Topic";
                    showToast(`YouTube video URL attached for ${ctxLabel}!`);
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/25 cursor-pointer transition-all active:scale-95"
                >
                  Attach Video
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: OLD VIDEOS STORAGE & ARCHIVES
         ───────────────────────────────────────────────────────────── */}
      {isArchiveStorageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 dark:bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
            {/* Header */}
            <div className="p-5 sm:p-6 pb-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/70 dark:bg-slate-950/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 shrink-0">
                  <FolderGit2 size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                      Old Videos Storage &amp; Archives
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      {archivedVideos.length} Saved Video
                      {archivedVideos.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Previously replaced videos are preserved here. You can
                    preview, restore them back to the active curriculum anytime,
                    or delete.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsArchiveStorageModalOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                title="Close Storage"
              >
                <X size={20} />
              </button>
            </div>

            {/* Filter Toolbar */}
            <div className="p-4 px-5 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search old videos by code (e.g. 1.0, 1.0.1), title, chapter, or replaced notes..."
                  value={archiveSearch}
                  onChange={(e) => setArchiveSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                />
                {archiveSearch && (
                  <button
                    onClick={() => setArchiveSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={archiveFilterLevel}
                  onChange={(e) => setArchiveFilterLevel(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  <option value="all">All Levels</option>
                  <option value="chapter">Chapter Videos</option>
                  <option value="topic">Topic Videos</option>
                  <option value="subTopic">Sub Topic Videos</option>
                  <option value="subSubTopic">Sub Sub Topic Videos</option>
                </select>

                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 whitespace-nowrap pl-1">
                  {filteredArchivedVideos.length} found
                </span>
              </div>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {filteredArchivedVideos.length === 0 ? (
                <div className="text-center py-16 px-4 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
                    <FolderGit2 size={32} />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {archiveSearch
                      ? "No matching archived videos found"
                      : "No Old Videos in Storage"}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    {archiveSearch
                      ? "Try searching with another keyword or hierarchy code like 1.0 or Ordered Pairs."
                      : "When you upload a new video for an existing lesson (e.g. 1.0: Ordered Pairs) with replacement enabled, the old version will be stored here automatically."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredArchivedVideos.map((v) => {
                    const isYt =
                      v.type === "youtube" ||
                      Boolean(v.youtubeId) ||
                      Boolean(extractYouTubeId(v.url));
                    const ytId = v.youtubeId || extractYouTubeId(v.url);
                    const thumb = getSafeThumbnailUrl(v.thumbnailUrl, ytId);
                    const archivedDate = v.archivedAt
                      ? new Date(v.archivedAt).toLocaleDateString()
                      : new Date(
                          v.updatedAt || Date.now(),
                        ).toLocaleDateString();

                    return (
                      <div
                        key={v._id || v.id}
                        className="rounded-2xl bg-slate-50/80 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 overflow-hidden flex flex-col justify-between hover:border-purple-400 dark:hover:border-purple-500 transition-all group"
                      >
                        <div>
                          {/* Thumbnail preview */}
                          <div
                            onClick={() => setPreviewVideoModal(v)}
                            className="relative aspect-video w-full bg-slate-900 overflow-hidden cursor-pointer"
                          >
                            {thumb ? (
                              <img
                                src={thumb}
                                alt={v.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src =
                                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-900">
                                <Video
                                  size={28}
                                  className="text-purple-500 mb-1"
                                />
                                <span className="text-[10px] font-bold">
                                  Archived Video
                                </span>
                              </div>
                            )}

                            {/* Play overlay on hover */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                <Play
                                  size={16}
                                  fill="currentColor"
                                  className="ml-0.5"
                                />
                              </div>
                            </div>

                            {/* Top Badges */}
                            <div className="absolute top-2 left-2 flex items-center gap-1">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-700/90 text-white shadow">
                                Archived
                              </span>
                              {isYt ? (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-600/90 text-white">
                                  YouTube
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600/90 text-white">
                                  MP4 Video
                                </span>
                              )}
                            </div>

                            {/* Code badge */}
                            {v.code && (
                              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-cyan-300 font-mono text-[10px] font-bold">
                                Code: {v.code}
                              </div>
                            )}

                            {v.duration && (
                              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white font-mono text-[10px] font-bold">
                                {v.duration}
                              </div>
                            )}
                          </div>

                          {/* Card Content */}
                          <div className="p-3.5 space-y-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 uppercase">
                                {v.uploadLevel || "Video"}
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold truncate max-w-[170px]">
                                {v.subject} • Chapter {v.chapterNumber || 1}
                              </span>
                            </div>

                            <h5 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm line-clamp-2 leading-snug">
                              {v.title}
                            </h5>

                            {/* Replacement Details Box */}
                            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-700 dark:text-purple-300 space-y-0.5">
                              <div className="flex items-center justify-between">
                                <span className="font-bold flex items-center gap-1">
                                  <Clock size={11} /> Archived on:
                                </span>
                                <span>{archivedDate}</span>
                              </div>
                              {v.replacedByTitle && (
                                <div className="truncate text-[10px] text-slate-600 dark:text-slate-400">
                                  Replaced by:{" "}
                                  <strong>{v.replacedByTitle}</strong>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="p-3.5 pt-0">
                          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-1.5">
                            <button
                              onClick={() => setPreviewVideoModal(v)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Preview video"
                            >
                              <Play size={12} fill="currentColor" />
                              <span>Play</span>
                            </button>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleRestoreArchivedVideo(v)}
                                className="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                                title="Restore as active curriculum video"
                              >
                                <RefreshCw size={12} />
                                <span>Restore</span>
                              </button>

                              <button
                                onClick={() =>
                                  handleDeleteArchivedVideo(
                                    v._id || v.id,
                                    v.title,
                                  )
                                }
                                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                title="Delete permanently"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>
                All archived items are kept safe in this storage and hidden from
                the student curriculum.
              </span>
              <button
                onClick={() => setIsArchiveStorageModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold cursor-pointer transition-colors"
              >
                Close Storage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: INTERACTIVE VIDEO & LINK PREVIEW PLAYER
         ───────────────────────────────────────────────────────────── */}
      {previewVideoModal &&
        (() => {
          const isYt =
            previewVideoModal.type === "youtube" ||
            Boolean(previewVideoModal.youtubeId) ||
            Boolean(extractYouTubeId(previewVideoModal.url));
          const ytId =
            previewVideoModal.youtubeId ||
            extractYouTubeId(previewVideoModal.url);
          const isVid =
            previewVideoModal.type === "video" ||
            Boolean(
              previewVideoModal.url &&
              (previewVideoModal.url.includes("/uploads/videos/") ||
                previewVideoModal.url.includes("/uploads/") ||
                previewVideoModal.url.startsWith("blob:") ||
                previewVideoModal.url.startsWith("data:video") ||
                /\.(mp4|webm|mov|mkv|ogg|ogv|m4v|avi|flv)(\?.*)?$/i.test(
                  previewVideoModal.url,
                )),
            );

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
              <div className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-6 text-left">
                {/* Top Close Bar */}
                <div className="p-4 sm:px-6 flex items-center justify-between border-b border-slate-800 bg-slate-900/90">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-600/20 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
                      {previewVideoModal.subject || "Lecture"}
                    </span>
                    {previewVideoModal.badgeText && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md flex items-center gap-1">
                        {(previewVideoModal.isVerifiedBadge ?? true) && (
                          <ShieldCheck size={11} className="text-white" />
                        )}
                        <span>{previewVideoModal.badgeText}</span>
                      </span>
                    )}
                    {previewVideoModal.qualityBadge && (
                      <span className="px-1.5 py-0.5 rounded bg-black/60 text-[10px] font-bold text-amber-300 border border-amber-400/30">
                        {previewVideoModal.qualityBadge}
                      </span>
                    )}
                    <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                      •
                    </span>
                    <span className="text-xs text-slate-300 font-semibold truncate max-w-sm">
                      {previewVideoModal.chapter ||
                        previewVideoModal.linkType ||
                        (isVid
                          ? "MP4 Video"
                          : isYt
                            ? "YouTube Lecture"
                            : "Curriculum Resource")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleCopyVideoLink(
                          previewVideoModal.url,
                          "modal-preview",
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Copy Link URL"
                    >
                      <Copy
                        size={13}
                        className={
                          copiedVideoId === "modal-preview"
                            ? "text-emerald-400"
                            : ""
                        }
                      />
                      <span className="hidden sm:inline">Copy Link</span>
                    </button>

                    <button
                      onClick={() => setPreviewVideoModal(null)}
                      className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Video Player Display Container */}
                <div className="w-full bg-black relative">
                  {/* Watermark Overlay on Preview Player */}
                  {(previewVideoModal.watermarkEnabled ?? true) && (
                    <div
                      className={`absolute z-20 pointer-events-none select-none flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/65 backdrop-blur-xs border border-white/10 text-white/80 font-mono text-[11px] tracking-wider uppercase font-bold shadow-xl ${
                        previewVideoModal.watermarkPosition === "top-left"
                          ? "top-4 left-4"
                          : previewVideoModal.watermarkPosition ===
                              "bottom-left"
                            ? "bottom-16 left-4"
                            : previewVideoModal.watermarkPosition ===
                                "bottom-right"
                              ? "bottom-16 right-4"
                              : "top-4 right-4"
                      }`}
                    >
                      <ShieldCheck size={14} className="text-blue-400" />
                      <span>
                        {previewVideoModal.watermarkText ||
                          "MyMarks • Protected Content"}
                      </span>
                    </div>
                  )}

                  {isYt && ytId ? (
                    <div className="relative aspect-video w-full bg-black">
                      <iframe
                        src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                        title={previewVideoModal.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                  ) : isVid ? (
                    <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                      <video
                        src={previewVideoModal.url}
                        controls
                        autoPlay
                        playsInline
                        className="w-full h-full object-contain"
                      >
                        Your browser does not support HTML5 video streaming.
                      </video>
                    </div>
                  ) : (
                    <div className="p-8 sm:p-14 text-center bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col items-center justify-center min-h-[300px]">
                      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-4">
                        {previewVideoModal.type === "drive" ? (
                          <FileText size={32} />
                        ) : (
                          <Link2 size={32} />
                        )}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 max-w-xl">
                        {previewVideoModal.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400 max-w-lg mb-6 leading-relaxed">
                        {previewVideoModal.description ||
                          "Verified curriculum study material, blueprint notes or virtual lab portal."}
                      </p>
                      <button
                        onClick={() => {
                          window.location.href = previewVideoModal.url;
                        }}
                        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                      >
                        <span>Open Study Resource in This Window</span>
                        <ExternalLink size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Video Details Bar */}
                <div className="p-5 sm:p-6 bg-slate-900/60 border-t border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">
                        {previewVideoModal.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
                        {previewVideoModal.description ||
                          "Comprehensive lecture with deep conceptual breakdown and board exam insights."}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          const item = previewVideoModal;
                          setPreviewVideoModal(null);
                          handleOpenEditVideo(item);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                      >
                        <Edit size={14} />
                        <span>Edit Video</span>
                      </button>
                      <button
                        onClick={() => setPreviewVideoModal(null)}
                        className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-md shadow-blue-600/30"
                      >
                        Done
                      </button>
                    </div>
                  </div>

                  {/* Metadata Badges */}
                  <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
                    {previewVideoModal.topicName && (
                      <span className="px-2.5 py-1 rounded-md bg-blue-900/50 text-cyan-300 border border-blue-700/50 font-bold">
                        Topic: {previewVideoModal.topicName}
                      </span>
                    )}
                    {(previewVideoModal.lessonName ||
                      previewVideoModal.lesson) && (
                      <span className="px-2.5 py-1 rounded-md bg-indigo-900/50 text-indigo-300 border border-indigo-700/50 font-bold">
                        {previewVideoModal.lessonName ||
                          previewVideoModal.lesson}
                      </span>
                    )}
                    <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-semibold">
                      Faculty:{" "}
                      <strong className="text-white">
                        {previewVideoModal.instructor || "Visdom Waves Lead"}
                      </strong>
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-semibold">
                      Class:{" "}
                      <strong className="text-white">
                        {previewVideoModal.classLevel || "Intermediate"}
                      </strong>
                    </span>
                    {previewVideoModal.duration && (
                      <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-semibold">
                        Length:{" "}
                        <strong className="text-white">
                          {previewVideoModal.duration}
                        </strong>
                      </span>
                    )}
                    {(Array.isArray(previewVideoModal.keywords) &&
                    previewVideoModal.keywords.length > 0
                      ? previewVideoModal.keywords
                      : Array.isArray(previewVideoModal.tags)
                        ? previewVideoModal.tags
                        : []
                    ).map((kw, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-800/80 text-blue-300 text-[11px] border border-slate-700/60 font-medium"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: VIEW FULL STUDENT PROFILE CARD
         ───────────────────────────────────────────────────────────── */}
      {viewUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 transition-colors duration-200">
            <button
              onClick={() => setViewUserDetail(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>

            {/* Profile Header */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-600/25">
                {(viewUserDetail.fullName || viewUserDetail.name || "ST")
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {viewUserDetail.fullName || viewUserDetail.name}
                </h3>
                <p className="text-xs text-red-600 dark:text-red-400 font-bold">
                  {viewUserDetail.role === "admin"
                    ? "Administrator"
                    : "Student Scholar"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {viewUserDetail.email}
                </p>
              </div>
            </div>

            {/* Profile Grid */}
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Primary Mobile Phone:
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {viewUserDetail.mobileNumber || viewUserDetail.phone || "—"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Board & Stream:
                </span>
                <span className="font-bold text-indigo-600 dark:text-indigo-300">
                  {viewUserDetail.board || "AP Intermediate"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Academic Year:
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {viewUserDetail.year || "First Year"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Junior College:
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {viewUserDetail.collegeName || viewUserDetail.college || "—"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Hall Ticket Number:
                </span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {viewUserDetail.hallTicketNumber || "Not entered yet"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Father / Guardian Name:
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {viewUserDetail.fatherName || "—"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Parent Mobile:
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {viewUserDetail.fatherMobile || "—"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Date of Birth:
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {viewUserDetail.dob || "—"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Study Session:
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {viewUserDetail.studyMonthYear || "June, 2026"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">
                  Database Record ID:
                </span>
                <code className="text-slate-500 font-mono text-[10px]">
                  {viewUserDetail._id || viewUserDetail.id}
                </code>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  const u = viewUserDetail;
                  setViewUserDetail(null);
                  handleOpenEditUser(u);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-amber-500/30"
              >
                <Edit size={14} />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={() => setViewUserDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer border border-slate-300 dark:border-slate-700 shadow-xs dark:shadow-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: DELETE CONFIRMATION
         ───────────────────────────────────────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-center transition-colors duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20 mx-auto flex items-center justify-center mb-4">
              <Trash2 size={22} />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">
              Confirm Deletion
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Are you sure you want to delete{" "}
              <span className="text-slate-900 dark:text-white font-semibold">
                &quot;{deleteConfirm.title}&quot;
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs cursor-pointer transition-colors border border-slate-300 dark:border-slate-700 shadow-xs dark:shadow-none"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirm.type === "user") {
                    handleDeleteUser(deleteConfirm.id);
                  } else if (deleteConfirm.type === "course") {
                    handleDeleteCourse(deleteConfirm.id);
                  } else if (deleteConfirm.type === "video") {
                    handleDeleteVideo(deleteConfirm.id);
                  }
                }}
                disabled={isLoading}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 cursor-pointer transition-all"
              >
                {isLoading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
