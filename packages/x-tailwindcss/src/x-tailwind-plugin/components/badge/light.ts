import { TailwindHelpers } from '../../../types';

/**
 * Returns the `light` variant for component `badge`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function badgeLight({ theme }: TailwindHelpers) {
  return {
    light: {
      backgroundColor: 'var(--badge-color-25)',
      color: theme('colors.neutral.90')
    }
  };
}
