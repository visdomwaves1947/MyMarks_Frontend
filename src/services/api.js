import { courses as fallbackCourses } from '../data/coursesData';
import { quickMathChallenges as fallbackChallenges } from '../data/quizData';

export const getApiBaseUrl = () => {
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
      return 'http://localhost:5000';
    }
  }
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  }
  return 'https://mymarks-backend.vercel.app';
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Check backend API health status
 */
export async function checkApiHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, {
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
    const res = await fetch(`${API_BASE_URL}/api/content${query}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }

    const data = await res.json();
    if (data.success && Array.isArray(data.data) && data.data.length > 0) {
      // Map MongoDB documents to the frontend course shape
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
      courses: category === 'all' ? fallbackCourses : fallbackCourses.filter(c => c.category === category),
      isLive: false,
    };
  } catch (error) {
    console.warn('[API] Fetch courses failed, using fallback data:', error.message);
    return {
      courses: category === 'all' ? fallbackCourses : fallbackCourses.filter(c => c.category === category),
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
    const res = await fetch(`${API_BASE_URL}/api/content?type=challenge`, {
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
    const res = await fetch(`${API_BASE_URL}/api/content`, {
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
    const res = await fetch(`${API_BASE_URL}/api/content/seed`, {
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
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
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
    if (baseUrl !== 'http://localhost:5000') {
      try {
        const localRes = await fetch(`http://localhost:5000/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });
        const localData = await localRes.json();
        if (localRes.ok && localData.success) {
          return localData;
        }
      } catch (e) {
        // Fallback failed, throw original error
      }
    }
    throw err;
  }
}

/**
 * User Registration API call
 */
export async function registerUserApi(userData) {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
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
    if (baseUrl !== 'http://localhost:5000') {
      try {
        const localRes = await fetch(`http://localhost:5000/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
        const localData = await localRes.json();
        if (localRes.ok && localData.success) {
          return localData;
        }
      } catch (e) {
        // Fallback failed, throw original error
      }
    }
    throw err;
  }
}

/**
 * ─────────────────────────────────────────────────────────────
 * ADMIN SERVICES: Real-time management for MyMarks Platform
 * ─────────────────────────────────────────────────────────────
 */

export const getAdminToken = () => {
  try {
    return (
      sessionStorage.getItem('mymarks_admin_token') ||
      localStorage.getItem('mymarks_admin_token') ||
      ''
    );
  } catch {
    return '';
  }
};

export const getAdminAuthHeaders = () => {
  const token = getAdminToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Login administrator with md@visdomwaves.com / Md@1947
 */
export async function loginAdminApi(credentials) {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Authentication failed');
    return data;
  } catch (err) {
    if (baseUrl !== 'http://localhost:5000') {
      const localRes = await fetch(`http://localhost:5000/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await localRes.json();
      if (!localRes.ok) throw new Error(data.message || 'Authentication failed');
      return data;
    }
    throw err;
  }
}

export async function fetchAdminStats() {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/admin/stats`);
    if (!res.ok) throw new Error(`Stats fetch failed (${res.status})`);
    return await res.json();
  } catch (err) {
    if (baseUrl !== 'http://localhost:5000') {
      try {
        const localRes = await fetch(`http://localhost:5000/api/admin/stats`);
        if (localRes.ok) return await localRes.json();
      } catch (e) {
        // Fallback
      }
    }
    return {
      success: false,
      error: err.message,
      stats: {
        totalUsers: 0,
        totalContent: 0,
        totalBookings: 0,
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
  const baseUrl = getApiBaseUrl();
  const query = new URLSearchParams(params).toString();
  const url = `${baseUrl}/api/admin/users${query ? `?${query}` : ''}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Users fetch failed (${res.status})`);
    return await res.json();
  } catch (err) {
    if (baseUrl !== 'http://localhost:5000') {
      try {
        const localRes = await fetch(`http://localhost:5000/api/admin/users${query ? `?${query}` : ''}`);
        if (localRes.ok) return await localRes.json();
      } catch (e) {
        // Fallback
      }
    }
    return { success: false, users: [], total: 0, error: err.message };
  }
}

export async function createAdminUserApi(userData) {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/admin/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Creation failed');
    return data;
  } catch (err) {
    if (baseUrl !== 'http://localhost:5000') {
      const localRes = await fetch(`http://localhost:5000/api/admin/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await localRes.json();
      if (!localRes.ok) throw new Error(data.message || 'Creation failed');
      return data;
    }
    throw err;
  }
}

export async function updateAdminUserApi(id, userData) {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Update failed');
    return data;
  } catch (err) {
    if (baseUrl !== 'http://localhost:5000') {
      const localRes = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await localRes.json();
      if (!localRes.ok) throw new Error(data.message || 'Update failed');
      return data;
    }
    throw err;
  }
}

export async function deleteAdminUserApi(id) {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/admin/users/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Deletion failed');
    return data;
  } catch (err) {
    if (baseUrl !== 'http://localhost:5000') {
      const localRes = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: 'DELETE',
      });
      const data = await localRes.json();
      if (!localRes.ok) throw new Error(data.message || 'Deletion failed');
      return data;
    }
    throw err;
  }
}

export async function fetchAdminBookings() {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/admin/bookings`);
    if (!res.ok) throw new Error(`Bookings fetch failed`);
    return await res.json();
  } catch (err) {
    if (baseUrl !== 'http://localhost:5000') {
      try {
        const localRes = await fetch(`http://localhost:5000/api/admin/bookings`);
        if (localRes.ok) return await localRes.json();
      } catch (e) {}
    }
    return { success: false, bookings: [] };
  }
}

export async function updateAdminBookingApi(id, updateData) {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/admin/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    return await res.json();
  } catch (err) {
    if (baseUrl !== 'http://localhost:5000') {
      const localRes = await fetch(`http://localhost:5000/api/admin/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      return await localRes.json();
    }
    throw err;
  }
}

export async function deleteAdminBookingApi(id) {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/admin/bookings/${id}`, {
      method: 'DELETE',
    });
    return await res.json();
  } catch (err) {
    if (baseUrl !== 'http://localhost:5000') {
      const localRes = await fetch(`http://localhost:5000/api/admin/bookings/${id}`, {
        method: 'DELETE',
      });
      return await localRes.json();
    }
    throw err;
  }
}

export async function createContentApi(contentData) {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contentData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create content');
    return data;
  } catch (err) {
    if (baseUrl !== 'http://localhost:5000') {
      const localRes = await fetch(`http://localhost:5000/api/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contentData),
      });
      const data = await localRes.json();
      if (!localRes.ok) throw new Error(data.message || 'Failed to create content');
      return data;
    }
    throw err;
  }
}

export async function updateContentApi(id, contentData) {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/content/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contentData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update content');
    return data;
  } catch (err) {
    if (baseUrl !== 'http://localhost:5000') {
      const localRes = await fetch(`http://localhost:5000/api/content/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contentData),
      });
      const data = await localRes.json();
      if (!localRes.ok) throw new Error(data.message || 'Failed to update content');
      return data;
    }
    throw err;
  }
}

export async function deleteContentApi(id) {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/content/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete content');
    return data;
  } catch (err) {
    if (baseUrl !== 'http://localhost:5000') {
      const localRes = await fetch(`http://localhost:5000/api/content/${id}`, {
        method: 'DELETE',
      });
      const data = await localRes.json();
      if (!localRes.ok) throw new Error(data.message || 'Failed to delete content');
      return data;
    }
    throw err;
  }
}


