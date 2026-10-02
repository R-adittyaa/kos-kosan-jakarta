export const TIERS = {
  basic: {
    id: 'basic',
    name: 'Kos Biasa',
    emoji: '🏠',
    description: 'Kos sederhana, kamar 3x3, kipas angin.',
    upgradeCost: 0,
    rentPerDay: 300,
    dailyCost: 100,        // ← BARU
    maxTenants: 1,
    bonusReputation: 0,
    dailyEnergy: 8,        // ← BARU
  },
  comfort: {
    id: 'comfort',
    name: 'Kos Nyaman',
    emoji: '🏡',
    description: 'Kamar mandi dalam, AC, WiFi.',
    upgradeCost: 3000,
    rentPerDay: 800,
    dailyCost: 200,        // ← BARU
    maxTenants: 2,
    bonusReputation: 5,
    dailyEnergy: 8,
  },
  elite: {
    id: 'elite',
    name: 'Kos Elite',
    emoji: '🏰',
    description: 'Fully furnished, kolam renang mini, keamanan 24 jam.',
    upgradeCost: 10000,
    rentPerDay: 2000,
    dailyCost: 400,        // ← BARU
    maxTenants: 3,
    bonusReputation: 15,
    dailyEnergy: 8,
  },
};

export const TIER_ORDER = ['basic', 'comfort', 'elite'];

export function nextTier(currentId) {
  const idx = TIER_ORDER.indexOf(currentId);
  if (idx < 0 || idx >= TIER_ORDER.length - 1) return null;
  return TIERS[TIER_ORDER[idx + 1]];
}