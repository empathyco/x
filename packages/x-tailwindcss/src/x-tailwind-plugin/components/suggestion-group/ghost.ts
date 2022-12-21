import { TailwindHelpers } from '../../../types';
import { commonGhostAndOutlinedStyles } from './utils/common-ghost-and-outline-styles';

/**
 * Returns the `ghost` variant for component `suggestion group`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function suggestionGroupGhost(helpers: TailwindHelpers) {
  return {
    ghost: {
      backgroundColor: 'transparent',
      ...commonGhostAndOutlinedStyles(helpers)
    }
  };
}
