'use client';

import dynamic from 'next/dynamic';

const PhaserGame = dynamic(() => import('./PhaserGame'), {
  ssr: false,
  loading: () => (
    <div className="w-[800px] h-[600px] max-w-full bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700">
      <div className="text-center">
        <div className="text-4xl mb-3 animate-bounce">🏢</div>
        <p className="text-slate-400 text-sm">Loading game...</p>
      </div>
    </div>
  ),
});

export default function GameCanvas() {
  return <PhaserGame />;
}