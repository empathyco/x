import { slidingPanelButtons } from './buttons';

/**
 * Returns the default styles for the component `sliding panel`.
 *
 * @returns The {@link CssStyleOptions} for the component.
 */
export function slidingPanelDefault() {
  return {
    position: 'relative',
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    ...slidingPanelButtons()
  };
}
