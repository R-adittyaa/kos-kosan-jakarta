'use client';

import { useEffect, useRef } from 'react';
import { createGameConfig } from '@/game/config';

export default function PhaserGame() {
  const gameRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let game;
    let mounted = true;

    (async () => {
      const Phaser = (await import('phaser')).default;
      if (!mounted || gameRef.current) return;

      // Tunggu font Google max 2 detik, biar ga stuck kalau gagal
      if (document.fonts && document.fonts.ready) {
        await Promise.race([
          document.fonts.ready,
          new Promise((resolve) => setTimeout(resolve, 2000)),
        ]);
      }

      const config = createGameConfig(Phaser);
      game = new Phaser.Game({
        ...config,
        parent: containerRef.current,
      });
      gameRef.current = game;
    })();

    return () => {
      mounted = false;
      game?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div ref={containerRef} id="game-container" />;
}