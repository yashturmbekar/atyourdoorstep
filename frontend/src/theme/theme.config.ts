// Theme Configuration for AtYourDoorStep
// Central theme management with TypeScript support

export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  warning: string;
  success: string;
  error: string;
}

export interface TextColors {
  primary: string;
  secondary: string;
  muted: string;
  light: string;
  inverse: string;
  accent: string;
}

export interface BackgroundColors {
  primary: string;
  secondary: string;
  tertiary: string;
  card: string;
  hover: string;
  dark: string;
  accent: string;
  header: string;
}

export interface BorderColors {
  default: string;
  light: string;
  divider: string;
}

export interface Transitions {
  fast: string;
  normal: string;
  slow: string;
  elastic: string;
  bounce: string;
}

export interface Shadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  inner: string;
  glow: string;
  glowLg: string;
  // Card-specific shadows for enhanced visual hierarchy
  cardRest: string;
  cardHover: string;
  cardActive: string;
  // Elevated shadows for important elements
  elevated: string;
  elevatedHover: string;
  // Soft shadows for subtle emphasis
  soft: string;
  softHover: string;
}

export interface Spacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

export interface BorderRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface ThemeConfig {
  colors: ThemeColors;
  textColors: TextColors;
  backgroundColors: BackgroundColors;
  borderColors: BorderColors;
  transitions: Transitions;
  shadows: Shadows;
  spacing: Spacing;
  borderRadius: BorderRadius;
}

// Default theme configuration - Soft Cream Theme (Warm & Elegant)
export const defaultTheme: ThemeConfig = {
  colors: {
    primary: '#a16207', // Warm amber - natural & organic
    primaryDark: '#92400e', // Deep amber
    primaryLight: '#d97706', // Light amber
    secondary: '#78716c', // Warm gray - earthy
    accent: '#dc2626', // Warm red - accent
    warning: '#f59e0b',
    success: '#10b981',
    error: '#ef4444',
  },
  textColors: {
    primary: '#1c1917', // Deep brown - warm & readable
    secondary: '#44403c', // Medium brown
    muted: '#78716c', // Muted brown
    light: '#a8a29e', // Light brown
    inverse: '#fffef7', // Cream background
    accent: '#a16207', // Amber accent
  },
  backgroundColors: {
    primary: '#fffef7', // Soft cream - main background
    secondary: '#faf8f1', // Light cream - secondary areas
    tertiary: '#f4f1e8', // Darker cream - tertiary elements
    card: '#fffef7', // Pure cream - cards
    hover: '#faf8f1', // Cream hover
    dark: '#e8e4d9', // Warm gray - contrast
    accent: '#fefce8', // Yellow accent background
    header: '#faf8f1', // Cream header
  },
  borderColors: {
    default: '#e8e4d9',
    light: '#f4f1e8',
    divider: '#e8e4d9',
  },
  transitions: {
    fast: 'all 0.15s ease',
    normal: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    elastic: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    bounce: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  shadows: {
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px 0 rgb(0 0 0 / 0.06)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.06)',
    glow: '0 0 20px rgba(161, 98, 7, 0.15)',
    glowLg: '0 0 40px rgba(161, 98, 7, 0.25)',
    // Card-specific shadows for enhanced visual hierarchy
    cardRest:
      '0 2px 8px 0 rgba(0, 0, 0, 0.08), 0 1px 3px 0 rgba(0, 0, 0, 0.06)',
    cardHover:
      '0 8px 25px 0 rgba(0, 0, 0, 0.15), 0 4px 10px 0 rgba(0, 0, 0, 0.1)',
    cardActive:
      '0 12px 35px 0 rgba(0, 0, 0, 0.2), 0 6px 15px 0 rgba(0, 0, 0, 0.15)',
    // Elevated shadows for important elements
    elevated:
      '0 6px 20px 0 rgba(0, 0, 0, 0.12), 0 2px 6px 0 rgba(0, 0, 0, 0.08)',
    elevatedHover:
      '0 10px 30px 0 rgba(0, 0, 0, 0.18), 0 4px 12px 0 rgba(0, 0, 0, 0.12)',
    // Soft shadows for subtle emphasis
    soft: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
    softHover:
      '0 3px 8px 0 rgba(0, 0, 0, 0.08), 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  },
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '3rem', // 48px
    '3xl': '4rem', // 64px
  },
  borderRadius: {
    none: '0',
    sm: '0.375rem', // 6px
    md: '0.5rem', // 8px
    lg: '0.75rem', // 12px
    xl: '1rem', // 16px
    full: '9999px',
  },
};

