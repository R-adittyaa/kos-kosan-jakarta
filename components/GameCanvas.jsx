'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const PhaserGame = dynamic(() => import('./PhaserGame'), {
  ssr: false,
  loading: () => <LoadingState />,
});

function LoadingState() {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (timedOut) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-950 z-10">
        <div className="text-center max-w-md px-6">
          <div className="text-5xl mb-4">😵</div>
          <p className="text-slate-300 text-base font-medium mb-2">
            Game gagal dimuat
          </p>
          <p className="text-slate-500 text-sm mb-6">
            Cek koneksi internet lu, terus refresh halaman ini.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-950 z-10">
      <div className="text-center">
        <div className="text-5xl md:text-6xl mb-4 animate-bounce">🏘️</div>
        <p className="text-slate-300 text-sm md:text-base font-medium">
          Memuat game...
        </p>
        <p className="text-slate-500 text-xs mt-1">Sebentar ya bro</p>
      </div>
    </div>
  );
}

export default function GameCanvas() {
  return <PhaserGame />;
}