import { deepMerge } from '@empathyco/x-deep-merge';
import { TailwindHelpers } from '../../../types';
import { inputLine } from '../input/line';

/**
 * Returns the default styles for component `input`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function inputGroupLine(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return deepMerge(inputLine(helpers), {
    line: {
      // fixed size buttons in this line variant
      '& .input-group-button': {
        height: theme('spacing.32')
      },
      '& .input-group-button-primary': {
        height: theme('spacing.32')
      },

      // To avoid the buttons to be "touching" the bottom line in sm size variant.
      '&.input-group-sm': {
        paddingBottom: '4px',
        '& .input-group-button,& .input-group-button-primary': {
          height: '28px'
        }
      },

      // padding is simulated with margin to remove it on button primary.
      // Default input-group is "hiding" the border with a negative margin, so here is restored to 0
      '> .input-group-button-primary:first-child': {
        marginInlineStart: '0'
      },
      '> .input-group-button-primary:last-child': {
        marginInlineEnd: '0'
      }
    }
  });
}
