import type { TailwindHelpers } from '../../../types'
import { mapColors } from '../../utils/map-colors'

/**
 * Returns the `color` variants for component `tag`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function tagColors(helpers: TailwindHelpers) {
  const { theme } = helpers
  return mapColors(
    color => ({
      '--tag-color-25': color['25'],
      '--tag-color-50': color['50'],
      '--tag-color-75': color['75'],
      '--tag-color-neutral-75': theme('x.colors.neutral.75'),
      borderColor: theme('x.colors.neutral.25'),
      color: theme('x.colors.neutral.75'),

      '&:hover,&:focus,&:active': {
        borderColor: 'var(--tag-color-50)',
        color: theme('x.colors.neutral.90'),
      },
    }),
    helpers,
  )
}
