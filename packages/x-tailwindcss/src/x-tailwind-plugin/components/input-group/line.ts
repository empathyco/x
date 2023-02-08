import { deepMerge } from '@empathyco/x-deep-merge';
import { TailwindHelpers } from '../../../types';
import { inputLine } from '../input/line';

/**
 * Returns the default styles for component `input`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function inputGroupline(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return deepMerge(inputLine(helpers), {
    line: {
      '&:focus-within': {
        outline: 'none',
        boxShadow: `0 2px 0 -0.5px var(--input-color-25,${theme('colors.neutral.25')})`
      },

      '& .input-group-button': {
        height: theme('spacing.32')
      },
      '& .input-group-button-primary': {
        height: theme('spacing.32')
      },

      '&.input-group-sm': {
        paddingBottom: '4px',
        '& .input-group-button,& .input-group-button-primary': {
          height: '28px'
        }
      },

      '> .input-group-button-primary:first-child': {
        borderInlineStartStyle: 'solid'
      },
      '> .input-group-button-primary:last-child': {
        borderInlineEndStyle: 'solid'
      }
    }
  });
}
