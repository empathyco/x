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
  return {
    fontFamily: theme('fontFamily.main'),
    borderWidth: theme('borderWidth.1'),
    cursor: 'pointer',
    fontWeight: theme('fontWeight.regular'),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    paddingInlineStart: theme('spacing.16'),
    paddingInlineEnd: theme('spacing.16'),
    '&::placeholder': {
      color: theme('colors.neutral.50'),
      fontFamily: theme('fontFamily.main'),
      fontSize: theme('fontSize.md'),
      fontWeight: theme('fontWeight.regular')
    },
    '&:disabled': {
      cursor: 'not-allowed'
    },
    ...inputColors(helpers).neutral,
    ...inputSizes(helpers).md
  };
}
