import type { TailwindHelpers } from '../../../types'

/**
 * Returns the component util `attach` CSS, used to place components on top of others.
 *
 * @param _helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function attach(_helpers: TailwindHelpers) {
  return {
    '.attach-container': {
      position: 'relative',
      '& > .attach-to-top-left': {
        position: 'absolute',
        top: 0,
        left: 0,
        transform: 'translate(calc(var(--attach-horizontal-offset, 50%) * -1), -50%)',
      },

      '& > .attach-to-top-right': {
        position: 'absolute',
        top: 0,
        right: 0,
        transform: 'translate(var(--attach-horizontal-offset, 50%), -50%)',
      },

      '& > .attach-to-bottom-right': {
        position: 'absolute',
        bottom: 0,
        right: 0,
        transform: 'translate( var(--attach-horizontal-offset, 50%), 50%)',
      },

      '& > .attach-to-bottom-left': {
        position: 'absolute',
        bottom: 0,
        left: 0,
        transform: 'translate(calc(var(--attach-horizontal-offset, 50%) * -1), 50%)',
      },
    },
  }
}
