import { Metadata } from 'next';
import { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'TODOS',
  description: 'My TODO list app',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bg-gray-800">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
