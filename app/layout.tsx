import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import TanStackProvider from '@/components/common/TanStackProvider/TanStackProvider';
import Header from '@/components/header/Header/Header';
import './globals.css';

//===========================================================================

const inter = Inter({
  variable: '--font-family',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

//===========================================================================

const SITE_URL = 'https://travel-trucks-five-liart.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'TravelTrucks | Camper rental service',
    template: '%s | TravelTrucks',
  },
  description:
    'TravelTrucks is a camper rental service where you can explore, compare and book campers for your next adventure.',

  openGraph: {
    title: 'TravelTrucks | Camper rental service',
    description:
      'Explore, compare and book campers for your next adventure with TravelTrucks.',
    url: SITE_URL,
    siteName: 'TravelTrucks',
    images: [
      {
        url: '/background-picture.jpg',
        width: 1200,
        height: 630,
        alt: 'TravelTrucks camper rental',
      },
    ],
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'TravelTrucks | Camper rental service',
    description:
      'Explore, compare and book campers for your next adventure with TravelTrucks.',
    images: ['/background-picture.jpg'],
  },
};

//===========================================================================

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <TanStackProvider>
          <Header />
          {children}
        </TanStackProvider>
      </body>
    </html>
  );
}

export default RootLayout;
