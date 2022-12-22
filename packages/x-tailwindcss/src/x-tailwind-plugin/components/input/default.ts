import { deepMerge } from '@empathyco/x-deep-merge';
import { TailwindHelpers } from '../../../types';
import { inputColors } from './colors';
import { inputSizes } from './sizes';

/**
 * Returns the default styles for component `input`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
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
      '&:disabled': {
        cursor: 'not-allowed'
      },
      '&::placeholder': {
        color: theme('colors.neutral.50'),
        fontFamily: theme('fontFamily.main'),
        fontWeight: theme('fontWeight.regular')
      }
    },
    inputColors(helpers).neutral,
    inputSizes(helpers).md
  );
}
