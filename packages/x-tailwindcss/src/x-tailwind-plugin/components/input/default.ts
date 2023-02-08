import { deepMerge } from '@empathyco/x-deep-merge';
import { TailwindHelpers } from '../../../types';
import { inputSizes } from './sizes';

/**
 * Returns the default styles for component `input`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function inputDefault(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return deepMerge(
    {
      fontFamily: theme('fontFamily.main'),
      borderWidth: theme('borderWidth.1'),
      cursor: 'text',
      fontWeight: theme('fontWeight.regular'),
      textOverflow: 'ellipsis',
      paddingInlineStart: theme('spacing.16'),
      paddingInlineEnd: theme('spacing.16'),
      borderColor: theme('colors.neutral.90'),
      backgroundColor: theme('colors.neutral.0'),
      color: theme('colors.neutral.90'),

      '&:hover': {
        borderColor: `var(--input-color-75,${theme('colors.neutral.50')})`
      },

      '&:focus,&:focus-within': {
        borderColor: `var(--input-color-75,${theme('colors.neutral.50')})`,
        outlineColor: `var(--input-color-25,${theme('colors.neutral.25')})`,
        outlineWidth: theme('borderWidth.2'),
        outlineStyle: 'solid'
      },

      '&:disabled,&[disabled]': {
        cursor: 'not-allowed',
        borderColor: theme('colors.neutral.25'),
        backgroundColor: theme('colors.neutral.10'),
        color: theme('colors.neutral.50')
      },

      '&::placeholder': {
        color: theme('colors.neutral.50'),
        fontFamily: theme('fontFamily.main'),
        fontWeight: theme('fontWeight.regular')
      }
    },
    inputSizes(helpers).md
  );
}
