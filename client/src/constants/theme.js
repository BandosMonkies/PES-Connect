// Theme configuration for PES Connect
// Color palette: Orange, Blue, and White

export const colors = {
  // Primary colors
  primary: {
    orange: '#FF6B35',
    orangeLight: '#FF8C61',
    orangeDark: '#E55A2B',
    orangeVeryLight: '#FFE5DC',
  },
  secondary: {
    blue: '#1E88E5',
    blueLight: '#42A5F5',
    blueDark: '#1565C0',
    blueVeryLight: '#E3F2FD',
  },
  neutral: {
    white: '#FFFFFF',
    offWhite: '#F8F9FA',
    lightGray: '#E9ECEF',
    gray: '#6C757D',
    darkGray: '#495057',
    dark: '#212529',
  },
  // Semantic colors
  success: '#28A745',
  error: '#DC3545',
  warning: '#FFC107',
  info: '#17A2B8',
};

export const gradients = {
  primary: `linear-gradient(135deg, ${colors.primary.orange} 0%, ${colors.secondary.blue} 100%)`,
  primaryReverse: `linear-gradient(135deg, ${colors.secondary.blue} 0%, ${colors.primary.orange} 100%)`,
  orange: `linear-gradient(135deg, ${colors.primary.orangeLight} 0%, ${colors.primary.orange} 100%)`,
  blue: `linear-gradient(135deg, ${colors.secondary.blueLight} 0%, ${colors.secondary.blue} 100%)`,
  subtle: `linear-gradient(135deg, ${colors.neutral.offWhite} 0%, ${colors.neutral.white} 100%)`,
};

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  xxl: '3rem',      // 48px
  xxxl: '4rem',     // 64px
};

export const borderRadius = {
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  colored: '0 10px 30px -5px rgba(255, 107, 53, 0.3)',
  coloredBlue: '0 10px 30px -5px rgba(30, 136, 229, 0.3)',
};

export const typography = {
  fontFamily: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
    heading: "'Poppins', 'Inter', sans-serif",
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
};

export const transitions = {
  fast: '150ms ease-in-out',
  normal: '250ms ease-in-out',
  slow: '350ms ease-in-out',
};
