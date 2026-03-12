import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { RootProvider } from 'fumadocs-ui/provider/next';

import { SiteFooter } from '@/components/footer';
import { siteConfig } from '@/lib/constants';

import './global.css';

const inter = Inter({
  subsets: [
    'latin',
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.docsUrl),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.tagline,
  icons: {
    icon: siteConfig.assets.favicon,
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={inter.className}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen">
        {/* '/docs/api/search' must stay in sync with basePath in next.config.mjs */}
        <RootProvider
          search={{ options: { type: 'static', api: '/docs/api/search' } }}
        >
          {children}
          <SiteFooter />
        </RootProvider>
      </body>
    </html>
  );
}
