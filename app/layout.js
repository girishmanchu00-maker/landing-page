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
  title: 'FinEzy — Premium CA & Compliance Resource Portal',
  description: 'Calculate taxes (Income Tax, HRA, TDS, Advance Tax), search GST rates, track upcoming due dates, view ITR filing checklists, and explore Budget 2025 highlights. Built for CA professionals, students, and businesses.',
  keywords: 'Income tax calculator, GST rate finder, CA compliance calendar, due date tracker, tax filing checklists, Budget 2025 slabs, HRA exemption calculator, TDS calculator',
  openGraph: {
    title: 'FinEzy — Premium CA & Compliance Resource Portal',
    description: 'All-in-one financial resource suite with calculators, due dates, GST rate finder, checklist persistence, and modern dashboard.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} data-theme="light">
      <body>
        {children}
      </body>
    </html>
  );
}
