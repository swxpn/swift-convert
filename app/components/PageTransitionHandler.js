'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function PageTransitionHandler() {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const previousPathRef = useRef(pathname);
  const isBackNavigationRef = useRef(false);

  useEffect(() => {
    // Track if this is back/forward navigation
    const handlePopState = () => {
      isBackNavigationRef.current = true;
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    // Check if this is back navigation by comparing with previous path
    const isBackNav = isBackNavigationRef.current;
    isBackNavigationRef.current = false;
    previousPathRef.current = pathname;

    // For back navigation, restore scroll position instantly
    // For forward navigation, scroll to top smoothly
    if (isBackNav) {
      // Instant scroll restoration for back button
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      // Show transition and fade out faster for back nav
      const showTimeoutId = setTimeout(() => {
        setIsTransitioning(true);
      }, 0);
      const hideTimeoutId = setTimeout(() => {
        setIsTransitioning(false);
      }, 150);
      return () => {
        clearTimeout(showTimeoutId);
        clearTimeout(hideTimeoutId);
      };
    } else {
      // Smooth scroll for forward navigation
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      // Show transition and fade out at normal pace for forward nav
      const showTimeoutId = setTimeout(() => {
        setIsTransitioning(true);
      }, 0);
      const hideTimeoutId = setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
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
