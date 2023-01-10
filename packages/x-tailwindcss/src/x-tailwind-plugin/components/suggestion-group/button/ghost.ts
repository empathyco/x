import { TailwindHelpers } from '../../../../types';

/**
 * Returns the `ghost` variant for component `suggestion group button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function suggestionGroupButtonGhost(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    ghost: {
      '&:hover': {
        backgroundColor: theme('colors.neutral.25'),
        transform: 'none'
      }
    }
  };
}
