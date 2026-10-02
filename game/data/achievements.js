export const ACHIEVEMENTS = {
  firstTenant: {
    id: 'firstTenant',
    emoji: '🎉',
    name: 'Penghuni Pertama',
    description: 'Dapetin penghuni kos pertama kali.',
    check: (s) => s.hasTenant === true,
  },
  richMan: {
    id: 'richMan',
    emoji: '💰',
    name: 'Kaya Raya',
    description: 'Punya uang lebih dari Rp 5.000.',
    check: (s) => s.money >= 5000,
  },
  upgradeComfort: {
    id: 'upgradeComfort',
    emoji: '🏡',
    name: 'Naik Kelas',
    description: 'Upgrade kos ke Kos Nyaman.',
    check: (s) => s.tier === 'comfort' || s.tier === 'elite',
  },
  upgradeElite: {
    id: 'upgradeElite',
    emoji: '🏰',
    name: 'Juragan Elite',
    description: 'Upgrade kos ke Kos Elite.',
    check: (s) => s.tier === 'elite',
  },
  gossipMaster: {
    id: 'gossipMaster',
    emoji: '👑',
    name: 'Raja Gosip',
    description: 'Relationship dengan Bu RT mencapai 70+.',
    check: (s) => (s.relationship?.burt ?? 0) >= 70,
  },
  bestFriend: {
    id: 'bestFriend',
    emoji: '💖',
    name: 'Sahabat Sejati',
    description: 'Relationship dengan salah satu karakter 90+.',
    check: (s) => Object.values(s.relationship || {}).some((v) => v >= 90),
  },
  multitasking: {
    id: 'multitasking',
    emoji: '👥',
    name: 'Multitasking',
    description: 'Punya 3 penghuni sekaligus.',
    check: (s) => (s.tenantCount || 0) >= 3,
  },
  survivor: {
    id: 'survivor',
    emoji: '🏆',
    name: 'Survivor',
    description: 'Lewatin 30 hari tanpa bangkrut.',
    check: (s) => s.day > 30 && s.money >= 0,
  },
};

export function checkAchievements(state, unlocked) {
  const newlyUnlocked = [];
  Object.values(ACHIEVEMENTS).forEach((ach) => {
    if (unlocked[ach.id]) return;
    try {
      if (ach.check(state)) {
        unlocked[ach.id] = true;
        newlyUnlocked.push(ach);
      }
    } catch {}
  });
  return newlyUnlocked;
}