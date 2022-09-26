import { TailwindHelpers } from '../../../types';
import { mapColors } from '../../../utils/map-colors';

/**
 * Returns the `ghost` variant for component `button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function buttonGhost(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    '&.ghost': {
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      color: theme('colors.neutral.50'),

      '&:hover': {
        borderColor: theme('colors.neutral.10'),
        backgroundColor: theme('colors.neutral.10'),
        color: theme('colors.neutral.75')
      },

      '&:active': {
        borderColor: theme('colors.neutral.10'),
        backgroundColor: theme('colors.neutral.10'),
        color: theme('colors.neutral.75')
      },

      '&:disabled': {
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        color: theme('colors.neutral.25')
      },
      ...mapColors(
        color => ({
          borderColor: 'transparent',
          backgroundColor: 'transparent',
          color: color['50'],

          '&:hover': {
            borderColor: theme('colors.neutral.10'),
            backgroundColor: theme('colors.neutral.10'),
            color: color['75']
          },

          '&:active': {
            borderColor: theme('colors.neutral.10'),
            backgroundColor: theme('colors.neutral.10'),
            color: color['75']
          },

          '&:disabled': {
            borderColor: 'transparent',
            backgroundColor: 'transparent',
            color: theme('colors.neutral.25')
          }
        }),
        helpers
      )
    }
  };
}
