import type { TailwindHelpers } from '../../../../types'

/**
 * Util to remove horizontal padding for component `button`.
 *
 * @param _helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the util.
 */
export function noHorizontalPadding(_helpers: TailwindHelpers) {
  return {
    paddingInlineStart: '0',
    paddingInlineEnd: '0',
  }
}
