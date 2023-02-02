import { TailwindHelpers } from '../../../types';

/**
 * Returns the component `layout item` utils CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function itemUtils(helpers: TailwindHelpers) {
  return {
    '.layout-expand': {
      height: '100%',
      flex: '1 1 0',
      minHeight: '0'
    },

    '.on-margin-left': {
      gridColumn: '1 / 2'
    },
    '.on-margin-right': {
      gridColumn: '-2 / -1'
    },

    '.overlap': {
      height: '0',
      overflow: 'visible',
      alignContent: 'flex-end',
      zIndex: '1'
    },
    '.overlap-from-top': {
      height: '0',
      overflow: 'visible',
      zIndex: '1',
      alignContent: 'flex-start'
    },

    '.no-margin-left': {
      '--x-margin-left': '0px'
    },
    '.no-margin-right': {
      '--x-margin-right': '0px'
    },
    '.no-margin': {
      '--x-margin-left': '0px',
      '--x-margin-right': '0px'
    },

    '@media (hover: hover) and (pointer: fine)': {
      '.scroll > .layout-item:not(.no-margin-right)': {
        '--x-layout-scroll-width': '17px'
      }
    }
  };
}
