import { RootProvider } from 'fumadocs-ui/provider/next';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { appName, appDescription, appUrl } from '@/lib/shared';
import './global.css';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description: appDescription,
  icons: {
    icon: '/brand/masumi-mark.png',
    apple: '/brand/masumi-mark.png',
  },
  openGraph: {
    title: appName,
    description: appDescription,
    url: appUrl,
    siteName: appName,
    images: ['/brand/masumi-mark.png'],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: appName,
    description: appDescription,
    images: ['/brand/masumi-mark.png'],
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
