import { relLabel } from '../data/characters';
import { ACHIEVEMENTS } from '../data/achievements';
import { TIERS } from '../data/apartments';
import { playSfx } from '../sound';

export function createEndingScene(Phaser) {
  return class EndingScene extends Phaser.Scene {
    constructor() {
      super('EndingScene');
    }

    init(data) {
      this.finalState = data.state;
      this.forceReason = data.forceReason || null;
    }

    create() {
      const W = this.scale.width;   // 1280
      const H = this.scale.height;  // 720
      const s = this.finalState;

      this.add.rectangle(W / 2, H / 2, W, H, 0x0f172a);
      this.add.circle(150, 150, 280, 0x4f46e5, 0.06);
      this.add.circle(W - 150, H - 150, 320, 0xec4899, 0.05);

      const relValues = Object.values(s.relationship || {});
      const avgRel = relValues.length
        ? relValues.reduce((a, b) => a + b, 0) / relValues.length
        : 0;
      const unlockedCount = Object.keys(s.achievements || {}).length;
      const totalAch = Object.keys(ACHIEVEMENTS).length;

      let ending;
      if (this.forceReason === 'midfail') {
        ending = {
          title: '💀 BANGKRUT DI TENGAH JALAN',
          color: '#f87171',
          desc: ['Evaluasi hari ke-15...', 'Uang lu kurang dari Rp 3.000.', 'Bu RT geleng-geleng kepala.', '...ini akhirnya.'],
        };
        playSfx('bad');
      } else if (s.money < 0) {
        ending = {
          title: '💀 BANGKRUT',
          color: '#f87171',
          desc: ['Uang lu minus, Raka.', 'Ga bisa bayar apa-apa lagi.', 'Jakarta terlalu keras.'],
        };
        playSfx('bad');
      } else if (s.money >= 8000 && s.tier === 'elite' && avgRel >= 50) {
        ending = {
          title: '🏆 JURAGAN KOS SEJATI',
          color: '#fbbf24',
          desc: ['Raka... lu LUAR BIASA.', 'Dari modal Rp 500.000,', 'jadi juragan kos elite.'],
        };
        playSfx('levelup');
      } else if (avgRel >= 60 && s.peace >= 50) {
        ending = {
          title: '😊 KOS NYAMAN',
          color: '#60a5fa',
          desc: ['Kos lu bukan yang termewah,', 'tapi paling nyaman.', 'Bu RT sering ngopi di teras lu.'],
        };
        playSfx('levelup');
      } else if (s.tier === 'elite') {
        ending = {
          title: '🏰 PENGUSAHA MUDA',
          color: '#a78bfa',
          desc: ['Kos elite lu jalan lancar.', 'Uang mengalir...', 'tapi ada yang kurang.'],
        };
      } else {
        ending = {
          title: '😐 GITU-GITU AJA',
          color: '#94a3b8',
          desc: ['Hari terakhir.', 'Kos lu masih berdiri.', 'Mungkin lain kali, Raka.'],
        };
      }

      // Title
      const title = this.add.text(W / 2, 90, ending.title, {
        fontSize: '48px', color: ending.color,
        fontFamily: 'system-ui, sans-serif', fontStyle: 'bold',
      }).setOrigin(0.5);
      title.setAlpha(0);
      this.tweens.add({ targets: title, alpha: 1, duration: 800 });

      // Desc
      ending.desc.forEach((line, i) => {
        const t = this.add.text(W / 2, 170 + i * 30, line, {
          fontSize: '17px', color: '#e2e8f0',
          fontFamily: 'system-ui, sans-serif',
        }).setOrigin(0.5);
        t.setAlpha(0);
        this.tweens.add({ targets: t, alpha: 1, duration: 500, delay: 800 + i * 200 });
      });

      // Stats recap
      this.time.delayedCall(1600, () => {
        const tierInfo = TIERS[s.tier] || TIERS.basic;
        const recapY = 380;
        const recapW = 900;
        const recapH = 200;

        this.add.rectangle(W / 2, recapY, recapW, recapH, 0x1e293b).setStrokeStyle(2, 0x334155);

        const colW = (recapW - 80) / 2;
        const rowH = 60;
        const startX = W / 2 - recapW / 2 + 40;
        const startY = recapY - recapH / 2 + 40;

        const stats = [
          { icon: '💰', label: 'Uang', value: `Rp ${s.money}`, color: '#4ade80' },
          { icon: '⭐', label: 'Reputasi', value: `${s.reputation}`, color: '#fbbf24' },
          { icon: tierInfo.emoji, label: 'Tipe Kos', value: tierInfo.name, color: '#60a5fa' },
          { icon: '👥', label: 'Penyewa', value: `${s.tenantCount || 0} orang`, color: '#a78bfa' },
        ];

        stats.forEach((stat, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = startX + col * (colW + 20);
          const y = startY + row * rowH + 20;

          this.add.text(x, y, stat.icon, { fontSize: '26px' }).setOrigin(0, 0.5);
          this.add.text(x + 42, y - 12, stat.label, {
            fontSize: '12px', color: '#94a3b8',
            fontFamily: 'system-ui, sans-serif',
          }).setOrigin(0, 0.5);
          this.add.text(x + 42, y + 12, stat.value, {
            fontSize: '17px', color: stat.color,
            fontFamily: 'system-ui, sans-serif', fontStyle: 'bold',
          }).setOrigin(0, 0.5);
        });
      });

      // Achievements
      this.time.delayedCall(2400, () => {
        const achY = 520;
        this.add.text(W / 2, achY, `🏆 Achievement: ${unlockedCount} / ${totalAch}`, {
          fontSize: '18px', color: '#fbbf24',
          fontFamily: 'system-ui, sans-serif', fontStyle: 'bold',
        }).setOrigin(0.5);

        const unlockedList = Object.keys(s.achievements || {})
          .map((id) => ACHIEVEMENTS[id])
          .filter(Boolean);

        const cols = 4;
        const cellW = 280;
        const startX = W / 2 - ((cols - 1) * cellW) / 2;

        unlockedList.forEach((ach, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = startX + col * cellW;
          const y = achY + 36 + row * 26;

          const t = this.add.text(x, y, `${ach.emoji} ${ach.name}`, {
            fontSize: '13px', color: '#cbd5e1',
            fontFamily: 'system-ui, sans-serif',
          }).setOrigin(0.5);
          t.setAlpha(0);
          this.tweens.add({ targets: t, alpha: 1, duration: 300, delay: i * 80 });
        });
      });

      // Tombol main lagi
      this.time.delayedCall(3200, () => {
        const btn = this.add
          .rectangle(W / 2, H - 50, 320, 60, 0x4f46e5)
          .setStrokeStyle(2, 0x6366f1)
          .setInteractive({ useHandCursor: true });

        const btnText = this.add.text(W / 2, H - 50, '🔄 MAIN LAGI', {
          fontSize: '19px', color: '#ffffff',
          fontFamily: 'system-ui, sans-serif', fontStyle: 'bold',
        }).setOrigin(0.5);

        btn.on('pointerover', () => btn.setFillStyle(0x6366f1));
        btn.on('pointerout',  () => btn.setFillStyle(0x4f46e5));
        btn.on('pointerdown', () => {
          playSfx('levelup');
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem('kos-jakarta-save-v1');
          }
          this.scene.start('IntroScene');
        });

        this.tweens.add({
          targets: [btn, btnText],
          scale: 1.03, duration: 800, yoyo: true, repeat: -1,
          ease: 'Sine.easeInOut',
        });
      });
    }
  };
}