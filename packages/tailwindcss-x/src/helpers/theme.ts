export default {
  colors: {
    neutral: {
      0: '#FFFFFF',
      10: '#E0E0E0',
      25: '#CBCBCB',
      50: '#ACACAC',
      75: '#5E5E5E',
      90: '#131313',
      100: '#000000'
    },
    primary: {
      25: '#46768B',
      50: '#36515B',
      75: '#243D48'
    },
    secondary: {
      25: '#06C1FF',
      50: '#0086B2',
      75: '#006485'
    },
    accent: {
      25: '#EC9B89',
      50: '#E67962',
      75: '#D44122'
    },
    highlight: {
      25: '#F5DEA3',
      50: '#F2CF6C',
      75: '#CB9C13'
    },
    success: {
      25: '#F5DEA3',
      50: '#F2CF6C',
      75: '#CB9C13'
    },
    warning: {
      25: '#46768B',
      50: '#36515B',
      400: '#243D48'
    },
    error: {
      25: '#46768B',
      50: '#36515B',
      75: '#243D48'
    }
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
    156: '156px'
  },
  borderRadius: {
    none: '0px',
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
  fontFamily: {
    primary: '',
    secondary: '',
    auxiliary: '',
    special: '',
    icons: ''
  },
  letterSpacing: {
    sm: '-0.05em',
    md: '0em',
    lg: '0.1em'
  },
  lineHeight: {
    sm: '1',
    md: '1.5',
    lg: '2'
  },
  screens: {
    tablet: '800px',
    desktop: '1200px',
    large: '2800px'
  },
  extend: {}
} as const;
