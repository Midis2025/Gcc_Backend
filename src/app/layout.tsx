import { ClerkProvider } from '@clerk/nextjs';
import React from 'react';
import { Plus_Jakarta_Sans, Outfit, JetBrains_Mono } from 'next/font/google';
import '@/styles/theme.css';

// Brand primary typeface
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-primary',
});

// Human display & heading typeface
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-heading',
});

// Precision tabular numeral font
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-numeral',
});

export const metadata = {
  title: 'GCC Backend & CMS',
  description: 'Gulf Connect Consultancy Backend API & Admin CMS Portal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${outfit.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}