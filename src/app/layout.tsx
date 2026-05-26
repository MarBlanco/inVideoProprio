import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'InVideoProprio - Genera videos virales de artículos',
  description: 'Convierte artículos en videos virales para TikTok, Instagram Reels y YouTube Shorts con IA',
  keywords: 'video generator, AI, TikTok, Instagram Reels, YouTube Shorts'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gradient-dark text-white min-h-screen">
        <main>{children}</main>
      </body>
    </html>
  );
}
