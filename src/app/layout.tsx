import './globals.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'moit | 모두의 만남을 잇다, 모잇',
  description: '모잇으로 모임 일정을 쉽고 빠르게 조율해보세요',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#f5f5f5] antialiased`}
      >
        <div className='mx-auto w-full max-w-screen-sm bg-white'>
          {children}
        </div>
      </body>
    </html>
  );
}
