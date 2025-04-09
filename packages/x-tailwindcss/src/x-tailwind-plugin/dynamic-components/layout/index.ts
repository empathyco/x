import type { TailwindHelpers } from '../../../types';
import { dynamicLayoutContainer } from './layout-container';

/**
 * Returns the dynamic features of the `layout` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function dynamicLayout(helpers: TailwindHelpers) {
  return {
    ...dynamicLayoutContainer(helpers)
  };
}
