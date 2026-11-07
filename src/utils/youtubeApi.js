// YouTube's player API, used only to read how far a student got. Videos play without it.

const API_SCRIPT = 'https://www.youtube.com/iframe_api';

let loading = null;

export function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        resolve(window.YT);
      };
      const script = document.createElement('script');
      script.src = API_SCRIPT;
      script.async = true;
      script.onerror = () => {
        loading = null;
        reject(new Error('The YouTube player API could not be loaded.'));
      };
      document.head.appendChild(script);
    });
  }
  return loading;
}
