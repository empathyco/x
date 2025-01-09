import { TailwindHelpers } from '../../../../types';

/**
 * Returns the `outlined` variant for component `input-group-button-primary`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function inputGroupButtonOutlined(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    backgroundColor: theme('x.colors.neutral.0'),
    borderColor: `var(--input-color-50,${theme('x.colors.neutral.90')})`,
    color: `var(--input-color-50,${theme('x.colors.neutral.90')})`,

    '&:hover,&:focus,&:active': {
      backgroundColor: `var(--input-color-50,${theme('x.colors.neutral.90')})`,
      borderColor: `var(--input-color-50,${theme('x.colors.neutral.90')})`,
      color: `theme('x.colors.neutral.0')`
    }
  };
}
