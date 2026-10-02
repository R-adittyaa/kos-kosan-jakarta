import Link from 'next/link';
import GameCanvas from '@/components/GameCanvas';
import FullscreenButton from '@/components/FullscreenButton';
import SoundToggle from '@/components/SoundToggle';

export const metadata = {
  title: 'Main — Kos-Kosan Jakarta',
};

export default function PlayPage() {
  return (
    <>
      <FullscreenButton />
      <SoundToggle />

      {/* Back button */}
      <Link
        href="/"
        className="fixed top-3 left-3 z-50 flex items-center gap-2 px-3 py-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/20 text-white/70 hover:text-white text-xs font-medium transition-all active:scale-95"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Menu
      </Link>

      <GameCanvas />
    </>
  );
}