import type { TailwindHelpers } from '../../../types'
import { progressBarSizes } from './sizes'

/**
 * Returns the default styles for component `progress-bar`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function progressBarDefault(helpers: TailwindHelpers) {
  const { theme } = helpers

  return {
    borderRadius: theme('x.borderRadius.sm'),
    display: 'inline-block',
    backgroundColor: theme('x.colors.neutral.25'),
    overflow: 'hidden',

    '& > .x-progress-bar-fill': {
      height: '100%',
      backgroundColor: `var(--progress-bar-color-50, ${theme('x.colors.neutral.90')})`,
    },

    ...progressBarSizes(helpers).md,
  }
}
