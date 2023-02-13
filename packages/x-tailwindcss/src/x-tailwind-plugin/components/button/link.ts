import { TailwindHelpers } from '../../../types';
import { noBackground } from './utils/no-background';
import { noHorizontalPadding } from './utils/no-horizontal-padding';

/**
 * Returns the `link` variant for component `button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function buttonLink(helpers: TailwindHelpers) {
  return {
    link: {
      display: 'inline-flex',
      minHeight: '0',
      textDecoration: 'underline',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      lineHeight: 'inherit',
      fontWeight: 'inherit',
      letterSpacing: 'inherit',
      ...noHorizontalPadding(helpers),
      ...noBackground(helpers)
    }
  };
}
