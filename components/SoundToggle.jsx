'use client';

import { useEffect, useState } from 'react';
import { stopBgm, startBgm } from '@/game/sound';

export default function SoundToggle() {
  const [mounted, setMounted] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Baca preference dari localStorage
    try {
      const saved = localStorage.getItem('kos-jakarta-muted');
      if (saved === 'true') {
        setMuted(true);
        stopBgm();
      }
    } catch {}
  }, []);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    try {
      localStorage.setItem('kos-jakarta-muted', String(next));
    } catch {}

    if (next) {
      stopBgm();
    } else {
      startBgm();
    }
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      title={muted ? 'Nyalain suara' : 'Matiin suara'}
      className="
        fixed top-3 right-16 z-50
        w-10 h-10 md:w-11 md:h-11
        rounded-xl
        bg-black/40 hover:bg-black/60
        backdrop-blur-md
        border border-white/10 hover:border-white/20
        flex items-center justify-center
        text-white/70 hover:text-white
        active:scale-95
        transition-all duration-200
      "
    >
      {muted ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="22" y1="9" x2="16" y2="15" />
          <line x1="16" y1="9" x2="22" y2="15" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
    </button>
  );
}