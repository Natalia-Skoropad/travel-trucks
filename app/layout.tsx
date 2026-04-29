import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import {
  DEFAULT_SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from '@/lib/constants/metadata';

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_SITE_DESCRIPTION,
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
