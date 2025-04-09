import type { TailwindHelpers } from '../../../types'

/**
 * Returns the `sharp` variants for component `icon`.
 *
 * @param _helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function iconSharp(_helpers: TailwindHelpers) {
  return {
    sharp: {
      '*': {
        strokeLinecap: 'square',
        strokeLinejoin: 'miter',
      },
    },
  }
}
