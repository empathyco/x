import { TailwindHelpers } from '../../../types';
import { inputColors } from '../input/colors';

/**
 * Returns the default styles for component `input`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function inputGroupColors(helpers: TailwindHelpers) {
  return inputColors(helpers);
}
