const YOUTUBE_LINK = /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;

// A video's YouTube id: its own field, or read from its link
export function youtubeIdOf(video) {
  const own = String(video?.youtubeId || '').trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(own)) return own;
  const match = YOUTUBE_LINK.exec(video?.url || video?.embedUrl || '');
  return match ? match[1] : '';
}

// What a highlight can be cut from: a YouTube video or an uploaded video file
export function mediaOfVideo(video) {
  const youtubeId = youtubeIdOf(video);
  if (youtubeId) return { kind: 'youtube', youtubeId };
  const url = video?.url || '';
  const isFile = video?.type === 'video' || /\/uploads\/|\.(mp4|webm|mov|m4v|ogg|ogv)(\?.*)?$/i.test(url);
  return isFile && url ? { kind: 'file', url } : null;
}

// "2:05" or "1:02:05" or "125" → seconds; anything else → NaN
export function parseClock(text) {
  const value = String(text ?? '').trim();
  if (!value) return NaN;
  if (/^\d+(\.\d+)?$/.test(value)) return Number(value);
  const parts = value.split(':');
  if (parts.length < 2 || parts.length > 3 || parts.some((part) => !/^\d+(\.\d+)?$/.test(part))) return NaN;
  return parts.reduce((total, part) => total * 60 + Number(part), 0);
}
