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
  return deepMerge(
    // to reorder properties
    {
      '&:hover,&:focus': null,
      '&:hover,&:focus-within': null,
      '&:disabled,&[disabled]': null
    },
    inputDefault(helpers),
    {
      display: 'flex',
      flexFlow: 'row nowrap',
      alignItems: 'center',
      alignContent: 'center',
      padding: '0',
      gap: theme('spacing.8'),
      overflow: 'hidden', // necessary to not show the buttons border over the input-group border.

      '&:hover': {
        borderColor: `var(--input-color-75,${theme('colors.neutral.50')})`
      },

      '&:focus-within': {
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
        color: 'inherit',
        minWidth: '0',
        fontSize: 'inherit',
        fontWeight: 'inherit',
        outline: 'none'
      }
    }
  );
}
