import { TailwindHelpers } from '../../../types';

/**
 * Returns the `overlay` variant for component `product image`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function overlay(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    overlay: {
      '--gradient-start': theme('colors.neutral.0'),
      '--gradient-end': theme('overlay.image'),
      '&:hover': {
        backgroundImage: 'linear-gradient(var(--gradient-start), var(--gradient-end))'
      },
      img: {
        '&:hover': {
          mixBlendMode: 'multiply'
        }
      }
    }
  };
}
