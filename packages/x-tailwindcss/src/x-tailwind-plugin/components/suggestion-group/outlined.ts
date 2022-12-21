import { TailwindHelpers } from '../../../types';
import { commonGhostAndOutlinedStyles } from './utils/common-ghost-and-outline-styles';

/**
 * Returns the `outlined` variant for component `suggestion group`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function suggestionGroupOutlined(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    outlined: {
      backgroundColor: theme('colors.neutral.0'),
      borderWidth: theme('borderWidth.1'),
      borderColor: 'var(--suggestion-group-color-50)',
      ...commonGhostAndOutlinedStyles(helpers)
    }
  };
}
