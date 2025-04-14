import type { TailwindHelpers } from '../../../../types'

/**
 * Returns the `sizes` variants for the component `fade`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function fadeDefaultSizes({ theme }: TailwindHelpers) {
  return {
    sm: {
      mask: `linear-gradient(to right,
            transparent calc(0.43 * ${theme('x.spacing.40')}),
            rgba(0, 0, 0, 0.8) calc(0.67 * ${theme('x.spacing.40')}),
            black ${theme('x.spacing.40')},
            rgba(0, 0, 0, 0.8) calc(100% - 0.67 * ${theme('x.spacing.40')}),
            transparent calc(100% - 0.43 * ${theme('x.spacing.40')}))`,
    },
    md: {
      mask: `linear-gradient(to right,
            transparent calc(0.43 * ${theme('x.spacing.80')}),
            rgba(0, 0, 0, 0.8) calc(0.67 * ${theme('x.spacing.80')}),
            black ${theme('x.spacing.80')},
            rgba(0, 0, 0, 0.8) calc(100% - 0.67 * ${theme('x.spacing.80')}),
            transparent calc(100% - 0.43 * ${theme('x.spacing.80')}))`,
    },
    lg: {
      mask: `linear-gradient(to right,
            transparent calc(0.43 * ${theme('x.spacing.160')}),
            rgba(0, 0, 0, 0.8) calc(0.67 * ${theme('x.spacing.160')}),
            black ${theme('x.spacing.160')},
            rgba(0, 0, 0, 0.8) calc(100% - 0.67 * ${theme('x.spacing.160')}),
            transparent calc(100% - 0.43 * ${theme('x.spacing.160')}))`,
    },
  }
}

/**
 * Returns the `sizes` variants for the component `sliding panel fade start`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function fadeStartSizes({ theme }: TailwindHelpers) {
  return {
    sm: {
      mask: `linear-gradient(to left,
              transparent calc(0.43 * ${theme('x.spacing.40')}),
              rgba(0, 0, 0, 0.8) calc(0.67 * ${theme('x.spacing.40')}),
              black ${theme('x.spacing.40')});`,
    },
    md: {
      mask: `linear-gradient(to left,
              transparent calc(0.43 * ${theme('x.spacing.80')}),
              rgba(0, 0, 0, 0.8) calc(0.67 * ${theme('x.spacing.80')}),
              black ${theme('x.spacing.80')});`,
    },
    lg: {
      mask: `linear-gradient(to left,
              transparent calc(0.43 * ${theme('x.spacing.160')}),
              rgba(0, 0, 0, 0.8) calc(0.67 * ${theme('x.spacing.160')}),
              black ${theme('x.spacing.160')});`,
    },
  }
}

/**
 * Returns the `sizes` for the component `sliding panel fade end`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function fadeEndSizes({ theme }: TailwindHelpers) {
  return {
    sm: {
      mask: `linear-gradient(to right,
              transparent calc(0.43 * ${theme('x.spacing.40')}),
              rgba(0, 0, 0, 0.8) calc(0.67 * ${theme('x.spacing.40')}),
              black ${theme('x.spacing.40')});`,
    },
    md: {
      mask: `linear-gradient(to right,
              transparent calc(0.43 * ${theme('x.spacing.80')}),
              rgba(0, 0, 0, 0.8) calc(0.67 * ${theme('x.spacing.80')}),
              black ${theme('x.spacing.80')});`,
    },
    lg: {
      mask: `linear-gradient(to right,
              transparent calc(0.43 * ${theme('x.spacing.160')}),
              rgba(0, 0, 0, 0.8) calc(0.67 * ${theme('x.spacing.160')}),
              black ${theme('x.spacing.160')});`,
    },
  }
}
