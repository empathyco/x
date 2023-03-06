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
    fontFamily: theme('fontFamily.main'),
    fontWeight: theme('fontWeight.regular'),
    fontSize: theme('fontSize.xs'),

    display: 'inline-flex',
    alignItems: 'center',

    borderRadius: theme('borderRadius.full'),
    color: theme('colors.neutral.0'),
    background: theme('colors.neutral.90'),

    ...badgeSizes(helpers).md
  };
}
