'use client';

import { useEffect, useState } from 'react';

export default function FullscreenButton() {
  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  // Tandai mounted setelah client-side
  useEffect(() => {
    setMounted(true);

    // Cek support fullscreen API
    const supported =
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled;

    setIsSupported(!!supported);

    const handler = () => {
      const fs =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;
      setIsFullscreen(!!fs);
    };

    document.addEventListener('fullscreenchange', handler);
    document.addEventListener('webkitfullscreenchange', handler);
    document.addEventListener('mozfullscreenchange', handler);
    document.addEventListener('MSFullscreenChange', handler);

    return () => {
      document.removeEventListener('fullscreenchange', handler);
      document.removeEventListener('webkitfullscreenchange', handler);
      document.removeEventListener('mozfullscreenchange', handler);
      document.removeEventListener('MSFullscreenChange', handler);
    };
  }, []);

  const toggle = () => {
    const el = document.documentElement;
    if (!isFullscreen) {
      const req =
        el.requestFullscreen ||
        el.webkitRequestFullscreen ||
        el.mozRequestFullScreen ||
        el.msRequestFullscreen;
      if (req) req.call(el).catch(() => {});
    } else {
      const exit =
        document.exitFullscreen ||
        document.webkitExitFullscreen ||
        document.mozCancelFullScreen ||
        document.msExitFullscreen;
      if (exit) exit.call(document).catch(() => {});
    }
  };

  // PENTING: render null sebelum client mount
  // biar server & client sama-sama ga render apa-apa
  if (!mounted) return null;
  if (!isSupported) return null;

  return (
    <button
      onClick={toggle}
      title={isFullscreen ? 'Keluar fullscreen' : 'Fullscreen'}
      className="
        fixed top-3 right-3 z-50
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
      {isFullscreen ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
        </svg>
      )}
    </button>
  );
}