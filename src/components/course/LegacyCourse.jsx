import React from 'react';
import { Navigate } from 'react-router-dom';
import useCatalog from '../../hooks/useCatalog';

/**
 * An old address such as /maths moves to the new page once that course is published.
 * Until then, or if the API cannot be reached, the old page keeps working.
 */
export default function LegacyCourse({ slug, children }) {
  const { courses, isLoading } = useCatalog();

  if (isLoading) {
    return <div className="min-h-[60vh] bg-[#EBF0F7] dark:bg-[#0B0F19]" />;
  }

  if (courses.some((course) => course.slug === slug)) {
    return <Navigate to={`/courses/${slug}`} replace />;
  }

  return children;
}
