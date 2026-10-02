import './globals.css';
import { Press_Start_2P, Rubik } from 'next/font/google';

const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
});

const bodyFont = Rubik({
  weight: ['400', '500', '700', '800'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://kos-kosan-jakarta.vercel.app'),
  title: {
    default: 'Kos-Kosan Jakarta — Game Sim Anak Rantau',
    template: '%s · Kos-Kosan Jakarta',
  },
  description:
    'Game simulasi santai: jadi anak rantau di Jakarta, kelola kos-kosan, cari penyewa, dan jadi juragan kos sejati. Main gratis di browser!',
  keywords: [
    'game indonesia',
    'game browser',
    'simulasi kos',
    'idle game',
    'game santai',
    'kos-kosan jakarta',
    'game phaser',
  ],
  authors: [{ name: 'Raka' }],
  openGraph: {
    title: 'Kos-Kosan Jakarta — Game Sim Anak Rantau',
    description:
      'Dari modal Rp 500.000 jadi juragan kos. Main gratis di browser!',
    url: '/',
    siteName: 'Kos-Kosan Jakarta',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kos-Kosan Jakarta — Game Sim Anak Rantau',
    description: 'Dari modal Rp 500.000 jadi juragan kos. Main gratis!',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f172a',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${pixelFont.variable} ${bodyFont.variable}`}>
      <body className="bg-slate-950 text-white antialiased">{children}</body>
    </html>
  );
}