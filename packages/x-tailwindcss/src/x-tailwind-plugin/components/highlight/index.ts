import { TailwindHelpers } from '../../../types';
import { highlightDefault } from './default';

/**
 * Returns the `highlight` component CSS. The highlight component serves to emphasize certain part
 * of a text.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function highlight(helpers: TailwindHelpers) {
  return {
    '.x-highlight-text': {
      ...highlightDefault(helpers)
    }
  };
}
