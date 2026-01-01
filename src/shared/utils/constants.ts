/**
 * Global constants for the rhythm game
 */

// Design tokens
export const COLORS = {
  primary: '#8B7FD6',     // Purple from design
  secondary: '#E6E6FA',   // Light lavender
  surface: {
    dark: '#1a1a1a',      // Dark card backgrounds
    light: '#2a2a2a',     // Lighter elements
    accent: '#3a3a3a',    // Accent elements
  },
  text: {
    primary: '#ffffff',   // Main text
    secondary: '#cccccc', // Secondary text
    muted: '#999999',     // Muted text
  },
  accent: {
    gold: '#FFD700',      // Star ratings
    green: '#4CAF50',     // Success states
    red: '#f44336',       // Error states
  },
  border: '#444444',      // Border color
} as const;

// Layout constants
export const LAYOUT = {
  borderRadius: {
    small: '6px',
    medium: '12px',
    large: '16px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  shadows: {
    card: '0 8px 32px rgba(0,0,0,0.3)',
    elevated: '0 12px 48px rgba(0,0,0,0.4)',
    glow: '0 0 20px rgba(139, 127, 214, 0.3)',
  },
} as const;

// Animation constants
export const ANIMATIONS = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
  },
} as const;

// Game constants
export const GAME = {
  maxStars: 10,           // Maximum difficulty stars
  scoresPerPage: 10,      // Number of scores to show
  searchDebounce: 300,    // Search input debounce in ms
  wheelItemHeight: 80,    // Height of each song item in wheel
  previewDuration: 30,    // Song preview duration in seconds
} as const;

// Keyboard shortcuts
export const KEYS = {
  up: 'ArrowUp',
  down: 'ArrowDown',
  enter: 'Enter',
  escape: 'Escape',
  space: ' ',
} as const;