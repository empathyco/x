import { TailwindHelpers } from '../../../types';

/**
 * Returns the `ghost` variant for component `suggestion group`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function suggestionGroupGhost(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    ghost: {
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: theme('colors.neutral.10')
      },
      gap: theme('spacing.4')
    }
  };
}
