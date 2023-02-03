import { TailwindHelpers } from '../../../../types';
import { inputGroupButton } from './button';
import { inputGroupButtonPrimary } from './button-primary';
import { inputGroupButtonRectangle } from './button-rectangle';

/**
 * Returns the default styles for component `input`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function inputGroupButtons(helpers: TailwindHelpers) {
  return {
    button: inputGroupButton(helpers),
    'button-primary': inputGroupButtonPrimary(helpers),
    'button-rectangle': inputGroupButtonRectangle(helpers)
  };
}
