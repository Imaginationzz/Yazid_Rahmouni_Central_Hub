'use client';

import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div style={{ width: '40px', height: '40px' }} />;

  return (
    <button
      onClick={toggleTheme}
      className="btn"
      style={{
        padding: '0.5rem',
        borderRadius: '50%',
        minWidth: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--panel-border)',
        background: 'var(--panel-bg)',
        color: 'var(--gold-accent)',
        cursor: 'pointer',
        transition: 'var(--transition)',
      }}
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
