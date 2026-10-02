export const EVENTS = {
  // ============================================================
  // ===== INTRO =====
  // ============================================================
  intro: {
    id: 'intro',
    character: 'burt',
    dialog: [
      'Heh, anak baru ya? Pindah ke sini kenapa?',
      'Oh, mau buka kos-kosan? Modal berapa lu?',
      'Hah?! Cuma Rp 500.000?! Mau ngapain?',
      '...ya udah, gpp. Coba aja. Jangan bikin rusuh ya!',
    ],
    choices: [
      {
        text: 'Siap Bu RT! 🙏',
        effects: { reputation: 5, relationship: { burt: 10 } },
        result: 'Bu RT ngangguk-ngangguk, agak terkesan.',
      },
      {
        text: 'Hehe, doain aja Bu 😅',
        effects: { reputation: -2, peace: 2, relationship: { burt: -5 } },
        result: 'Bu RT mendelik. Tapi lu santai.',
      },
    ],
  },

  // ============================================================
  // ===== PENGHUNI PERTAMA =====
  // ============================================================
  firstTenant: {
    id: 'firstTenant',
    character: 'tenant1',
    condition: (s) => !s.hasTenant && s.day >= 1,
    weight: 0, // manual trigger dari iklan
    dialog: [
      'Bang, masih ada kamar kosong?',
      'Gw Dimas, mahasiswa. Budget cuma Rp 800/bulan.',
      'Boleh nego ga bang?',
    ],
    choices: [
      {
        text: 'Oke Rp 800, deal! 🤝',
        effects: { money: 800, reputation: 3, tenant: true, relationship: { tenant1: 15 } },
        result: 'Dimas senyum lebar, langsung isi kamar.',
      },
      {
        text: 'Rp 1.000, ga bisa kurang.',
        effects: { money: 1000, reputation: -1, tenant: true, relationship: { tenant1: -5 } },
        result: 'Dimas ngeluh tapi akhirnya terima.',
      },
      {
        text: 'Maaf masih kosong semua 😞',
        effects: { peace: 3, reputation: -3 },
        result: 'Dimas pergi. Lu masih sendirian.',
      },
    ],
  },

  // ============================================================
  // ===== EVENT TENANT DIMAS =====
  // ============================================================
  tenantLate: {
    id: 'tenantLate',
    character: 'tenant1',
    condition: (s) => s.hasTenant && s.day >= 3,
    weight: 8,
    dialog: [
      'Bang, maaf... gw telat bayar 3 hari.',
      'Ayah gw lagi sakit, uangnya kepake buat obat.',
      'Gw janji minggu depan gw lunasin...',
    ],
    choices: [
      {
        text: 'Gpp, santai aja. Keluarga dulu. 🙏',
        effects: { peace: -5, relationship: { tenant1: 20 } },
        result: 'Dimas nangis dikit. Dia bakal inget kebaikan lu.',
      },
      {
        text: 'Ya udah, minggu depan TAPI JANGAN TELAT LAGI!',
        effects: { relationship: { tenant1: -5 } },
        result: 'Dimas ngangguk cemas. Hubungan agak renggang.',
      },
      {
        text: 'Sekarang atau keluar!',
        effects: { money: 800, reputation: -10, relationship: { tenant1: -30 } },
        result: 'Dimas bayar sambil ngeluh. Lu dapet uang, tapi dingin.',
      },
    ],
  },

  acBroken: {
    id: 'acBroken',
    character: 'tenant1',
    condition: (s) => s.hasTenant && s.day >= 5,
    weight: 6,
    dialog: [
      'Bang, AC kamar gw rusak nih.',
      'Panas banget, gw ga bisa tidur.',
      'Bisa diperbaiki ga?',
    ],
    choices: [
      {
        text: 'Gw panggil tukang sekarang. 💸',
        effects: { money: -300, relationship: { tenant1: 15 }, reputation: 3 },
        result: 'Dimas senang. AC dingin lagi.',
      },
      {
        text: 'Pakai kipas aja dulu, bro 😅',
        effects: { relationship: { tenant1: -10 }, peace: 2 },
        result: 'Dimas ngeluh tapi terima. Lu hemat.',
      },
      {
        text: 'Ya beli AC baru sendiri lah!',
        effects: { reputation: -5, relationship: { tenant1: -20 } },
        result: 'Dimas diem. Tapi hatinya kesel.',
      },
    ],
  },

  hujanDeras: {
    id: 'hujanDeras',
    character: 'tenant1',
    condition: (s) => s.hasTenant && s.day >= 4,
    weight: 5,
    dialog: [
      'Bang! Atap kamar gw bocor!',
      'Kasur gw basah semua nih...',
    ],
    choices: [
      {
        text: 'Gw benerin sekarang juga! 🔨',
        effects: { money: -200, reputation: 5, relationship: { tenant1: 10 } },
        result: 'Atap dibenerin. Dimas kagum.',
      },
      {
        text: 'Pakai ember dulu, nanti minggu depan.',
        effects: { relationship: { tenant1: -10 } },
        result: 'Dimas ngeluh. Tapi terpaksa.',
      },
    ],
  },

  dimasCurhat: {
    id: 'dimasCurhat',
    character: 'tenant1',
    condition: (s) => s.hasTenant && (s.relationship?.tenant1 ?? 0) >= 30,
    weight: 4,
    dialog: [
      'Bang... gw capek.',
      'Kuliah gw berat, keluarga gw susah.',
      'Kadang gw pengen pulang aja ke kampung...',
    ],
    choices: [
      {
        text: 'Dimas, lu kuat. Gw dulu juga gitu. 💪',
        effects: { relationship: { tenant1: 20 }, peace: -3 },
        result: 'Dimas nangis. Lu jadi mentor dia.',
      },
      {
        text: 'Ya udah pulang aja kalau mau.',
        effects: { relationship: { tenant1: -15 }, peace: 5 },
        result: 'Dimas diem. Tapi hatinya hancur.',
      },
      {
        text: 'Sini gw traktir makan. 🍜',
        effects: { money: -50, relationship: { tenant1: 25 } },
        result: 'Makan bareng. Dimas balik semangat.',
      },
    ],
  },

  // ============================================================
  // ===== EVENT BU RT & PAK HAJI =====
  // ============================================================
  pakHajiVisit: {
    id: 'pakHajiVisit',
    character: 'pakHaji',
    condition: (s) => s.day >= 7 && s.reputation >= 5,
    weight: 5,
    dialog: [
      'Assalamualaikum, Nak Raka.',
      'Denger-denger lu pinter ngurus kos ya?',
      'Gw punya kos 2 lantai di Tebet. Mau kelola bareng?',
      'Lu dapet 30% dari profit.',
    ],
    choices: [
      {
        text: 'Boleh Pak Haji! Siap! 🤝',
        effects: { money: 500, reputation: 10, relationship: { pakHaji: 20 } },
        result: 'Pak Haji tersenyum. Kerjasama dimulai.',
      },
      {
        text: 'Hmm, saya pikir-pikir dulu Pak.',
        effects: { relationship: { pakHaji: -5 } },
        result: 'Pak Haji ngangguk. Tapi agak kecewa.',
      },
      {
        text: 'Maaf Pak, saya mau fokus dulu.',
        effects: { relationship: { pakHaji: -10 }, peace: 5 },
        result: 'Pak Haji pergi. Lu tenang, tapi kehilangan peluang.',
      },
    ],
  },

  viralTiktok: {
    id: 'viralTiktok',
    character: 'burt',
    condition: (s) => s.hasTenant && s.day >= 10 && s.reputation >= 10,
    weight: 4,
    dialog: [
      'RAKA! Kos lu viral di TikTok!',
      'Ada yang review kamar lu, viewersnya 2 juta!',
      'Banyak yang nanya DM ke gw nih.',
    ],
    choices: [
      {
        text: 'GAS! Buka pendaftaran! 🚀',
        effects: { money: 2000, reputation: 15, relationship: { burt: 10 } },
        result: 'Penyewa baru daftar. Uang masuk gede!',
      },
      {
        text: 'Wah, alhamdulillah. Tapi santai dulu.',
        effects: { reputation: 5, peace: 5 },
        result: 'Lu senang tapi ga grusak-grusak.',
      },
    ],
  },

  premanNagih: {
    id: 'premanNagih',
    character: 'burt',
    condition: (s) => s.day >= 5 && s.reputation < 10,
    weight: 6,
    dialog: [
      'Raka... ada preman dateng nih.',
      'Katanya minta "uang keamanan" Rp 500.',
      'Kalau ga dikasih, katanya bakal bikin rusuh.',
    ],
    choices: [
      {
        text: 'Ya udah gw bayar, biar aman. 💸',
        effects: { money: -500, peace: 5 },
        result: 'Preman pergi. Lu aman tapi bokek.',
      },
      {
        text: 'Lapor Bu RT & polisi aja!',
        effects: { reputation: 10, relationship: { burt: 15 }, peace: -5 },
        result: 'Bu RT bantu. Preman kabur. Tapi lu deg-degan.',
      },
      {
        text: 'Hajar aja! 💪',
        effects: { reputation: -10, peace: -20, relationship: { burt: -15 } },
        result: 'Lu berantem. Menang, tapi rusuh.',
      },
    ],
  },

  tetanggaBerisik: {
    id: 'tetanggaBerisik',
    character: 'burt',
    condition: (s) => s.day >= 6,
    weight: 5,
    dialog: [
      'Raka, tetangga lu nih berisik banget.',
      'Ada yang karaokean sampe jam 2 pagi.',
      'Lu mau komplain ga?',
    ],
    choices: [
      {
        text: 'Gw tegur baik-baik. 🙏',
        effects: { reputation: 5, relationship: { burt: 10 }, peace: -5 },
        result: 'Tetangga minta maaf. Situasi kondusif.',
      },
      {
        text: 'Ah, biarin aja. Yang penting kos gw aman.',
        effects: { peace: 5, relationship: { burt: -10 } },
        result: 'Bu RT sebel. Tapi lu tenang.',
      },
    ],
  },

  // ============================================================
  // ===== EVENT SARI =====
  // ============================================================
  sariArrives: {
    id: 'sariArrives',
    character: 'sari',
    condition: (s) => s.hasTenant && (s.tier === 'comfort' || s.tier === 'elite') && (s.tenantCount ?? 0) < 3,
    weight: 6,
    dialog: [
      'Halo kak! Gw Sari, anak kuliner.',
      'Denger kos ini udah ada AC-nya ya?',
      'Boleh gw lihat kamarnya?',
    ],
    choices: [
      {
        text: 'Boleh! Sini gw antar. 🙂',
        effects: { tenant: true, money: 800, reputation: 5, relationship: { sari: 20 } },
        result: 'Sari suka. Dia langsung pindah masuk.',
      },
      {
        text: 'Nanti dulu ya, gw lagi sibuk.',
        effects: { relationship: { sari: -10 } },
        result: 'Sari agak kecewa. Tapi sabar.',
      },
    ],
  },

  sariMasak: {
    id: 'sariMasak',
    character: 'sari',
    condition: (s) => s.hasTenant && (s.relationship?.sari ?? 0) >= 40,
    weight: 5,
    dialog: [
      'Kak! Gw masak rendang nih.',
      'Banyak banget, gabisa habis sendiri.',
      'Mau?',
    ],
    choices: [
      {
        text: 'Mau dong! 🍛',
        effects: { relationship: { sari: 15 }, peace: 10 },
        result: 'Lu makan bareng. Enak & tenang.',
      },
      {
        text: 'Nanti aja, gw masih kerja.',
        effects: { relationship: { sari: -5 } },
        result: 'Sari ngangguk. Tapi sedih dikit.',
      },
    ],
  },

  // ============================================================
  // ===== EVENT BAGAS =====
  // ============================================================
  bagasArrives: {
    id: 'bagasArrives',
    character: 'bagas',
    condition: (s) => s.tier === 'elite' && (s.tenantCount ?? 0) < 3,
    weight: 6,
    dialog: [
      'Yo. Gw Bagas, freelancer IT.',
      'Kerja remote, butuh tempat tenang.',
      'WiFi di sini kenceng ga?',
    ],
    choices: [
      {
        text: 'Kenceng banget bro, 100 Mbps! 🚀',
        effects: { tenant: true, money: 2000, reputation: 10, relationship: { bagas: 20 } },
        result: 'Bagas langsung sewa. Dia suka WiFi-nya.',
      },
      {
        text: 'Standar aja sih...',
        effects: { relationship: { bagas: -5 } },
        result: 'Bagas mikir-mikir. Tapi akhirnya masuk.',
      },
    ],
  },

  bagasWebsite: {
    id: 'bagasWebsite',
    character: 'bagas',
    condition: (s) => s.hasTenant && (s.relationship?.bagas ?? 0) >= 40,
    weight: 5,
    dialog: [
      'Bro, kos lu website-nya jelek amat.',
      'Gw bisa bikin yang proper. Gratis.',
      'Biar banyak yang dateng.',
    ],
    choices: [
      {
        text: 'GAS BRO! 🚀',
        effects: { reputation: 15, money: 500, relationship: { bagas: 15 } },
        result: 'Website jadi. Booking naik drastis.',
      },
      {
        text: 'Nanti aja, gw fokus yang lain.',
        effects: { relationship: { bagas: -5 } },
        result: 'Bagas ngangguk. Tapi agak males bantu.',
      },
    ],
  },

  // ============================================================
  // ===== EVENT UPGRADE =====
  // ============================================================
  canUpgrade: {
    id: 'canUpgrade',
    character: 'pakHaji',
    condition: (s) => s.tier === 'basic' && s.money >= 3000,
    weight: 10,
    dialog: [
      'Raka, kos lu udah rame.',
      'Waktunya upgrade nih.',
      'Gw bisa bantu. Mau?',
    ],
    choices: [
      {
        text: 'MAU PAK! Upgrade! 🏡',
        effects: { upgrade: true, relationship: { pakHaji: 15 } },
        result: 'Kos lu naik kelas! Lebih mahal, lebih nyaman.',
      },
      {
        text: 'Nanti aja Pak, masih nabung.',
        effects: { relationship: { pakHaji: -3 } },
        result: 'Pak Haji ngangguk. Sabar.',
      },
    ],
  },

  // ============================================================
  // ===== EVENT DEADLINE (Fase 4A.5) =====
  // ============================================================
  midEvalWarning: {
    id: 'midEvalWarning',
    character: 'burt',
    condition: (s) => s.day >= 12 && s.day <= 14 && s.money < 3000,
    weight: 20, // prioritas tinggi
    dialog: [
      'Raka... hari ke-15 nanti ada evaluasi lho.',
      'Katanya kalau uang lu kurang dari Rp 3.000,',
      'lu harus tutup kos. Kasian...',
      'Makanya kerja yang bener!',
    ],
    choices: [
      {
        text: 'Siap Bu RT! Gw bakal kerja keras! 💪',
        effects: { peace: -5 },
        result: 'Lu makin deg-degan. Tapi semangat.',
      },
      {
        text: 'Yah, gimana ya Bu... 😰',
        effects: { peace: -10, relationship: { burt: -5 } },
        result: 'Bu RT cemberut. Lu panik.',
      },
    ],
  },
};

// ============================================================
// Helper: ambil event yang eligible berdasarkan state
// ============================================================
export function pickEvent(state) {
  const eligible = Object.values(EVENTS).filter((evt) => {
    if (!evt.condition) return false;
    if (evt.weight === 0) return false;

    // Event upgrade cuma muncul kalau tier masih basic
    if (evt.id === 'canUpgrade' && state.tier !== 'basic') return false;

    // Event tenant baru cuma muncul kalau slot masih ada
    if (evt.id === 'sariArrives' && (state.tenantCount ?? 0) >= 3) return false;
    if (evt.id === 'bagasArrives' && (state.tenantCount ?? 0) >= 3) return false;

    // Warning deadline cuma muncul kalau uang kurang
    if (evt.id === 'midEvalWarning' && state.money >= 3000) return false;

    try {
      return evt.condition(state);
    } catch {
      return false;
    }
  });

  if (eligible.length === 0) return null;

  const totalWeight = eligible.reduce((sum, e) => sum + (e.weight || 1), 0);
  let r = Math.random() * totalWeight;
  for (const evt of eligible) {
    r -= evt.weight || 1;
    if (r <= 0) return evt.id;
  }
  return eligible[0].id;
}