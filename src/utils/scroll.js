// The site scrolls smoothly by default (scroll-smooth on <html>). This jumps straight to the top instead.
export function jumpToTop() {
  const root = document.documentElement;
  root.style.scrollBehavior = 'auto';
  // Reading the style makes the browser apply it now; otherwise the jump still glides
  void getComputedStyle(root).scrollBehavior;
  window.scrollTo(0, 0);
  root.style.scrollBehavior = '';
}
