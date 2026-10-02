import { createBootScene } from './scenes/BootScene';
import { createPreloadScene } from './scenes/PreloadScene';
import { createIntroScene } from './scenes/IntroScene';
import { createMainScene } from './scenes/MainScene';
import { createEndingScene } from './scenes/EndingScene';

export function createGameConfig(Phaser) {
  const BootScene = createBootScene(Phaser);
  const PreloadScene = createPreloadScene(Phaser);
  const IntroScene = createIntroScene(Phaser);
  const MainScene = createMainScene(Phaser);
  const EndingScene = createEndingScene(Phaser);

  return {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#0f172a',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: { gravity: { y: 0 }, debug: false },
    },
    scene: [BootScene, PreloadScene, IntroScene, MainScene, EndingScene],
  };
}