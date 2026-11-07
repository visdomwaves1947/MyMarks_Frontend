// Two letters for a person without a photo, leaving out titles such as Dr. or Prof.
export const initialsOf = (name) =>
  (name || '')
    .replace(/^((Dr|Prof|Mr|Mrs|Ms|Sir)\.?\s+)+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
