/**
 * Returns the `default` element CSS.
 *
 * @returns The {@link CssStyleOptions} for the component.
 */
export function layoutDefault() {
  return {
    display: 'flex',
    flexFlow: 'column nowrap',
    height: '100%',
    maxHeight: '100%',
    justifyContent: 'flex-start',
    alignItems: 'stretch'
  };
}
