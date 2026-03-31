'use client';

import { useEffect } from 'react';

export function ReloadHandler() {
  useEffect(() => {
    // Show reload overlay on beforeunload
    const handleBeforeUnload = () => {
      const overlay = document.querySelector('.reload-overlay-static');
      if (overlay) {
        overlay.style.display = 'flex';
      }
      document.documentElement.classList.add('page-reloading');
    };

    // Listen for keyboard shortcut (Cmd+R / Ctrl+R)
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
        const overlay = document.querySelector('.reload-overlay-static');
        if (overlay) {
          overlay.style.display = 'flex';
        }
        document.documentElement.classList.add('page-reloading');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

  return (
    <div 
      className="reload-overlay-static" 
      style={{ display: 'none' }}
    >
      <div className="reload-spinner"></div>
    </div>
  );
}
