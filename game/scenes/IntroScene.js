import { playSfx, startBgm } from '../sound';

export function createIntroScene(Phaser) {
  return class IntroScene extends Phaser.Scene {
    constructor() {
      super('IntroScene');
    }

    create() {
      const W = this.scale.width;   // 1280
      const H = this.scale.height;  // 720

      this.add.rectangle(W / 2, H / 2, W, H, 0x0f172a);

      // Decorative
      this.add.circle(180, 180, 260, 0x4f46e5, 0.07);
      this.add.circle(W - 180, H - 180, 320, 0xec4899, 0.05);

      // ===== TITLE =====
      const title = this.add.text(W / 2, 100, '🏘️', { fontSize: '84px' }).setOrigin(0.5);
      const titleText = this.add.text(W / 2, 200, 'Kos-Kosan Jakarta', {
        fontSize: '52px', color: '#fbbf24',
        fontFamily: 'system-ui, sans-serif', fontStyle: 'bold',
      }).setOrigin(0.5);
      const subtitle = this.add.text(W / 2, 260, 'Fase 4D — Full Screen 16:9', {
        fontSize: '17px', color: '#64748b',
        fontFamily: 'system-ui, sans-serif',
      }).setOrigin(0.5);

      title.setAlpha(0);
      titleText.setAlpha(0);
      subtitle.setAlpha(0);
      this.tweens.add({ targets: title, alpha: 1, duration: 700, y: 90 });
      this.tweens.add({ targets: titleText, alpha: 1, duration: 700, delay: 300 });
      this.tweens.add({ targets: subtitle, alpha: 1, duration: 700, delay: 500 });

      // ===== STORY CARD =====
      const cardW = 620;
      const cardH = 260;
      const cardY = 460;

      this.add.rectangle(W / 2, cardY, cardW, cardH, 0x1e293b).setStrokeStyle(2, 0x334155);

      const story = [
        'Namamu Raka. Umur 22.',
        'Baru lulus kuliah, pindah ke Jakarta.',
        'Modal cuma Rp 500.000.',
        'Impian: jadi juragan kos-kosan.',
        '',
        '...coba aja dulu, siapa tau hoki.',
      ];

      story.forEach((line, i) => {
        const isLast = i === story.length - 1;
        const t = this.add.text(W / 2, cardY - cardH / 2 + 45 + i * 30, line, {
          fontSize: isLast ? '15px' : '17px',
          color: isLast ? '#94a3b8' : '#e2e8f0',
          fontFamily: 'system-ui, sans-serif',
          fontStyle: isLast ? 'italic' : 'normal',
        }).setOrigin(0.5);
        t.setAlpha(0);
        this.tweens.add({ targets: t, alpha: 1, duration: 400, delay: 900 + i * 300 });
      });

      // ===== BUTTON =====
      this.time.delayedCall(900 + story.length * 300 + 300, () => {
        const btn = this.add
          .rectangle(W / 2, 650, 340, 72, 0xf59e0b)
          .setStrokeStyle(3, 0xfbbf24)
          .setInteractive({ useHandCursor: true });

        const btnText = this.add.text(W / 2, 650, '▶️  MULAI HIDUP BARU', {
          fontSize: '20px', color: '#0f172a',
          fontFamily: 'system-ui, sans-serif', fontStyle: 'bold',
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
          scale: 1.04, duration: 800, yoyo: true, repeat: -1,
          ease: 'Sine.easeInOut',
        });
      });
    }
  };
}