// Alternative dark theme (original dark theme)
export const darkTheme: Partial<ThemeConfig> = {
  textColors: {
    primary: '#f1f5f9',
    secondary: '#cbd5e1',
    muted: '#94a3b8',
    light: '#64748b',
    inverse: '#0f172a',
    accent: '#8b5cf6',
  },
  backgroundColors: {
    primary: '#0f172a',
    secondary: '#1e293b',
    tertiary: '#334155',
    card: '#1a2332',
    hover: '#2a3441',
    dark: '#020617',
    accent: '#1e1b4b',
    header: '#1a2332',
  },
  borderColors: {
    default: '#334155',
    light: '#475569',
    divider: '#1e293b',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.6), 0 8px 10px -6px rgb(0 0 0 / 0.5)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.6)',
    '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.6)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.3)',
    glow: '0 0 20px rgba(139, 92, 246, 0.15)',
    glowLg: '0 0 40px rgba(139, 92, 246, 0.25)',
    cardRest: '0 2px 8px 0 rgba(0, 0, 0, 0.2), 0 1px 3px 0 rgba(0, 0, 0, 0.15)',
    cardHover:
      '0 8px 25px 0 rgba(0, 0, 0, 0.3), 0 4px 10px 0 rgba(0, 0, 0, 0.2)',
    cardActive:
      '0 12px 35px 0 rgba(0, 0, 0, 0.4), 0 6px 15px 0 rgba(0, 0, 0, 0.3)',
    elevated:
      '0 6px 20px 0 rgba(0, 0, 0, 0.25), 0 2px 6px 0 rgba(0, 0, 0, 0.2)',
    elevatedHover:
      '0 10px 30px 0 rgba(0, 0, 0, 0.35), 0 4px 12px 0 rgba(0, 0, 0, 0.25)',
    soft: '0 1px 3px 0 rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.1)',
    softHover:
      '0 3px 8px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.15)',
  },
};

// Light theme (alias for default theme with light specific tweaks)
export const lightTheme: Partial<ThemeConfig> = {
  backgroundColors: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    card: '#ffffff',
    hover: '#f8fafc',
    dark: '#e2e8f0',
    accent: '#fefce8',
    header: '#f8fafc',
  },
  textColors: {
    primary: '#0f172a',
    secondary: '#475569',
    muted: '#64748b',
    light: '#94a3b8',
    inverse: '#ffffff',
    accent: '#6366f1',
  },
  shadows: {
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px 0 rgb(0 0 0 / 0.06)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.06)',
    glow: '0 0 20px rgba(99, 102, 241, 0.1)',
    glowLg: '0 0 40px rgba(99, 102, 241, 0.15)',
    cardRest:
      '0 2px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 3px 0 rgba(0, 0, 0, 0.04)',
    cardHover:
      '0 8px 25px 0 rgba(0, 0, 0, 0.12), 0 4px 10px 0 rgba(0, 0, 0, 0.08)',
    cardActive:
      '0 12px 35px 0 rgba(0, 0, 0, 0.15), 0 6px 15px 0 rgba(0, 0, 0, 0.1)',
    elevated:
      '0 6px 20px 0 rgba(0, 0, 0, 0.1), 0 2px 6px 0 rgba(0, 0, 0, 0.06)',
    elevatedHover:
      '0 10px 30px 0 rgba(0, 0, 0, 0.15), 0 4px 12px 0 rgba(0, 0, 0, 0.1)',
    soft: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
    softHover:
      '0 3px 8px 0 rgba(0, 0, 0, 0.06), 0 2px 4px 0 rgba(0, 0, 0, 0.04)',
  },
};

// Option 1: Warm Neutral Palette
export const warmNeutralTheme: Partial<ThemeConfig> = {
  backgroundColors: {
    primary: '#fefbf3',
    secondary: '#f5f1e8',
    tertiary: '#ede8dc',
    card: '#fefbf3',
    hover: '#f5f1e8',
    dark: '#e6dcc8',
    accent: '#fef7ed',
    header: '#f5f1e8',
  },
  textColors: {
    primary: '#292524',
    secondary: '#57534e',
    muted: '#78716c',
    light: '#a8a29e',
    inverse: '#fefbf3',
    accent: '#92400e',
  },
};

