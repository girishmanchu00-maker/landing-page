import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

export const metadata = {
  title: 'Fin2ools - Finance, Tax & Compliance - Made Easy',
  description: 'A fintech solution that makes finance, tax, and compliance easy for students, consultants, and corporates. Calculate taxes, track compliance deadlines, search GST rates, and access statutory audit checklists.',
  keywords: 'Fin2ools, Income tax calculator, GST rate finder, CA compliance calendar, due date tracker, tax filing checklists, Budget 2025 slabs, HRA exemption calculator, TDS calculator',
  icons: {
    icon: [
      { url: '/fin2ools.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    shortcut: '/fin2ools.png',
    apple: '/fin2ools.png',
  },
  openGraph: {
    title: 'Fin2ools - Finance, Tax & Compliance - Made Easy',
    description: 'A fintech solution that makes finance, tax, and compliance easy for students, consultants, and corporates.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} data-theme="light" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
