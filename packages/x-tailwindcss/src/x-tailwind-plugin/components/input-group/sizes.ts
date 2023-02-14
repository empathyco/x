import { deepMerge } from '@empathyco/x-deep-merge';
import { TailwindHelpers } from '../../../types';
import { inputSizes } from '../input/sizes';

/**
 * Returns the `sizes` variants for component `input`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function inputGroupSizes(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return deepMerge(inputSizes(helpers), {
    sm: {
      '--input-group-button-font-size': theme('fontSize.xs'),
      '--input-group-button-primary-font-size': theme('fontSize.sm'),
      '--input-group-button-rectangle-padding': theme('spacing.12')
    },
    md: {
      '--input-group-button-font-size': theme('fontSize.sm'),
      '--input-group-button-primary-font-size': theme('fontSize.sm'),
      '--input-group-button-rectangle-padding': theme('spacing.16')
    },
    lg: {
      '--input-group-button-font-size': theme('fontSize.sm'),
      '--input-group-button-primary-font-size': theme('fontSize.md'),
      '--input-group-button-rectangle-padding': theme('spacing.20')
    }
  });
}
