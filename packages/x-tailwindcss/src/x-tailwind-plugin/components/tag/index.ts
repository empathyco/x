import { rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../types';
import { tagDefault } from './default';
import { tagSizes } from './sizes';
import { tagColors } from './colors';
import { tagOutlined } from './outlined';
import { tagSolid } from './solid';
import { tagGhost } from './ghost';
import { tagTight } from './tight';
import { CSSRuleObject } from 'tailwindcss/types/config';

/**
 * Returns the component `tag` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function tag(helpers: TailwindHelpers): CSSRuleObject {
  return {
    '.x-tag': {
      ...tagDefault(helpers),
      ...rename(
        {
          ...tagSizes(helpers),
          ...tagColors(helpers),
          ...tagOutlined(helpers),
          ...tagSolid(helpers),
          ...tagGhost(helpers),
          ...tagTight(helpers)
        },
        { prefix: '&-' }
      )
    }
  };
}
