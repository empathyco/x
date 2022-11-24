import { TailwindHelpers } from '../../../types';

/**
 * Returns the default styles for component `highlight`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function highlightInverted(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    invert: {
      fontWeight: theme('fontWeight.regular'),
      '.highlight-match': {
        fontWeight: theme('fontWeight.bold')
      }
    }
  };
}
