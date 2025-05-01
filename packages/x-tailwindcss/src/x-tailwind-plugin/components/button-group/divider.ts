import type { TailwindHelpers } from '../../../types'

/**
 * Returns the styles for the `button-group-divider`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function buttonGroupDivider(helpers: TailwindHelpers) {
  const { theme } = helpers

  return {
    divider: {
      borderLeft: '1px solid currentColor',
      margin: `${theme('x.spacing.8')} 0`,
      alignSelf: 'stretch',
    },
  }
}
