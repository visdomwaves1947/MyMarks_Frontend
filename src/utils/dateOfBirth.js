// Dates of birth: kept as "yyyy-mm-dd" (what the server stores), typed and shown as "dd-mm-yyyy"

// A student signing up is at least this old, and at most this old
export const DOB_MIN_AGE = 10;
export const DOB_MAX_AGE = 60;

const pad = (number) => String(number).padStart(2, '0');

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// A day as "yyyy-mm-dd" in the student's own time zone
export const isoOf = (year, month, day) => `${year}-${pad(month + 1)}-${pad(day)}`;

export const todayIso = (now = new Date()) => isoOf(now.getFullYear(), now.getMonth(), now.getDate());

// "yyyy-mm-dd" → { year, month (0-11), day }, or null when it is not a real day (31-02-2008)
export const partsOf = (iso) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, month, day);
  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day ? { year, month, day } : null;
};

// The same day a number of years earlier (29 Feb falls back to 28 Feb)
export const yearsBefore = (iso, years) => {
  const parts = partsOf(iso);
  if (!parts) return '';
  const year = parts.year - years;
  const last = new Date(year, parts.month + 1, 0).getDate();
  return isoOf(year, parts.month, Math.min(parts.day, last));
};

// Whole years between a date of birth and today
export const ageOn = (iso, today = todayIso()) => {
  const born = partsOf(iso);
  const now = partsOf(today);
  if (!born || !now) return NaN;
  const hadBirthday = now.month > born.month || (now.month === born.month && now.day >= born.day);
  return now.year - born.year - (hadBirthday ? 0 : 1);
};

// The day after
const dayAfter = (iso) => {
  const parts = partsOf(iso);
  const next = new Date(parts.year, parts.month, parts.day + 1);
  return isoOf(next.getFullYear(), next.getMonth(), next.getDate());
};

// The earliest and latest dates of birth that can be chosen: DOB_MAX_AGE at most, DOB_MIN_AGE at least
export const dobRange = (today = todayIso()) => ({
  min: dayAfter(yearsBefore(today, DOB_MAX_AGE + 1)),
  max: yearsBefore(today, DOB_MIN_AGE),
});

// "yyyy-mm-dd" → "dd-mm-yyyy"; anything else stays as typed
export const typedOf = (iso) => {
  const parts = partsOf(iso);
  return parts ? `${pad(parts.day)}-${pad(parts.month + 1)}-${parts.year}` : String(iso || '');
};

// "14 May 2008"
export const longDateOf = (iso) => {
  const parts = partsOf(iso);
  return parts ? `${parts.day} ${MONTHS[parts.month]} ${parts.year}` : '';
};

/**
 * What a student typed → "yyyy-mm-dd" when it is a whole real date ("14-05-2008", "14/5/2008",
 * "14.05.2008"), otherwise what they typed, so the form can say what is wrong with it.
 */
export const isoFromTyped = (text) => {
  const value = String(text || '').trim();
  // Already "yyyy-mm-dd", as browsers fill in a saved birthday
  if (partsOf(value)) return value;
  const match = /^(\d{1,2})[-/. ](\d{1,2})[-/. ](\d{4})$/.exec(value);
  if (!match) return value;
  const iso = isoOf(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
  return partsOf(iso) ? iso : value;
};

/** What is wrong with a date of birth, or '' */
export const dobProblem = (value, today = todayIso()) => {
  if (!value) return 'Date of Birth is required';
  if (!partsOf(value)) return 'Enter a real date as dd-mm-yyyy, such as 14-05-2008.';
  if (value > today) return 'Date of birth cannot be in the future.';
  const age = ageOn(value, today);
  if (age < DOB_MIN_AGE) return `You must be at least ${DOB_MIN_AGE} years old to sign up.`;
  if (age > DOB_MAX_AGE) return `Please check the year: that makes you ${age} years old.`;
  return '';
};
