import { TailwindHelpers } from '../../../../types';
import { inputGroupButton } from './button';
import { inputGroupButtonGhost } from './button-ghost';
import { inputGroupButtonOutlined } from './button-outlined';
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
    'button-rectangle': inputGroupButtonRectangle(helpers),
    'button-outlined': inputGroupButtonOutlined(helpers),
    'button-ghost': inputGroupButtonGhost(helpers)
  };
}
