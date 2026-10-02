import { playSfx, startBgm } from '../sound';

export function createIntroScene(Phaser) {
  return class IntroScene extends Phaser.Scene {
    constructor() {
      super('IntroScene');
    }

    create() {
      const W = this.scale.width;
      const H = this.scale.height;

      this.add.rectangle(W / 2, H / 2, W, H, 0x0f172a);

      // Title
      const title = this.add.text(W / 2, 120, '🏘️ Kos-Kosan Jakarta', {
        fontSize: '42px',
        color: '#fbbf24',
        fontFamily: 'system-ui, sans-serif',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      const subtitle = this.add.text(W / 2, 180, 'Fase 1 — Anak Rantau', {
        fontSize: '18px',
        color: '#94a3b8',
        fontFamily: 'system-ui, sans-serif',
      }).setOrigin(0.5);

      title.setAlpha(0);
      subtitle.setAlpha(0);
      this.tweens.add({ targets: title, alpha: 1, duration: 800 });
      this.tweens.add({ targets: subtitle, alpha: 1, duration: 800, delay: 400 });

      // Cerita
      const story = [
        'Namamu Raka. Umur 22.',
        'Baru lulus kuliah, pindah ke Jakarta.',
        'Modal cuma Rp 500.000.',
        'Impian: jadi juragan kos-kosan.',
        '',
        '...coba aja dulu, siapa tau hoki.',
      ];

      story.forEach((line, i) => {
        const t = this.add.text(W / 2, 260 + i * 30, line, {
          fontSize: '16px',
          color: '#e2e8f0',
          fontFamily: 'system-ui, sans-serif',
        }).setOrigin(0.5);
        t.setAlpha(0);
        this.tweens.add({ targets: t, alpha: 1, duration: 500, delay: 1000 + i * 400 });
      });

      // Tombol mulai (muncul terakhir)
      this.time.delayedCall(1000 + story.length * 400 + 500, () => {
        const btn = this.add
          .rectangle(W / 2, 500, 240, 60, 0xf59e0b)
          .setStrokeStyle(3, 0xfbbf24)
          .setInteractive({ useHandCursor: true });

        const btnText = this.add.text(W / 2, 500, '▶️  MULAI HIDUP BARU', {
          fontSize: '18px',
          color: '#0f172a',
          fontFamily: 'system-ui, sans-serif',
          fontStyle: 'bold',
        }).setOrigin(0.5);

        btn.on('pointerover', () => btn.setFillStyle(0xfbbf24));
        btn.on('pointerout', () => btn.setFillStyle(0xf59e0b));
        btn.on('pointerdown', () => {
          playSfx('levelup');
          startBgm();
          this.cameras.main.fadeOut(500, 0, 0, 0);
          this.time.delayedCall(500, () => this.scene.start('MainScene'));
        });

        this.tweens.add({
          targets: [btn, btnText],
          scale: 1.05,
          duration: 700,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      });
    }
  };
}