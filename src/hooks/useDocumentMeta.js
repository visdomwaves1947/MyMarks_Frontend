import { useEffect } from 'react';

const setMeta = (attribute, name, content) => {
  let tag = document.head.querySelector(`meta[${attribute}="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, name);
    tag.setAttribute('data-page-meta', 'true');
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

/**
 * Page title and description for Google, which reads pages after they load.
 * WhatsApp does not, so vercel.json sends it to the backend share page instead.
 */
export default function useDocumentMeta({ title, description, image }) {
  useEffect(() => {
    if (!title) return undefined;

    const previousTitle = document.title;
    const descriptionTag = document.head.querySelector('meta[name="description"]');
    const previousDescription = descriptionTag?.getAttribute('content');

    document.title = title;
    if (description) setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    if (description) setMeta('property', 'og:description', description);
    if (image) setMeta('property', 'og:image', new URL(image, window.location.origin).href);

    return () => {
      document.title = previousTitle;
      if (descriptionTag && previousDescription) descriptionTag.setAttribute('content', previousDescription);
      document.head.querySelectorAll('meta[data-page-meta]').forEach((tag) => tag.remove());
    };
  }, [title, description, image]);
}
