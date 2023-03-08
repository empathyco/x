import { TailwindHelpers } from '../../../types';
import { tagSizes } from './sizes';

/**
 * Returns the default styles for component `tag`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function tagDefault(helpers: TailwindHelpers) {
  const { theme } = helpers;

  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flexFlow: 'row nowrap',
    boxSizing: 'border-box',

    backgroundColor: theme('colors.neutral.0'),
    borderColor: theme('colors.neutral.25'),
    borderStyle: 'solid',
    borderWidth: theme('borderWidth.1'),
    color: theme('colors.neutral.75'),

    gap: theme('spacing.8'),

    fontFamily: theme('fontFamily.main'),
    fontWeight: theme('fontWeight.regular'),
    letterSpacing: theme('letterSpacing.lg'),
    lineHeight: theme('lineHeight.sm'),

    cursor: 'pointer',

    '&:hover,&:focus,&:active': {
      borderColor: theme('colors.neutral.50'),
      color: theme('colors.neutral.90')
    },

    '&:disabled': {
      cursor: 'not-allowed',
      borderColor: theme('colors.neutral.25'),
      color: theme('colors.neutral.25')
    },

    ...tagSizes(helpers).md,

    '&:not(:disabled).selected': {
      borderColor: `var(--tag-color-75, ${theme('colors.neutral.90')})`,
      borderWidth: theme('spacing.2'),
      color: theme('colors.neutral.90'),

      '&:hover,&:focus,&:active': {
        borderColor: `var(--tag-color-50, ${theme('colors.neutral.50')})`
      }
    }
  };
}
