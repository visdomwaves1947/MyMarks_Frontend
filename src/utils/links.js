// The same link rules as the server: an https link, or a page on this site such as /practicals

const isHttpsUrl = (value) => {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
};

const isSitePath = (value) => /^\/(?!\/)[\w\-./?=&%#]*$/.test(value);

export const isSafeLink = (value) => isHttpsUrl(value) || isSitePath(value);

export const linkProblem = (url) =>
  !url || isSafeLink(url) ? '' : 'The link must start with https:// or be a page on this site, such as /practicals.';
