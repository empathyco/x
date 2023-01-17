import { TailwindHelpers } from '../../../types';

/**
 * Returns the default styles for component `product image`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function productImageDefault(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    aspectRatio: theme('aspectRatio.default'),
    overflow: 'hidden',
    img: {
      objectFit: 'contain'
    }
  };
}
