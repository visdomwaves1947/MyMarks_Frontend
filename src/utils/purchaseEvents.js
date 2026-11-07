// Sent when a payment is confirmed, so an open course page, My Courses and the cart catch up.
// detail: { courseId } for Buy Now, plus courseIds for every course of a cart.
export const COURSE_BOUGHT = 'mymarks:course-bought';

export const boughtIds = (event) => {
  const detail = event?.detail || {};
  return Array.isArray(detail.courseIds) ? detail.courseIds : [detail.courseId].filter(Boolean);
};
