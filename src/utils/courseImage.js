export const DEFAULT_COURSE_IMAGE = '/auth-bg.jpg';

const CLOUDINARY_UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/;

/**
 * Asks Cloudinary for a copy no wider than needed, in the lightest format the browser
 * can show. Images stored anywhere else are returned unchanged.
 */
export function courseImage(url, width = 800) {
  if (!url) return DEFAULT_COURSE_IMAGE;
  const match = url.match(CLOUDINARY_UPLOAD);
  return match ? `${match[1]}f_auto,q_auto,c_limit,w_${width}/${match[2]}` : url;
}

export function showDefaultImage(event) {
  if (!event.currentTarget.src.endsWith(DEFAULT_COURSE_IMAGE)) {
    event.currentTarget.src = DEFAULT_COURSE_IMAGE;
  }
}

export const formatPrice = (value) => `₹${Number(value).toLocaleString('en-IN')}`;

export const isOutsideLink = (link) => /^https:\/\//i.test(link || '');

export const courseTag = (course) =>
  course.tagLabel || (course.streams || []).map((stream) => stream.code).filter(Boolean).join(' / ');
