import { CHARACTERS } from '../data/characters';

export function createPreloadScene(Phaser) {
  return class PreloadScene extends Phaser.Scene {
    constructor() {
      super('PreloadScene');
    }

    preload() {
      const { width, height } = this.scale;

      // ===== LOADING TEXT =====
      const loadingText = this.add.text(width / 2, height / 2 - 30, 'Memuat aset...', {
        fontSize: '20px',
        color: '#94a3b8',
        fontFamily: 'Rubik, system-ui, sans-serif',
      }).setOrigin(0.5);

      const progressText = this.add.text(width / 2, height / 2 + 30, '0%', {
        fontSize: '14px',
        color: '#64748b',
        fontFamily: 'Rubik, system-ui, sans-serif',
      }).setOrigin(0.5);

      // Progress bar
      const barW = 400;
      const barH = 8;
      const barY = height / 2;

      const barBg = this.add.rectangle(width / 2, barY, barW, barH, 0x1e293b)
        .setStrokeStyle(2, 0x334155);
      const barFill = this.add.rectangle(width / 2 - barW / 2, barY, 0, barH, 0x6366f1)
        .setOrigin(0, 0.5);

      this.load.on('progress', (value) => {
        barFill.width = barW * value;
        progressText.setText(`${Math.floor(value * 100)}%`);
      });

      this.load.on('complete', () => {
        loadingText.destroy();
        progressText.destroy();
        barBg.destroy();
        barFill.destroy();
      });

      // ===== SPRITE BENERAN (dari Pixel Spaces) =====
      this.load.image('char_mc',   '/assets/characters/mc.png');
      this.load.image('char_burt', '/assets/characters/burt.png');

      // ===== FURNITURE =====
      this.load.image('furniture_door',        '/assets/furniture/door.png');
      this.load.image('furniture_door_closed', '/assets/furniture/door_closed.png');
      this.load.image('furniture_stairs',      '/assets/furniture/stairs.png');
      this.load.image('furniture_light1',      '/assets/furniture/light1.png');
      this.load.image('furniture_light2',      '/assets/furniture/light2.png');
      this.load.image('furniture_light3',      '/assets/furniture/light3.png');

      // Catat kalau ada yang gagal load
      this.load.on('loaderror', (file) => {
        console.warn(`⚠️ Gagal load: ${file.key} dari ${file.src}`);
      });
    }

    create() {
      // Fallback: generate emoji texture buat karakter yang ga punya PNG
      Object.values(CHARACTERS).forEach((char) => {
        if (!this.textures.exists(char.texture)) {
          console.log(`🎨 Fallback emoji: ${char.name}`);
          this.makeCharTexture(char.texture, char.color, char.emoji);
        }
      });

      this.scene.start('IntroScene');
    }

    makeCharTexture(key, color, emoji) {
      const size = 96;
      const g = this.add.graphics();
      g.fillStyle(color, 1);
      g.fillRoundedRect(0, 0, size, size, 16);
      g.lineStyle(3, 0xffffff, 0.3);
      g.strokeRoundedRect(0, 0, size, size, 16);
      g.generateTexture(key, size, size);
      g.destroy();

      const canvas = this.textures.get(key).getSourceImage();
      const ctx = canvas.getContext('2d');
      ctx.font = '56px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, size / 2, size / 2 + 4);
      this.textures.get(key).refresh();
    }
  };
}