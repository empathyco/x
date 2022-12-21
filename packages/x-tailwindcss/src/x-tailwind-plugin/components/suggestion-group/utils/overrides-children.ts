import { TailwindHelpers } from '../../../../types';

/**
 * Overrides the `suggestion` styles when it is inside a `suggestion group`.
 *
 * @param helpers
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function overridesChildren(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    '> *:first-child:not(.suggestion-group-button)': {
      marginInlineStart: theme('spacing.8')
    },
    '> *:last-child:not(.suggestion-group-button)': {
      marginInlineEnd: theme('spacing.8')
    },
    '.suggestion': {
      color: 'currentColor',
      minHeight: 'inherit',
      fontSize: 'inherit',
      fontFamily: 'inherit',
      fontWeight: 'inherit'
    },

    '&:hover': {
      '.suggestion': {
        textDecoration: 'underline'
      }
    }
  };
}
