// Pages of a course's topic cards

// How many topic cards one page shows
export const LESSONS_PER_PAGE = 15;

/**
 * The page buttons to show: the first and last page and the ones around this page, with null for a
 * gap. A gap of a single page shows that page instead.  (3, 9) → [1, 2, 3, 4, null, 9]
 */
export const pageList = (current, total) => {
  const wanted = [...new Set([1, total, current - 1, current, current + 1])].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
  const list = [];
  wanted.forEach((page, index) => {
    const gap = index > 0 ? page - wanted[index - 1] : 1;
    if (gap === 2) list.push(page - 1);
    else if (gap > 2) list.push(null);
    list.push(page);
  });
  return list;
};
