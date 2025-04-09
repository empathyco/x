import type { TailwindHelpers } from '../../../../types';

/**
 * Returns the `ghost` variant for component `input-group-button-primary`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function inputGroupButtonGhost(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    color: `var(--input-color-50,${theme('x.colors.neutral.90')})`,

    '&:hover,&:focus,&:active': {
      backgroundColor: theme('x.colors.neutral.10'),
      borderColor: theme('x.colors.neutral.10'),
      color: `var(--input-color-75,${theme('x.colors.neutral.90')})`
    }
  };
}
