import { TailwindHelpers } from '../../../types';

/**
 * Returns the component `button` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-unused-vars
export function item(helpers: TailwindHelpers) {
  return {
    item: {
      '--x-layout-scroll-width': '17px',

      '--x-margin': 'max(var(--x-layout-min-margin, 0px), var(--x-max-width-margin))',
      '--x-max-width-margin': 'calc((100vw - var(--x-layout-max-with, 100vw)) / 2)',
      '--x-margin-left': 'var(--x-margin)',
      '--x-margin-right': 'var(--x-margin)',

      display: 'grid',
      justifyItems: 'stretch',
      alignItems: 'start',

      gridTemplateColumns: 'var(--x-margin-left) 1fr var(--x-margin-right)',

      '& > *': {
        gridColumn: '2 / -2'
      }
    }
  };
}

/**
 * Returns the component `button` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-unused-vars
export function itemModifiers(helpers: TailwindHelpers) {
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
      '--x-margin-left': 0
    },

    '.no-margin-right': {
      '--x-margin-right': 0
    },

    '.no-margin': {
      '--x-margin-left': 0,
      '--x-margin-right': 0
    }
  };
}
