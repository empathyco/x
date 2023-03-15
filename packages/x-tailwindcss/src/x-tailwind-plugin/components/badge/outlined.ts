import { TailwindHelpers } from '../../../types';

/**
 * Returns the `outlined` variant for component `badge`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function badgeOutlined(helpers: TailwindHelpers) {
  const { theme } = helpers;

  return {
    outlined: {
      color: theme('colors.neutral.90'),
      backgroundColor: 'transparent',

      borderWidth: theme('spacing.1'),
      borderColor: `var(--badge-color-50, ${theme('colors.neutral.90')})`
    }
  };
}
