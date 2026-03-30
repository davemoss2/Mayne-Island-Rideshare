import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import Header from '@/components/Header';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: 'Mayne Island Rideshare - Community Volunteer Transportation',
  description: 'Free volunteer rideshare service for the Mayne Island community in BC, Canada',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          <DataProvider>
            <Header />
            <main className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
              {children}
            </main>
            <Analytics />
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
