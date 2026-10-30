import { courses as fallbackCourses } from '../data/coursesData';
import { quickMathChallenges as fallbackChallenges } from '../data/quizData';

export const LOCAL_API_URL = 'http://localhost:5000';
export const CLOUD_API_URL = 'https://mymarks-backend.vercel.app';

// Dynamic cache of working API URL
let activeApiUrl = null;

export const getApiBaseUrl = () => {
  // If running locally in browser (localhost / 127.0.0.1 / local network), prioritize local backend
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host.startsWith('192.168.') ||
      host.startsWith('10.') ||
      host.startsWith('172.') ||
      host.endsWith('.local')
    ) {
      return LOCAL_API_URL;
    }
  }

  if (activeApiUrl) return activeApiUrl;

  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  }

  return CLOUD_API_URL;
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Resilient fetcher with automatic failover between local server and cloud Vercel backend.
 */
export async function resilientFetch(path, options = {}) {
  const isLocalHost = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );

  const primaryBase = isLocalHost ? LOCAL_API_URL : getApiBaseUrl();
  const secondaryBase = primaryBase === LOCAL_API_URL ? CLOUD_API_URL : LOCAL_API_URL;

  const url1 = `${primaryBase}${path}`;
  const url2 = `${secondaryBase}${path}`;

  try {
    const res = await fetch(url1, options);
    if (res.ok) {
      if (!isLocalHost) activeApiUrl = primaryBase;
      return res;
    }
    // Only failover to secondary if primary gave a server 500 error AND we are not local
    if (res.status >= 500 && !isLocalHost && primaryBase !== secondaryBase) {
      try {
        const altRes = await fetch(url2, options);
        if (altRes.ok) {
          activeApiUrl = secondaryBase;
          return altRes;
        }
      } catch (e) {}
    }
    return res;
  } catch (err) {
    // Network / connection refused error on primary, try secondary if not on local dev server
    if (!isLocalHost && !path.includes('/upload')) {
      try {
        const altRes = await fetch(url2, options);
        if (altRes.ok) {
          activeApiUrl = secondaryBase;
          return altRes;
        }
        return altRes;
      } catch (altErr) {}
    }
    throw err;
  }
}

/**
 * Check backend API health status
 */
