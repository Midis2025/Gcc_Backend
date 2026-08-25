import React from 'react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '@/styles/theme.css';

// Brand typeface, matching the public Gulf Connect Consultancy site.
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-primary',
});

export const metadata = {
  title: 'GCC Backend & CMS',
  description: 'Gulf Connect Consultancy Backend API & Admin CMS Portal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
