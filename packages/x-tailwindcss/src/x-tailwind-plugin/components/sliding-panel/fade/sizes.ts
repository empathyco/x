import { TailwindHelpers } from '../../../../types';

/**
 * Returns the `sizes` variants for the component `fade`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function fadeSizes({ theme }: TailwindHelpers) {
  return {
    sm: {
      '.sliding-panel-scroll': {
        mask: `linear-gradient(to right,
            transparent calc(0.43 * ${theme('spacing.40')}),
            rgba(0, 0, 0, 0.8) calc(0.67 * ${theme('spacing.40')}),
            black ${theme('spacing.40')},
            rgba(0, 0, 0, 0.8) calc(100% - 0.67 * ${theme('spacing.40')}),
            transparent calc(100% - 0.43 * ${theme('spacing.40')}))`
      }
    },
    md: {
      '.sliding-panel-scroll': {
        mask: `linear-gradient(to right,
            transparent calc(0.43 * ${theme('spacing.80')}),
            rgba(0, 0, 0, 0.8) calc(0.67 * ${theme('spacing.80')}),
            black ${theme('spacing.80')},
            rgba(0, 0, 0, 0.8) calc(100% - 0.67 * ${theme('spacing.80')}),
            transparent calc(100% - 0.43 * ${theme('spacing.80')}))`
      }
    },
    lg: {
      '.sliding-panel-scroll': {
        mask: `linear-gradient(to right,
            transparent calc(0.43 * ${theme('spacing.152')}),
            rgba(0, 0, 0, 0.8) calc(0.67 * ${theme('spacing.152')}),
            black ${theme('spacing.152')},
            rgba(0, 0, 0, 0.8) calc(100% - 0.67 * ${theme('spacing.152')}),
            transparent calc(100% - 0.43 * ${theme('spacing.152')}))`
      }
    }
  };
}
