import type { Metadata } from 'next';
import './globals.css';
import 'tailwindcss/tailwind.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';

export const metadata: Metadata = {
  title: 'Health Check in',
  description: 'Health-checkin-app for teams',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <UserProvider>
        <body className={`relative`}>{children}</body>
      </UserProvider>
    </html>
  );
}
