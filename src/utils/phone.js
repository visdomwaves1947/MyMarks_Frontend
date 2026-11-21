// Mobile numbers with a country, kept the same way as the mobile app and the server keep them:
// an Indian number is 10 digits, exactly as before; a number from another country carries its code,
// such as +971501234567.
import { COUNTRIES, INDIA, PREFERRED_FOR_DIAL } from '../data/countryCodes';

const digitsOf = (text) => String(text ?? '').replace(/\D/g, '');

const countryForDial = (dial) => {
  const preferred = PREFERRED_FOR_DIAL[dial];
  if (preferred) return COUNTRIES.find((country) => country.code === preferred);
  return COUNTRIES.find((country) => country.dial === dial);
};

/** A saved number as { country, number }: 10 digits (or 91 and 10 digits) is India; +code… finds its country */
export const parsePhone = (stored) => {
  const raw = String(stored ?? '').trim();
  const digits = digitsOf(raw);
  if (!digits) return { country: INDIA, number: '' };
  if (!raw.startsWith('+')) {
    return { country: INDIA, number: digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits };
  }
  // The longest code that fits wins: +1684 (American Samoa) before +1
  for (let length = 4; length >= 1; length -= 1) {
    if (digits.length <= length) continue;
    const country = countryForDial(`+${digits.slice(0, length)}`);
    if (country) return { country, number: digits.slice(length) };
  }
  return { country: INDIA, number: digits };
};

/** What the form sends: India as 10 digits, others as +code and the number */
export const phoneValue = (country, number) => {
  const digits = digitsOf(number);
  if (!digits) return '';
  return country.code === INDIA.code ? digits : `${country.dial}${digits}`;
};

/**
 * The problem with a number, or '' when it is fine. India needs 10 digits ([strictIndia]: starting
 * with 6 to 9, as the contact form asks); other countries 6 to 13 digits after the code.
 */
export const phoneProblem = (stored, { strictIndia = false, label = 'mobile number' } = {}) => {
  const { country, number } = parsePhone(stored);
  if (!number) return `Please enter a ${label}`;
  if (country.code === INDIA.code) {
    if (number.length !== 10) return `Enter a valid 10-digit ${label}`;
    if (strictIndia && !/^[6-9]/.test(number)) return `Enter a valid 10-digit ${label} starting with 6, 7, 8 or 9`;
    return '';
  }
  return number.length >= 6 && number.length <= 13 ? '' : `Enter a valid ${label} for ${country.name}`;
};

/** "+91 79977 55155", "+971 501234567"; anything that is not a mobile number is shown as given */
export const formatPhone = (stored) => {
  const { country, number } = parsePhone(stored);
  if (!number || (country.code === INDIA.code && number.length !== 10)) return String(stored ?? '');
  return country.code === INDIA.code ? `+91 ${number.slice(0, 5)} ${number.slice(5)}` : `${country.dial} ${number}`;
};

/**
 * What a typed mobile-or-email sign-in becomes: an email stays as typed; a phone loses its spaces and
 * dashes, +91 numbers become their 10 digits, and other countries keep their +code.
 */
export const signInValue = (typed) => {
  const text = String(typed ?? '').trim();
  if (text.includes('@') || !/^\+?[\d\s()-]+$/.test(text)) return text;
  const { country, number } = parsePhone(text);
  return phoneValue(country, number);
};

/** A tel: link that dials from anywhere: tel:+919876543210, tel:+971501234567 */
export const telLink = (stored) => {
  const { country, number } = parsePhone(stored);
  return number ? `tel:${country.dial}${number}` : '';
};
