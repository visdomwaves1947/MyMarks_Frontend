// Turns the saved menu into the links each dropdown column shows

const hasContent = (menu) => Boolean(menu && ((menu.sections || []).length || menu.footerText || menu.exploreHref));

/**
 * Older saves kept one shared dropdown at the top level; it belongs to the first dropdown link without its own.
 * The server does this too, so this only matters while an older server is still live.
 */
export const upgradeNavigation = (saved) => {
  let legacy = hasContent(saved?.menu) ? saved.menu : null;
  const links = (saved?.links || []).map((link) => {
    if (link.kind !== 'menu' || hasContent(link.menu) || !legacy) return link;
    const upgraded = { ...link, menu: legacy };
    legacy = null;
    return upgraded;
  });
  return { ...saved, links, menu: undefined };
};

// Dropdown width for the number of columns
export const MEGA_MENU_WIDTH = {
  1: 'w-[300px]',
  2: 'w-[460px]',
  3: 'w-[560px] sm:w-[620px] md:w-[650px]',
  4: 'w-[760px] lg:w-[820px]',
};

// How far a dropdown starts left of its link. Narrow ones sit under the link; the navbar keeps every one on screen.
export const MEGA_MENU_OFFSET = {
  1: 'left-0',
  2: '-left-24',
  3: '-left-40 sm:-left-60 md:-left-64',
  4: '-left-40 sm:-left-60 md:-left-64',
};

const streamItems = (streams) =>
  streams
    .filter((stream) => stream.slug !== 'languages')
    .map((stream) => ({
      name: stream.code,
      desc: stream.shortName,
      href: `/demo?group=${stream.slug}#courses`,
    }));

const languageItems = (courses) =>
  courses
    .filter((course) => (course.streams || []).some((stream) => stream.slug === 'languages'))
    .map((course) => ({
      name: course.name,
      href: course.ownLink || `/courses/${course.slug}`,
    }));

export const sectionItems = (section, { courses = [], streams = [] }) => {
  if (section.source === 'streams') return streamItems(streams);
  if (section.source === 'languages') return languageItems(courses);
  return (section.items || [])
    .filter((item) => item.visible !== false)
    .map((item) => ({ name: item.label, desc: item.desc, href: item.href }));
};

// Visible columns. The website leaves out columns with no links; the admin preview keeps them.
export const resolveSections = (menu, catalog, { keepEmpty = false } = {}) =>
  (menu?.sections || [])
    .filter((section) => section.visible !== false)
    .map((section) => ({ title: section.title, icon: section.icon, items: sectionItems(section, catalog) }))
    .filter((section) => keepEmpty || section.items.length > 0);
