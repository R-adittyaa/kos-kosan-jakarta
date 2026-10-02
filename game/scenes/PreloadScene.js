import { CHARACTERS } from '../data/characters';

export function createPreloadScene(Phaser) {
  return class PreloadScene extends Phaser.Scene {
    constructor() {
      super('PreloadScene');
    }

    preload() {
      Object.values(CHARACTERS).forEach((char) => {
        this.makeCharTexture(char.texture, char.color, char.emoji);
      });

      this.makeBgTexture('bg_room', 0x334155);
      this.makeBgTexture('bg_floor', 0x78350f);
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

    makeBgTexture(key, color) {
      const g = this.add.graphics();
      g.fillStyle(color, 1);
      g.fillRect(0, 0, 4, 4);
      g.generateTexture(key, 4, 4);
      g.destroy();
    }

    create() {
      this.scene.start('IntroScene');
    }
  };
}