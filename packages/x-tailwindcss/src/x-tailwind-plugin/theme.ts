export default {
  aspectRatio: {
    default: '3 / 4',
  },
  borderRadius: {
    none: 0,
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '32px',
    full: '99999px',
  },
  borderWidth: {
    DEFAULT: '1px',
    1: '1px',
    2: '2px',
    4: '4px',
  },
  colors: {
    current: 'currentColor',
    transparent: 'transparent',
    neutral: {
      0: '#FFFFFF',
      10: '#EEF1F2',
      25: '#DBE2E5',
      50: '#5F717B',
      75: '#3C494F',
      90: '#283034',
      100: '#000000',
    },
    lead: {
      25: '#BBC9CF',
      50: '#5E7782',
      75: '#243D48',
    },
    auxiliary: {
      25: '#E3F0F5',
      50: '#0086B2',
      75: '#006485',
    },
    accent: {
      25: '#F8EBEF',
      50: '#D44A6F',
      75: '#A42748',
    },
    highlight: {
      25: '#F1EEF2',
      50: '#8B6391',
      75: '#684A6D',
    },
    success: {
      25: '#ECFDF5',
      50: '#10B981',
      75: '#065F46',
    },
    warning: {
      25: '#FFFBEB',
      50: '#F59E0B',
      75: '#92400E',
    },
    error: {
      25: '#FEF2F2',
      50: '#EF4444',
      75: '#991B1B',
    },
  },
  fontFamily: {
    main: 'Inter, sans-serif',
    alternative: 'Lora, serif',
    extra: 'Poppins, sans-serif',
    special: 'Bree Serif, serif',
    icon: 'font-awesome',
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
    '8xl': '96px',
  },
  fontWeight: {
    light: '200',
    regular: '400',
    bold: '700',
  },
  layoutMaxWidth: {
    md: '1440px',
    lg: '1920px',
    full: '100vw',
  },
  letterSpacing: {
    xs: '-0.025em',
    sm: '-0.01em',
    md: '0',
    lg: '0.04em',
  },
  lineHeight: {
    xs: '1.2',
    sm: '1.4',
    md: '1.6',
    lg: '1.8',
    default: 'auto',
  },
  screens: {
    tablet: '744px',
    desktop: '1280px',
    large: '2560px',
  },
  spacing: {
    0: '0px',
    1: '1px',
    2: '2px',
    4: '4px',
    8: '8px',
    12: '12px',
    16: '16px',
    20: '20px',
    24: '24px',
    28: '28px',
    32: '32px',
    40: '40px',
    48: '48px',
    56: '56px',
    64: '64px',
    80: '80px',
    96: '96px',
    128: '128px',
    160: '160px',
    192: '192px',
    224: '224px',
    256: '256px',
    320: '320px',
    384: '384px',
    448: '448px',
    512: '512px',
  },
  strokeWidth: {
    sm: '0.2px',
    md: '0.4px',
    lg: '0.8px',
    xl: '1px',
  },
  extend: {},
} as const
