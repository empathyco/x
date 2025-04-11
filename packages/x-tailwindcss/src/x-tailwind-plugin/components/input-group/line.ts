import type { TailwindHelpers } from '../../../types'
import { deepMerge } from '@empathyco/x-deep-merge'
import { inputLine } from '../input/line'

/**
 * Returns the `line` variant for component `input-group`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function inputGroupLine(helpers: TailwindHelpers) {
  const { theme } = helpers
  // eslint-disable-next-line ts/no-unsafe-return
  return deepMerge(inputLine(helpers), {
    line: {
      // fixed size buttons in this line variant
      '--input-group-button-height': theme('x.spacing.32'),

      // To avoid the buttons to be "touching" the bottom line in sm size variant.
      '&.input-group-sm': {
        '--input-group-button-height': theme('x.spacing.28'),
        paddingBottom: theme('x.spacing.4'),
      },

      // Default input-group is "hiding" the border, so here is restored.
      '> .input-group-button-primary:first-child': {
        borderInlineStartStyle: 'solid',
      },
      '> .input-group-button-primary:last-child': {
        borderInlineEndStyle: 'solid',
      },
    },
  })
}