// Option 2: Cool Modern Palette
export const coolModernTheme: Partial<ThemeConfig> = {
  backgroundColors: {
    primary: '#f8fafc',
    secondary: '#e2e8f0',
    tertiary: '#cbd5e1',
    card: '#f8fafc',
    hover: '#e2e8f0',
    dark: '#94a3b8',
    accent: '#f0f9ff',
    header: '#e2e8f0',
  },
  textColors: {
    primary: '#0f172a',
    secondary: '#334155',
    muted: '#64748b',
    light: '#94a3b8',
    inverse: '#f8fafc',
    accent: '#0369a1',
  },
};

// Option 3: Soft Cream Palette
export const softCreamTheme: Partial<ThemeConfig> = {
  backgroundColors: {
    primary: '#fffef7',
    secondary: '#faf8f1',
    tertiary: '#f4f1e8',
    card: '#fffef7',
    hover: '#faf8f1',
    dark: '#e8e4d9',
    accent: '#fefce8',
    header: '#faf8f1',
  },
  textColors: {
    primary: '#1c1917',
    secondary: '#44403c',
    muted: '#78716c',
    light: '#a8a29e',
    inverse: '#fffef7',
    accent: '#a16207',
  },
};

// Option 4: Minimal Pure Palette
export const minimalPureTheme: Partial<ThemeConfig> = {
  backgroundColors: {
    primary: '#ffffff',
    secondary: '#f8f9fa',
    tertiary: '#e9ecef',
    card: '#ffffff',
    hover: '#f8f9fa',
    dark: '#dee2e6',
    accent: '#f8f9fa',
    header: '#f8f9fa',
  },
  textColors: {
    primary: '#212529',
    secondary: '#495057',
    muted: '#6c757d',
    light: '#adb5bd',
    inverse: '#ffffff',
    accent: '#495057',
  },
};

// Option 5: Earthy Natural Palette
export const earthyNaturalTheme: Partial<ThemeConfig> = {
  backgroundColors: {
    primary: '#fdfcf8',
    secondary: '#f7f4ed',
    tertiary: '#f0ebe0',
    card: '#fdfcf8',
    hover: '#f7f4ed',
    dark: '#e3dcc6',
    accent: '#f6f3e7',
    header: '#f7f4ed',
  },
  textColors: {
    primary: '#3c2e26',
    secondary: '#6b5b47',
    muted: '#8b7355',
    light: '#a69080',
    inverse: '#fdfcf8',
    accent: '#8b4513',
  },
};

// Option 6: Soft Green-tinted (Perfect for food/organic theme)
export const softGreenTheme: Partial<ThemeConfig> = {
  backgroundColors: {
    primary: '#fdfffe',
    secondary: '#f7faf8',
    tertiary: '#f0f4f1',
    card: '#fdfffe',
    hover: '#f7faf8',
    dark: '#e8f0ea',
    accent: '#f0fdf4',
    header: '#f7faf8',
  },
  textColors: {
    primary: '#064e3b',
    secondary: '#065f46',
    muted: '#047857',
    light: '#10b981',
    inverse: '#fdfffe',
    accent: '#059669',
  },
};

export const greenTheme: Partial<ThemeConfig> = {
  colors: {
    primary: '#22c55e',
    primaryDark: '#16a34a',
    primaryLight: '#4ade80',
    secondary: '#06b6d4',
    accent: '#10b981',
    warning: '#f59e0b',
    success: '#22c55e',
    error: '#ef4444',
  },
};

// Advanced Color Combination Themes - Deep Thinking Applied

// Option 7: Ocean Breeze (Professional & Trustworthy)
export const oceanBreezeTheme: Partial<ThemeConfig> = {
  colors: {
    primary: '#0ea5e9', // Sky blue - trust, reliability
    primaryDark: '#0284c7', // Deep ocean blue
    primaryLight: '#38bdf8', // Light sky blue
    secondary: '#06b6d4', // Cyan - freshness, clarity
    accent: '#22d3ee', // Bright cyan - energy
    warning: '#f59e0b', // Amber
    success: '#10b981', // Emerald
    error: '#ef4444', // Red
  },
  backgroundColors: {
    primary: '#f8fdff', // Very light blue-white
    secondary: '#f0f9ff', // Light blue tint
    tertiary: '#e0f2fe', // Subtle blue
    card: '#ffffff', // Pure white for cards
    hover: '#f0f9ff', // Light blue hover
    dark: '#e0f2fe', // Blue-gray
    accent: '#ecfeff', // Cyan accent background
    header: '#f0f9ff', // Light blue header
  },
  textColors: {
    primary: '#0c4a6e', // Deep blue - strong readability
    secondary: '#075985', // Medium blue
    muted: '#0369a1', // Muted blue
    light: '#0ea5e9', // Light blue
    inverse: '#f8fdff', // Light background for dark text
    accent: '#0284c7', // Accent blue
  },
};

