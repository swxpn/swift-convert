'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function PageTransitionHandler() {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Scroll to top smoothly on route change
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
      left: 0,
    });

    // Show the transition indicator
    const startTimeoutId = setTimeout(() => {
      setIsTransitioning(true);
    }, 0);

    const endTimeoutId = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);

    return () => {
      clearTimeout(startTimeoutId);
      clearTimeout(endTimeoutId);
    };
  }, [pathname]);

  return (
    <>
      {/* Loading bar that appears during page transitions */}
      <div
        className="page-transition-loader"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, var(--primary), var(--primary-dark))',
          opacity: isTransitioning ? 1 : 0,
          transition: 'opacity 0.2s ease',
          zIndex: 9999,
          pointerEvents: 'none',
          boxShadow: isTransitioning ? '0 0 10px rgba(252, 128, 25, 0.5)' : 'none',
        }}
      />
      {/* Fade overlay for smoother transition */}
      <div
        className="page-transition-fade"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 247, 241, 0.03)',
          opacity: isTransitioning ? 0.5 : 0,
          pointerEvents: 'none',
          transition: 'opacity 0.15s ease',
          zIndex: 9998,
        }}
      />
    </>
  );
}
