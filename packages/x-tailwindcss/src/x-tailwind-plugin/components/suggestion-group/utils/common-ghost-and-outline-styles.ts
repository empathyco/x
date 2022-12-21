import { TailwindHelpers } from '../../../../types';

/**
 * Util to return hover styles for `ghost` and `tag` variants.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the util.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function commonGhostAndOutlinedStyles(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    '&:hover': {
      backgroundColor: theme('colors.neutral.10')
    },
    gap: theme('spacing.4')
  };
}
