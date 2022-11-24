import { TailwindHelpers } from '../../../types';

/**
 * Returns the default styles for component `highlight`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function highlightDefault(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    fontWeight: theme('fontWeight.bold'),
    '.highlight-match': {
      fontWeight: theme('fontWeight.regular')
    }
  };
}
