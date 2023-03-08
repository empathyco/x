import { TailwindHelpers } from '../../../types';

/**
 * Returns the `bright` variant for component `badge`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function badgeBright(helpers: TailwindHelpers) {
  const { theme } = helpers;

  return {
    bright: {
      borderWidth: theme('spacing.1'),
      color: theme('colors.neutral.0'),
      borderColor: `var(--badge-color-25, ${theme('colors.neutral.0')})`,
      backgroundColor: 'transparent'
    }
  };
}