// Option 8: Sunset Warmth (Creative & Energetic)
export const sunsetWarmthTheme: Partial<ThemeConfig> = {
  colors: {
    primary: '#ea580c', // Warm orange - creativity, energy
    primaryDark: '#c2410c', // Deep orange
    primaryLight: '#fb923c', // Light orange
    secondary: '#dc2626', // Red - passion, action
    accent: '#facc15', // Yellow - optimism, clarity
    warning: '#f59e0b', // Amber
    success: '#16a34a', // Green
    error: '#dc2626', // Red
  },
  backgroundColors: {
    primary: '#fffbfa', // Warm white
    secondary: '#fff7ed', // Light orange tint
    tertiary: '#fed7aa', // Peach
    card: '#ffffff', // Pure white
    hover: '#fff7ed', // Warm hover
    dark: '#fdba74', // Orange-beige
    accent: '#fef3c7', // Yellow accent background
    header: '#fff7ed', // Warm header
  },
  textColors: {
    primary: '#7c2d12', // Deep brown-red
    secondary: '#9a3412', // Medium brown
    muted: '#c2410c', // Muted orange
    light: '#ea580c', // Light orange
    inverse: '#fffbfa', // Light background
    accent: '#92400e', // Accent brown
  },
};

// Option 9: Forest Depth (Natural & Sustainable)
export const forestDepthTheme: Partial<ThemeConfig> = {
  colors: {
    primary: '#059669', // Forest green - nature, growth
    primaryDark: '#047857', // Deep forest
    primaryLight: '#10b981', // Light emerald
    secondary: '#0d9488', // Teal - balance, healing
    accent: '#84cc16', // Lime - fresh growth
    warning: '#f59e0b', // Amber
    success: '#22c55e', // Green
    error: '#ef4444', // Red
  },
  backgroundColors: {
    primary: '#f7fef7', // Very light green-white
    secondary: '#f0fdf4', // Light green tint
    tertiary: '#dcfce7', // Subtle green
    card: '#ffffff', // Pure white
    hover: '#f0fdf4', // Green hover
    dark: '#bbf7d0', // Light green
    accent: '#f7fee7', // Lime accent background
    header: '#f0fdf4', // Green header
  },
  textColors: {
    primary: '#14532d', // Deep forest green
    secondary: '#166534', // Medium green
    muted: '#15803d', // Muted green
    light: '#22c55e', // Light green
    inverse: '#f7fef7', // Light background
    accent: '#047857', // Accent green
  },
};

// Option 10: Lavender Elegance (Luxury & Sophistication)
export const lavenderEleganceTheme: Partial<ThemeConfig> = {
  colors: {
    primary: '#8b5cf6', // Purple - luxury, creativity
    primaryDark: '#7c3aed', // Deep purple
    primaryLight: '#a78bfa', // Light purple
    secondary: '#ec4899', // Pink - femininity, warmth
    accent: '#06b6d4', // Cyan - clarity, freshness
    warning: '#f59e0b', // Amber
    success: '#10b981', // Emerald
    error: '#ef4444', // Red
  },
  backgroundColors: {
    primary: '#fefbff', // Very light purple-white
    secondary: '#faf5ff', // Light purple tint
    tertiary: '#f3e8ff', // Subtle purple
    card: '#ffffff', // Pure white
    hover: '#faf5ff', // Purple hover
    dark: '#e9d5ff', // Light purple
    accent: '#fdf2f8', // Pink accent background
    header: '#faf5ff', // Purple header
  },
  textColors: {
    primary: '#581c87', // Deep purple
    secondary: '#6b21a8', // Medium purple
    muted: '#7c3aed', // Muted purple
    light: '#a78bfa', // Light purple
    inverse: '#fefbff', // Light background
    accent: '#7c3aed', // Accent purple
  },
};

