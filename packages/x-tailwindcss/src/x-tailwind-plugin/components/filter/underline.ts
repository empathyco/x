import { TailwindHelpers } from '../../../types';

/**
 * Returns the `underline` variant for component `filter`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function filterUnderline(helpers: TailwindHelpers) {
  const { theme } = helpers;

  return {
    underline: {
      '&:hover': {
        borderColor: 'currentColor'
      },
      '&.selected': {
        fontWeight: theme('fontWeight.regular')
      }
    }
  };
}
