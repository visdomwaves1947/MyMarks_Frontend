// A highlight reel's parts on one timeline: 20 s of chapter 1 then 20 s of chapter 5 is one 40 s video.

const round = (value) => Math.round(value * 1000) / 1000;

// Where each part starts in the reel, and the reel's length
export function timelineOf(clips = []) {
  let at = 0;
  const parts = clips.map((clip, index) => {
    const length = Math.max(0, Number(clip.end) - Number(clip.start));
    const part = { ...clip, index, from: round(at), length: round(length) };
    at += length;
    return part;
  });
  return { parts, total: round(at) };
}

// The part playing at a moment of the reel, and the time in its own video
export function locate(timeline, time) {
  const { parts, total } = timeline;
  if (parts.length === 0) return { index: -1, local: 0 };
  const at = Math.min(Math.max(Number(time) || 0, 0), total);
  let index = parts.findIndex((part) => at < part.from + part.length);
  if (index === -1) index = parts.length - 1;
  const part = parts[index];
  return { index, local: round(part.start + Math.min(at - part.from, part.length)) };
}

// The moment of the reel for a time in one part's video
export function reelTimeOf(timeline, index, local) {
  const part = timeline.parts[index];
  if (!part) return 0;
  const inside = Math.min(Math.max(Number(local) - part.start, 0), part.length);
  return round(part.from + inside);
}

// "Ch 1 · What is trigonometry"
export function partLabel(part) {
  if (!part) return '';
  const number = part.chapter?.number;
  return number !== null && number !== undefined && number !== '' ? `Ch ${number} · ${part.title}` : part.title;
}
