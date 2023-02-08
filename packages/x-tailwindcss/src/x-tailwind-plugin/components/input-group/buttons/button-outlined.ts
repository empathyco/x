import { TailwindHelpers } from '../../../../types';

/**
 * Returns the default styles for component `input`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function inputGroupButtonOutlined(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    backgroundColor: theme('colors.neutral.0'),
    borderColor: `var(--input-color-50,${theme('colors.neutral.90')})`,
    color: `var(--input-color-50,${theme('colors.neutral.90')})`,

    '&:hover,&:focus,&:active': {
      backgroundColor: `var(--input-color-50,${theme('colors.neutral.90')})`,
      borderColor: `var(--input-color-50,${theme('colors.neutral.90')})`,
      color: `theme('colors.neutral.0')`
    }
  };
}
