// A stand-in for YouTube's player API, shared by the tests that play parts of videos (highlights, roadmaps)

// Stands in for YouTube's player API. window.__ytAdvance(seconds) moves every playing video on;
// a video stops at its end time, as YouTube's does.
export const FAKE_YOUTUBE_API = `
window.__yt = { players: [] };
function FakePlayer(element, options) {
  var self = this;
  var p = { videoId: options.videoId || '', time: 0, state: -1, muted: false, volume: 100, rate: 1, end: null, destroyed: false, captions: true };
  window.__yt.players.push(p);
  var frame = document.createElement('div');
  frame.setAttribute('data-fake-youtube', '');
  frame.style.cssText = 'width:100%;height:100%;background:#0f172a';
  if (element.parentNode) element.parentNode.replaceChild(frame, element);
  function emit(state) {
    p.state = state;
    setTimeout(function () {
      if (options.events && options.events.onStateChange) options.events.onStateChange({ data: state, target: self });
    }, 0);
  }
  p.emit = emit;
  this.loadVideoById = function (o) { p.videoId = o.videoId; p.time = o.startSeconds || 0; p.end = o.endSeconds || null; emit(1); };
  this.cueVideoById = function (o) { p.videoId = o.videoId; p.time = o.startSeconds || 0; p.end = o.endSeconds || null; emit(5); };
  this.playVideo = function () { emit(1); };
  this.pauseVideo = function () { emit(2); };
  this.seekTo = function (seconds) { p.time = seconds; };
  this.getCurrentTime = function () { return p.time; };
  this.getDuration = function () { return 900; };
  this.getPlayerState = function () { return p.state; };
  this.mute = function () { p.muted = true; };
  this.unMute = function () { p.muted = false; };
  this.isMuted = function () { return p.muted; };
  this.setVolume = function (volume) { p.volume = volume; };
  this.getVolume = function () { return p.volume; };
  this.setPlaybackRate = function (rate) { p.rate = rate; };
  this.getPlaybackRate = function () { return p.rate; };
  this.loadModule = function (name) { if (name === 'captions' || name === 'cc') p.captions = true; };
  this.unloadModule = function (name) { if (name === 'captions' || name === 'cc') p.captions = false; };
  this.destroy = function () { p.destroyed = true; };
  setTimeout(function () { if (options.events && options.events.onReady) options.events.onReady({ target: self }); }, 0);
}
window.YT = { Player: FakePlayer, PlayerState: { ENDED: 0, PLAYING: 1, PAUSED: 2 } };
window.__ytAdvance = function (seconds) {
  window.__yt.players.forEach(function (p) {
    if (p.state !== 1 || p.destroyed) return;
    p.time += seconds;
    if (p.end !== null && p.time >= p.end) { p.time = p.end; p.emit(0); }
  });
};
window.__ytHeard = function () {
  return window.__yt.players
    .filter(function (p) { return p.state === 1 && !p.muted && !p.destroyed; })
    .map(function (p) { return { videoId: p.videoId, time: p.time }; });
};
window.__ytSound = function () {
  return window.__yt.players
    .filter(function (p) { return p.state === 1 && !p.destroyed; })
    .map(function (p) { return { muted: p.muted, volume: p.volume, rate: p.rate, captions: p.captions }; });
};
if (window.onYouTubeIframeAPIReady) window.onYouTubeIframeAPIReady();`;

export const fakeYouTube = (page) =>
  page.route('https://www.youtube.com/iframe_api', (route) =>
    route.fulfill({ contentType: 'application/javascript', body: FAKE_YOUTUBE_API })
  );
// Moves the playing video on, a second at a time so the reel sees each moment
export const play = async (page, seconds) => {
  for (let done = 0; done < seconds; done += 1) {
    await page.evaluate(() => window.__ytAdvance(1));
    await page.waitForTimeout(140);
  }
};
export const heard = (page) => page.evaluate(() => window.__ytHeard());
// The sound and speed of the video that is playing
export const sound = (page) => page.evaluate(() => window.__ytSound());
