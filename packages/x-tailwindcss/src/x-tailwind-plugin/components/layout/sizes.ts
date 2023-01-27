import { map } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../types';

/**
 * Returns the `sizes` available variants of component `layout`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function sizes(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return map(theme('layoutMaxWidth'), (maxWidthName, maxWidthValue) => ({
    '--x-layout-max-width': maxWidthValue
  }));
}
