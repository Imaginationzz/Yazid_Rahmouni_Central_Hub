import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VisitTracker from '@/components/VisitTracker';

export const metadata = {
  title: 'Yazid Rahmouni Portfolio',
  description: 'Showcase of skills, articles, and web projects',
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
