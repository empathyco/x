import { TailwindHelpers } from '../../../types';
import { scrollDefault } from './default';
import { CSSRuleObject } from 'tailwindcss/types/config';
/**
 * Returns the component `scroll` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function scroll(helpers: TailwindHelpers): CSSRuleObject {
  return {
    '.x-scroll': {
      ...scrollDefault(helpers)
    }
  };
}
