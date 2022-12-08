import { rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../../types';
import { paddingBySize } from './padding-by-size';

/**
 * Util to return hover styles for `ghost` and `tag` variants.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the util.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function commonGhostAndTagStyles(helpers: TailwindHelpers) {
  const { theme } = helpers;
  const padding = paddingBySize(helpers);
  return {
    '&:hover': {
      backgroundColor: theme('colors.neutral.10'),
      textDecoration: 'none'
    },
    ...padding.md,
    ...rename(padding, { prefix: '&.suggestion-' })
  };
}
