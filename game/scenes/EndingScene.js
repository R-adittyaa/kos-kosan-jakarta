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
      const W = this.scale.width;
      const H = this.scale.height;
      const s = this.finalState;

      this.add.rectangle(W / 2, H / 2, W, H, 0x0f172a);

      const relValues = Object.values(s.relationship || {});
      const avgRel = relValues.length
        ? relValues.reduce((a, b) => a + b, 0) / relValues.length
        : 0;
      const unlockedCount = Object.keys(s.achievements || {}).length;
      const totalAch = Object.keys(ACHIEVEMENTS).length;

      // ===== TENTUKAN ENDING (PRIORITAS) =====
      let ending;

      if (this.forceReason === 'midfail') {
        ending = {
          title: '💀 BANGKRUT DI TENGAH JALAN',
          color: '#f87171',
          desc: [
            'Evaluasi hari ke-15...',
            'Uang lu kurang dari Rp 3.000.',
            'Bu RT geleng-geleng kepala.',
            'Pak Haji angkat tangan.',
            '...ini akhirnya.',
          ],
        };
        playSfx('bad');
      } else if (s.money < 0) {
        ending = {
          title: '💀 BANGKRUT',
          color: '#f87171',
          desc: [
            'Uang lu minus, Raka.',
            'Ga bisa bayar apa-apa lagi.',
            'Penghuni kabur satu-satu.',
            'Jakarta terlalu keras.',
          ],
        };
        playSfx('bad');
      } else if (s.money >= 8000 && s.tier === 'elite' && avgRel >= 50) {
        ending = {
          title: '🏆 JURAGAN KOS SEJATI',
          color: '#fbbf24',
          desc: [
            'Raka... lu LUAR BIASA.',
            'Dari modal Rp 500.000,',
            'jadi juragan kos elite di Jakarta.',
            'Semua orang respect sama lu.',
          ],
        };
        playSfx('levelup');
      } else if (avgRel >= 60 && s.peace >= 50) {
        ending = {
          title: '😊 KOS NYAMAN',
          color: '#60a5fa',
          desc: [
            'Kos lu bukan yang termewah,',
            'tapi paling nyaman sedaerah.',
            'Semua penghuni betah.',
            'Bu RT aja sering ngopi di teras lu.',
          ],
        };
        playSfx('levelup');
      } else if (s.tier === 'elite') {
        ending = {
          title: '🏰 PENGUSAHA MUDA',
          color: '#a78bfa',
          desc: [
            'Kos elite lu jalan lancar.',
            'Uang mengalir, tapi...',
            'ada yang kurang.',
            'Mungkin soal pertemanan?',
          ],
        };
      } else {
        ending = {
          title: '😐 GITU-GITU AJA',
          color: '#94a3b8',
          desc: [
            'Hari terakhir.',
            'Kos lu masih berdiri.',
            'Tapi... ya gitu deh.',
            'Mungkin lain kali, Raka.',
          ],
        };
      }

      // ===== RENDER TITLE =====
      const title = this.add.text(W / 2, 80, ending.title, {
        fontSize: '36px', color: ending.color,
        fontFamily: 'system-ui, sans-serif', fontStyle: 'bold',
      }).setOrigin(0.5);
      title.setAlpha(0);
      this.tweens.add({ targets: title, alpha: 1, duration: 800 });

      // ===== RENDER DESC =====
      ending.desc.forEach((line, i) => {
        const t = this.add.text(W / 2, 140 + i * 24, line, {
          fontSize: '15px', color: '#e2e8f0',
          fontFamily: 'system-ui, sans-serif',
        }).setOrigin(0.5);
        t.setAlpha(0);
        this.tweens.add({ targets: t, alpha: 1, duration: 500, delay: 800 + i * 200 });
      });

      // ===== STATS RECAP =====
      this.time.delayedCall(1800, () => {
        const tierInfo = TIERS[s.tier] || TIERS.basic;
        const stats = [
          `💰 Rp ${s.money}   ⭐ ${s.reputation}   😌 ${s.peace}`,
          `${tierInfo.emoji} ${tierInfo.name}   👥 ${s.tenantCount || 0} penyewa   📅 ${s.day} hari`,
          `👩 Bu RT: ${relLabel(s.relationship?.burt ?? 0)}   🧔 Pak Haji: ${relLabel(s.relationship?.pakHaji ?? 0)}`,
          `🧑‍🎓 Dimas: ${relLabel(s.relationship?.tenant1 ?? 0)}   🧑‍🍳 Sari: ${relLabel(s.relationship?.sari ?? 0)}   🧑‍💻 Bagas: ${relLabel(s.relationship?.bagas ?? 0)}`,
        ];

        stats.forEach((line, i) => {
          const t = this.add.text(W / 2, 280 + i * 26, line, {
            fontSize: '14px', color: '#94a3b8',
            fontFamily: 'system-ui, sans-serif',
          }).setOrigin(0.5);
          t.setAlpha(0);
          this.tweens.add({ targets: t, alpha: 1, duration: 400, delay: i * 150 });
        });

        // Achievement counter
        const achText = this.add.text(W / 2, 410,
          `🏆 Achievement: ${unlockedCount} / ${totalAch}`, {
          fontSize: '16px', color: '#fbbf24',
          fontFamily: 'system-ui, sans-serif', fontStyle: 'bold',
        }).setOrigin(0.5);
        achText.setAlpha(0);
        this.tweens.add({ targets: achText, alpha: 1, duration: 500, delay: 700 });

        // Daftar achievement (grid 3 kolom)
        const unlockedList = Object.keys(s.achievements || {})
          .map((id) => ACHIEVEMENTS[id])
          .filter(Boolean);

        const cols = 3;
        const cellW = 250;
        const startX = W / 2 - ((cols - 1) * cellW) / 2;

        unlockedList.forEach((ach, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = startX + col * cellW;
          const y = 445 + row * 22;

          const t = this.add.text(x, y, `${ach.emoji} ${ach.name}`, {
            fontSize: '12px', color: '#cbd5e1',
            fontFamily: 'system-ui, sans-serif',
          }).setOrigin(0.5);
          t.setAlpha(0);
          this.tweens.add({ targets: t, alpha: 1, duration: 300, delay: 1200 + i * 100 });
        });
      });

      // ===== TOMBOL MAIN LAGI =====
      this.time.delayedCall(3200, () => {
        const btn = this.add
          .rectangle(W / 2, H - 45, 260, 50, 0x4f46e5)
          .setStrokeStyle(2, 0x6366f1)
          .setInteractive({ useHandCursor: true });

        const btnText = this.add.text(W / 2, H - 45, '🔄 MAIN LAGI', {
          fontSize: '17px', color: '#ffffff',
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
          scale: 1.03,
          duration: 800,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      });
    }
  };
}