// Option 11: Monochrome Professional (Clean & Timeless)
export const monochromeProTheme: Partial<ThemeConfig> = {
  colors: {
    primary: '#374151', // Dark gray - professional, stable
    primaryDark: '#1f2937', // Very dark gray
    primaryLight: '#6b7280', // Medium gray
    secondary: '#4b5563', // Gray - balance, neutrality
    accent: '#0ea5e9', // Blue accent - trust
    warning: '#f59e0b', // Amber
    success: '#10b981', // Emerald
    error: '#ef4444', // Red
  },
  backgroundColors: {
    primary: '#ffffff', // Pure white
    secondary: '#f9fafb', // Very light gray
    tertiary: '#f3f4f6', // Light gray
    card: '#ffffff', // Pure white
    hover: '#f9fafb', // Light gray hover
    dark: '#e5e7eb', // Medium light gray
    accent: '#f0f9ff', // Blue accent background
    header: '#f9fafb', // Light gray header
  },
  textColors: {
    primary: '#111827', // Almost black
    secondary: '#374151', // Dark gray
    muted: '#6b7280', // Medium gray
    light: '#9ca3af', // Light gray
    inverse: '#ffffff', // White
    accent: '#0ea5e9', // Blue accent
  },
};

// Option 12: Coral Reef (Vibrant & Friendly)
export const coralReefTheme: Partial<ThemeConfig> = {
  colors: {
    primary: '#f97316', // Orange - energy, enthusiasm
    primaryDark: '#ea580c', // Deep orange
    primaryLight: '#fb923c', // Light orange
    secondary: '#06b6d4', // Cyan - freshness, clarity
    accent: '#f472b6', // Pink - friendliness, warmth
    warning: '#f59e0b', // Amber
    success: '#22c55e', // Green
    error: '#ef4444', // Red
  },
  backgroundColors: {
    primary: '#fffbf5', // Very light orange-white
    secondary: '#fff7ed', // Light orange tint
    tertiary: '#ffedd5', // Peach
    card: '#ffffff', // Pure white
    hover: '#fff7ed', // Orange hover
    dark: '#fed7aa', // Light orange
    accent: '#fdf2f8', // Pink accent background
    header: '#fff7ed', // Orange header
  },
  textColors: {
    primary: '#9a3412', // Deep orange-brown
    secondary: '#c2410c', // Medium orange
    muted: '#ea580c', // Muted orange
    light: '#f97316', // Light orange
    inverse: '#fffbf5', // Light background
    accent: '#dc2626', // Red accent
  },
};

// Option 13: Midnight Blue (Premium & Sophisticated)
export const midnightBlueTheme: Partial<ThemeConfig> = {
  colors: {
    primary: '#1e40af', // Blue - trust, stability
    primaryDark: '#1e3a8a', // Deep blue
    primaryLight: '#3b82f6', // Light blue
    secondary: '#6366f1', // Indigo - depth, wisdom
    accent: '#f59e0b', // Gold - luxury, premium
    warning: '#f59e0b', // Amber
    success: '#10b981', // Emerald
    error: '#ef4444', // Red
  },
  backgroundColors: {
    primary: '#f8faff', // Very light blue-white
    secondary: '#f1f5f9', // Light blue-gray
    tertiary: '#e2e8f0', // Blue-gray
    card: '#ffffff', // Pure white
    hover: '#f1f5f9', // Blue-gray hover
    dark: '#cbd5e1', // Medium blue-gray
    accent: '#fffbeb', // Gold accent background
    header: '#f1f5f9', // Blue-gray header
  },
  textColors: {
    primary: '#1e3a8a', // Deep blue
    secondary: '#1e40af', // Medium blue
    muted: '#3b82f6', // Muted blue
    light: '#60a5fa', // Light blue
    inverse: '#f8faff', // Light background
    accent: '#d97706', // Gold accent
  },
};

// Option 14: Royal Purple (Luxury & Creativity)
export const royalPurpleTheme: Partial<ThemeConfig> = {
  colors: {
    primary: '#7c3aed', // Purple - luxury, creativity
    primaryDark: '#6d28d9', // Deep purple
    primaryLight: '#8b5cf6', // Light purple
    secondary: '#a855f7', // Medium purple
    accent: '#f59e0b', // Gold - premium accent
    warning: '#f59e0b', // Amber
    success: '#10b981', // Emerald
    error: '#ef4444', // Red
  },
  backgroundColors: {
    primary: '#fefbff', // Very light purple-white
    secondary: '#faf5ff', // Light purple
    tertiary: '#f3e8ff', // Purple-gray
    card: '#ffffff', // Pure white
    hover: '#f3e8ff', // Purple hover
    dark: '#ddd6fe', // Medium purple
    accent: '#fffbeb', // Gold accent background
    header: '#faf5ff', // Purple header
  },
  textColors: {
    primary: '#581c87', // Deep purple
    secondary: '#7c3aed', // Medium purple
    muted: '#8b5cf6', // Muted purple
    light: '#a78bfa', // Light purple
    inverse: '#fefbff', // Light background
    accent: '#d97706', // Gold accent
  },
};

