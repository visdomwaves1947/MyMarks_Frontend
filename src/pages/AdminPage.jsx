import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  LogIn,
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
  Image as ImageIcon
} from 'lucide-react';

import {
  fetchAdminStats,
  fetchAdminUsers,
  createAdminUserApi,
  updateAdminUserApi,
  deleteAdminUserApi,
  fetchAdminBookings,
  updateAdminBookingApi,
  deleteAdminBookingApi,
  loginAdminApi,
  fetchCourses,
  createContentApi,
  updateContentApi,
  deleteContentApi,
  triggerSeed,
  checkApiHealth,
  fetchAdminVideos,
  createAdminVideoApi,
  updateAdminVideoApi,
  deleteAdminVideoApi,
  seedAdminVideosApi,
  uploadMediaFileApi
} from '../services/api';

const MASTER_EMAIL = 'md@visdomwaves.com';
const MASTER_PASS = 'Md@1947';

export default function AdminPage({
  currentUser = null,
  onLogout,
  onOpenSignIn,
  theme: propTheme,
  toggleTheme: propToggleTheme
}) {
  const navigate = useNavigate();

  // Internal theme tracking & fallback
  const [internalTheme, setInternalTheme] = useState(() => {
    try {
      return localStorage.getItem('mla_theme') || (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    } catch {
      return 'dark';
    }
  });

  const activeTheme = propTheme || internalTheme;

  const handleToggleTheme = () => {
    if (propToggleTheme) {
      propToggleTheme();
    } else {
      const next = activeTheme === 'dark' ? 'light' : 'dark';
      setInternalTheme(next);
      const root = document.documentElement;
      if (next === 'dark') {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      }
      try {
        localStorage.setItem('mla_theme', next);
      } catch (e) {
        console.warn(e);
      }
    }
  };

  // Authentication State: check if user is already logged in via normal sign-in or admin token
  const [isAdminAuthed, setIsAdminAuthed] = useState(() => {
    try {
      const savedUser = localStorage.getItem('mla_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === 'admin' || parsed.email === 'md@visdomwaves.com') {
          return true;
        }
      }
      return (
        sessionStorage.getItem('mymarks_admin_auth') === 'true' ||
        localStorage.getItem('mymarks_admin_auth') === 'true'
      );
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (currentUser && (currentUser.role === 'admin' || currentUser.email === 'md@visdomwaves.com')) {
      setIsAdminAuthed(true);
    }
  }, [currentUser]);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [rememberAdmin, setRememberAdmin] = useState(true);

  // Active Tab: 'dashboard' | 'students' | 'courses' | 'bookings' | 'settings'
  const [activeTab, setActiveTab] = useState('dashboard');

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
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  }, []);

  // Filter & Search States
  const [userSearch, setUserSearch] = useState('');
  const [boardFilter, setBoardFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');

  const [courseSearch, setCourseSearch] = useState('');
  const [courseCategory, setCourseCategory] = useState('all');

  const [bookingFilter, setBookingFilter] = useState('all');

  const [videoSearch, setVideoSearch] = useState('');
  const [videoTypeFilter, setVideoTypeFilter] = useState('all');
  const [videoSubjectFilter, setVideoSubjectFilter] = useState('all');
  const [videoClassFilter, setVideoClassFilter] = useState('all');

  // Modals
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userModalMode, setUserModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewUserDetail, setViewUserDetail] = useState(null);

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseModalMode, setCourseModalMode] = useState('create');
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoModalMode, setVideoModalMode] = useState('create');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [previewVideoModal, setPreviewVideoModal] = useState(null);
  const [copiedVideoId, setCopiedVideoId] = useState(null);

  // Video Upload & Full Screen Studio States
  const [isVideoFullScreen, setIsVideoFullScreen] = useState(false);
  const [videoSourceMode, setVideoSourceMode] = useState('upload'); // 'upload' | 'url'
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [videoUploadInfo, setVideoUploadInfo] = useState(null);
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const [thumbUploadProgress, setThumbUploadProgress] = useState(0);
  const [videoDragOver, setVideoDragOver] = useState(false);
  const [thumbDragOver, setThumbDragOver] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState(null); // { type: 'user'|'course'|'booking'|'video', id, title }

  // Helper to extract YouTube ID
  const extractYouTubeId = useCallback((url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : '';
  }, []);

  // User Form Data
  const initialUserForm = {
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    board: 'Andhra Pradesh Intermediate',
    year: 'First Year',
    collegeName: '',
    hallTicketNumber: '',
    fatherName: '',
    fatherMobile: '',
    relationship: 'Father',
    dob: '',
    aadhaarNumber: '',
    studyMonthYear: 'June, 2026',
    role: 'student',
  };
  const [userForm, setUserForm] = useState(initialUserForm);

  // Course Form Data
  const initialCourseForm = {
    title: '',
    type: 'course',
    category: 'mpc',
    level: 'Intermediate 1st Year',
    description: '',
    lessonsCount: 36,
    durationWeeks: 12,
    rating: 4.9,
    tag: 'Core Track',
    instructor: {
      name: 'Faculty Lead',
      title: 'Senior Subject Educator',
    },
    popular: true,
    status: 'published',
  };
  const [courseForm, setCourseForm] = useState(initialCourseForm);

  // Video & Resource Form Data
  const initialVideoForm = {
    title: '',
    type: 'youtube', // 'youtube' | 'video' | 'link' | 'drive' | 'document'
    url: '',
    subject: 'Mathematics',
    classLevel: 'Intermediate 1st Year',
    chapter: '',
    description: '',
    duration: '35 mins',
    instructor: 'Visdom Waves Faculty',
    tags: '',
    linkType: 'Lecture Video',
    thumbnailUrl: '',
    isFeatured: false,
    status: 'published',
  };
  const [videoForm, setVideoForm] = useState(initialVideoForm);

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
      const coursesRes = await fetchCourses('all');
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
        setVideos(videosRes.data);
      }

      const elapsed = Math.round(performance.now() - start);
      setApiStatus({ online: true, latency: elapsed });
    } catch (err) {
      console.warn('Failed to load admin data:', err);
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

  // Handle Admin Login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    const cleanEmail = loginEmail.trim().toLowerCase();
    const cleanPass = loginPass.trim();

    if (!cleanEmail || !cleanPass) {
      setLoginError('Please enter both username and password.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await loginAdminApi({ email: cleanEmail, password: cleanPass });
      if (res && res.success) {
        setIsAdminAuthed(true);
        try {
          if (rememberAdmin) {
            localStorage.setItem('mymarks_admin_auth', 'true');
            if (res.token) localStorage.setItem('mymarks_admin_token', res.token);
          } else {
            sessionStorage.setItem('mymarks_admin_auth', 'true');
            if (res.token) sessionStorage.setItem('mymarks_admin_token', res.token);
          }
        } catch (err) {
          console.warn(err);
        }
        showToast('Welcome Administrator! Authenticated successfully.');
      } else {
        setLoginError('Access denied: Invalid administrator credentials.');
      }
    } catch (err) {
      // Local fallback verification for offline mode
      if (
        cleanEmail === MASTER_EMAIL.toLowerCase() &&
        (cleanPass === MASTER_PASS || cleanPass === 'Md@1947' || cleanPass === 'md@1947')
      ) {
        setIsAdminAuthed(true);
        try {
          if (rememberAdmin) {
            localStorage.setItem('mymarks_admin_auth', 'true');
          } else {
            sessionStorage.setItem('mymarks_admin_auth', 'true');
          }
        } catch (storageErr) {
          console.warn(storageErr);
        }
        showToast('Welcome to MyMarks Administrator Dashboard!');
      } else {
        setLoginError(err.message || 'Access denied: Invalid administrator credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogout = () => {
    try {
      localStorage.removeItem('mymarks_admin_auth');
      sessionStorage.removeItem('mymarks_admin_auth');
      localStorage.removeItem('mymarks_admin_token');
      sessionStorage.removeItem('mymarks_admin_token');
      localStorage.removeItem('mla_user');
    } catch (e) {
      console.warn(e);
    }
    setIsAdminAuthed(false);
    showToast('Logged out of Admin Hub', 'info');
    if (onLogout) {
      onLogout();
    } else {
      navigate('/demo');
    }
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !userSearch ||
        (u.fullName || '').toLowerCase().includes(userSearch.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(userSearch.toLowerCase()) ||
        (u.mobileNumber || '').includes(userSearch) ||
        (u.collegeName || '').toLowerCase().includes(userSearch.toLowerCase()) ||
        (u.hallTicketNumber || '').toLowerCase().includes(userSearch.toLowerCase());

      const matchBoard =
        boardFilter === 'all' ||
        (u.board || '').toLowerCase().includes(boardFilter.toLowerCase());

      const matchYear =
        yearFilter === 'all' ||
        (u.year || '').toLowerCase().includes(yearFilter.toLowerCase());

      return matchSearch && matchBoard && matchYear;
    });
  }, [users, userSearch, boardFilter, yearFilter]);

  // Filtered Courses
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        !courseSearch ||
        (c.title || '').toLowerCase().includes(courseSearch.toLowerCase()) ||
        (c.description || '').toLowerCase().includes(courseSearch.toLowerCase());

      const matchCategory =
        courseCategory === 'all' ||
        (c.category || '').toLowerCase() === courseCategory.toLowerCase();

      return matchSearch && matchCategory;
    });
  }, [courses, courseSearch, courseCategory]);

  // Filtered Videos & Resources
  const filteredVideos = useMemo(() => {
    return videos.filter((v) => {
      const q = videoSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        (v.title || '').toLowerCase().includes(q) ||
        (v.chapter || '').toLowerCase().includes(q) ||
        (v.instructor || '').toLowerCase().includes(q) ||
        (v.subject || '').toLowerCase().includes(q) ||
        (v.description || '').toLowerCase().includes(q) ||
        (Array.isArray(v.tags) && v.tags.some((t) => t.toLowerCase().includes(q)));

      const matchType = videoTypeFilter === 'all' || v.type === videoTypeFilter;
      const matchSubject =
        videoSubjectFilter === 'all' ||
        (v.subject || '').toLowerCase() === videoSubjectFilter.toLowerCase();
      const matchClass =
        videoClassFilter === 'all' ||
        (v.classLevel || '').toLowerCase() === videoClassFilter.toLowerCase();

      return matchSearch && matchType && matchSubject && matchClass;
    });
  }, [videos, videoSearch, videoTypeFilter, videoSubjectFilter, videoClassFilter]);

  // User Actions
  const handleOpenAddUser = () => {
    setUserModalMode('create');
    setUserForm(initialUserForm);
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (user) => {
    setUserModalMode('edit');
    setSelectedUser(user);
    setUserForm({
      fullName: user.fullName || user.name || '',
      email: user.email || '',
      mobileNumber: user.mobileNumber || user.phone || '',
      password: '',
      board: user.board || 'Andhra Pradesh Intermediate',
      year: user.year || 'First Year',
      collegeName: user.collegeName || user.college || '',
      hallTicketNumber: user.hallTicketNumber || user.hallTicket || '',
      fatherName: user.fatherName || '',
      fatherMobile: user.fatherMobile || '',
      relationship: user.relationship || 'Father',
      dob: user.dob || '',
      aadhaarNumber: user.aadhaarNumber || '',
      studyMonthYear: user.studyMonthYear || 'June, 2026',
      role: user.role || 'student',
    });
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (userModalMode === 'create') {
        const res = await createAdminUserApi(userForm);
        showToast('Student registered successfully!');
      } else {
        await updateAdminUserApi(selectedUser._id || selectedUser.id, userForm);
        showToast('Student profile updated successfully!');
      }
      setIsUserModalOpen(false);
      await loadAdminData();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    setIsLoading(true);
    try {
      await deleteAdminUserApi(id);
      showToast('Student deleted successfully');
      setDeleteConfirm(null);
      await loadAdminData();
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Course Actions
  const handleOpenAddCourse = () => {
    setCourseModalMode('create');
    setCourseForm(initialCourseForm);
    setIsCourseModalOpen(true);
  };

  const handleOpenEditCourse = (course) => {
    setCourseModalMode('edit');
    setSelectedCourse(course);
    setCourseForm({
      title: course.title || '',
      type: course.type || 'course',
      category: course.category || 'mpc',
      level: course.level || 'Intermediate 1st Year',
      description: course.description || '',
      lessonsCount: course.lessonsCount || 36,
      durationWeeks: course.durationWeeks || 12,
      rating: course.rating || 4.9,
      tag: course.tag || 'Core Track',
      instructor: {
        name: course.instructor?.name || course.instructor || 'Faculty Lead',
        title: course.instructor?.title || course.instructorTitle || 'Senior Subject Educator',
      },
      popular: !!course.popular,
      status: course.status || 'published',
    });
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (courseModalMode === 'create') {
        await createContentApi(courseForm);
        showToast('New course curriculum added successfully!');
      } else {
        await updateContentApi(selectedCourse.id || selectedCourse._id, courseForm);
        showToast('Course updated successfully!');
      }
      setIsCourseModalOpen(false);
      await loadAdminData();
    } catch (err) {
      showToast(err.message || 'Failed to save course', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    setIsLoading(true);
    try {
      await deleteContentApi(id);
      showToast('Course removed successfully');
      setDeleteConfirm(null);
      await loadAdminData();
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Video & Resource Actions
  const handleOpenAddVideo = () => {
    setVideoModalMode('create');
    setVideoForm(initialVideoForm);
    setVideoSourceMode('upload');
    setVideoUploadProgress(0);
    setVideoUploadInfo(null);
    setIsVideoModalOpen(true);
  };

  const handleOpenEditVideo = (video) => {
    setVideoModalMode('edit');
    setSelectedVideo(video);
    setVideoSourceMode(video.url && video.url.includes('/uploads/videos/') ? 'upload' : 'url');
    setVideoUploadProgress(0);
    setVideoUploadInfo(video.url ? { originalName: video.title, url: video.url } : null);
    setVideoForm({
      title: video.title || '',
      type: video.type || 'youtube',
      url: video.url || '',
      subject: video.subject || 'Mathematics',
      classLevel: video.classLevel || 'Intermediate 1st Year',
      chapter: video.chapter || '',
      description: video.description || '',
      duration: video.duration || '35 mins',
      instructor: video.instructor || 'Visdom Waves Faculty',
      tags: Array.isArray(video.tags) ? video.tags.join(', ') : video.tags || '',
      linkType: video.linkType || 'Lecture Video',
      thumbnailUrl: video.thumbnailUrl || '',
      isFeatured: !!video.isFeatured,
      status: video.status || 'published',
    });
    setIsVideoModalOpen(true);
  };

  // Video file upload handler
  const handleVideoFileSelect = async (file) => {
    if (!file) return;

    // Validate video type
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska', 'video/ogg'];
    const isVideo = validVideoTypes.includes(file.type) || /\.(mp4|webm|mov|mkv|avi|ogg|ogv)$/i.test(file.name);
    if (!isVideo) {
      showToast('Please select a valid video file (.mp4, .webm, .mov, .mkv)', 'error');
      return;
    }

    // Auto extract duration and auto-populate title if empty
    try {
      const tempVideo = document.createElement('video');
      tempVideo.preload = 'metadata';
      tempVideo.src = URL.createObjectURL(file);
      tempVideo.onloadedmetadata = () => {
        const totalSec = Math.round(tempVideo.duration);
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        const durStr = mins > 0 ? `${mins} mins ${secs > 0 ? secs + 's' : ''}`.trim() : `${secs}s`;
        setVideoForm(prev => ({
          ...prev,
          duration: prev.duration && prev.duration !== '35 mins' ? prev.duration : durStr
        }));
      };
    } catch (e) {
      console.warn('Could not extract duration metadata:', e);
    }

    // Auto-fill title if empty
    if (!videoForm.title) {
      const cleanName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
      setVideoForm(prev => ({ ...prev, title: cleanName }));
    }

    setIsUploadingVideo(true);
    setVideoUploadProgress(1);

    try {
      const res = await uploadMediaFileApi(file, (percent) => {
        setVideoUploadProgress(percent);
      });

      if (res.success && res.data?.url) {
        setVideoForm(prev => ({
          ...prev,
          url: res.data.url,
          type: 'video',
        }));
        setVideoUploadInfo({
          originalName: file.name,
          sizeMb: (file.size / (1024 * 1024)).toFixed(2),
          url: res.data.url,
        });
        showToast('Video uploaded successfully to Visdom Waves storage!');
      } else {
        throw new Error(res.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Video upload failed:', err);
      showToast(err.message || 'Video upload failed. Check server connection.', 'error');
    } finally {
      setIsUploadingVideo(false);
    }
  };

  // Thumbnail image upload handler
  const handleThumbFileSelect = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP)', 'error');
      return;
    }

    setIsUploadingThumb(true);
    setThumbUploadProgress(1);

    try {
      const res = await uploadMediaFileApi(file, (percent) => {
        setThumbUploadProgress(percent);
      });

      if (res.success && res.data?.url) {
        setVideoForm(prev => ({
          ...prev,
          thumbnailUrl: res.data.url,
        }));
        showToast('Thumbnail uploaded successfully!');
      } else {
        throw new Error(res.message || 'Thumbnail upload failed');
      }
    } catch (err) {
      console.error('Thumbnail upload failed:', err);
      showToast(err.message || 'Thumbnail upload failed', 'error');
    } finally {
      setIsUploadingThumb(false);
    }
  };

  const handleSaveVideo = async (e) => {
    e.preventDefault();
    if (!videoForm.title.trim()) {
      showToast('Please provide a video/link title', 'error');
      return;
    }
    if (!videoForm.url.trim()) {
      showToast('Please provide a URL or link', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const parsedTags = typeof videoForm.tags === 'string'
        ? videoForm.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : videoForm.tags || [];

      const payload = {
        ...videoForm,
        tags: parsedTags,
      };

      // Auto detect YouTube video ID or direct video file upload
      const ytId = extractYouTubeId(payload.url);
      const isVideoFile = payload.url && (
        payload.url.includes('/uploads/') ||
        /\.(mp4|webm|mov|mkv|ogg|ogv|m4v|avi)(\?.*)?$/i.test(payload.url)
      );

      if (ytId) {
        payload.youtubeId = ytId;
        payload.type = 'youtube';
        payload.embedUrl = `https://www.youtube.com/embed/${ytId}`;
        if (!payload.thumbnailUrl) {
          payload.thumbnailUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
        }
      } else if (payload.type === 'video' || isVideoFile) {
        payload.type = 'video';
        if (!payload.embedUrl) {
          payload.embedUrl = payload.url;
        }
      }

      if (videoModalMode === 'create') {
        await createAdminVideoApi(payload);
        showToast('New video / link uploaded successfully!');
      } else {
        await updateAdminVideoApi(selectedVideo.id || selectedVideo._id, payload);
        showToast('Video / link details updated successfully!');
      }

      setIsVideoModalOpen(false);
      await loadAdminData();
    } catch (err) {
      showToast(err.message || 'Failed to save video', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVideo = async (id) => {
    setIsLoading(true);
    try {
      await deleteAdminVideoApi(id);
      showToast('Video removed successfully');
      setDeleteConfirm(null);
      await loadAdminData();
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeedVideos = async () => {
    if (!window.confirm('Seed standard curriculum lecture videos and study materials?')) return;
    setIsLoading(true);
    try {
      await seedAdminVideosApi();
      showToast('Standard lecture videos & links seeded successfully!');
      await loadAdminData();
    } catch (err) {
      showToast('Seed failed: ' + err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyVideoLink = (url, id) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedVideoId(id);
    showToast('Link copied to clipboard!');
    setTimeout(() => setCopiedVideoId(null), 2500);
  };

  // Seed Initial Content
  const handleSeedContent = async () => {
    if (!window.confirm('Seed standard curriculum content into MongoDB database?')) return;
    setIsLoading(true);
    try {
      const res = await triggerSeed();
      showToast('Curriculum seeded successfully!');
      await loadAdminData();
    } catch (err) {
      showToast('Seed failed: ' + err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Export Users to CSV
  const handleExportCSV = () => {
    if (!users.length) {
      showToast('No student records to export', 'error');
      return;
    }

    const headers = [
      'Full Name',
      'Email',
      'Mobile Number',
      'Board',
      'Intermediate Year',
      'College Name',
      'Hall Ticket No',
      'Father Name',
      'Father Mobile',
      'Date of Birth',
      'Registration Date',
    ];

    const rows = users.map((u) => [
      `"${u.fullName || u.name || ''}"`,
      `"${u.email || ''}"`,
      `"${u.mobileNumber || u.phone || ''}"`,
      `"${u.board || ''}"`,
      `"${u.year || ''}"`,
      `"${u.collegeName || u.college || ''}"`,
      `"${u.hallTicketNumber || u.hallTicket || ''}"`,
      `"${u.fatherName || ''}"`,
      `"${u.fatherMobile || ''}"`,
      `"${u.dob || ''}"`,
      `"${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MyMarks_Students_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Students list exported to CSV successfully!');
  };

  // ─────────────────────────────────────────────────────────────
  // RENDER: Admin Auth Gate (if not logged in)
  // ─────────────────────────────────────────────────────────────
  if (!isAdminAuthed) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-100 dark:bg-[#080D1A] text-slate-800 dark:text-white selection:bg-red-600 selection:text-white relative overflow-hidden transition-colors duration-200">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 dark:bg-red-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />

        {/* Top-right theme toggle for login screen */}
        <div className="absolute top-5 right-5 z-20">
          <button
            type="button"
            onClick={handleToggleTheme}
            className="relative flex items-center w-[54px] h-[30px] rounded-full bg-slate-200 dark:bg-slate-700 transition-colors duration-300 focus:outline-none shadow-inner ring-1 ring-slate-300 dark:ring-white/20 cursor-pointer shrink-0"
            aria-label="Toggle theme"
            title={activeTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <div
              className={`absolute top-[3px] w-[24px] h-[24px] bg-white rounded-full shadow-md transition-transform duration-300 ease-out z-0 ${
                activeTheme === 'dark' ? 'translate-x-[26px]' : 'translate-x-[3px]'
              }`}
            />
            <div className="relative flex justify-between items-center w-full px-[6px] z-10 pointer-events-none">
              <Sun
                className={`w-3.5 h-3.5 transition-colors duration-300 ${
                  activeTheme === 'dark' ? 'text-slate-400' : 'text-amber-500 font-bold'
                }`}
              />
              <Moon
                className={`w-3.5 h-3.5 transition-colors duration-300 ${
                  activeTheme === 'dark' ? 'text-indigo-400 font-bold' : 'text-slate-400'
                }`}
              />
            </div>
          </button>
        </div>

        <div className="relative w-full max-w-md bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200 dark:border-slate-700/60 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-slate-200/50 dark:shadow-black/90 transition-colors duration-200">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 p-0.5 shadow-xl shadow-red-600/30 mb-3.5">
              <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-950 flex items-center justify-center">
                <ShieldCheck size={28} className="text-red-500" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-red-500 dark:text-red-400 text-xs font-bold mb-2">
              <Lock size={12} />
              <span>Restricted Administration Hub</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              MyMarks Admin Portal
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-xs">
              Sign in with your MyMarks account or enter administrator credentials below.
            </p>
          </div>

          {/* Option to open standard website sign in */}
          {onOpenSignIn && (
            <div className="mb-4">
              <button
                type="button"
                onClick={onOpenSignIn}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 transition-all cursor-pointer active:scale-95"
              >
                <LogIn size={15} />
                <span>Sign In via Website Login</span>
              </button>
              <div className="flex items-center gap-3 my-4">
                <div className="h-[1px] bg-slate-200 dark:bg-slate-800 grow" />
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">or enter credentials</span>
                <div className="h-[1px] bg-slate-200 dark:bg-slate-800 grow" />
              </div>
            </div>
          )}

          {loginError && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs sm:text-sm flex items-center gap-2.5">
              <AlertCircle size={16} className="text-rose-500 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Username / Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  autoFocus
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="md@visdomwaves.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium focus:bg-white dark:focus:bg-slate-950"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Security Passcode
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all focus:bg-white dark:focus:bg-slate-950"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberAdmin}
                  onChange={(e) => setRememberAdmin(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer accent-red-600"
                />
                <span>Keep me signed in</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setLoginEmail('md@visdomwaves.com');
                  setLoginPass('Md@1947');
                }}
                className="text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300 text-[11px] font-semibold underline underline-offset-2"
              >
                Auto-fill Master Credentials (Md@1947)
              </button>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer active:scale-95"
            >
              <span>Unlock Admin Dashboard</span>
              <ChevronRight size={16} />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <Link to="/demo" className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors">
              <span>← Back to Website</span>
            </Link>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">MyMarks v1.0 • TLS Secured</span>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER: Full Admin Dashboard
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#070B14] text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white transition-colors duration-200">
      {/* Toast Notification Container */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[9999] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border text-sm font-semibold transition-all animate-bounce ${
            toast.type === 'error'
              ? 'bg-rose-50 dark:bg-rose-950/90 text-rose-700 dark:text-rose-200 border-rose-200 dark:border-rose-800'
              : toast.type === 'info'
              ? 'bg-blue-50 dark:bg-blue-950/90 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-800'
              : 'bg-emerald-50 dark:bg-emerald-950/90 text-emerald-700 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle size={18} className="text-rose-500 dark:text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 size={18} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-6 py-3 transition-colors duration-200 shadow-xs dark:shadow-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Left */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 shadow-md shadow-red-600/20">
              <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center text-white font-black text-base">
                M
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white">
                  MyMarks<span className="text-red-500">.co.in</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-red-500/10 dark:bg-red-500/15 border border-red-500/25 dark:border-red-500/30 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-wider">
                  Admin Hub
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Comprehensive Management for Intermediate & Secondary Education
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Database Status Pill */}
            <div
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${
                apiStatus.online
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/25 text-emerald-700 dark:text-emerald-300'
                  : 'bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/25 text-amber-700 dark:text-amber-300'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  apiStatus.online ? 'bg-emerald-500 dark:bg-emerald-400 animate-pulse' : 'bg-amber-500 dark:bg-amber-400'
                }`}
              />
              <span>{apiStatus.online ? `MongoDB Connected (${apiStatus.latency}ms)` : 'Offline Fallback'}</span>
            </div>

            {/* Dark / Light Mode Toggle Pill Switch */}
            <button
              type="button"
              onClick={handleToggleTheme}
              className="relative flex items-center w-[54px] h-[30px] rounded-full bg-slate-200 dark:bg-slate-700 transition-colors duration-300 focus:outline-none shadow-inner ring-1 ring-slate-300 dark:ring-white/20 cursor-pointer shrink-0"
              aria-label="Toggle dark mode"
              title={activeTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {/* Sliding White Knob */}
              <div
                className={`absolute top-[3px] w-[24px] h-[24px] bg-white rounded-full shadow-md transition-transform duration-300 ease-out z-0 ${
                  activeTheme === 'dark' ? 'translate-x-[26px]' : 'translate-x-[3px]'
                }`}
              />
              <div className="relative flex justify-between items-center w-full px-[6px] z-10 pointer-events-none">
                <Sun
                  className={`w-3.5 h-3.5 transition-colors duration-300 ${
                    activeTheme === 'dark' ? 'text-slate-400' : 'text-amber-500 font-bold'
                  }`}
                />
                <Moon
                  className={`w-3.5 h-3.5 transition-colors duration-300 ${
                    activeTheme === 'dark' ? 'text-indigo-400 font-bold' : 'text-slate-400'
                  }`}
                />
              </div>
            </button>

            {/* Refresh Button */}
            <button
              onClick={loadAdminData}
              disabled={isRefreshing}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs dark:shadow-none"
              title="Refresh all data"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-red-500' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* Go to Website */}
            <button
              onClick={() => navigate('/demo')}
              className="px-3 py-1.5 rounded-xl bg-slate-100/90 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs dark:shadow-none"
            >
              <span>View Website</span>
              <ExternalLink size={13} />
            </button>

            {/* Logout */}
            <button
              onClick={handleAdminLogout}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-red-500/10 hover:bg-red-600 dark:bg-red-600/20 text-red-600 dark:text-red-300 hover:text-white border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Sign out of Admin Portal"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body with Navigation Tabs */}
      <div className="grow max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-sm dark:shadow-none overflow-x-auto scrollbar-none transition-colors duration-200">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 size={16} />
            <span>Overview & Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'students'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Users size={16} />
            <span>Students Directory</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[11px] font-black">
              {users.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'courses'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <BookOpen size={16} />
            <span>Curriculum & Subjects</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[11px] font-black">
              {courses.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'videos'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Video size={16} />
            <span>Videos, YouTube & Links</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[11px] font-black">
              {videos.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Calendar size={16} />
            <span>Bookings & Inquiries</span>
            {bookings.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 dark:bg-amber-500/30 text-amber-700 dark:text-amber-300 text-[11px] font-black">
                {bookings.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Settings size={16} />
            <span>Platform Controls</span>
          </button>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            TAB 1: DASHBOARD & OVERVIEW
           ───────────────────────────────────────────────────────────── */}
        {activeTab === 'dashboard' && (
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
                  <span className="text-3xl font-black text-slate-900 dark:text-white">{users.length}</span>
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
                  <span className="text-3xl font-black text-slate-900 dark:text-white">{courses.length}</span>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">16+ Subjects</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  MPC, BiPC, CEC, MEC, HEC, Languages & Practicals
                </p>
              </div>

              {/* Card 3: Videos, YouTube & Links */}
              <div
                onClick={() => setActiveTab('videos')}
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
                  <span className="text-3xl font-black text-slate-900 dark:text-white">{videos.length}</span>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Media Vault</span>
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
                  <span className="text-3xl font-black text-slate-900 dark:text-white">{bookings.length}</span>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Incoming</span>
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
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">Atlas Live</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 truncate">
                  cluster0.vquspbp.mongodb.net
                </p>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="p-5 rounded-3xl bg-white dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 border border-slate-200/90 dark:border-slate-800 shadow-sm dark:shadow-none flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Quick Operations</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Instant administrative shortcuts for daily platform operations
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
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">Recent Registered Students</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Latest students who signed up on MyMarks</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('students')}
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
                            {(user.fullName || user.name || 'S')
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')
                              .toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                              {user.fullName || user.name}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {user.email} • {user.mobileNumber || user.phone || 'No Phone'}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300">
                            {user.board || 'AP Intermediate'}
                          </span>
                          <span className="block text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
                          </span>
                        </div>
                      </div>
                    ))}

                    {users.length === 0 && (
                      <div className="py-10 text-center text-slate-500 text-sm">
                        No students registered yet. Click &quot;Register New Student&quot; to add one.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Academic Streams & Boards Breakdown */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/80 shadow-sm dark:shadow-none flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">Board Enrollment</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Distribution across educational boards</p>

                  <div className="space-y-3">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        <span>Andhra Pradesh Intermediate (BIEAP)</span>
                        <span className="text-slate-900 dark:text-white">
                          {users.filter((u) => (u.board || '').includes('Andhra')).length}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full"
                          style={{
                            width: `${
                              users.length
                                ? (users.filter((u) => (u.board || '').includes('Andhra')).length /
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
                          {users.filter((u) => (u.board || '').includes('Telangana')).length}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{
                            width: `${
                              users.length
                                ? (users.filter((u) => (u.board || '').includes('Telangana')).length /
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
                          {users.filter((u) => (u.board || '').includes('CBSE')).length}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{
                            width: `${
                              users.length
                                ? (users.filter((u) => (u.board || '').includes('CBSE')).length /
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
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Verified DB</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 2: STUDENTS DIRECTORY
           ───────────────────────────────────────────────────────────── */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            {/* Action & Filter Bar */}
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-sm dark:shadow-none flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 transition-colors duration-200">
              {/* Search Box */}
              <div className="relative grow max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
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
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
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
                              {(user.fullName || user.name || 'ST')
                                .split(' ')
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join('')
                                .toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                                {user.fullName || user.name}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {user.role === 'admin' ? (
                                  <span className="text-amber-500 dark:text-amber-400 font-bold">Admin</span>
                                ) : (
                                  'Student Scholar'
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="py-3.5 px-4">
                          <div className="text-slate-800 dark:text-slate-300 font-medium">{user.email}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {user.mobileNumber || user.phone || '—'}
                          </div>
                        </td>

                        {/* Board & Year */}
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-300 mb-0.5">
                            {user.board || 'AP Intermediate'}
                          </span>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {user.year || 'First Year'}
                          </div>
                        </td>

                        {/* College */}
                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                          {user.collegeName || user.college || '—'}
                        </td>

                        {/* Parent Info */}
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-xs">
                          {user.fatherName ? (
                            <div>
                              <span className="font-semibold text-slate-800 dark:text-slate-300">{user.fatherName}</span>
                              <span className="block text-[10px] text-slate-400 dark:text-slate-500">{user.fatherMobile || '—'}</span>
                            </div>
                          ) : (
                            '—'
                          )}
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-xs">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
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
                                  type: 'user',
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
                        <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
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
        {activeTab === 'courses' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-sm dark:shadow-none flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 transition-colors duration-200">
              <div className="relative grow max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
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
                        {c.category || 'Curriculum'}
                      </span>
                      <span className="text-xs text-amber-500 dark:text-amber-400 font-bold">★ {c.rating || 4.9}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                      {c.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                      {c.description || 'Comprehensive curriculum modules designed for exam mastery.'}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>{c.level || 'Intermediate'}</span>
                      <span>{c.lessonsCount || 36} Lessons</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold truncate max-w-[150px]">
                      {c.instructor?.name || c.instructor || 'Faculty Lead'}
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
                            type: 'course',
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
                  No courses found in this category. Click &quot;Seed Standard Content&quot; or &quot;Add Course&quot; to populate.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 4: VIDEOS, YOUTUBE & RESOURCE LINKS
           ───────────────────────────────────────────────────────────── */}
        {activeTab === 'videos' && (
          <div className="space-y-4">
            {/* Filter Bar - Single Line Layout */}
            <div className="p-3 sm:p-3.5 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-sm dark:shadow-none flex items-center justify-between gap-3 transition-colors duration-200 overflow-x-auto no-scrollbar">
              <div className="relative shrink min-w-[180px] max-w-xs xl:max-w-sm">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={videoSearch}
                  onChange={(e) => setVideoSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium focus:bg-white dark:focus:bg-slate-950"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0 flex-nowrap">
                {/* Type Filter */}
                <select
                  value={videoTypeFilter}
                  onChange={(e) => setVideoTypeFilter(e.target.value)}
                  className="px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs dark:shadow-none shrink-0"
                >
                  <option value="all">All Media</option>
                  <option value="youtube">YouTube</option>
                  <option value="video">Direct Video</option>
                  <option value="drive">Drive & PDFs</option>
                  <option value="link">Study Links</option>
                </select>

                {/* Subject Filter */}
                <select
                  value={videoSubjectFilter}
                  onChange={(e) => setVideoSubjectFilter(e.target.value)}
                  className="px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs dark:shadow-none shrink-0"
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

                {/* Class Year Filter */}
                <select
                  value={videoClassFilter}
                  onChange={(e) => setVideoClassFilter(e.target.value)}
                  className="px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs dark:shadow-none shrink-0"
                >
                  <option value="all">All Classes</option>
                  <option value="Intermediate 1st Year">1st Year</option>
                  <option value="Intermediate 2nd Year">2nd Year</option>
                  <option value="Both Years">Both Years</option>
                </select>

                <button
                  onClick={handleSeedVideos}
                  className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0"
                  title="Seed sample YouTube lectures & study links"
                >
                  <Sparkles size={14} />
                  <span>Seed Videos</span>
                </button>

                <button
                  onClick={() => {
                    setIsVideoFullScreen(true);
                    handleOpenAddVideo();
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0"
                  title="Open video uploader in full-screen studio view"
                >
                  <Maximize2 size={14} />
                  <span>Full Screen Studio</span>
                </button>

                <button
                  onClick={handleOpenAddVideo}
                  className="px-3.5 sm:px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Plus size={15} />
                  <span>Upload Video / Link</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics & Summary Bar */}
            <div className="flex items-center justify-between text-xs font-semibold px-2 text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-3">
                <span>Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredVideos.length}</strong> resources</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">{videos.filter(v => v.type === 'youtube').length} YouTube Lectures</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">{videos.filter(v => v.type === 'drive' || v.type === 'link').length} Reference Links & Drive Notes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
                  {videos.filter(v => v.status === 'published').length} Published
                </span>
                {videos.filter(v => v.isFeatured).length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[11px] font-bold">
                    ★ {videos.filter(v => v.isFeatured).length} Featured
                  </span>
                )}
              </div>
            </div>

            {/* Videos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredVideos.map((v) => {
                const isYouTube = v.type === 'youtube' || !!v.youtubeId || Boolean(extractYouTubeId(v.url));
                const isDrive = v.type === 'drive' || Boolean(v.url && v.url.includes('drive.google.com'));
                const isDirectVideo = v.type === 'video' || Boolean(
                  v.url && (
                    v.url.includes('/uploads/') ||
                    /\.(mp4|webm|mov|mkv|ogg|ogv|m4v)(\?.*)?$/i.test(v.url)
                  )
                );

                return (
                  <div
                    key={v.id || v._id}
                    className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/80 shadow-sm dark:shadow-none flex flex-col justify-between hover:border-blue-400/50 dark:hover:border-blue-500/40 transition-all group overflow-hidden"
                  >
                    <div>
                      {/* Thumbnail Container with Play Overlay */}
                      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden cursor-pointer" onClick={() => setPreviewVideoModal(v)}>
                        {v.thumbnailUrl ? (
                          <img
                            src={v.thumbnailUrl}
                            alt={v.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-slate-400">
                            <Video size={36} className="text-blue-500 opacity-80 mb-1" />
                            <span className="text-xs font-semibold">{v.subject || 'Curriculum Video'}</span>
                          </div>
                        )}

                        {/* Hover Overlay with Round Play Icon */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-xs">
                          <div className="w-13 h-13 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-xl shadow-blue-950/60 transform group-hover:scale-110 transition-transform duration-300">
                            <Play size={22} fill="currentColor" className="ml-1" />
                          </div>
                        </div>

                        {/* Top Left: Type Badge */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          {isYouTube ? (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-600/90 text-white flex items-center gap-1 shadow-md backdrop-blur-xs">
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                              </svg>
                              <span>YouTube</span>
                            </span>
                          ) : isDrive ? (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600/90 text-white flex items-center gap-1 shadow-md backdrop-blur-xs">
                              <FileText size={12} />
                              <span>Drive & Notes</span>
                            </span>
                          ) : isDirectVideo ? (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-600/90 text-white flex items-center gap-1 shadow-md backdrop-blur-xs">
                              <Film size={12} />
                              <span>MP4 Video</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-600/90 text-white flex items-center gap-1 shadow-md backdrop-blur-xs">
                              <Link2 size={12} />
                              <span>Study Link</span>
                            </span>
                          )}

                          {v.isFeatured && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 shadow-md">
                              ★ Featured
                            </span>
                          )}
                        </div>

                        {/* Bottom Right: Duration Pill */}
                        {v.duration && (
                          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 text-white font-mono text-[11px] font-bold shadow-md backdrop-blur-xs">
                            {v.duration}
                          </div>
                        )}
                      </div>

                      {/* Content Body */}
                      <div className="p-4 sm:p-5">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 uppercase tracking-wider">
                              {v.subject || 'Subject'}
                            </span>
                            {v.chapter && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
                                {v.chapter}
                              </span>
                            )}
                          </div>

                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            v.status === 'published'
                              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                              : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                          }`}>
                            {v.status || 'published'}
                          </span>
                        </div>

                        <h4
                          onClick={() => setPreviewVideoModal(v)}
                          className="font-bold text-slate-900 dark:text-white text-sm sm:text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
                        >
                          {v.title}
                        </h4>

                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                          {v.description || 'Comprehensive video lecture with practical concept breakdowns and exam shortcuts.'}
                        </p>

                        {/* Instructor & Class info */}
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-semibold truncate max-w-[160px] text-slate-700 dark:text-slate-300">
                            {v.instructor || 'Visdom Waves Lead'}
                          </span>
                          <span className="text-[11px]">{v.classLevel || 'Intermediate'}</span>
                        </div>

                        {/* Tags */}
                        {Array.isArray(v.tags) && v.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2.5">
                            {v.tags.slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="p-4 pt-0 sm:p-5 sm:pt-0">
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setPreviewVideoModal(v)}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Play size={13} fill="currentColor" />
                          <span>Watch / Preview</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopyVideoLink(v.url, v.id || v._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Copy Video / Link URL"
                          >
                            <Copy size={15} className={copiedVideoId === (v.id || v._id) ? 'text-emerald-500' : ''} />
                          </button>

                          <button
                            onClick={() => setPreviewVideoModal(v)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Play / View in Same Window"
                          >
                            <ExternalLink size={15} />
                          </button>

                          <button
                            onClick={() => handleOpenEditVideo(v)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Edit Video / Link"
                          >
                            <Edit size={15} />
                          </button>

                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                type: 'video',
                                id: v.id || v._id,
                                title: v.title,
                              })
                            }
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Delete Video / Link"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredVideos.length === 0 && (
                <div className="col-span-full py-16 text-center text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8">
                  <Video size={42} className="mx-auto text-slate-400/60 mb-3" />
                  <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">No videos or links found</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Try adjusting your filters or search terms, or click &quot;Upload Video / Link&quot; to add new classroom YouTube lectures and resources.
                  </p>
                  <div className="flex items-center justify-center gap-3 mt-4">
                    <button
                      onClick={handleSeedVideos}
                      className="px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Sparkles size={14} />
                      <span>Seed Standard Videos</span>
                    </button>
                    <button
                      onClick={handleOpenAddVideo}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                    >
                      <Plus size={15} />
                      <span>Upload First Video</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 4: BOOKINGS & INQUIRIES
           ───────────────────────────────────────────────────────────── */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-sm dark:shadow-none flex items-center justify-between transition-colors duration-200">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Assessment & Demo Inquiries</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Requests submitted by students/parents for diagnostic assessment and 1-on-1 demo
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
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
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
                      <tr key={b._id || b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">{b.title}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {b.metadata?.email || b.metadata?.parentEmail || b.description}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                          {b.metadata?.goalArea || b.metadata?.subject || 'Diagnostic Math'}
                        </td>

                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                          {b.metadata?.gradeLevel || 'Intermediate'}
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={b.status || 'Pending'}
                            onChange={async (e) => {
                              const newStatus = e.target.value;
                              await updateAdminBookingApi(b._id || b.id, { status: newStatus });
                              showToast(`Booking status changed to ${newStatus}`);
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
                          {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'Recent'}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={async () => {
                              if (window.confirm('Delete this booking record?')) {
                                await deleteAdminBookingApi(b._id || b.id);
                                showToast('Booking deleted');
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
                        <td colSpan={6} className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                          No pending diagnostic assessments or bookings. Requests from the Booking modal appear here.
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
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Site Privacy Gate Controls */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/80 shadow-sm dark:shadow-none transition-colors duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Site Privacy Gate</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Manage confidential preview protection</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Authorized Master User</span>
                      <p className="text-[11px] text-slate-500">Master user authorized to unlock site</p>
                    </div>
                    <code className="text-red-600 dark:text-red-400 font-mono text-[11px] bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded border border-red-200 dark:border-red-500/20">
                      md@visdomwaves.com
                    </code>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Master Passcode</span>
                      <p className="text-[11px] text-slate-500">Confidential password for site preview</p>
                    </div>
                    <code className="text-amber-600 dark:text-amber-400 font-mono text-[11px] bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded border border-amber-200 dark:border-amber-500/20">
                      Md@1947
                    </code>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        localStorage.removeItem('site_privacy_access');
                        sessionStorage.removeItem('site_privacy_access');
                        showToast('Website privacy lock engaged. Access gate will show on next visit.');
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
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Backend & Database Status</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Live MongoDB connection and server metrics</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">API Health Status:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                      Online (200 OK)
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Database Engine:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-mono">MongoDB Atlas 8.12</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Total Registered Documents:</span>
                    <span className="text-slate-900 dark:text-white font-bold">{users.length + courses.length + bookings.length} Records</span>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={async () => {
                        const health = await checkApiHealth();
                        showToast(`Health Check: ${health.status.toUpperCase()}`);
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
                {userModalMode === 'create' ? 'Register New Student' : 'Edit Student Profile'}
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
                    onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
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
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
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
                    onChange={(e) => setUserForm({ ...userForm, mobileNumber: e.target.value })}
                    placeholder="9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium focus:bg-white dark:focus:bg-slate-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Account Password {userModalMode === 'edit' && '(Leave blank to keep)'}
                  </label>
                  <input
                    type="password"
                    required={userModalMode === 'create'}
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
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
                    onChange={(e) => setUserForm({ ...userForm, board: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer shadow-xs dark:shadow-none"
                  >
                    <option value="Andhra Pradesh Intermediate">Andhra Pradesh Intermediate (BIEAP)</option>
                    <option value="Telangana Intermediate">Telangana Intermediate (TSBIE)</option>
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
                    onChange={(e) => setUserForm({ ...userForm, year: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer shadow-xs dark:shadow-none"
                  >
                    <option value="First Year">First Year (Junior Inter)</option>
                    <option value="Second Year">Second Year (Senior Inter)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Junior College Name
                  </label>
                  <input
                    type="text"
                    value={userForm.collegeName}
                    onChange={(e) => setUserForm({ ...userForm, collegeName: e.target.value })}
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
                    onChange={(e) => setUserForm({ ...userForm, hallTicketNumber: e.target.value })}
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
                    onChange={(e) => setUserForm({ ...userForm, fatherName: e.target.value })}
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
                    onChange={(e) => setUserForm({ ...userForm, fatherMobile: e.target.value })}
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
                  {isLoading ? 'Saving...' : userModalMode === 'create' ? 'Register Student' : 'Save Changes'}
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
                {courseModalMode === 'create' ? 'Add Curriculum Topic / Course' : 'Edit Course'}
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
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
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
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
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
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
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
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
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
                    onChange={(e) => setCourseForm({ ...courseForm, lessonsCount: Number(e.target.value) })}
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
                    onChange={(e) => setCourseForm({ ...courseForm, durationWeeks: Number(e.target.value) })}
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
                  {isLoading ? 'Saving...' : courseModalMode === 'create' ? 'Publish Course' : 'Save Changes'}
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
              ? 'fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 overflow-hidden animate-in fade-in duration-200'
              : 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md overflow-hidden animate-in fade-in duration-150'
          }
        >
          <div
            className={
              isVideoFullScreen
                ? 'w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden'
                : 'relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 transition-all duration-200'
            }
          >
            {/* Hidden native file inputs for direct device uploading */}
            <input
              type="file"
              id="admin-video-file-input"
              accept="video/mp4,video/webm,video/quicktime,video/x-matroska,video/ogg,video/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleVideoFileSelect(e.target.files[0]);
              }}
            />
            <input
              type="file"
              id="admin-thumb-file-input"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleThumbFileSelect(e.target.files[0]);
              }}
            />

            {/* Studio Header (Sticky) */}
            <div className="shrink-0 px-5 sm:px-8 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
                  <Video size={20} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
                      {videoModalMode === 'create' ? 'Media Studio • Upload Video / Lecture' : 'Edit Video / Link Details'}
                    </h3>
                    <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      {isVideoFullScreen ? 'Full Screen Studio' : 'Modal View'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    Upload MP4 files directly from device, publish YouTube lectures, Drive notes or reference links
                  </p>
                </div>
              </div>

              {/* Controls: Full Screen Toggle + Close */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsVideoFullScreen((prev) => !prev)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-200 dark:border-slate-700 shadow-xs"
                  title={isVideoFullScreen ? 'Exit Full Screen Studio' : 'Open in Full Screen Studio'}
                >
                  {isVideoFullScreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                  <span className="hidden sm:inline">{isVideoFullScreen ? 'Exit Full Screen' : 'Full Screen'}</span>
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

            {/* Studio Form & Layout */}
            <form onSubmit={handleSaveVideo} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
                <div className={`grid grid-cols-1 ${isVideoFullScreen ? 'lg:grid-cols-12 gap-8 max-w-7xl mx-auto w-full' : 'lg:grid-cols-12 gap-6'}`}>
                  
                  {/* ─────────────────────────────────────────────────────────
                      LEFT COLUMN: MEDIA UPLOAD & LIVE PLAYER PREVIEW
                     ───────────────────────────────────────────────────────── */}
                  <div className={`${isVideoFullScreen ? 'lg:col-span-5' : 'lg:col-span-5'} space-y-5`}>
                    
                    {/* Live Preview Box */}
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Play size={13} className="text-red-500" />
                          <span>Live Player Preview</span>
                        </span>
                        {videoForm.url && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <CheckCircle2 size={11} />
                            <span>Link Connected</span>
                          </span>
                        )}
                      </div>

                      {/* Video Player Display */}
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center relative group">
                        {extractYouTubeId(videoForm.url) ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${extractYouTubeId(videoForm.url)}?autoplay=0`}
                            title="YouTube Preview"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full border-0"
                          />
                        ) : videoForm.url && (videoForm.type === 'video' || videoForm.url.match(/\.(mp4|webm|mov|ogg)$/i) || videoForm.url.includes('/uploads/')) ? (
                          <video
                            controls
                            src={videoForm.url}
                            className="w-full h-full object-contain bg-black"
                            poster={videoForm.thumbnailUrl || undefined}
                          >
                            Your browser does not support HTML5 video preview.
                          </video>
                        ) : videoForm.thumbnailUrl ? (
                          <div className="w-full h-full relative">
                            <img
                              src={videoForm.thumbnailUrl}
                              alt="Thumbnail preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <span className="p-3 rounded-full bg-red-600/90 text-white shadow-lg">
                                <Play size={20} fill="currentColor" />
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center p-6 text-slate-400">
                            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-2 border border-slate-700">
                              <Film size={22} />
                            </div>
                            <p className="text-xs font-bold text-slate-300">No Video Loaded Yet</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Upload a video file or paste a link below to preview live
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Uploaded File Info Badge */}
                      {videoUploadInfo && (
                        <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                            <div className="min-w-0">
                              <p className="font-bold text-emerald-700 dark:text-emerald-300 truncate">
                                {videoUploadInfo.originalName}
                              </p>
                              <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                                Size: {videoUploadInfo.sizeMb} MB • Ready on Visdom Waves Server
                              </p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold shrink-0">
                            Uploaded
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Direct Video File Upload Drag-and-Drop Zone */}
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                          <UploadCloud size={14} className="text-blue-500" />
                          <span>Video File Upload</span>
                        </label>
                        <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-0.5 rounded-lg text-[11px] font-bold">
                          <button
                            type="button"
                            onClick={() => setVideoSourceMode('upload')}
                            className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                              videoSourceMode === 'upload'
                                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                          >
                            Device Upload
                          </button>
                          <button
                            type="button"
                            onClick={() => setVideoSourceMode('url')}
                            className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                              videoSourceMode === 'url'
                                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                          >
                            URL Link
                          </button>
                        </div>
                      </div>

                      {videoSourceMode === 'upload' ? (
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setVideoDragOver(true);
                          }}
                          onDragLeave={() => setVideoDragOver(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setVideoDragOver(false);
                            if (e.dataTransfer.files?.[0]) handleVideoFileSelect(e.dataTransfer.files[0]);
                          }}
                          onClick={() => {
                            const input = document.getElementById('admin-video-file-input');
                            if (input) input.click();
                          }}
                          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                            videoDragOver
                              ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
                              : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 bg-white dark:bg-slate-900/60'
                          }`}
                        >
                          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3 border border-blue-200 dark:border-blue-500/20">
                            <Upload size={22} className={isUploadingVideo ? 'animate-bounce' : ''} />
                          </div>

                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            {isUploadingVideo ? 'Uploading Video to Server...' : 'Click to Browse or Drag Video Here'}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                            Supports MP4, WebM, MOV & MKV • Up to 500 MB
                          </p>

                          {/* Upload Progress Bar */}
                          {isUploadingVideo && (
                            <div className="mt-4 max-w-xs mx-auto">
                              <div className="flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
                                <span>Uploading...</span>
                                <span>{videoUploadProgress}%</span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-200"
                                  style={{ width: `${videoUploadProgress}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {!isUploadingVideo && (
                            <button
                              type="button"
                              className="mt-3 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all inline-flex items-center gap-1.5"
                            >
                              <Upload size={13} />
                              <span>Select Video File</span>
                            </button>
                          )}
                        </div>
                      ) : (
                        <div>
                          <input
                            type="url"
                            value={videoForm.url}
                            onChange={(e) => {
                              const newUrl = e.target.value;
                              const ytId = extractYouTubeId(newUrl);
                              setVideoForm((prev) => ({
                                ...prev,
                                url: newUrl,
                                type: ytId ? 'youtube' : prev.type,
                              }));
                            }}
                            placeholder="https://example.com/lecture.mp4 or direct stream link"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                          />
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                            Paste downloadable MP4 URL or direct streaming video address.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Thumbnail Upload & Preview */}
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                          <ImageIcon size={14} className="text-purple-500" />
                          <span>Custom Thumbnail Image</span>
                        </label>
                        {videoForm.thumbnailUrl && (
                          <button
                            type="button"
                            onClick={() => setVideoForm((prev) => ({ ...prev, thumbnailUrl: '' }))}
                            className="text-[10px] text-red-500 hover:underline font-bold"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-20 h-14 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 overflow-hidden shrink-0 flex items-center justify-center">
                          {videoForm.thumbnailUrl ? (
                            <img
                              src={videoForm.thumbnailUrl}
                              alt="Thumb"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon size={18} className="text-slate-500" />
                          )}
                        </div>

                        <div className="flex-1 space-y-1.5 min-w-0">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const input = document.getElementById('admin-thumb-file-input');
                                if (input) input.click();
                              }}
                              disabled={isUploadingThumb}
                              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                            >
                              <Upload size={12} />
                              <span>{isUploadingThumb ? `${thumbUploadProgress}%` : 'Upload Image'}</span>
                            </button>
                          </div>
                          <input
                            type="url"
                            value={videoForm.thumbnailUrl}
                            onChange={(e) => setVideoForm({ ...videoForm, thumbnailUrl: e.target.value })}
                            placeholder="Or paste image URL (https://...)"
                            className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ─────────────────────────────────────────────────────────
                      RIGHT COLUMN: METADATA & ACADEMIC ATTRIBUTES
                     ───────────────────────────────────────────────────────── */}
                  <div className={`${isVideoFullScreen ? 'lg:col-span-7' : 'lg:col-span-7'} space-y-4`}>
                    
                    {/* Resource Type Selector Pills */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                        Select Resource Type
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button
                          type="button"
                          onClick={() => setVideoForm((prev) => ({ ...prev, type: 'youtube' }))}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            videoForm.type === 'youtube'
                              ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/25'
                              : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                          <span>YouTube</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setVideoForm((prev) => ({ ...prev, type: 'video' }))}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            videoForm.type === 'video'
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/25'
                              : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <Film size={14} />
                          <span>Direct Video</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setVideoForm((prev) => ({ ...prev, type: 'drive' }))}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            videoForm.type === 'drive'
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/25'
                              : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <FileText size={14} />
                          <span>Drive / PDF</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setVideoForm((prev) => ({ ...prev, type: 'link' }))}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            videoForm.type === 'link'
                              ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/25'
                              : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <Link2 size={14} />
                          <span>Web Link</span>
                        </button>
                      </div>
                    </div>

                    {/* URL / Link Address Input (Always Editable) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        URL / Resource Address *
                      </label>
                      <input
                        type="url"
                        required
                        value={videoForm.url}
                        onChange={(e) => {
                          const newUrl = e.target.value;
                          const ytId = extractYouTubeId(newUrl);
                          setVideoForm((prev) => ({
                            ...prev,
                            url: newUrl,
                            type: ytId ? 'youtube' : prev.type,
                            thumbnailUrl: ytId && (!prev.thumbnailUrl || prev.thumbnailUrl.includes('youtube.com'))
                              ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
                              : prev.thumbnailUrl,
                          }));
                        }}
                        placeholder={
                          videoForm.type === 'youtube'
                            ? 'https://www.youtube.com/watch?v=... or https://youtu.be/...'
                            : videoForm.type === 'video'
                            ? 'Upload file on the left or paste https://... video URL'
                            : videoForm.type === 'drive'
                            ? 'https://drive.google.com/drive/folders/...'
                            : 'https://example.com/study-material'
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium focus:bg-white dark:focus:bg-slate-950"
                      />
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Video / Resource Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={videoForm.title}
                        onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                        placeholder="e.g. Mathematics 2A: Calculus & Differential Equations Complete Lecture"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium focus:bg-white dark:focus:bg-slate-950"
                      />
                    </div>

                    {/* Subject & Target Class */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Subject Stream
                        </label>
                        <select
                          value={videoForm.subject}
                          onChange={(e) => setVideoForm({ ...videoForm, subject: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer shadow-xs dark:shadow-none"
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
                          <option value="General">General / Platform Demo</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Target Intermediate Class
                        </label>
                        <select
                          value={videoForm.classLevel}
                          onChange={(e) => setVideoForm({ ...videoForm, classLevel: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer shadow-xs dark:shadow-none"
                        >
                          <option value="Intermediate 1st Year">Intermediate 1st Year (Junior)</option>
                          <option value="Intermediate 2nd Year">Intermediate 2nd Year (Senior)</option>
                          <option value="Both Years">Both Years (Comprehensive)</option>
                          <option value="All Levels">All Levels</option>
                        </select>
                      </div>
                    </div>

                    {/* Chapter & Educator */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Chapter / Unit Name
                        </label>
                        <input
                          type="text"
                          value={videoForm.chapter}
                          onChange={(e) => setVideoForm({ ...videoForm, chapter: e.target.value })}
                          placeholder="e.g. Calculus & Complex Numbers"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium focus:bg-white dark:focus:bg-slate-950"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Educator / Channel Name
                        </label>
                        <input
                          type="text"
                          value={videoForm.instructor}
                          onChange={(e) => setVideoForm({ ...videoForm, instructor: e.target.value })}
                          placeholder="e.g. Dr. S. K. Sharma / Visdom Waves Faculty"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium focus:bg-white dark:focus:bg-slate-950"
                        />
                      </div>
                    </div>

                    {/* Category & Duration */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Resource Category
                        </label>
                        <select
                          value={videoForm.linkType}
                          onChange={(e) => setVideoForm({ ...videoForm, linkType: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer shadow-xs dark:shadow-none"
                        >
                          <option value="Lecture Video">Full Lecture Video</option>
                          <option value="Revision Class">Speed Revision / Crash Course</option>
                          <option value="Formula Sheet & PDF">Formula Sheet & Handwritten Notes</option>
                          <option value="Lab Practical">Lab Practical & Simulator</option>
                          <option value="PYQ Solution">Board PYQ Solved Analysis</option>
                          <option value="Mock Exam">Online Practice Test</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                          Duration / Length
                        </label>
                        <input
                          type="text"
                          value={videoForm.duration}
                          onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                          placeholder="e.g. 45 mins / 1h 15m / PDF"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium focus:bg-white dark:focus:bg-slate-950"
                        />
                      </div>
                    </div>

                    {/* Summary */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Summary & Key Concepts
                      </label>
                      <textarea
                        rows={2}
                        value={videoForm.description}
                        onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                        placeholder="Outline of topics covered, 7-mark question proofs, board blueprints and key takeaways."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium focus:bg-white dark:focus:bg-slate-950"
                      />
                    </div>

                    {/* Search Tags */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Search Keywords / Tags (Comma Separated)
                      </label>
                      <input
                        type="text"
                        value={videoForm.tags}
                        onChange={(e) => setVideoForm({ ...videoForm, tags: e.target.value })}
                        placeholder="IPE 2026, 7 Marks, Calculus, Derivations"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium focus:bg-white dark:focus:bg-slate-950"
                      />
                    </div>

                    {/* Feature Toggle & Status */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={videoForm.isFeatured}
                          onChange={(e) => setVideoForm({ ...videoForm, isFeatured: e.target.checked })}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Feature on Student Demo & Hero section
                        </span>
                      </label>

                      <div className="flex items-center gap-3 text-xs font-bold">
                        <span className="text-slate-500">Status:</span>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="videoStatus"
                            value="published"
                            checked={videoForm.status === 'published'}
                            onChange={() => setVideoForm({ ...videoForm, status: 'published' })}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-emerald-600 dark:text-emerald-400">Published</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="videoStatus"
                            value="draft"
                            checked={videoForm.status === 'draft'}
                            onChange={() => setVideoForm({ ...videoForm, status: 'draft' })}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-amber-600 dark:text-amber-400">Draft</span>
                        </label>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Studio Action Footer (Always Sticky at Bottom) */}
              <div className="shrink-0 px-5 sm:px-8 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {videoForm.type.toUpperCase()}
                  </span>
                  <span>•</span>
                  <span>{videoForm.subject}</span>
                  {videoForm.duration && (
                    <>
                      <span>•</span>
                      <span>{videoForm.duration}</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsVideoFullScreen((prev) => !prev)}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    {isVideoFullScreen ? 'Exit Full Screen' : 'Full Screen View'}
                  </button>

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
                    className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isLoading ? (
                      <span>Saving...</span>
                    ) : isUploadingVideo ? (
                      <span>Uploading Video...</span>
                    ) : videoModalMode === 'create' ? (
                      <span>Publish Video / Link</span>
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
          MODAL: INTERACTIVE VIDEO & LINK PREVIEW PLAYER
         ───────────────────────────────────────────────────────────── */}
      {previewVideoModal && (() => {
        const isYt = previewVideoModal.type === 'youtube' || Boolean(previewVideoModal.youtubeId) || Boolean(extractYouTubeId(previewVideoModal.url));
        const ytId = previewVideoModal.youtubeId || extractYouTubeId(previewVideoModal.url);
        const isVid = previewVideoModal.type === 'video' || Boolean(
          previewVideoModal.url && (
            previewVideoModal.url.includes('/uploads/videos/') ||
            previewVideoModal.url.includes('/uploads/') ||
            previewVideoModal.url.startsWith('blob:') ||
            previewVideoModal.url.startsWith('data:video') ||
            /\.(mp4|webm|mov|mkv|ogg|ogv|m4v|avi|flv)(\?.*)?$/i.test(previewVideoModal.url)
          )
        );

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-6 text-left">
              {/* Top Close Bar */}
              <div className="p-4 sm:px-6 flex items-center justify-between border-b border-slate-800 bg-slate-900/90">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-600/20 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
                    {previewVideoModal.subject || 'Lecture'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium hidden sm:inline">•</span>
                  <span className="text-xs text-slate-300 font-semibold truncate max-w-sm">
                    {previewVideoModal.chapter || previewVideoModal.linkType || (isVid ? 'MP4 Video' : isYt ? 'YouTube Lecture' : 'Curriculum Resource')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyVideoLink(previewVideoModal.url, 'modal-preview')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Copy Link URL"
                  >
                    <Copy size={13} className={copiedVideoId === 'modal-preview' ? 'text-emerald-400' : ''} />
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
              <div className="w-full bg-black">
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
                      {previewVideoModal.type === 'drive' ? <FileText size={32} /> : <Link2 size={32} />}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 max-w-xl">{previewVideoModal.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-lg mb-6 leading-relaxed">
                      {previewVideoModal.description || 'Verified curriculum study material, blueprint notes or virtual lab portal.'}
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
                      {previewVideoModal.description || 'Comprehensive lecture with deep conceptual breakdown and board exam insights.'}
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
                  <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-semibold">
                    Faculty: <strong className="text-white">{previewVideoModal.instructor || 'Visdom Waves Lead'}</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-semibold">
                    Class: <strong className="text-white">{previewVideoModal.classLevel || 'Intermediate'}</strong>
                  </span>
                  {previewVideoModal.duration && (
                    <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-semibold">
                      Length: <strong className="text-white">{previewVideoModal.duration}</strong>
                    </span>
                  )}
                  {Array.isArray(previewVideoModal.tags) && previewVideoModal.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-800/60 text-slate-400 text-[11px]">
                      #{tag}
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
                {(viewUserDetail.fullName || viewUserDetail.name || 'ST')
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">{viewUserDetail.fullName || viewUserDetail.name}</h3>
                <p className="text-xs text-red-600 dark:text-red-400 font-bold">{viewUserDetail.role === 'admin' ? 'Administrator' : 'Student Scholar'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{viewUserDetail.email}</p>
              </div>
            </div>

            {/* Profile Grid */}
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Primary Mobile Phone:</span>
                <span className="font-bold text-slate-900 dark:text-white">{viewUserDetail.mobileNumber || viewUserDetail.phone || '—'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Board & Stream:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-300">{viewUserDetail.board || 'AP Intermediate'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Academic Year:</span>
                <span className="font-bold text-slate-900 dark:text-white">{viewUserDetail.year || 'First Year'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Junior College:</span>
                <span className="font-bold text-slate-900 dark:text-white">{viewUserDetail.collegeName || viewUserDetail.college || '—'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Hall Ticket Number:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{viewUserDetail.hallTicketNumber || 'Not entered yet'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Father / Guardian Name:</span>
                <span className="font-bold text-slate-900 dark:text-white">{viewUserDetail.fatherName || '—'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Parent Mobile:</span>
                <span className="font-bold text-slate-900 dark:text-white">{viewUserDetail.fatherMobile || '—'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Date of Birth:</span>
                <span className="font-bold text-slate-900 dark:text-white">{viewUserDetail.dob || '—'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Study Session:</span>
                <span className="font-bold text-slate-900 dark:text-white">{viewUserDetail.studyMonthYear || 'June, 2026'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Database Record ID:</span>
                <code className="text-slate-500 font-mono text-[10px]">{viewUserDetail._id || viewUserDetail.id}</code>
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
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">Confirm Deletion</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Are you sure you want to delete <span className="text-slate-900 dark:text-white font-semibold">&quot;{deleteConfirm.title}&quot;</span>? This action cannot be undone.
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
                  if (deleteConfirm.type === 'user') {
                    handleDeleteUser(deleteConfirm.id);
                  } else if (deleteConfirm.type === 'course') {
                    handleDeleteCourse(deleteConfirm.id);
                  } else if (deleteConfirm.type === 'video') {
                    handleDeleteVideo(deleteConfirm.id);
                  }
                }}
                disabled={isLoading}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 cursor-pointer transition-all"
              >
                {isLoading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
