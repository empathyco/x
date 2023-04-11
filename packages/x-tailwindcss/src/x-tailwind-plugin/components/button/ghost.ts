import { deepMerge } from '@empathyco/x-deep-merge';
import { TailwindHelpers } from '../../../types';
import { backgroundOnHover } from './utils/background-on-hover';
import { noBackground } from './utils/no-background';

/**
 * Returns the `ghost` variant for component `button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function buttonGhost(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    ghost: deepMerge(noBackground(helpers), backgroundOnHover(helpers), {
      '&.selected': {
        borderColor: theme('colors.neutral.10'),
        backgroundColor: theme('colors.neutral.10'),
        color: `var(--button-color-75,${theme('colors.neutral.90')})`,

        '&:hover,&:active': {
          borderColor: theme('colors.neutral.25'),
          backgroundColor: theme('colors.neutral.25')
        }
      }
    })
  };
}
