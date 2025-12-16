import type { TailwindHelpers } from '../../../types'

/**
 * Returns the component `layout` utils CSS.
 *
 * @param _helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function utils(_helpers: TailwindHelpers) {
  return {
    '.x-layout-stack': {
      display: 'grid',
      gridTemplateRows: '1fr',
      gridTemplateColumns: '1fr',
      justifyItems: 'stretch',
      alignItems: 'stretch',

      '& > *': {
        gridRow: '1 / -1',
        gridColumn: '1 / -1',
        minHeight: '0',
        minWidth: '0',
        maxHeight: '100%',
        maxWidth: '100%',
      },
    },

    '.x-layout-item .x-layout-expand': {
      height: '100%',
      flex: '1 1 0',
      minHeight: '0',
    },

    '.x-layout-item > .x-layout-on-margin-left': {
      gridColumn: '1 / 2',
    },
    '.x-layout-item > .x-layout-on-margin-right': {
      gridColumn: '-2 / -1',
    },

    '.x-layout-overlap': {
      height: '0',
      overflow: 'visible',
      alignContent: 'flex-end',
      zIndex: '1',
    },
    '.x-layout-overlap-from-top': {
      height: '0',
      overflow: 'visible',
      zIndex: '1',
      alignContent: 'flex-start',
    },

    '.x-layout-item.x-layout-no-margin-left': {
      '--x-margin-left': '0px',
    },
    '.x-layout-item.x-layout-no-margin-right': {
      '--x-margin-right': '0px',
    },
    '.x-layout-item.x-layout-no-margin': {
      '--x-margin-left': '0px',
      '--x-margin-right': '0px',
    },

    '.x-scroll > .x-layout-item:not(.x-layout-no-margin-right)': {
      '@media (hover: hover) and (pointer: fine)': {
        '--x-layout-scroll-width': '17px',
      },
    },
  }
}
