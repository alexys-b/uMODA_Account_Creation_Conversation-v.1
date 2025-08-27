'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from './ThemeProvider';
import { useState, useRef, useEffect } from 'react';

export function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleThemeSelect = (selectedTheme: typeof theme) => {
    setTheme(selectedTheme);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="outline"
        size="sm"
        className="theme-toggle h-9 w-9 px-0 shadow-md hover:shadow-lg transition-all duration-200"
        onClick={toggleMenu}
        aria-label="Toggle theme"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {actualTheme === 'light' ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </Button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 min-w-[120px] rounded-md shadow-lg z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)'
          }}
        >
          <div className="p-1">
            <button
              onClick={() => handleThemeSelect('light')}
              className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm transition-colors cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                theme === 'light' ? 'bg-accent text-accent-foreground' : 'text-foreground'
              }`}
              style={{
                color: theme === 'light' ? 'var(--accent-foreground)' : 'var(--foreground)',
                backgroundColor: theme === 'light' ? 'var(--accent)' : 'transparent'
              }}
            >
              <Sun className="h-4 w-4" />
              <span>Light</span>
            </button>
            
            <button
              onClick={() => handleThemeSelect('dark')}
              className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm transition-colors cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                theme === 'dark' ? 'bg-accent text-accent-foreground' : 'text-foreground'
              }`}
              style={{
                color: theme === 'dark' ? 'var(--accent-foreground)' : 'var(--foreground)',
                backgroundColor: theme === 'dark' ? 'var(--accent)' : 'transparent'
              }}
            >
              <Moon className="h-4 w-4" />
              <span>Dark</span>
            </button>
            
            <button
              onClick={() => handleThemeSelect('system')}
              className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm transition-colors cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                theme === 'system' ? 'bg-accent text-accent-foreground' : 'text-foreground'
              }`}
              style={{
                color: theme === 'system' ? 'var(--accent-foreground)' : 'var(--foreground)',
                backgroundColor: theme === 'system' ? 'var(--accent)' : 'transparent'
              }}
            >
              <Monitor className="h-4 w-4" />
              <span>System</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}