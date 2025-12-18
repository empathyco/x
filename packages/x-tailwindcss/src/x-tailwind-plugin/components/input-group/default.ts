import type { TailwindHelpers } from '../../../types'
import { deepMerge } from '@empathyco/x-deep-merge'
import { inputDefault } from '../input/default'

/**
 * Returns the default styles for component `input-group`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function inputGroupDefault(helpers: TailwindHelpers) {
  const { theme } = helpers
  // eslint-disable-next-line ts/no-unsafe-return
  return deepMerge(inputDefault(helpers), {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    alignContent: 'center',
    paddingInlineStart: 0,
    paddingInlineEnd: 0,
    gap: theme('x.spacing.8'),
    overflow: 'hidden', // necessary to not show the buttons border over the input-group border.

    // padding is simulated with margin to remove it on button primary
    '> :first-child': {
      marginInlineStart: theme('x.spacing.16'),
    },
    '> :last-child': {
      marginInlineEnd: theme('x.spacing.16'),
    },

    '.x-input, input': {
      flex: '1 1 auto',
      minWidth: '0',
      padding: '0',
      border: 'none',
      background: 'none',
      color: 'inherit',
      fontSize: 'inherit',
      fontWeight: 'inherit',
      outline: 'none',
      '&:focus,&:focus-within': {
        outline: 'none',
      },
    },
  })
}
