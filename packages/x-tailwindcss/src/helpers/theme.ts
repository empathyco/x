export default {
  borderRadius: {
    none: 0,
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '32px',
    round: '99999px'
  },
  borderWidth: {
    1: '1px',
    2: '2px',
    4: '4px'
  },
  colors: {
    neutral: {
      0: '#FFFFFF',
      10: '#E7E7E7',
      25: '#BFBFBF',
      50: '#808080',
      75: '#404040',
      90: '#1A1A1A',
      100: '#000000'
    },
    primary: {
      25: '#CDD3D6',
      50: '#243D48',
      75: '#1B2D36'
    },
    secondary: {
      25: '#BFE1EC',
      50: '#0086B2',
      75: '#006485'
    },
    accent: {
      25: '#F4D2DB',
      50: '#D44A6F',
      75: '#A42748'
    },
    success: {
      25: '#ECFDF5',
      50: '#10B981',
      75: '#065F46'
    },
    warning: {
      25: '#FFFBEB',
      50: '#F59E0B',
      75: '#92400E'
    },
    error: {
      25: '#FEF2F2',
      50: '#EF4444',
      75: '#991B1B'
    }
  },
  fontFamily: {
    primary: 'Montserrat',
    secondary: 'Lora',
    auxiliary: 'Helvetica Neue',
    special: 'Allan',
    icon: 'font-awesome'
  },
  fontSize: {
    xxs: '10px',
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '20px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '40px',
    '4xl': '48px',
    '5xl': '56px',
    '6xl': '64px',
    '7xl': '80px',
    '8xl': '96px'
  },
  fontWeight: {
    light: 200,
    regular: 400,
    bold: 600
  },
  letterSpacing: {
    sm: '-1%',
    md: 0,
    lg: '2%'
  },
  lineHeight: {
    sm: 1,
    md: 1.5,
    lg: 2
  },
  screens: {
    tablet: '800px',
    desktop: '1200px',
    large: '2800px'
  },
  spacing: {
    'spacing-1': 1,
    'spacing-2': 2,
    'spacing-4': 4,
    'spacing-8': 8,
    'spacing-12': 12,
    'spacing-16': 16,
    'spacing-20': 20,
    'spacing-24': 24,
    'spacing-32': 32,
    'spacing-40': 40,
    'spacing-48': 48,
    'spacing-56': 56,
    'spacing-64': 64,
    'spacing-80': 80,
    'spacing-96': 96,
    'spacing-128': 128,
    'spacing-152': 152
  },
  extend: {}
} as const;
