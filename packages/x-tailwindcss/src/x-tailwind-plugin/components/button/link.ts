import { TailwindHelpers } from '../../../types';
import { noBackground } from './utils/no-background';

/**
 * Returns the `link` variant for component `button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function buttonLink(helpers: TailwindHelpers) {
  return {
    link: {
      paddingInlineStart: '0',
      paddingInlineEnd: '0',
      minHeight: '0',
      textDecoration: 'underline',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      lineHeight: 'inherit',
      fontWeight: 'inherit',
      letterSpacing: 'inherit',
      ...noBackground(helpers)
    }
  };
}
