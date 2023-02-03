import { deepMerge } from '@empathyco/x-deep-merge';
import { TailwindHelpers } from '../../../types';
import { inputDefault } from '../input/default';

/**
 * Returns the default styles for component `input`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function inputGroupDefault(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return deepMerge(inputDefault(helpers), {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    alignContent: 'center',
    padding: '0',
    gap: theme('spacing.8'),
    overflow: 'hidden', // necessary to not show the buttons border over the input-group border.

    '&:hover,&:focus-within': {
      borderColor: `var(--input-color-75,${theme('colors.neutral.50')})`
    },

    '> :first-child': {
      marginInlineStart: theme('spacing.16')
    },
    '> :last-child': {
      marginInlineEnd: theme('spacing.16')
    },

    '.input, input': {
      border: 'none',
      flex: '1 1 auto',
      padding: '0',
      background: 'none',
      color: 'inherit'
    }
  });
}
