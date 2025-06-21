import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import RootLayoutClient from './RootLayoutClient';

// Font must be defined in the server component
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Transaction Processor',
  description: 'SignaPay Transaction Processor Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootLayoutClient inter={inter}>{children}</RootLayoutClient>;
}
