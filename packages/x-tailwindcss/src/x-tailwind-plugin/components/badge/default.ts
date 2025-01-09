import { TailwindHelpers } from '../../../types';
import { badgeSizes } from './sizes';

/**
 * Returns the default styles for component `badge`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function badgeDefault(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    fontFamily: theme('x.fontFamily.main'),
    fontWeight: theme('x.fontWeight.regular'),
    fontSize: theme('x.fontSize.xs'),

    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme('x.borderRadius.full'),

    color: theme('x.colors.neutral.0'),
    backgroundColor: theme('x.colors.neutral.90'),

    ...badgeSizes(helpers).md
  };
}
