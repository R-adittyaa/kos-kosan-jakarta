import GameCanvas from '@/components/GameCanvas';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4 gap-4">
      <header className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
          🏘️ Kos-Kosan Jakarta
        </h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1">
          Anak rantau, modal tipis, mimpi jadi juragan kos.
        </p>
      </header>

      <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-2">
        <GameCanvas />
      </div>

      <footer className="text-slate-500 text-xs">
        Next.js + Phaser + Tailwind · Fase 1
      </footer>
    </main>
  );
}