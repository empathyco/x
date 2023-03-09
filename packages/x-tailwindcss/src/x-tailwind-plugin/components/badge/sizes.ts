import { TailwindHelpers } from '../../../types';

/**
 * Returns the `sizes` variants for component `badge`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function badgeSizes(helpers: TailwindHelpers) {
  const { theme } = helpers;

  return {
    sm: {
      '--attach-horizontal-offset': theme('spacing.8'),

      height: theme('spacing.20'),
      padding: `0 ${theme('spacing.8')}`
    },
    md: {
      '--attach-horizontal-offset': theme('spacing.12'),

      height: theme('spacing.24'),
      padding: `0 ${theme('spacing.12')}`
    }
  };
}
