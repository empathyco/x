import type { TailwindHelpers } from '../../../../types'

/**
 * Returns the `rectangle` variant for component `input-group-button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function inputGroupButtonRectangle({ theme }: TailwindHelpers) {
  return {
    paddingInlineStart: `var(--input-group-button-rectangle-padding,${theme('x.spacing.16')})`,
    paddingInlineEnd: `var(--input-group-button-rectangle-padding,${theme('x.spacing.16')})`,
    aspectRatio: 'auto',
  }
}
