import type { TailwindHelpers } from '../../../types'

/**
 * Returns the `container` element CSS.
 *
 * @param _helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function container(_helpers: TailwindHelpers) {
  return {
    container: {
      display: 'flex',
      flexFlow: 'column nowrap',
      height: '100%',
      maxHeight: '100%',
      justifyContent: 'flex-start',
      alignItems: 'stretch',

      '& > .scroll': {
        height: '100%',
        flex: '1 1 0',
        minHeight: '0',
      },
    },
  }
}
