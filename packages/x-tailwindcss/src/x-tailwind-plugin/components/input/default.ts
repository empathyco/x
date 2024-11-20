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
      paddingInlineStart: theme('x.x.spacing.16'),
      paddingInlineEnd: theme('x.x.spacing.16'),
      borderWidth: theme('x.borderWidth.1'),
      fontWeight: theme('x.fontWeight.regular'),
      textOverflow: 'ellipsis',
      fontFamily: theme('x.fontFamily.main'),
      borderColor: theme('x.colors.neutral.90'),
      backgroundColor: theme('x.colors.neutral.0'),
      color: theme('x.colors.neutral.90'),
      cursor: 'text',

      '&:hover': {
        borderColor: `var(--input-color-75,${theme('x.colors.neutral.50')})`
      },

      '&:focus,&:focus-within': {
        borderColor: `var(--input-color-75,${theme('x.colors.neutral.50')})`,
        outlineColor: `var(--input-color-25,${theme('x.colors.neutral.25')})`,
        outlineWidth: theme('x.borderWidth.2'),
        outlineStyle: 'solid'
      },

      '&:disabled,&[disabled]': {
        cursor: 'not-allowed',
        borderColor: theme('x.colors.neutral.25'),
        backgroundColor: theme('x.colors.neutral.10'),
        color: theme('x.colors.neutral.50')
      },

      '&::placeholder,& .input-placeholder': {
        color: theme('x.colors.neutral.50'),
        fontFamily: theme('x.fontFamily.main'),
        fontWeight: theme('x.fontWeight.regular')
      }
    },
    inputSizes(helpers).md
  );
}
