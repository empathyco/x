import { map, rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../types';

/**
 * Returns the component `button` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function minMargin({ theme }: TailwindHelpers) {
  return {
    'min-margin': rename(
      map(theme('spacing'), (minMarginName, minMarginValue) => ({
        '--x-layout-min-margin': minMarginValue
      })),
      { prefix: '&-' }
    )
  };
}
