import { TailwindHelpers } from '../../../types';

/**
 * Returns the `fade` variants for the component `sliding panel`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function slidingPanelFade({ theme }: TailwindHelpers) {
  /* eslint-disable @typescript-eslint/restrict-template-expressions */
  return {
    '&.fade': {
      '.sliding-panel__scroll': {
        mask: `linear-gradient(to right,
            transparent calc(0.43 * ${theme('spacing.80')}),
            rgba(0, 0, 0, 0.8) calc(0.67 * ${theme('spacing.80')}),
            black ${theme('spacing.80')},
            rgba(0, 0, 0, 0.8) calc(100% - 0.67 * ${theme('spacing.80')}),
            transparent calc(100% - 0.43 * ${theme('spacing.80')}))`
      },
      '&-sm': {
        '.sliding-panel__scroll': {
          mask: `linear-gradient(to right,
            transparent calc(0.43 * ${theme('spacing.40')}),
            rgba(0, 0, 0, 0.8) calc(0.67 * ${theme('spacing.40')}),
            black ${theme('spacing.40')},
            rgba(0, 0, 0, 0.8) calc(100% - 0.67 * ${theme('spacing.40')}),
            transparent calc(100% - 0.43 * ${theme('spacing.40')}))`
        }
      },
      '&-lg': {
        '.sliding-panel__scroll': {
          mask: `linear-gradient(to right,
            transparent calc(0.43 * ${theme('spacing.152')}),
            rgba(0, 0, 0, 0.8) calc(0.67 * ${theme('spacing.152')}),
            black ${theme('spacing.152')},
            rgba(0, 0, 0, 0.8) calc(100% - 0.67 * ${theme('spacing.152')}),
            transparent calc(100% - 0.43 * ${theme('spacing.152')}))`
        }
      }
    }
  };
}
