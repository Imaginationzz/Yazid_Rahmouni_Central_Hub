import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VisitTracker from '@/components/VisitTracker';

export const metadata = {
  metadataBase: new URL('https://yazidrahmouni.com'),
  title: {
    default: 'Yazid Rahmouni | Personal Portal',
    template: '%s | Yazid Rahmouni'
  },
  description: 'Professional portfolio and central hub of Yazid Rahmouni. Showcase of web projects, insightful articles, and professional experience.',
  keywords: ['Yazid Rahmouni', 'Portfolio', 'Web Developer', 'Software Engineer', 'Technical Articles', 'Personal Portal'],
  authors: [{ name: 'Yazid Rahmouni' }],
  creator: 'Yazid Rahmouni',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yazidrahmouni.com',
    siteName: 'Yazid Rahmouni Portal',
    title: 'Yazid Rahmouni | Personal Portal',
    description: 'Explore the work, articles, and professional journey of Yazid Rahmouni.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Yazid Rahmouni Branding'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yazid Rahmouni | Personal Portal',
    description: 'Explore the work, articles, and professional journey of Yazid Rahmouni.',
    images: ['/logo.png'],
  },
  manifest: '/manifest.json',
  icons: {
    apple: '/icon_512x512px.png',
  },
  themeColor: '#0b0c10',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <VisitTracker />
          <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main className="page-wrapper" style={{ flex: 1 }}>
              {children}
            </main>
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
