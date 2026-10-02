export const CHARACTERS = {
  mc: {
    name: 'Raka',
    role: 'Anak Rantau',
    emoji: '🧑',
    color: 0xfbbf24,
    texture: 'char_mc',
  },
  burt: {
    name: 'Bu RT',
    role: 'Ketua RT 07',
    emoji: '👩',
    color: 0xf472b6,
    texture: 'char_burt',
    relationship: 20,
  },
  pakHaji: {
    name: 'Pak Haji',
    role: 'Pemilik Kos',
    emoji: '🧔',
    color: 0x60a5fa,
    texture: 'char_pakhaji',
    relationship: 30,
  },
  tenant1: {
    name: 'Dimas',
    role: 'Mahasiswa',
    emoji: '🧑‍🎓',
    color: 0x4ade80,
    texture: 'char_tenant1',
    relationship: 10,
  },
  // ===== BARU =====
  sari: {
    name: 'Sari',
    role: 'Anak Kuliner',
    emoji: '🧑‍🍳',
    color: 0xf87171,
    texture: 'char_sari',
    relationship: 15,
  },
  bagas: {
    name: 'Bagas',
    role: 'Freelancer IT',
    emoji: '🧑‍💻',
    color: 0xa78bfa,
    texture: 'char_bagas',
    relationship: 15,
  },
};

export function relLabel(value) {
  if (value >= 80) return '💖 Dekat';
  if (value >= 60) return '😊 Akrab';
  if (value >= 40) return '🙂 Kenal';
  if (value >= 20) return '😐 Biasa';
  if (value >= 0)  return '😒 Dingin';
  return '💢 Musuh';
}