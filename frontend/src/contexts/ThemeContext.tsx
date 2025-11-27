import React, { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { defaultTheme, applyTheme, mergeThemes } from '../theme/theme.config';
import type { ThemeConfig } from '../theme/theme.config';

interface ThemeContextType {
  theme: ThemeConfig;
  isDarkMode: boolean;
  switchTheme: (newTheme: ThemeConfig) => void;
  updateTheme: (overrides: Partial<ThemeConfig>) => void;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Export the context for use in custom hooks
export { ThemeContext };

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeConfig;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme = defaultTheme,
}) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(initialTheme);
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to light mode

  // Apply theme changes to CSS variables
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  // Initialize theme from localStorage or apply default
  useEffect(() => {
    const savedTheme = localStorage.getItem('atyourdoorstep-theme');
    const savedDarkMode = localStorage.getItem('atyourdoorstep-dark-mode');

    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setCurrentTheme(parsedTheme);
      } catch {
        console.warn('Failed to parse saved theme, using default');
        // Apply default theme immediately
        applyTheme(defaultTheme);
      }
    } else {
      // Apply default theme immediately for first-time visitors
      applyTheme(defaultTheme);
    }

    if (savedDarkMode !== null) {
      setIsDarkMode(savedDarkMode === 'true');
    }
  }, []);

  // Switch to a different theme
  const switchTheme = (newTheme: ThemeConfig) => {
    setCurrentTheme(newTheme);
    localStorage.setItem('atyourdoorstep-theme', JSON.stringify(newTheme));
  };

  // Update specific theme properties
  const updateTheme = (overrides: Partial<ThemeConfig>) => {
    const updatedTheme = mergeThemes(currentTheme, overrides);
    setCurrentTheme(updatedTheme);
    localStorage.setItem('atyourdoorstep-theme', JSON.stringify(updatedTheme));
  };

  // Toggle between dark and light mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('atyourdoorstep-dark-mode', newDarkMode.toString());
  };

  const value: ThemeContextType = {
    theme: currentTheme,
    isDarkMode,
    switchTheme,
    updateTheme,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
