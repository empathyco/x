import { TailwindHelpers } from '../../../types';
import { slidingPanelDefault } from './default';

export function slidingPanel(helpers: TailwindHelpers) {
  return {
    '.sliding-panel': {
      ...slidingPanelDefault(helpers)
    }
  };
}
