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
    classLevel: 'All Levels',
    chapter: 'Interactive Learning Platform',
    description: 'Walkthrough of Visdom Waves live 1-on-1 personalized learning dashboard, real-time whiteboarding, and doubt-solving session.',
    duration: '12 mins',
    instructor: 'Visdom Waves Lead',
    tags: ['Platform Demo', 'Classroom Tour', 'Visdom Waves'],
    linkType: 'Lecture Video',
    isFeatured: true,
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
    classLevel: 'Intermediate 1st Year',
    chapter: 'Functions',
    description: 'Master injective, surjective, and bijective mappings, domain and range calculations with 7-mark IPE Board exam shortcuts.',
    duration: '48 mins',
    instructor: 'Dr. S. K. Sharma',
    tags: ['Maths 1A', 'Functions', 'IPE 2026', '7 Marks Guaranteed'],
    linkType: 'Lecture Video',
    isFeatured: true,
    status: 'published',
    viewsCount: 980,
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
    classLevel: 'Intermediate 1st Year',
    chapter: 'Kinematics',
    description: 'Detailed derivations of trajectory of projectile, maximum height, time of flight, and horizontal range for Board and JEE Foundation.',
    duration: '42 mins',
    instructor: 'Prof. Ananya Rao',
    tags: ['Physics 1', 'Kinematics', 'Projectile Motion', 'Derivations'],
    linkType: 'Lecture Video',
    isFeatured: true,
    status: 'published',
    viewsCount: 1120,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'vid-04',
    id: 'vid-04',
    title: 'Chemistry: Chemical Bonding & Molecular Orbital Theory (MOT)',
    url: 'https://www.youtube.com/watch?v=WUvTyaaNjfo',
    youtubeId: 'WUvTyaaNjfo',
    embedUrl: 'https://www.youtube.com/embed/WUvTyaaNjfo',
    thumbnailUrl: 'https://img.youtube.com/vi/WUvTyaaNjfo/hqdefault.jpg',
    type: 'youtube',
    subject: 'Chemistry',
    classLevel: 'Intermediate 1st Year',
    chapter: 'Chemical Bonding',
    description: 'Learn hybridization (sp, sp2, sp3), VSEPR theory shapes, and MOT energy diagrams for N2 and O2 molecules.',
    duration: '55 mins',
    instructor: 'Dr. V. Murthy',
    tags: ['Chemistry', 'MOT', 'Hybridization', 'VSEPR'],
    linkType: 'Lecture Video',
    isFeatured: false,
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
    classLevel: 'Both Years',
    chapter: 'Board Question Bank',
    description: 'Comprehensive 10-year solved IPE Question Papers with blueprint marks weightage for MPC, BiPC, CEC, and MEC streams.',
    duration: 'PDF Drive',
    instructor: 'Curriculum Council',
    tags: ['Question Bank', 'PDF Notes', 'IPE Blueprint', 'Official'],
    linkType: 'Notes & PDF',
    isFeatured: true,
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
    classLevel: 'Intermediate 1st Year',
    chapter: 'Lab Practicals',
    description: 'Interactive virtual laboratory simulation to measure zero error, pitch, and least count with real-time digital calculations.',
    duration: 'Interactive',
    instructor: 'Lab Innovations Team',
    tags: ['Practicals', 'Lab Simulator', 'Screw Gauge', 'Interactive'],
    linkType: 'Study Material',
    isFeatured: true,
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

export async function createAdminVideoApi(videoData) {
  try {
    const res = await resilientFetch('/api/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(videoData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to upload video/link');
    return data;
  } catch (err) {
    throw err;
  }
}

export async function updateAdminVideoApi(id, videoData) {
  try {
    const res = await resilientFetch(`/api/videos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(videoData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update video/link');
    return data;
  } catch (err) {
    throw err;
  }
}

export async function deleteAdminVideoApi(id) {
  try {
    const res = await resilientFetch(`/api/videos/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete video');
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

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${baseUrl}/api/upload`);

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
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data);
        } else {
          // If server upload endpoint is not available, provide fallback data URL
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              success: true,
              data: { url: reader.result, name: file.name },
            });
          };
          reader.onerror = () => reject(new Error(data.message || 'Upload failed'));
          reader.readAsDataURL(file);
        }
      } catch (e) {
        // Fallback to data URL
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            success: true,
            data: { url: reader.result, name: file.name },
          });
        };
        reader.onerror = () => reject(e);
        reader.readAsDataURL(file);
      }
    };

    xhr.onerror = () => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof onProgress === 'function') onProgress(100);
        resolve({
          success: true,
          data: { url: reader.result, name: file.name },
        });
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    };

    xhr.send(formData);
  });
}

export async function submitContactMessage(contactData) {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `Contact Inquiry: ${contactData.name}`,
        type: 'general',
        category: 'contact',
        description: `Subject: ${contactData.subject || 'General Inquiry'} | Rating: ${contactData.rating || 5}`,
        metadata: {
          ...contactData,
          submittedAt: new Date().toISOString(),
        },
      }),
    });
    const data = await res.json().catch(() => ({}));
    return { success: true, data };
  } catch (err) {
    if (baseUrl !== 'http://localhost:5000') {
      try {
        const localRes = await fetch('http://localhost:5000/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `Contact Inquiry: ${contactData.name}`,
            type: 'general',
            category: 'contact',
            description: `Subject: ${contactData.subject || 'General Inquiry'} | Rating: ${contactData.rating || 5}`,
            metadata: {
              ...contactData,
              submittedAt: new Date().toISOString(),
            },
          }),
        });
        const localData = await localRes.json().catch(() => ({}));
        return { success: true, data: localData };
      } catch (localErr) {
        console.warn('[API] Contact submission local fallback:', localErr.message);
      }
    }
    console.warn('[API] Contact submission fallback:', err.message);
    return { success: true, localOnly: true };
  }
}


