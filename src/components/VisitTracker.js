'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track admin pages
    if (pathname.startsWith('/admin')) return;

    fetch('/api/visits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: pathname,
        userAgent: navigator.userAgent,
        referrer: document.referrer || null,
      }),
    }).catch(() => {
      // Silently fail — visit tracking should never break the app
    });
  }, [pathname]);

  return null; // Invisible component
}
