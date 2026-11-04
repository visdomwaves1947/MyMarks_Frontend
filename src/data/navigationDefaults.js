// The top menu as it was built by hand. The site shows it until the menu loads, if the API is
// down, and until the admin saves a menu on the Navigation Menu page. Same as the backend default.
// Every link with kind "menu" opens its own dropdown.
export const DEFAULT_NAVIGATION = {
  links: [
    { label: 'Home', href: '/demo', kind: 'link', visible: true },
    { label: 'About Us', href: '/aboutus', kind: 'link', visible: true },
    {
      label: 'Intermediate',
      href: '/demo#courses',
      kind: 'menu',
      visible: true,
      menu: {
        footerText: 'AP & TS Intermediate',
        exploreLabel: 'Explore All',
        exploreHref: '/demo#courses',
        sections: [
          { title: 'Academic Groups', icon: 'layers', source: 'streams', visible: true, items: [] },
          { title: 'Languages', icon: 'globe', source: 'languages', visible: true, items: [] },
          {
            title: 'Lab / Practicals',
            icon: 'flask',
            source: 'custom',
            visible: true,
            items: [
              { label: 'Physics Lab (30M)', desc: '', href: '/practicals?subject=phy', visible: true },
              { label: 'Chemistry Lab (30M)', desc: '', href: '/practicals?subject=chem', visible: true },
              { label: 'Biology Labs (30M)', desc: '', href: '/practicals?subject=bot', visible: true },
              { label: 'Computer Science (30M)', desc: '', href: '/practicals?subject=cs', visible: true },
              { label: 'Electronics Lab (30M)', desc: '', href: '/practicals?subject=elec', visible: true },
              { label: 'Geography Lab (30M)', desc: '', href: '/practicals?subject=geo', visible: true },
              { label: 'View All Practical Handbooks', desc: '', href: '/practicals', visible: true },
            ],
          },
        ],
      },
    },
    { label: 'Contact Us', href: '/contactus', kind: 'link', visible: true },
  ],
  isDefault: true,
};
