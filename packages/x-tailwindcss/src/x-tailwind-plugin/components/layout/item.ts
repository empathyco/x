/**
 * Returns the component `layout item` CSS.
 *
 * @returns The {@link CssStyleOptions} for the component.
 */
export function item() {
  return {
    '--x-margin': 'max(var(--x-layout-min-margin, 0px), var(--x-max-width-margin))',
    '--x-max-width-margin': 'calc((100vw - var(--x-layout-max-with, 100vw)) / 2)',
    '--x-margin-left': 'var(--x-margin)',
    '--x-margin-right': 'var(--x-margin)',

    display: 'grid',
    justifyItems: 'stretch',
    alignItems: 'start',
    overflowX: 'hidden',

    gridTemplateColumns: 'var(--x-margin-left) 1fr var(--x-margin-right)',

    '& > *': {
      gridColumn: '2 / -2'
    }
  };
}
