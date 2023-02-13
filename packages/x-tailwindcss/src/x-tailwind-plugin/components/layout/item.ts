import { TailwindHelpers } from '../../../types';

/**
 * Returns the component `layout item` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function item(helpers: TailwindHelpers) {
  return {
    item: {
      '--x-max-width-margin': 'calc((100vw - var(--x-layout-max-width, 100vw)) / 2)',
      '--x-margin': 'max(var(--x-layout-min-margin, 0px), var(--x-max-width-margin))',
      '--x-margin-left': 'var(--x-margin)',
      '--x-margin-right': 'var(--x-margin)',

      display: 'grid',
      justifyItems: 'stretch',
      alignItems: 'start',

      gridTemplateColumns:
        'var(--x-margin-left) 1fr calc(var(--x-margin-right) - var(--x-layout-scroll-width,0px))',

      '& > *': {
        gridColumn: '2/-2'
      }
    }
  };
}
