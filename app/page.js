import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-x-hidden">
      {/* ===== BACKGROUND DECORATION ===== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-8">
        {/* ===== NAVBAR ===== */}
        <nav className="flex items-center justify-between mb-20">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏘️</span>
            <span
              className="text-sm font-bold text-amber-300"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              KOS-KOSAN JAKARTA
            </span>
          </div>
          <Link
            href="/play"
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold transition-colors"
          >
            Main →
          </Link>
        </nav>

        {/* ===== HERO ===== */}
        <section className="text-center mb-24">
          <div className="text-7xl md:text-8xl mb-6 animate-bounce-slow">🏘️</div>

          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 bg-clip-text text-transparent mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            KOS-KOSAN JAKARTA
          </h1>

          <p className="text-base md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Modal <span className="text-amber-300 font-bold">Rp 500.000</span>, mimpi jadi{' '}
            <span className="text-amber-300 font-bold">juragan kos</span>.
            <br />
            Anak rantau vs Jakarta. Siapa yang menang?
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/play"
              className="group px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-lg transition-all shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 active:scale-95"
            >
              ▶️  MAIN SEKARANG
            </Link>
            <a
              href="#cara-main"
              className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-bold text-lg transition-all"
            >
              📖  CARA MAIN
            </a>
          </div>

          <p className="text-xs text-slate-500 mt-6">
            Gratis · Tanpa download · Bisa dimainkan di HP
          </p>
        </section>

        {/* ===== FEATURES ===== */}
        <section className="mb-24">
          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-12 text-amber-300"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            APA YANG BIKIN SERU?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              emoji="🏠"
              title="Kelola Kos"
              desc="Dari kos biasa sampe elite. Upgrade, atur harga sewa, cari penyewa."
            />
            <FeatureCard
              emoji="🎲"
              title="15+ Event"
              desc="Penyewa telat bayar, AC rusak, preman nagih, viral TikTok — tiap hari beda."
            />
            <FeatureCard
              emoji="💖"
              title="5 Karakter"
              desc="Bu RT, Pak Haji, Dimas, Sari, Bagas. Bangun hubungan, buka cerita rahasia."
            />
            <FeatureCard
              emoji="🏆"
              title="8 Achievement"
              desc="Kumpulin pencapaian, buka ending rahasia, jadi juragan sejati."
            />
          </div>
        </section>

        {/* ===== CARA MAIN ===== */}
        <section id="cara-main" className="mb-24 scroll-mt-8">
          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-12 text-amber-300"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            CARA MAIN
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StepCard
              num="1"
              title="Pilih Aksi"
              desc="Setiap hari punya 8 energi. Kerja, santai, pasang iklan — pilih dengan bijak."
            />
            <StepCard
              num="2"
              title="Hadapi Event"
              desc="Tiap hari ada kejadian random. Pilihan lu nentuin nasib kos lu."
            />
            <StepCard
              num="3"
              title="Jadi Juragan"
              desc="Kumpulin Rp 3.000 di hari 15, lalu Rp 8.000 di hari 30. Bisa ga?"
            />
          </div>
        </section>

        {/* ===== PREVIEW / CTA ===== */}
        <section className="mb-24">
          <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 md:p-12 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-orange-500/10" />

            <div className="relative">
              <div className="text-5xl mb-4">🎮</div>
              <h3
                className="text-xl md:text-2xl font-bold text-white mb-3"
                style={{ fontFamily: 'var(--font-pixel)' }}
              >
                SIAP JADI JURAGAN?
              </h3>
              <p className="text-slate-300 mb-6 max-w-md mx-auto text-sm md:text-base">
                30 hari. 15+ event. 8 achievement. Berapa ending yang bisa lu buka?
              </p>
              <Link
                href="/play"
                className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-lg transition-all shadow-2xl shadow-amber-500/30 hover:scale-105 active:scale-95"
              >
                🚀  MULAI PETUALANGAN
              </Link>
            </div>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="text-center py-8 border-t border-white/10">
          <p className="text-xs text-slate-500 mb-2">
            Dibuat dengan ❤️ di Jakarta
          </p>
          <p className="text-xs text-slate-600">
            Next.js · Phaser · Tailwind CSS
          </p>
        </footer>
      </div>
    </main>
  );
}

// ===== COMPONENTS =====
function FeatureCard({ emoji, title, desc }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] p-6 transition-all hover:-translate-y-1 hover:border-amber-500/30">
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
        {emoji}
      </div>
      <h3 className="text-base font-bold text-amber-300 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function StepCard({ num, title, desc }) {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div
        className="absolute -top-4 -left-4 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-bold text-lg shadow-lg"
        style={{ fontFamily: 'var(--font-pixel)' }}
      >
        {num}
      </div>
      <h3 className="text-base font-bold text-white mb-2 mt-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}