import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Kos-Kosan Jakarta';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          fontFamily: 'system-ui',
        }}
      >
        <div style={{ fontSize: 120, marginBottom: 20 }}>🏘️</div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #fbbf24, #f97316, #f43f5e)',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: 20,
          }}
        >
          Kos-Kosan Jakarta
        </div>
        <div style={{ fontSize: 32, color: '#94a3b8' }}>
          Anak rantau · Modal tipis · Mimpi jadi juragan
        </div>
        <div
          style={{
            marginTop: 40,
            padding: '16px 40px',
            background: '#f59e0b',
            color: '#0f172a',
            borderRadius: 16,
            fontSize: 24,
            fontWeight: 'bold',
          }}
        >
          🎮 Main Gratis
        </div>
      </div>
    ),
    { ...size }
  );
}