import { useEffect, useState } from 'react';
import { defaultTheme, applyTheme, mergeThemes } from '../theme/theme.config';
import type { ThemeConfig } from '../theme/theme.config';

// Theme context for managing global theme state
export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(defaultTheme);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Apply theme changes to CSS variables
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  // Switch to a different theme
  const switchTheme = (newTheme: ThemeConfig) => {
    setCurrentTheme(newTheme);
    localStorage.setItem('theme', JSON.stringify(newTheme));
  };

  // Update specific theme properties
  const updateTheme = (overrides: Partial<ThemeConfig>) => {
    const updatedTheme = mergeThemes(currentTheme, overrides);
    setCurrentTheme(updatedTheme);
    localStorage.setItem('theme', JSON.stringify(updatedTheme));
  };

  // Toggle between dark and light mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // This could be expanded to switch between predefined dark/light themes
  };

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setCurrentTheme(parsedTheme);
      } catch {
        console.warn('Failed to parse saved theme, using default');
      }
    }
  }, []);

  return {
    theme: currentTheme,
    isDarkMode,
    switchTheme,
    updateTheme,
    toggleDarkMode,
  };
};

// Utility hook for accessing theme values directly
export const useThemeValue = () => {
  const { theme } = useTheme();

  return {
    colors: theme.colors,
    textColors: theme.textColors,
    backgroundColors: theme.backgroundColors,
    borderColors: theme.borderColors,
    transitions: theme.transitions,
    shadows: theme.shadows,
    spacing: theme.spacing,
    borderRadius: theme.borderRadius,
  };
};

// CSS-in-JS style generator hook
export const useThemeStyles = () => {
  const { theme } = useTheme();

  const getButtonStyles = (
    variant: 'primary' | 'secondary' | 'danger' = 'primary'
  ) => {
    const baseStyles = {
      padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
      borderRadius: theme.borderRadius.lg,
      transition: theme.transitions.normal,
      fontWeight: '600',
      cursor: 'pointer',
      border: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
    };

    const variants = {
      primary: {
        backgroundColor: theme.colors.primary,
        color: theme.textColors.primary,
        '&:hover': {
          backgroundColor: theme.colors.primaryDark,
          boxShadow: theme.shadows.glow,
        },
      },
      secondary: {
        backgroundColor: theme.colors.secondary,
        color: theme.textColors.primary,
        '&:hover': {
          backgroundColor: theme.colors.accent,
          boxShadow: theme.shadows.glow,
        },
      },
      danger: {
        backgroundColor: theme.colors.error,
        color: theme.textColors.primary,
        '&:hover': {
          backgroundColor: '#dc2626',
          boxShadow: theme.shadows.glow,
        },
      },
    };

    return { ...baseStyles, ...variants[variant] };
  };

  const getCardStyles = () => ({
    backgroundColor: theme.backgroundColors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    boxShadow: theme.shadows.md,
    border: `1px solid ${theme.borderColors.default}`,
    transition: theme.transitions.normal,
    '&:hover': {
      boxShadow: theme.shadows.lg,
      transform: 'translateY(-2px)',
    },
  });

  const getSectionStyles = () => ({
    padding: `${theme.spacing['2xl']} ${theme.spacing.lg}`,
    backgroundColor: theme.backgroundColors.secondary,
    borderRadius: theme.borderRadius.lg,
    margin: `${theme.spacing.lg} 0`,
  });

  const getPageLayoutStyles = () => ({
    minHeight: '100vh',
    backgroundColor: theme.backgroundColors.primary,
    color: theme.textColors.primary,
    fontFamily: 'inherit',
  });

  return {
    getButtonStyles,
    getCardStyles,
    getSectionStyles,
    getPageLayoutStyles,
    theme,
  };
};