// Option 15: Sage Green (Wellness & Balance)
export const sageGreenTheme: Partial<ThemeConfig> = {
  colors: {
    primary: '#16a34a', // Green - growth, wellness
    primaryDark: '#15803d', // Deep green
    primaryLight: '#22c55e', // Light green
    secondary: '#059669', // Emerald
    accent: '#eab308', // Yellow - energy, optimism
    warning: '#f59e0b', // Amber
    success: '#10b981', // Emerald
    error: '#ef4444', // Red
  },
  backgroundColors: {
    primary: '#f7fef7', // Very light green-white
    secondary: '#f0fdf4', // Light green
    tertiary: '#dcfce7', // Green-gray
    card: '#ffffff', // Pure white
    hover: '#f0fdf4', // Green hover
    dark: '#bbf7d0', // Medium green
    accent: '#fefce8', // Yellow accent background
    header: '#f0fdf4', // Green header
  },
  textColors: {
    primary: '#14532d', // Deep green
    secondary: '#16a34a', // Medium green
    muted: '#22c55e', // Muted green
    light: '#4ade80', // Light green
    inverse: '#f7fef7', // Light background
    accent: '#ca8a04', // Yellow accent
  },
};

// Option 16: Copper Bronze (Artisan & Craftsmanship)
export const copperBronzeTheme: Partial<ThemeConfig> = {
  colors: {
    primary: '#b45309', // Bronze - craftsmanship, warmth
    primaryDark: '#92400e', // Deep bronze
    primaryLight: '#d97706', // Light bronze
    secondary: '#dc2626', // Red - passion, energy
    accent: '#059669', // Emerald - balance
    warning: '#f59e0b', // Amber
    success: '#10b981', // Emerald
    error: '#ef4444', // Red
  },
  backgroundColors: {
    primary: '#fffbf5', // Very light bronze-white
    secondary: '#fef3e2', // Light bronze
    tertiary: '#fed7aa', // Bronze-beige
    card: '#ffffff', // Pure white
    hover: '#fef3e2', // Bronze hover
    dark: '#fdba74', // Medium bronze
    accent: '#f0fdf4', // Green accent background
    header: '#fef3e2', // Bronze header
  },
  textColors: {
    primary: '#7c2d12', // Deep bronze
    secondary: '#b45309', // Medium bronze
    muted: '#d97706', // Muted bronze
    light: '#f59e0b', // Light bronze
    inverse: '#fffbf5', // Light background
    accent: '#059669', // Green accent
  },
};

// Option 17: Arctic Blue (Clean & Modern)
export const arcticBlueTheme: Partial<ThemeConfig> = {
  colors: {
    primary: '#0284c7', // Blue - trust, cleanliness
    primaryDark: '#0369a1', // Deep blue
    primaryLight: '#0ea5e9', // Light blue
    secondary: '#06b6d4', // Cyan - freshness
    accent: '#8b5cf6', // Purple - innovation
    warning: '#f59e0b', // Amber
    success: '#10b981', // Emerald
    error: '#ef4444', // Red
  },
  backgroundColors: {
    primary: '#f8fcff', // Very light blue-white
    secondary: '#f0f9ff', // Light blue
    tertiary: '#e0f2fe', // Blue-gray
    card: '#ffffff', // Pure white
    hover: '#f0f9ff', // Blue hover
    dark: '#bae6fd', // Medium blue
    accent: '#f5f3ff', // Purple accent background
    header: '#f0f9ff', // Blue header
  },
  textColors: {
    primary: '#0c4a6e', // Deep blue
    secondary: '#0284c7', // Medium blue
    muted: '#0ea5e9', // Muted blue
    light: '#38bdf8', // Light blue
    inverse: '#f8fcff', // Light background
    accent: '#7c3aed', // Purple accent
  },
};

