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

      // Tunggu font Google selesai load sebelum Phaser init
      if (document.fonts && document.fonts.ready) {
        try {
          await document.fonts.ready;
        } catch {}
      }

      const config = createGameConfig(Phaser);
      game = new Phaser.Game({
        ...config,
        parent: containerRef.current,
      });
      gameRef.current = game;

      // Paksa canvas style setelah Phaser init
      setTimeout(() => {
        const canvas = containerRef.current?.querySelector('canvas');
        if (canvas) {
          canvas.style.maxWidth = '100vw';
          canvas.style.maxHeight = '100dvh';
          canvas.style.width = 'auto';
          canvas.style.height = 'auto';
        }
      }, 100);
    })();

    return () => {
      mounted = false;
      game?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div ref={containerRef} id="game-container" />;
}