'use client';

import dynamic from 'next/dynamic';

const PhaserGame = dynamic(() => import('./PhaserGame'), {
  ssr: false,
  loading: () => (
    <div
      className="fixed inset-0 flex items-center justify-center bg-slate-900"
      style={{ zIndex: 1 }}
    >
      <div className="text-center">
        <div className="text-5xl md:text-6xl mb-4 animate-bounce">🏘️</div>
        <p className="text-slate-400 text-sm md:text-base font-medium">Memuat game...</p>
        <p className="text-slate-600 text-xs mt-1">Sebentar ya bro</p>
      </div>
    </div>
  ),
});

export default function GameCanvas() {
  return <PhaserGame />;
}