// Option 18: Terracotta Earth (Authentic & Grounded)
export const terracottaEarthTheme: Partial<ThemeConfig> = {
  colors: {
    primary: '#dc2626', // Red-orange - warmth, authenticity
    primaryDark: '#b91c1c', // Deep red
    primaryLight: '#ef4444', // Light red
    secondary: '#ea580c', // Orange - energy, creativity
    accent: '#16a34a', // Green - natural balance
    warning: '#f59e0b', // Amber
    success: '#10b981', // Emerald
    error: '#ef4444', // Red
  },
  backgroundColors: {
    primary: '#fffafa', // Very light red-white
    secondary: '#fef2f2', // Light red
    tertiary: '#fed7d7', // Red-pink
    card: '#ffffff', // Pure white
    hover: '#fef2f2', // Red hover
    dark: '#fecaca', // Medium red
    accent: '#f0fdf4', // Green accent background
    header: '#fef2f2', // Red header
  },
  textColors: {
    primary: '#7f1d1d', // Deep red
    secondary: '#dc2626', // Medium red
    muted: '#ef4444', // Muted red
    light: '#f87171', // Light red
    inverse: '#fffafa', // Light background
    accent: '#16a34a', // Green accent
  },
};

// Option 19: Champagne Gold (Luxury & Celebration)
export const champagneGoldTheme: Partial<ThemeConfig> = {
  colors: {
    primary: '#d97706', // Gold - luxury, celebration
    primaryDark: '#b45309', // Deep gold
    primaryLight: '#f59e0b', // Light gold
    secondary: '#dc2626', // Red - passion, energy
    accent: '#7c3aed', // Purple - sophistication
    warning: '#f59e0b', // Amber
    success: '#10b981', // Emerald
    error: '#ef4444', // Red
  },
  backgroundColors: {
    primary: '#fffef7', // Very light gold-white
    secondary: '#fefce8', // Light gold
    tertiary: '#fef3c7', // Gold-yellow
    card: '#ffffff', // Pure white
    hover: '#fefce8', // Gold hover
    dark: '#fde68a', // Medium gold
    accent: '#faf5ff', // Purple accent background
    header: '#fefce8', // Gold header
  },
  textColors: {
    primary: '#78350f', // Deep gold
    secondary: '#d97706', // Medium gold
    muted: '#f59e0b', // Muted gold
    light: '#fbbf24', // Light gold
    inverse: '#fffef7', // Light background
    accent: '#7c3aed', // Purple accent
  },
};

// Option 20: Midnight Rose (Romantic & Sophisticated)
export const midnightRoseTheme: Partial<ThemeConfig> = {
  colors: {
    primary: '#be185d', // Rose - romance, sophistication
    primaryDark: '#9d174d', // Deep rose
    primaryLight: '#db2777', // Light rose
    secondary: '#7c3aed', // Purple - luxury, creativity
    accent: '#d97706', // Gold - premium accent
    warning: '#f59e0b', // Amber
    success: '#10b981', // Emerald
    error: '#ef4444', // Red
  },
  backgroundColors: {
    primary: '#fefcfe', // Very light rose-white
    secondary: '#fdf2f8', // Light rose
    tertiary: '#fce7f3', // Rose-pink
    card: '#ffffff', // Pure white
    hover: '#fdf2f8', // Rose hover
    dark: '#fbcfe8', // Medium rose
    accent: '#fffbeb', // Gold accent background
    header: '#fdf2f8', // Rose header
  },
  textColors: {
    primary: '#831843', // Deep rose
    secondary: '#be185d', // Medium rose
    muted: '#db2777', // Muted rose
    light: '#f472b6', // Light rose
    inverse: '#fefcfe', // Light background
    accent: '#d97706', // Gold accent
  },
};

