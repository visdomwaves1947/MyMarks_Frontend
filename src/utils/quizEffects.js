import confetti from 'canvas-confetti';

/**
 * What a student sees, hears and feels when an answer is checked: a burst of confetti from the right
 * answer, short tones, and a buzz on a phone for a wrong one. Sound can be switched off (kept on this
 * device), and people who asked their device for less motion get no confetti.
 */

const SOUND_KEY = 'mymarks_quiz_sound';
const COLOURS = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#a855f7', '#06b6d4'];

export const soundIsOn = () => {
  try {
    return localStorage.getItem(SOUND_KEY) !== 'off';
  } catch {
    return true;
  }
};
export const setSoundOn = (on) => {
  try {
    localStorage.setItem(SOUND_KEY, on ? 'on' : 'off');
  } catch {
    // Private windows may refuse: the choice then lasts for this page only
  }
};

export const wantsLessMotion = () => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
};

let audio = null;
const tone = (frequency, start, length, { type = 'sine', volume = 0.12 } = {}) => {
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  oscillator.connect(gain);
  gain.connect(audio.destination);
  oscillator.start(start);
  oscillator.stop(start + length + 0.03);
};

// 'correct': two rising notes · 'wrong': two low falling notes · 'pass': a rising run · 'done': one soft note
export function playSound(kind) {
  if (!soundIsOn()) return;
  try {
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) return;
    audio = audio || new Context();
    if (audio.state === 'suspended') audio.resume();
    const now = audio.currentTime;
    if (kind === 'correct') {
      tone(659.25, now, 0.13);
      tone(987.77, now + 0.1, 0.24);
    } else if (kind === 'wrong') {
      tone(196, now, 0.17, { type: 'triangle', volume: 0.15 });
      tone(146.83, now + 0.15, 0.28, { type: 'triangle', volume: 0.15 });
    } else if (kind === 'pass') {
      [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => tone(frequency, now + index * 0.11, 0.24));
    } else if (kind === 'done') {
      tone(440, now, 0.3, { volume: 0.09 });
    }
  } catch {
    // No sound on this device
  }
}

// A burst of confetti out of an element (the answer that was right)
export function burstFrom(element, { strong = false } = {}) {
  if (!element || wantsLessMotion()) return;
  try {
    const box = element.getBoundingClientRect();
    confetti({
      particleCount: strong ? 110 : 60,
      spread: strong ? 95 : 70,
      startVelocity: strong ? 40 : 30,
      gravity: 1.15,
      scalar: 0.9,
      ticks: 150,
      origin: { x: (box.left + box.width / 2) / window.innerWidth, y: (box.top + box.height / 2) / window.innerHeight },
      colors: COLOURS,
      zIndex: 300,
      disableForReducedMotion: true,
    });
  } catch {
    // The canvas is not available
  }
}

// Confetti from both sides of the screen for a moment, for passing. Returns a function that stops it.
export function celebrate(milliseconds = 1400) {
  if (wantsLessMotion()) return () => {};
  const until = Date.now() + milliseconds;
  let frame = 0;
  const shoot = () => {
    try {
      const shared = { particleCount: 5, spread: 60, colors: COLOURS, zIndex: 300, disableForReducedMotion: true };
      confetti({ ...shared, angle: 60, origin: { x: 0, y: 0.75 } });
      confetti({ ...shared, angle: 120, origin: { x: 1, y: 0.75 } });
    } catch {
      return;
    }
    if (Date.now() < until) frame = requestAnimationFrame(shoot);
  };
  shoot();
  return () => cancelAnimationFrame(frame);
}

// Takes away confetti still falling, so none of it lingers over the next question or a wrong answer
export function clearConfetti() {
  try {
    confetti.reset();
  } catch {
    // Nothing to clear
  }
}

export function buzz(pattern) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    // Not a phone
  }
}
