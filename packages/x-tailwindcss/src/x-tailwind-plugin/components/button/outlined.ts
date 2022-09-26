import { TailwindHelpers } from '../../../types';
import { mapColors } from '../../../utils/map-colors';

/**
 * Returns the `outlined` variant for component `button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function buttonOutlined(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    '&.outlined': {
      borderColor: theme('colors.neutral.50'),
      backgroundColor: theme('colors.neutral.0'),
      color: theme('colors.neutral.50'),

      '&:hover': {
        borderColor: theme('colors.neutral.50'),
        backgroundColor: theme('colors.neutral.50'),
        color: theme('colors.neutral.0')
      },

      '&:active': {
        borderColor: theme('colors.neutral.50'),
        backgroundColor: theme('colors.neutral.50'),
        color: theme('colors.neutral.0')
      },

      '&:disabled': {
        borderColor: theme('colors.neutral.25'),
        backgroundColor: theme('colors.neutral.10'),
        color: theme('colors.neutral.25')
      },
      ...mapColors(
        color => ({
          borderColor: color['50'],
          backgroundColor: theme('colors.neutral.0'),
          color: color['50'],

          '&:hover': {
            backgroundColor: color['50'],
            borderColor: color['50'],
            color: theme('colors.neutral.0')
          },

          '&:active': {
            borderColor: color['50'],
            backgroundColor: color['50'],
            color: theme('colors.neutral.0')
          },

          '&:disabled': {
            borderColor: theme('colors.neutral.25'),
            backgroundColor: theme('colors.neutral.10'),
            color: theme('colors.neutral.25')
          }
        }),
        helpers
      )
    }
  };
}
