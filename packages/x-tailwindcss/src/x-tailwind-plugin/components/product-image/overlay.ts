import { TailwindHelpers } from '../../../types';

/**
 * Returns the `overlay` variant of component `product-image`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function overlay(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    overlay: {
      '&:hover': {
        mixBlendMode: 'multiply'
      },
      img: {
        '&:hover': {
          maskImage: `linear-gradient(to top, transparent, 20%, ${theme('colors.neutral.100')})`
        }
      }
    }
  };
}
