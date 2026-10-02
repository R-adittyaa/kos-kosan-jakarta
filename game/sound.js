let ctx;

function getCtx() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

export function playSfx(type) {
  const audioCtx = getCtx();
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const now = audioCtx.currentTime;
 const presets = {
  click:     { freq: 600, wave: 'square',   dur: 0.08 },
  coin:      { freq: 900, wave: 'triangle', dur: 0.15, slide: 1400 },
  coin_big:  { freq: 700, wave: 'triangle', dur: 0.25, slide: 1800 },
  error:     { freq: 200, wave: 'sawtooth', dur: 0.25 },
  bad:       { freq: 150, wave: 'sawtooth', dur: 0.35, slide: 100 },
  door:      { freq: 400, wave: 'sine',     dur: 0.4,  slide: 200 },
  levelup:   { freq: 500, wave: 'triangle', dur: 0.5,  slide: 1200 },
  achievement: { freq: 800, wave: 'triangle', dur: 0.6, slide: 1600 },
  dialog:    { freq: 700, wave: 'sine',     dur: 0.05 },
  tick:      { freq: 800, wave: 'square',   dur: 0.06, slide: 400 },
  dayEnd:    { freq: 300, wave: 'sine',     dur: 0.6,  slide: 500 },
  upgrade:   { freq: 400, wave: 'triangle', dur: 0.8,  slide: 2000 },
};

  const p = presets[type] || presets.click;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = p.wave;
  osc.frequency.setValueAtTime(p.freq, now);
  if (p.slide) osc.frequency.exponentialRampToValueAtTime(p.slide, now + p.dur);

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + p.dur);

  osc.connect(gain).connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + p.dur);
}

// ===== BGM GENERATOR =====
let bgmNodes = null;

export function startBgm() {
  const audioCtx = getCtx();
  if (!audioCtx || bgmNodes) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  // Chord progression: Am - F - C - G (lo-fi vibe)
  const chords = [
    [220.00, 261.63, 329.63], // Am
    [174.61, 220.00, 261.63], // F
    [261.63, 329.63, 392.00], // C
    [196.00, 246.94, 293.66], // G
  ];

  const master = audioCtx.createGain();
  master.gain.value = 0.04;
  master.connect(audioCtx.destination);

  let chordIndex = 0;
  const interval = setInterval(() => {
    if (!bgmNodes) return;
    const chord = chords[chordIndex % chords.length];
    chordIndex++;

    chord.forEach((freq) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const t = audioCtx.currentTime;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.5, t + 0.3);
      gain.gain.linearRampToValueAtTime(0, t + 2.8);

      osc.connect(gain).connect(master);
      osc.start(t);
      osc.stop(t + 3);
    });
  }, 3000);

  bgmNodes = { master, interval };
}

export function stopBgm() {
  if (!bgmNodes) return;
  clearInterval(bgmNodes.interval);
  bgmNodes.master.disconnect();
  bgmNodes = null;
}