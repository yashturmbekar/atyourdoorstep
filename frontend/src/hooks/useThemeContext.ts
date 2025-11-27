import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

// Hook to use theme context
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
