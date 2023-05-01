import { TailwindHelpers } from '../../../types';

/**
 * Returns the component `layout` utils CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function utils(helpers: TailwindHelpers) {
  return {
    '.layout-stack': {
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
        maxWidth: '100%'
      }
    },

    '.layout-expand': {
      height: '100%',
      flex: '1 1 0',
      minHeight: '0'
    },

    '.layout-on-margin-left': {
      gridColumn: '1 / 2'
    },
    '.layout-on-margin-right': {
      gridColumn: '-2 / -1'
    },

    '.layout-overlap': {
      height: '0',
      overflow: 'visible',
      alignContent: 'flex-end',
      zIndex: '1'
    },
    '.layout-overlap-from-top': {
      height: '0',
      overflow: 'visible',
      zIndex: '1',
      alignContent: 'flex-start'
    },

    '.layout-no-margin-left': {
      '--x-margin-left': '0px'
    },
    '.layout-no-margin-right': {
      '--x-margin-right': '0px'
    },
    '.layout-no-margin': {
      '--x-margin-left': '0px',
      '--x-margin-right': '0px'
    },

    '@media (hover: hover) and (pointer: fine)': {
      '.scroll > .layout-item:not(.layout-no-margin-right)': {
        '--x-layout-scroll-width': '17px'
      }
    }
  };
}
