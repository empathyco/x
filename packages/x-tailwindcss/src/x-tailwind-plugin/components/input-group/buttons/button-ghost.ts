import { TailwindHelpers } from '../../../../types';

/**
 * Returns the default styles for component `input`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function inputGroupButtonGhost(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    color: `var(--input-color-50,${theme('colors.neutral.90')})`,

    '&:hover,&:focus,&:active': {
      backgroundColor: theme('colors.neutral.10'),
      borderColor: theme('colors.neutral.10'),
      color: `var(--input-color-75,${theme('colors.neutral.90')})`
    }
  };
}
