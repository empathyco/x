import { TailwindHelpers } from '../../../types';
import { slidingPanelFade } from './fade';
import { slidingPanelButtons } from './buttons';

/**
 * Returns the default styles for the component `sliding panel`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function slidingPanelDefault(helpers: TailwindHelpers) {
  return {
    position: 'relative',
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    height: '100%',
    zIndex: 0,
    '.sliding-panel-scroll': {
      display: 'flex',
      flex: '100%',
      flexFlow: 'row nowrap',
      overflowX: 'auto',
      overflowY: 'hidden',
      scrollbarWidth: 'none', // Firefox
      '> *': {
        flex: '0 0 auto'
      },
      '&::-webkit-scrollbar': {
        display: 'none'
      }
    },
    ...slidingPanelButtons(),
    ...slidingPanelFade(helpers)
  };
}
