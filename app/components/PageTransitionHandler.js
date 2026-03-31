'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function PageTransitionHandler() {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isBackNavigationRef = useRef(false);

  useEffect(() => {
    // Track if this is back/forward navigation via popstate
    const handlePopState = () => {
      isBackNavigationRef.current = true;
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    // Check if this is back navigation
    const isBackNav = isBackNavigationRef.current;
    isBackNavigationRef.current = false;

    // Show transition indicator immediately via timeout to avoid ESLint warning
    const showTimeoutId = setTimeout(() => {
      setIsTransitioning(true);
    }, 0);

    if (isBackNav) {
      // Back navigation: instant scroll, quick fade out
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      
      // Hide transition indicator very quickly for back navigation
      const hideTimeoutId = setTimeout(() => {
        setIsTransitioning(false);
      }, 80);

      return () => {
        clearTimeout(showTimeoutId);
        clearTimeout(hideTimeoutId);
      };
    } else {
      // Forward navigation: smooth scroll, normal fade out
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      
      const hideTimeoutId = setTimeout(() => {
        setIsTransitioning(false);
      }, 350);

      return () => {
        clearTimeout(showTimeoutId);
        clearTimeout(hideTimeoutId);
      };
    }
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
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
          opacity: isTransitioning ? 1 : 0,
          pointerEvents: 'none',
          transition: 'opacity 0.15s ease',
          zIndex: 9998,
        }}
      />
    </>
  );
}
