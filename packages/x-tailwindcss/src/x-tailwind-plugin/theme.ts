export default {
  borderRadius: {
    none: 0,
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '32px',
    full: '99999px'
  },
  borderWidth: {
    1: '1px',
    2: '2px',
    4: '4px'
  },
  colors: {
    neutral: {
      0: '#FFFFFF',
      10: '#F7F7FA',
      25: '#C8D1D5',
      50: '#5F717B',
      75: '#4B5B63',
      90: '#283034',
      100: '#000000'
    },
    lead: {
      25: '#BBC9CF',
      50: '#243D48',
      75: '#1B2D36'
    },
    auxiliary: {
      25: '#BFE1EC',
      50: '#0086B2',
      75: '#006485'
    },
    accent: {
      25: '#F4D2DB',
      50: '#D44A6F',
      75: '#A42748'
    },
    highlight: {
      25: '#E2D8E3',
      50: '#8B6391',
      75: '#684A6D'
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
    primary: ['Inter', 'sans-serif'],
    secondary: ['Lora', 'serif'],
    auxiliary: ['Poppins', 'sans-serif'],
    special: ['Bree Serif', 'serif'],
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
    light: '200',
    regular: '400',
    bold: '600'
  },
  letterSpacing: {
    sm: '-1%',
    md: '0',
    lg: '2%'
  },
  lineHeight: {
    sm: '1.2',
    md: '1.5',
    lg: '2'
  },
  screens: {
    tablet: '800px',
    desktop: '1200px',
    large: '2800px'
  },
  spacing: {
    1: '1px',
    2: '2px',
    4: '4px',
    8: '8px',
    12: '12px',
    16: '16px',
    20: '20px',
    24: '24px',
    32: '32px',
    40: '40px',
    48: '48px',
    56: '56px',
    64: '64px',
    80: '80px',
    96: '96px',
    128: '128px',
    152: '152px',
    184: '184px',
    216: '216px',
    280: '280px',
    344: '344px'
  },
  extend: {}
} as const;
