import { TailwindHelpers } from '../../../../types';

/**
 * Returns the default styles for component `input`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function inputGroupButtonRectangle({ theme }: TailwindHelpers) {
  return {
    paddingInlineStart: `var(--input-group-button-rectangle-padding,${theme('spacing.16')})`,
    paddingInlineEnd: `var(--input-group-button-rectangle-padding,${theme('spacing.16')})`,
    aspectRatio: 'auto'
  };
}
