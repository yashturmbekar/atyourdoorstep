# Theme System Documentation

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Theme Configuration](#theme-configuration)
- [Usage Methods](#usage-methods)
- [Preset Themes](#preset-themes)
- [Component Integration](#component-integration)
- [Customization Examples](#customization-examples)
- [Best Practices](#best-practices)
- [Migration Guide](#migration-guide)
- [Troubleshooting](#troubleshooting)

## Overview

The AtYourDoorStep theme system provides a comprehensive, centralized approach to managing colors, typography, spacing, transitions, and other design tokens across the entire application. 

### Key Features
- 🎨 **CSS Custom Properties** - Browser-native theming with CSS variables
- 🔧 **TypeScript Integration** - Type-safe theme configuration and usage
- ⚡ **Performance Optimized** - No runtime overhead for basic theming
- 🎯 **Utility Classes** - Pre-built classes for rapid development
- 🔄 **Dynamic Theming** - Switch themes at runtime
- 📱 **Component Integration** - All components use theme system

### Technology Stack
- CSS Custom Properties (CSS Variables)
- TypeScript interfaces for type safety
- React Context for state management
- CSS utility classes for rapid styling

## Architecture

### Core Files

- **`src/theme/theme.config.ts`** - Main theme configuration with TypeScript interfaces
- **`src/styles/globals.css`** - CSS custom properties definition
- **`src/styles/theme-utilities.css`** - Utility classes for quick theme access
- **`src/contexts/ThemeContext.tsx`** - React context for theme management
- **`src/hooks/useTheme.ts`** - Custom hooks for theme access
- **`src/hooks/useThemeContext.ts`** - Hook for accessing theme context

## Quick Start

### 1. Wrap your app with ThemeProvider

```tsx
import { ThemeProvider } from './contexts/ThemeContext';
import { App } from './App';

function Root() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
```

### 2. Use theme in components

```tsx
import { useThemeContext } from '../hooks/useThemeContext';
import { Button, Card } from '../components/common';

function MyComponent() {
  const { theme, updateTheme } = useThemeContext();

  const changePrimaryColor = () => {
    updateTheme({
      colors: {
        ...theme.colors,
        primary: '#ff6b6b',
      },
    });
  };

  return (
    <Card>
      <Button onClick={changePrimaryColor}>Change Primary Color</Button>
    </Card>
  );
}
```

### 3. Use utility classes

```tsx
function MyComponent() {
  return (
    <div className="bg-theme-primary p-lg rounded-lg shadow-glow">
      <h1 className="text-primary">Themed Content</h1>
      <p className="text-secondary">Using utility classes</p>
    </div>
  );
}
```

## Theme Configuration

### Color System

```typescript
interface ThemeColors {
  primary: string; // Main brand color
  primaryDark: string; // Darker variant
  primaryLight: string; // Lighter variant
  secondary: string; // Secondary brand color
  accent: string; // Accent/highlight color
  warning: string; // Warning states
  success: string; // Success states
  error: string; // Error states
}
```

### Text Colors

```typescript
interface TextColors {
  primary: string; // Main text color
  secondary: string; // Secondary text
  muted: string; // Muted/disabled text
  light: string; // Light text
  inverse: string; // Inverse text (for dark backgrounds)
  accent: string; // Accent text color
}
```

### Background Colors

```typescript
interface BackgroundColors {
  primary: string; // Main background
  secondary: string; // Secondary background
  tertiary: string; // Tertiary background
  card: string; // Card background
  hover: string; // Hover states
  dark: string; // Dark background
  accent: string; // Accent background
}
```

### Transitions

```typescript
interface Transitions {
  fast: string; // 0.15s ease
  normal: string; // 0.3s cubic-bezier
  slow: string; // 0.5s cubic-bezier
  elastic: string; // 0.4s elastic
  bounce: string; // 0.6s bounce
}
```

### Spacing System

```typescript
interface Spacing {
  xs: string; // 4px
  sm: string; // 8px
  md: string; // 16px
  lg: string; // 24px
  xl: string; // 32px
  '2xl': string; // 48px
  '3xl': string; // 64px
}
```

## CSS Variables Reference

All theme values are available as CSS custom properties. Here's the complete list:

### Color Variables

```css
/* Primary Colors */
--primary-color: #8b5cf6;
--primary-dark: #7c3aed;
--primary-light: #a78bfa;

/* Secondary Colors */
--secondary-color: #06b6d4;
--accent-color: #10d9c4;

/* State Colors */
--success-color: #22c55e;
--warning-color: #f59e0b;
--error-color: #ef4444;

/* Text Colors */
--text-primary: #1f2937;
--text-secondary: #6b7280;
--text-muted: #9ca3af;
--text-light: #f9fafb;
--text-inverse: #ffffff;
--text-accent: #10d9c4;

/* Background Colors */
--bg-primary: #ffffff;
--bg-secondary: #f9fafb;
--bg-tertiary: #f3f4f6;
--bg-card: #ffffff;
--bg-hover: #f3f4f6;
--bg-dark: #1f2937;
--bg-accent: rgba(16, 217, 196, 0.1);

/* Border Colors */
--border-color: #e5e7eb;
--border-light: #f3f4f6;
--border-divider: #e5e7eb;
```

### Spacing Variables

```css
--spacing-xs: 0.25rem;    /* 4px */
--spacing-sm: 0.5rem;     /* 8px */
--spacing-md: 1rem;       /* 16px */
--spacing-lg: 1.5rem;     /* 24px */
--spacing-xl: 2rem;       /* 32px */
--spacing-2xl: 3rem;      /* 48px */
--spacing-3xl: 4rem;      /* 64px */
```

### Border Radius Variables

```css
--radius-sm: 0.375rem;    /* 6px */
--radius-md: 0.5rem;      /* 8px */
--radius-lg: 0.75rem;     /* 12px */
--radius-xl: 1rem;        /* 16px */
--radius-2xl: 1.5rem;     /* 24px */
--radius-full: 9999px;    /* Full rounded */
```

### Transition Variables

```css
--transition-fast: all 0.15s ease;
--transition-normal: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
--transition-elastic: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
--transition-bounce: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Shadow Variables

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
--shadow-glow: 0 0 20px rgba(139, 92, 246, 0.3);
--shadow-glow-lg: 0 0 40px rgba(139, 92, 246, 0.4);
```

### Gradient Variables

```css
--gradient-primary: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
--gradient-accent: linear-gradient(135deg, var(--accent-color) 0%, var(--primary-light) 100%);
--gradient-success: linear-gradient(135deg, var(--success-color) 0%, #16a34a 100%);
--gradient-warning: linear-gradient(135deg, var(--warning-color) 0%, #d97706 100%);
```

## Usage Methods

The theme system provides multiple ways to use theme values in your components:

### 1. CSS Custom Properties (Recommended)

Direct access to theme values in CSS files - the most performant approach:

```css
.my-component {
  background-color: var(--primary-color);
  color: var(--text-primary);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  transition: var(--transition-normal);
}

.my-component:hover {
  background-color: var(--primary-dark);
  box-shadow: var(--shadow-glow);
}
```

### 2. CSS Utility Classes

Pre-built classes for rapid development:

```html
<!-- Colors -->
<div class="bg-theme-primary text-primary">Primary themed</div>
<div class="bg-theme-secondary text-secondary">Secondary themed</div>

<!-- Spacing -->
<div class="p-lg m-md">           <!-- padding large, margin medium -->
<div class="px-xl py-sm">         <!-- horizontal XL, vertical small -->

<!-- Effects -->
<div class="shadow-glow rounded-lg hover-lift">Interactive element</div>
```

### 3. React Hooks

For dynamic theming and programmatic access:

#### useThemeContext

```tsx
import { useThemeContext } from '../hooks/useThemeContext';

function ThemeControls() {
  const { theme, switchTheme, updateTheme } = useThemeContext();

  // Switch to completely different theme
  const switchToGreenTheme = () => {
    switchTheme(greenTheme);
  };

  // Update specific theme properties
  const updatePrimaryColor = (color: string) => {
    updateTheme({
      colors: {
        ...theme.colors,
        primary: color,
      },
    });
  };

  return (
    <div>
      <button onClick={switchToGreenTheme}>Green Theme</button>
      <input
        type="color"
        value={theme.colors.primary}
        onChange={e => updatePrimaryColor(e.target.value)}
      />
    </div>
  );
}
```

#### useThemeStyles

```tsx
import { useThemeStyles } from '../hooks/useTheme';

function StyledComponent() {
  const { getButtonStyles, getCardStyles } = useThemeStyles();

  return (
    <div style={getCardStyles()}>
      <button style={getButtonStyles('primary')}>Themed Button</button>
    </div>
  );
}
```

## Preset Themes

### Default Theme (Purple-Teal)

- Primary: #8b5cf6 (Purple)
- Secondary: #06b6d4 (Cyan)
- Accent: #10d9c4 (Teal)

### Light Theme

- Inverted text colors for light backgrounds
- Lighter background colors

### Green Theme

- Primary: #22c55e (Green)
- Secondary: #06b6d4 (Cyan)
- Accent: #10b981 (Emerald)

## Component Integration

### Updated Components

All these components now use the theme system:

- **Button** - Uses theme colors, spacing, transitions
- **Card** - Uses theme backgrounds, borders, shadows
- **Section** - Uses theme backgrounds and spacing
- **PageLayout** - Uses theme backgrounds and layouts

### Creating Theme-Aware Components

```tsx
// MyComponent.tsx
import React from 'react';
import './MyComponent.css';

interface MyComponentProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  variant = 'primary',
  children,
}) => {
  return (
    <div className={`my-component my-component-${variant}`}>{children}</div>
  );
};
```

```css
/* MyComponent.css */
.my-component {
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  transition: var(--transition-normal);
  box-shadow: var(--shadow-md);
}

.my-component-primary {
  background-color: var(--primary-color);
  color: var(--text-primary);
}

.my-component-secondary {
  background-color: var(--secondary-color);
  color: var(--text-primary);
}

.my-component:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}
```

## Customization Examples

### 1. Change Primary Color

```tsx
const { updateTheme } = useThemeContext();

updateTheme({
  colors: {
    ...theme.colors,
    primary: '#ff6b6b',
    primaryDark: '#ff5252',
    primaryLight: '#ff8a80',
  },
});
```

### 2. Update Spacing

```tsx
updateTheme({
  spacing: {
    ...theme.spacing,
    lg: '2rem', // Change from 1.5rem to 2rem
    xl: '3rem', // Change from 2rem to 3rem
  },
});
```

### 3. Modify Transitions

```tsx
updateTheme({
  transitions: {
    ...theme.transitions,
    normal: 'all 0.2s ease-in-out', // Faster transition
    elastic: 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
});
```

## Best Practices

### 1. Always Use Theme Values

❌ **Don't do this:**

```css
.my-component {
  background-color: #8b5cf6;
  padding: 16px;
  border-radius: 12px;
}
```

✅ **Do this:**

```css
.my-component {
  background-color: var(--primary-color);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
}
```

### 2. Use Utility Classes When Possible

❌ **Don't do this:**

```css
.my-specific-class {
  background-color: var(--primary-color);
  color: var(--text-primary);
  padding: var(--spacing-lg);
}
```

✅ **Do this:**

```jsx
<div className="bg-theme-primary text-primary p-lg">Content</div>
```

### 3. Consistent Component Patterns

All themed components should follow this pattern:

- Use theme CSS variables
- Provide variant props
- Support utility classes via className
- Use semantic naming

### 4. TypeScript Integration

Always use the TypeScript interfaces when working with theme values programmatically.

## Migration Guide

To convert existing components to use the theme system:

1. **Replace hardcoded colors** with CSS variables
2. **Replace hardcoded spacing** with theme spacing variables
3. **Replace hardcoded transitions** with theme transition variables
4. **Add variant support** where appropriate
5. **Update TypeScript interfaces** if needed

## Browser Support

The theme system uses CSS custom properties, which are supported in:

- Chrome 49+
- Firefox 31+
- Safari 9.1+
- Edge 16+

For older browsers, consider using a PostCSS plugin to provide fallbacks.

## Performance Considerations

- CSS custom properties are performant and don't require JavaScript for basic theming
- Theme changes via JavaScript are applied once and cascade automatically
- Utility classes are generated at build time, not runtime
- localStorage is used for theme persistence

## Troubleshooting

### Theme not applying

- Ensure ThemeProvider wraps your app
- Check if CSS custom properties are supported
- Verify theme.config.ts is properly imported

### Colors not updating

- Check if applyTheme() is being called
- Verify CSS variables are being set correctly
- Ensure no hardcoded values are overriding theme values

### Utility classes not working

- Verify theme-utilities.css is imported
- Check for CSS specificity issues
- Ensure classes are spelled correctly

---

## Quick Reference Card

### Most Used CSS Variables

```css
/* Colors */
var(--primary-color)      /* #8b5cf6 */
var(--text-primary)       /* #1f2937 */
var(--bg-primary)         /* #ffffff */
var(--bg-card)           /* #ffffff */

/* Spacing */
var(--spacing-sm)         /* 8px */
var(--spacing-md)         /* 16px */
var(--spacing-lg)         /* 24px */
var(--spacing-xl)         /* 32px */

/* Effects */
var(--radius-lg)          /* 12px */
var(--transition-normal)  /* 0.3s ease */
var(--shadow-md)          /* Standard shadow */
var(--shadow-glow)        /* Glowing effect */
```

### Common Utility Classes

```html
<!-- Backgrounds & Colors -->
<div class="bg-theme-primary text-primary">
<div class="bg-theme-card text-secondary">

<!-- Spacing -->
<div class="p-lg m-md">           <!-- padding-lg, margin-md -->
<div class="px-xl py-sm">         <!-- horizontal-xl, vertical-sm -->

<!-- Effects -->
<div class="rounded-lg shadow-md hover-lift transition-normal">
```

### React Hook Usage

```tsx
// Get theme context
const { theme, updateTheme, switchTheme } = useThemeContext();

// Update theme
updateTheme({ colors: { ...theme.colors, primary: '#new-color' } });

// Switch theme
switchTheme(darkTheme);
```

---

## Related Documentation

- [Theme Implementation Guide](../guides/theme-implementation.md) - Step-by-step setup
- [Theme Integration Summary](../guides/theme-integration-summary.md) - Component examples  
- [Component Organization](component-organization.md) - How components use themes
