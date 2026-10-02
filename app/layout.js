import './globals.css';

export const metadata = {
  title: 'Sewa Apartemen 🏢',
  description: 'Game sim sederhana — sewa apartemen & cari penyewa',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-slate-900 text-white antialiased">
        {children}
      </body>
    </html>
  );
}