import { TailwindHelpers } from '../../../types';
import { slidingPanelButtons } from './buttons';
import { slidingPanelFade } from './fade';

export function slidingPanelDefault(helpers: TailwindHelpers) {
  return {
    position: 'relative',
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    height: '100%',
    '.sliding-panel__scroll': {
      display: 'flex',
      flex: '100%',
      flexFlow: 'row nowrap',
      overflowX: 'auto',
      overflowY: 'hidden',
      scrollbarWidth: 'none', // Firefox
      '&::-webkit-scrollbar': {
        display: 'none'
      }
    },
    ...slidingPanelButtons(),
    ...slidingPanelFade(helpers)
  };
}
