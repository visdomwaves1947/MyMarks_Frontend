# MyMarks website

React, Vite and Tailwind. The API is in the `MyMarks_Backend` repository.

## Run it

```bash
npm install
```

```bash
npm run dev
```

The site uses the API on port 5000 when it runs on localhost.

## Where things are

- Course cards, streams and menus come from `useCatalog` in `src/hooks`.
- `/courses/:slug` is one shared page, `src/pages/CoursePage.jsx`, filled from the admin panel.
- The admin Courses & Streams screens are in `src/components/admin/courses`.
- `LegacyCourse` keeps each old subject page until that course is published, then moves its
  old address to the new page. The old pages are the rollback, so delete them only after launch.

## Tests

```bash
npm run lint
```

```bash
npm run test:e2e
```

The browser tests need Google Chrome, and the backend repository next to this one. They start
their own API on port 5050 with a throwaway in-memory database, and the site on port 4173.
The phone project covers the public site, and the desktop project also runs the admin steps.

See `RELEASE.md` in the backend repository for how to release.
