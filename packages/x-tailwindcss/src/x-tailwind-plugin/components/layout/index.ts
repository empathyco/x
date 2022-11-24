import { rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../types';
import { container } from './container';
import { item, itemModifiers } from './item';
import { maxWidth } from './max-width';
import { minMargin } from './min-margin';

/**
 * Returns the component `button` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function layout(helpers: TailwindHelpers) {
  return {
    '.layout': rename(
      {
        ...container(helpers),
        ...maxWidth(helpers),
        ...minMargin(helpers),
        ...item(helpers)
      },
      { prefix: '&-' }
    ),
    ...itemModifiers(helpers)
  };
}
