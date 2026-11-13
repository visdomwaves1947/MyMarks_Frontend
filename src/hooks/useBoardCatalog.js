import { useMemo } from 'react';
import useCatalog from './useCatalog';
import { LAB_SUBJECTS } from '../data/labPracticalsData';
import { coursesForBoard, labsForBoard } from '../utils/boards';

/**
 * The course list as the visitor should see it: a signed-in student gets the subjects and labs of
 * their own board; visitors and administrators get everything.
 */
export default function useBoardCatalog(currentUser) {
  const catalog = useCatalog();
  const allCourses = catalog.courses;
  const board = currentUser?.board;
  const role = currentUser?.role;

  return useMemo(() => {
    const viewer = board || role ? { board, role } : null;
    const courses = coursesForBoard(allCourses, viewer);
    const narrowed = courses !== allCourses;
    return {
      ...catalog,
      courses,
      allCourses,
      labs: labsForBoard(LAB_SUBJECTS, allCourses, courses),
      // The student's board while the list is narrowed to it
      board: narrowed ? board : '',
    };
    // catalog's other fields change together with its course list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCourses, board, role, catalog.streams, catalog.isLoading, catalog.error]);
}
