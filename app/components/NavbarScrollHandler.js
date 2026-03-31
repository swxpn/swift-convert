'use client';

import { useEffect, useRef } from 'react';

export function NavbarScrollHandler() {
  const isHydratedRef = useRef(false);

  useEffect(() => {
    // Mark as hydrated and skip the first render
    isHydratedRef.current = true;
    
    const handleScroll = () => {
      if (!isHydratedRef.current) return;
      
      const navbar = document.querySelector('.navbar');
      if (!navbar) return;

      const scrollY = window.scrollY;
      const triggerHeight = 100;

      if (scrollY > triggerHeight) {
        if (!navbar.classList.contains('scrolled')) {
          navbar.classList.add('scrolled');
        }
      } else {
        if (navbar.classList.contains('scrolled')) {
          navbar.classList.remove('scrolled');
        }
      }
    };

    // Call once on mount to set initial state
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return null;
}