export async function checkApiHealth() {
  try {
    const res = await resilientFetch('/api/health', {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API] Health check warning:', err.message);
    return { status: 'offline', error: err.message };
  }
}

/**
 * Fetch curriculum courses from backend with fallback
 */
export async function fetchCourses(category = 'all') {
  try {
    const query = category && category !== 'all' ? `?type=course&category=${category}` : '?type=course';
    const res = await resilientFetch(`/api/content${query}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }

    const data = await res.json();
    if (data.success && Array.isArray(data.data) && data.data.length > 0) {
      return {
        courses: data.data.map((c) => ({
          id: c._id || c.id || c.slug,
          category: c.category || 'all',
          level: c.level || 'All Levels',
          title: c.title,
          description: c.description,
          tag: c.tag || 'Popular',
          tagColor: c.tagColor || 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
          rating: c.rating || 4.9,
          reviewsCount: c.reviewsCount || 1000,
          lessonsCount: c.lessonsCount || 36,
          durationWeeks: c.durationWeeks || 12,
          studentsCount: c.studentsCount || '3,000+',
          instructor: c.instructor?.name || 'Faculty Lead',
          instructorTitle: c.instructor?.title || 'Senior Mathematics Educator',
          skills: c.skills || [],
          popular: !!c.popular,
        })),
        isLive: true,
      };
    }

    // If backend collection is empty, trigger seed in background
    triggerSeed().catch(() => {});

    return {
      courses: category === 'all' ? fallbackCourses : fallbackCourses.filter((c) => c.category === category),
      isLive: false,
    };
  } catch (error) {
    console.warn('[API] Fetch courses failed, using fallback data:', error.message);
    return {
      courses: category === 'all' ? fallbackCourses : fallbackCourses.filter((c) => c.category === category),
      isLive: false,
      error: error.message,
    };
  }
}

/**
 * Fetch quick math quiz challenges from backend with fallback
 */
export async function fetchChallenges() {
  try {
    const res = await resilientFetch('/api/content?type=challenge', {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) throw new Error(`API returned status ${res.status}`);

    const data = await res.json();
    if (data.success && Array.isArray(data.data) && data.data.length > 0) {
      return {
        challenges: data.data.map((item, idx) => ({
          id: item._id || item.id || idx + 1,
          category: item.category || 'Speed Mental Math',
          question: item.quizData?.question || item.title,
          options: item.quizData?.options || ['Option A', 'Option B', 'Option C', 'Option D'],
          correct: item.quizData?.correctAnswerIndex ?? 0,
          hint: item.quizData?.hint || 'Think step by step.',
          difficulty: item.quizData?.difficulty || 'Medium',
          points: item.quizData?.points || 100,
        })),
        isLive: true,
      };
    }

    return {
      challenges: fallbackChallenges,
      isLive: false,
    };
  } catch (error) {
    console.warn('[API] Fetch challenges failed, using fallback data:', error.message);
    return {
      challenges: fallbackChallenges,
      isLive: false,
    };
  }
}

/**
 * Submit booking / diagnostic assessment to backend
 */
export async function submitBooking(bookingData) {
  try {
    const res = await resilientFetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `Assessment Booking: ${bookingData.studentName}`,
        type: 'general',
        category: 'booking',
        description: `Booking request for ${bookingData.gradeLevel} - ${bookingData.goalArea}`,
        metadata: {
          ...bookingData,
          submittedAt: new Date().toISOString(),
        },
      }),
    });

    const data = await res.json();
    return { success: res.ok, data };
  } catch (error) {
    console.warn('[API] Booking submission fallback:', error.message);
    return { success: true, localOnly: true };
  }
}

/**
 * Auto-seed backend with initial academy content if needed
 */
export async function triggerSeed() {
  try {
    const res = await resilientFetch('/api/content/seed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return await res.json();
  } catch (err) {
    console.warn('[API] Seed request failed:', err.message);
    return null;
  }
}

/**
 * User Login API call
 */
export async function loginUserApi(credentials) {
  try {
    const res = await resilientFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Login failed');
    }
    return data;
  } catch (err) {
    throw err;
  }
}

/**
 * User Registration API call
 */
export async function registerUserApi(userData) {
  try {
    const res = await resilientFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Registration failed');
    }
    return data;
  } catch (err) {
    throw err;
  }
}

/**
 * Admin Login API call
 */
export async function loginAdminApi(credentials) {
  try {
    const res = await resilientFetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Admin authentication failed');
    }
    return data;
  } catch (err) {
    throw err;
  }
}

export async function fetchAdminStats() {
  try {
    const res = await resilientFetch('/api/admin/stats');
    if (!res.ok) throw new Error(`Stats fetch failed (${res.status})`);
    return await res.json();
  } catch (err) {
    console.warn('[API] Stats fetch warning:', err.message);
    return {
      success: false,
      error: err.message,
      stats: {
        totalUsers: 0,
        totalContent: 0,
        totalBookings: 0,
        totalVideos: 0,
        serverUptime: 0,
        boardDistribution: [],
        yearDistribution: [],
      },
      recentUsers: [],
      recentBookings: [],
    };
  }
}

export async function fetchAdminUsers(params = {}) {
  const query = new URLSearchParams(params).toString();
  const path = `/api/admin/users${query ? `?${query}` : ''}`;
  try {
    const res = await resilientFetch(path);
    if (!res.ok) throw new Error(`Users fetch failed (${res.status})`);
    return await res.json();
  } catch (err) {
    return { success: false, users: [], total: 0, error: err.message };
  }
}

export async function createAdminUserApi(userData) {
  try {
    const res = await resilientFetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Creation failed');
    return data;
  } catch (err) {
    throw err;
  }
}

export async function updateAdminUserApi(id, userData) {
  try {
    const res = await resilientFetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Update failed');
    return data;
  } catch (err) {
    throw err;
  }
}

export async function deleteAdminUserApi(id) {
  try {
    const res = await resilientFetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Deletion failed');
    return data;
  } catch (err) {
    throw err;
  }
}

export async function fetchAdminBookings() {
  try {
    const res = await resilientFetch('/api/admin/bookings');
    if (!res.ok) throw new Error('Bookings fetch failed');
    return await res.json();
  } catch (err) {
    return { success: false, bookings: [] };
  }
}

export async function updateAdminBookingApi(id, updateData) {
  try {
    const res = await resilientFetch(`/api/admin/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    return await res.json();
  } catch (err) {
    throw err;
  }
}

export async function deleteAdminBookingApi(id) {
  try {
    const res = await resilientFetch(`/api/admin/bookings/${id}`, {
      method: 'DELETE',
    });
    return await res.json();
  } catch (err) {
    throw err;
  }
}

export async function createContentApi(contentData) {
  try {
    const res = await resilientFetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contentData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create content');
    return data;
  } catch (err) {
    throw err;
  }
}

export async function updateContentApi(id, contentData) {
  try {
    const res = await resilientFetch(`/api/content/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contentData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update content');
    return data;
  } catch (err) {
    throw err;
  }
}

export async function deleteContentApi(id) {
  try {
    const res = await resilientFetch(`/api/content/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete content');
    return data;
  } catch (err) {
    throw err;
  }
}

/**
 * ========================================================
 * VIDEOS, YOUTUBE & RESOURCE LINKS APIs
 * ========================================================
 */

export const fallbackVideos = [
  {
    _id: 'vid-01',
    id: 'vid-01',
    title: 'Visdom Waves - Live Classroom Tour & Whiteboard Demo',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    type: 'youtube',
    subject: 'General',
    board: 'Both Boards',
    classLevel: 'All Levels',
    year: 'Both Years',
    chapter: 'Interactive Learning Platform',
    topicName: 'Platform Overview & Live Learning',
    lesson: 'Lesson 1: Platform Tour',
    lessonName: 'Lesson 1: Platform Tour',
    description: 'Walkthrough of Visdom Waves live 1-on-1 personalized learning dashboard, real-time whiteboarding, and doubt-solving session.',
    duration: '12 mins',
    instructor: 'Visdom Waves Lead',
    keywords: ['Platform Demo', 'Classroom Tour', 'Visdom Waves', 'Live Learning'],
    tags: ['Platform Demo', 'Classroom Tour', 'Visdom Waves'],
    linkType: 'Lecture Video',
    isFeatured: true,
    isPremium: false,
    status: 'published',
    viewsCount: 1420,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'vid-02',
    id: 'vid-02',
    title: 'Mathematics 1A: Functions & Domains Complete Breakdown',
    url: 'https://www.youtube.com/watch?v=fNk_zzaMoSs',
    youtubeId: 'fNk_zzaMoSs',
    embedUrl: 'https://www.youtube.com/embed/fNk_zzaMoSs',
    thumbnailUrl: 'https://img.youtube.com/vi/fNk_zzaMoSs/hqdefault.jpg',
    type: 'youtube',
    subject: 'Mathematics',
    board: 'Both Boards',
    classLevel: 'Intermediate 1st Year',
    year: '1st Year',
    chapter: 'Functions',
    topicName: 'Functions, Domains & Ranges',
    lesson: 'Lesson 1: Injective & Surjective Mappings',
    lessonName: 'Lesson 1: Injective & Surjective Mappings',
    description: 'Master injective, surjective, and bijective mappings, domain and range calculations with 7-mark IPE Board exam shortcuts.',
    duration: '48 mins',
    instructor: 'Dr. S. K. Sharma',
    keywords: ['Maths 1A', 'Functions', 'IPE 2026', '7 Marks Guaranteed', 'Domains'],
    tags: ['Maths 1A', 'Functions', 'IPE 2026', '7 Marks Guaranteed'],
    linkType: 'Lecture Video',
    isFeatured: true,
    isPremium: false,
    status: 'published',
    viewsCount: 980,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'vid-02b',
    id: 'vid-02b',
    title: 'Mathematics 2A: Complex Numbers & De Moivre Theorem',
    url: 'https://www.youtube.com/watch?v=fNk_zzaMoSs',
    youtubeId: 'fNk_zzaMoSs',
    embedUrl: 'https://www.youtube.com/embed/fNk_zzaMoSs',
    thumbnailUrl: 'https://img.youtube.com/vi/fNk_zzaMoSs/hqdefault.jpg',
    type: 'youtube',
    subject: 'Mathematics',
    board: 'Both Boards',
    classLevel: 'Intermediate 2nd Year',
    year: '2nd Year',
    chapter: 'Complex Numbers',
    topicName: 'Complex Numbers & De Moivre Theorem',
    lesson: 'Lesson 2: De Moivre Theorem Proofs',
    lessonName: 'Lesson 2: De Moivre Theorem Proofs',
    description: 'Master nth roots of unity, modulus-amplitude form, and 7-mark senior intermediate board exam problems.',
    duration: '52 mins',
    instructor: 'Dr. S. K. Sharma',
    keywords: ['Maths 2A', 'Complex Numbers', 'De Moivre', 'Senior Inter', 'Roots of Unity'],
    tags: ['Maths 2A', 'Complex Numbers', 'De Moivre', 'Senior Inter'],
    linkType: 'Lecture Video',
    isFeatured: true,
    isPremium: true,
    status: 'published',
    viewsCount: 840,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'vid-03',
    id: 'vid-03',
    title: 'Physics 1st Year: Motion in a Plane & Projectile Motion Derivations',
    url: 'https://www.youtube.com/watch?v=bHIhgxav9LY',
    youtubeId: 'bHIhgxav9LY',
    embedUrl: 'https://www.youtube.com/embed/bHIhgxav9LY',
    thumbnailUrl: 'https://img.youtube.com/vi/bHIhgxav9LY/hqdefault.jpg',
    type: 'youtube',
    subject: 'Physics',
    board: 'Both Boards',
    classLevel: 'Intermediate 1st Year',
    year: '1st Year',
    chapter: 'Kinematics',
    lesson: 'Lesson 3: Projectile Motion',
    description: 'Detailed derivations of trajectory of projectile, maximum height, time of flight, and horizontal range for Board and JEE Foundation.',
    duration: '42 mins',
    instructor: 'Prof. Ananya Rao',
    tags: ['Physics 1', 'Kinematics', 'Projectile Motion', 'Derivations'],
    linkType: 'Lecture Video',
    isFeatured: true,
    isPremium: false,
    status: 'published',
    viewsCount: 1120,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'vid-04',
    id: 'vid-04',
    title: 'Chemistry: Chemical Bonding & Molecular Orbital Theory (MOT)',
    url: 'https://www.youtube.com/watch?v=jQUrfmX0uko',
    youtubeId: 'jQUrfmX0uko',
    embedUrl: 'https://www.youtube.com/embed/jQUrfmX0uko',
    thumbnailUrl: 'https://img.youtube.com/vi/jQUrfmX0uko/hqdefault.jpg',
    type: 'youtube',
    subject: 'Chemistry',
    board: 'Both Boards',
    classLevel: 'Intermediate 1st Year',
    year: '1st Year',
    chapter: 'Chemical Bonding',
    lesson: 'Lesson 2: Hybridization & MOT',
    description: 'Learn hybridization (sp, sp2, sp3), VSEPR theory shapes, and MOT energy diagrams for N2 and O2 molecules.',
    duration: '55 mins',
    instructor: 'Dr. V. Murthy',
    tags: ['Chemistry', 'MOT', 'Hybridization', 'VSEPR'],
    linkType: 'Lecture Video',
    isFeatured: false,
    isPremium: false,
    status: 'published',
    viewsCount: 760,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'vid-05',
    id: 'vid-05',
    title: 'Official AP/TS Intermediate Board Previous Year Question Papers (Drive)',
    url: 'https://drive.google.com/drive/folders/mymarks-ipe-pyq-resources',
    type: 'drive',
    subject: 'General',
    board: 'Both Boards',
    classLevel: 'Both Years',
    year: 'Both Years',
    chapter: 'Board Question Bank',
    lesson: 'Resource: Solved Question Bank',
    description: 'Comprehensive 10-year solved IPE Question Papers with blueprint marks weightage for MPC, BiPC, CEC, and MEC streams.',
    duration: 'PDF Drive',
    instructor: 'Curriculum Council',
    tags: ['Question Bank', 'PDF Notes', 'IPE Blueprint', 'Official'],
    linkType: 'Notes & PDF',
    isFeatured: true,
    isPremium: false,
    status: 'published',
    viewsCount: 2340,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'vid-06',
    id: 'vid-06',
    title: 'Physics Lab Virtual Simulator: Vernier Caliper & Screw Gauge',
    url: 'https://amrita.olabs.edu.in/?sub=1&brch=4&sim=22&cnt=1',
    type: 'link',
    subject: 'Physics',
    board: 'Both Boards',
    classLevel: 'Intermediate 1st Year',
    year: '1st Year',
    chapter: 'Lab Practicals',
    lesson: 'Lab 1: Vernier Caliper & Zero Error',
    description: 'Interactive virtual laboratory simulation to measure zero error, pitch, and least count with real-time digital calculations.',
    duration: 'Interactive',
    instructor: 'Lab Innovations Team',
    tags: ['Practicals', 'Lab Simulator', 'Screw Gauge', 'Interactive'],
    linkType: 'Study Material',
    isFeatured: true,
    isPremium: false,
    status: 'published',
    viewsCount: 890,
    createdAt: new Date().toISOString(),
  },
];

export async function fetchAdminVideos(params = {}) {
  const query = new URLSearchParams(params).toString();
  const path = `/api/videos${query ? `?${query}` : ''}`;
  try {
    const res = await resilientFetch(path);
    if (!res.ok) throw new Error(`Videos fetch failed (${res.status})`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data) && data.data.length > 0) {
      return data;
    }
    // If backend collection is empty, try seeding in background
    seedAdminVideosApi().catch(() => {});
    return {
      success: true,
      data: fallbackVideos,
      count: fallbackVideos.length,
      total: fallbackVideos.length,
      isLocalFallback: true,
    };
  } catch (err) {
    console.warn('[API] Using fallback videos data:', err.message);
    return {
      success: true,
      data: fallbackVideos,
      count: fallbackVideos.length,
      total: fallbackVideos.length,
      isLocalFallback: true,
      error: err.message,
    };
  }
}

// In-memory cache & in-flight deduplication for student videos
const studentVideosCache = new Map();
const inFlightVideoRequests = new Map();

export function clearStudentVideosCache() {
  studentVideosCache.clear();
  inFlightVideoRequests.clear();
}

if (typeof window !== 'undefined') {
  window.addEventListener('mymarks_video_updated', clearStudentVideosCache);
}

/**
 * Fetch published videos specifically for student dashboard and curriculum modules
 */
export async function fetchStudentVideos(params = {}) {
  const searchParams = { ...params, publishedOnly: 'true', studentView: 'true' };
  const query = new URLSearchParams(searchParams).toString();
  const path = `/api/videos${query ? `?${query}` : ''}`;

  // 30-second cache to prevent repeat API bursts on re-renders
  const cached = studentVideosCache.get(path);
  if (cached && Date.now() - cached.timestamp < 30000) {
    return cached.data;
  }

  // Deduplicate concurrent requests in flight
  if (inFlightVideoRequests.has(path)) {
    return inFlightVideoRequests.get(path);
  }

  const fetchPromise = (async () => {
    try {
      const res = await resilientFetch(path);
      if (!res.ok) throw new Error(`Student videos fetch failed (${res.status})`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        studentVideosCache.set(path, { data: data.data, timestamp: Date.now() });
        return data.data;
      }
      return fallbackVideos.filter(v => v.status === 'published');
    } catch (err) {
      console.warn('[API] Falling back to published local fallback videos:', err.message);
      return fallbackVideos.filter(v => v.status === 'published');
    } finally {
      inFlightVideoRequests.delete(path);
    }
  })();

  inFlightVideoRequests.set(path, fetchPromise);
  return fetchPromise;
}

export async function createAdminVideoApi(videoData) {
  try {
    const token = localStorage.getItem('mymarks_admin_token') || sessionStorage.getItem('mymarks_admin_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await resilientFetch('/api/videos', {
      method: 'POST',
      headers,
      body: JSON.stringify(videoData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to upload video/link');
    clearStudentVideosCache();
    return data;
  } catch (err) {
    throw err;
  }
}

export async function updateAdminVideoApi(id, videoData) {
  try {
    const token = localStorage.getItem('mymarks_admin_token') || sessionStorage.getItem('mymarks_admin_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await resilientFetch(`/api/videos/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(videoData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update video/link');
    clearStudentVideosCache();
    return data;
  } catch (err) {
    throw err;
  }
}

export async function toggleAdminVideoStatusApi(id, status) {
  try {
    const token = localStorage.getItem('mymarks_admin_token') || sessionStorage.getItem('mymarks_admin_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await resilientFetch(`/api/videos/${id}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to toggle status');
    clearStudentVideosCache();
    return data;
  } catch (err) {
    throw err;
  }
}

export async function deleteAdminVideoApi(id) {
  try {
    const token = localStorage.getItem('mymarks_admin_token') || sessionStorage.getItem('mymarks_admin_token');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await resilientFetch(`/api/videos/${id}`, {
      method: 'DELETE',
      headers,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete video');
    clearStudentVideosCache();
    return data;
  } catch (err) {
    throw err;
  }
}

export async function seedAdminVideosApi() {
  try {
    const res = await resilientFetch('/api/videos/seed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videos: fallbackVideos }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('[API] Video seed fallback:', err.message);
    return { success: true, seeded: true, isLocalFallback: true };
  }
}

export async function uploadMediaFileApi(file, onProgress) {
  const baseUrl = getApiBaseUrl();
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('mymarks_admin_token') || sessionStorage.getItem('mymarks_admin_token');

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    // Use /api/videos/upload with fallback to /api/upload
    xhr.open('POST', `${baseUrl}/api/videos/upload`);

    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    if (xhr.upload && typeof onProgress === 'function') {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText || '{}');
        if (xhr.status >= 200 && xhr.status < 300 && data.success) {
          resolve(data);
        } else if (xhr.status === 404) {
          // Retry with /api/upload alias
          const retryXhr = new XMLHttpRequest();
          retryXhr.open('POST', `${baseUrl}/api/upload`);
          if (token) retryXhr.setRequestHeader('Authorization', `Bearer ${token}`);
          retryXhr.onload = () => {
            try {
              const retryData = JSON.parse(retryXhr.responseText || '{}');
              if (retryXhr.status >= 200 && retryXhr.status < 300) {
                resolve(retryData);
              } else {
                throw new Error(retryData.message || 'Upload failed');
              }
            } catch (err) {
              fallbackDataUrl(file, resolve, reject);
            }
          };
          retryXhr.onerror = () => fallbackDataUrl(file, resolve, reject);
          retryXhr.send(formData);
        } else {
          // If server upload failed, fallback to local data URL for preview
          fallbackDataUrl(file, resolve, reject);
        }
      } catch (e) {
        fallbackDataUrl(file, resolve, reject);
      }
    };

    xhr.onerror = () => {
      fallbackDataUrl(file, resolve, reject);
    };

    xhr.send(formData);
  });
}

function fallbackDataUrl(file, resolve, reject) {
  const reader = new FileReader();
  reader.onload = () => {
    resolve({
      success: true,
      data: {
        url: reader.result,
        relativeUrl: reader.result,
        name: file.name,
        originalName: file.name,
        mimetype: file.type,
        size: file.size,
      },
    });
  };
  reader.onerror = (err) => reject(err);
  reader.readAsDataURL(file);
}


/**
 * Submit Contact Us inquiry to MongoDB Atlas via backend API (/api/contact)
 */
export async function submitContactMessage(contactData) {
  const payload = {
    name: contactData.name?.trim(),
    email: contactData.email?.trim().toLowerCase(),
    phone: contactData.phone ? String(contactData.phone).replace(/\D/g, '') : '',
    subject: contactData.subject || 'General Inquiry',
    message: contactData.message?.trim(),
    metadata: {
      submittedAt: new Date().toISOString(),
      clientPlatform: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    },
  };

  try {
    const res = await resilientFetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || `Server returned error (${res.status})`);
    }

    return { success: true, data };
  } catch (err) {
    // Failover to /api/content if /api/contact is unavailable
    try {
      const fallbackRes = await resilientFetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Contact Inquiry: ${payload.name}`,
          type: 'general',
          category: 'contact',
          description: `Subject: ${payload.subject} | Phone: ${payload.phone}`,
          contentBody: payload.message,
          metadata: payload,
        }),
      });
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json().catch(() => ({}));
        return { success: true, data: fallbackData };
      }
    } catch (fallbackErr) {
      console.warn('[API] Fallback also failed:', fallbackErr.message);
    }
    throw err;
  }
}

/**
 * Fetch all contact inquiries from MongoDB (for Admin dashboard)
 */
export async function fetchContactMessages(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await resilientFetch(`/api/contact${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error(`Failed to load contact messages (${res.status})`);
    return await res.json();
  } catch (err) {
    console.error('[API] fetchContactMessages error:', err.message);
    return { success: false, contacts: [], count: 0 };
  }
}

/**
 * Update contact inquiry status in MongoDB
 */
export async function updateContactStatusApi(id, status, note = '') {
  const res = await resilientFetch(`/api/contact/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, note }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Failed to update contact status');
  return data;
}

/**
 * Delete a contact message from MongoDB
 */
export async function deleteContactMessageApi(id) {
  const res = await resilientFetch(`/api/contact/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Failed to delete contact inquiry');
  return data;
}