// Theme utility functions
export const applyTheme = (theme: ThemeConfig): void => {
  const root = document.documentElement;

  // Apply colors
  root.style.setProperty('--primary-color', theme.colors.primary);
  root.style.setProperty('--primary-dark', theme.colors.primaryDark);
  root.style.setProperty('--primary-light', theme.colors.primaryLight);
  root.style.setProperty('--secondary-color', theme.colors.secondary);
  root.style.setProperty('--accent-color', theme.colors.accent);
  root.style.setProperty('--warning-color', theme.colors.warning);
  root.style.setProperty('--success-color', theme.colors.success);
  root.style.setProperty('--error-color', theme.colors.error);

  // Apply text colors
  root.style.setProperty('--text-primary', theme.textColors.primary);
  root.style.setProperty('--text-secondary', theme.textColors.secondary);
  root.style.setProperty('--text-muted', theme.textColors.muted);
  root.style.setProperty('--text-light', theme.textColors.light);
  root.style.setProperty('--text-inverse', theme.textColors.inverse);
  root.style.setProperty('--text-accent', theme.textColors.accent);

  // Apply background colors
  root.style.setProperty('--bg-primary', theme.backgroundColors.primary);
  root.style.setProperty('--bg-secondary', theme.backgroundColors.secondary);
  root.style.setProperty('--bg-tertiary', theme.backgroundColors.tertiary);
  root.style.setProperty('--bg-card', theme.backgroundColors.card);
  root.style.setProperty('--bg-hover', theme.backgroundColors.hover);
  root.style.setProperty('--bg-dark', theme.backgroundColors.dark);
  root.style.setProperty('--bg-accent', theme.backgroundColors.accent);
  root.style.setProperty('--bg-header', theme.backgroundColors.header);

  // Apply border colors
  root.style.setProperty('--border-color', theme.borderColors.default);
  root.style.setProperty('--border-light', theme.borderColors.light);
  root.style.setProperty('--divider-color', theme.borderColors.divider);

  // Apply transitions
  root.style.setProperty('--transition-fast', theme.transitions.fast);
  root.style.setProperty('--transition-normal', theme.transitions.normal);
  root.style.setProperty('--transition-slow', theme.transitions.slow);
  root.style.setProperty('--transition-elastic', theme.transitions.elastic);
  root.style.setProperty('--transition-bounce', theme.transitions.bounce);

  // Apply shadows
  root.style.setProperty('--shadow-sm', theme.shadows.sm);
  root.style.setProperty('--shadow-md', theme.shadows.md);
  root.style.setProperty('--shadow-lg', theme.shadows.lg);
  root.style.setProperty('--shadow-xl', theme.shadows.xl);
  root.style.setProperty('--shadow-2xl', theme.shadows['2xl']);
  root.style.setProperty('--shadow-3xl', theme.shadows['3xl']);
  root.style.setProperty('--shadow-inner', theme.shadows.inner);
  root.style.setProperty('--shadow-glow', theme.shadows.glow);
  root.style.setProperty('--shadow-glow-lg', theme.shadows.glowLg);
  root.style.setProperty('--shadow-card-rest', theme.shadows.cardRest);
  root.style.setProperty('--shadow-card-hover', theme.shadows.cardHover);
  root.style.setProperty('--shadow-card-active', theme.shadows.cardActive);
  root.style.setProperty('--shadow-elevated', theme.shadows.elevated);
  root.style.setProperty(
    '--shadow-elevated-hover',
    theme.shadows.elevatedHover
  );
  root.style.setProperty('--shadow-soft', theme.shadows.soft);
  root.style.setProperty('--shadow-soft-hover', theme.shadows.softHover);

  // Apply spacing
  root.style.setProperty('--spacing-xs', theme.spacing.xs);
  root.style.setProperty('--spacing-sm', theme.spacing.sm);
  root.style.setProperty('--spacing-md', theme.spacing.md);
  root.style.setProperty('--spacing-lg', theme.spacing.lg);
  root.style.setProperty('--spacing-xl', theme.spacing.xl);
  root.style.setProperty('--spacing-2xl', theme.spacing['2xl']);
  root.style.setProperty('--spacing-3xl', theme.spacing['3xl']);

  // Apply border radius
  root.style.setProperty('--radius-none', theme.borderRadius.none);
  root.style.setProperty('--radius-sm', theme.borderRadius.sm);
  root.style.setProperty('--radius-md', theme.borderRadius.md);
  root.style.setProperty('--radius-lg', theme.borderRadius.lg);
  root.style.setProperty('--radius-xl', theme.borderRadius.xl);
  root.style.setProperty('--radius-full', theme.borderRadius.full);
};

// Merge themes utility
export const mergeThemes = (
  baseTheme: ThemeConfig,
  overrides: Partial<ThemeConfig>
): ThemeConfig => {
  return {
    colors: { ...baseTheme.colors, ...overrides.colors },
    textColors: { ...baseTheme.textColors, ...overrides.textColors },
    backgroundColors: {
      ...baseTheme.backgroundColors,
      ...overrides.backgroundColors,
    },
    borderColors: { ...baseTheme.borderColors, ...overrides.borderColors },
    transitions: { ...baseTheme.transitions, ...overrides.transitions },
    shadows: { ...baseTheme.shadows, ...overrides.shadows },
    spacing: { ...baseTheme.spacing, ...overrides.spacing },
    borderRadius: { ...baseTheme.borderRadius, ...overrides.borderRadius },
  };
};
