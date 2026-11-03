import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'comfort' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'comfort' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('cogflow_theme') as Theme) || 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = () => {
      let active: ResolvedTheme;
      if (theme === 'system') {
        active = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        active = theme;
      }

      setResolvedTheme(active);

      root.classList.remove('dark', 'comfort', 'light');
      if (active === 'dark') {
        root.classList.add('dark');
      } else if (active === 'comfort') {
        root.classList.add('comfort');
      } else {
        root.classList.add('light');
      }
    };

    applyTheme();
    localStorage.setItem('cogflow_theme', theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  // Cycles through all 3 formats: Light -> Comfort (Calming Off-White) -> Dark -> Light
  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === 'light') return 'comfort';
      if (prev === 'comfort') return 'dark';
      if (prev === 'dark') return 'light';
      // If currently on system, advance from resolved
      return resolvedTheme === 'dark' ? 'light' : resolvedTheme === 'comfort' ? 'dark' : 'comfort';
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};


