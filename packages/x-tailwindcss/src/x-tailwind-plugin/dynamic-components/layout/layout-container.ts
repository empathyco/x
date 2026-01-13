import type { TailwindHelpers } from '../../../types'
import { map, rename } from '@empathyco/x-utils'

/**
 * Returns the `layout-container` dynamic features of component `layout`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function dynamicLayoutContainer(helpers: TailwindHelpers) {
  const { theme } = helpers

  return {
    ...map(
      {
        ...rename(
          {
            mx: (value: any) => ({
              '& > .layout-item': {
                '--x-margin-left': value,
                '--x-margin-right': value,
              },
            }),
            ml: (value: any) => ({
              '& > .layout-item': {
                '--x-margin-left': value,
              },
            }),
            mr: (value: any) => ({
              '& > .layout-item': {
                '--x-margin-right': value,
              },
            }),
          },
          { prefix: '.layout-container-' },
        ),
      },
      (name, styles) => {
        return {
          styles,
          values: {
            ...theme('x.spacing'),
          },
        }
      },
    ),
  }
}
