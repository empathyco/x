import { TailwindHelpers } from '../../../types';
import { commonGhostAndTagStyles } from './utils/common-ghost-and-tag-styles';

/**
 * Returns the `ghost` variant for component `suggestion`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function suggestionGhost(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    ghost: {
      backgroundColor: theme('colors.neutral.0'),
      borderColor: theme('colors.neutral.0'),
      borderWidth: theme('borderWidth.1'),
      ...commonGhostAndTagStyles(helpers)
    }
  };
}
