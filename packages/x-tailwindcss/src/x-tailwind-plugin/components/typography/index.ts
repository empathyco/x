import { TailwindHelpers } from '../../../types';
import { text1 } from './text1';
import { text2 } from './text2';
import { title1 } from './title1';
import { title2 } from './title2';
import { title3 } from './title3';
import { title4 } from './title4';
import { CSSRuleObject } from 'tailwindcss/types/config';

/**
 * Returns all the typography components.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function typography(helpers: TailwindHelpers): CSSRuleObject {
  return {
    ...text1(helpers),
    ...text2(helpers),
    ...title1(helpers),
    ...title2(helpers),
    ...title3(helpers),
    ...title4(helpers)
  };
}
