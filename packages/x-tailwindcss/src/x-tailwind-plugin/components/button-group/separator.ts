import { TailwindHelpers } from '../../../types';

/**
 * Returns the styles for the `button-group-separator`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function buttonGroupSeparator(helpers: TailwindHelpers) {
  const { theme } = helpers;

  return {
    separator: {
      borderLeft: '1px solid currentColor',
      margin: `${theme('spacing.8')} 0`,
      alignSelf: 'stretch'
    }
  };
}
