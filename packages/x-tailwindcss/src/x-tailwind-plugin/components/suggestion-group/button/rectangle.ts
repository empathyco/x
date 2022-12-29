import { TailwindHelpers } from '../../../../types';

/**
 * Returns the `rectangle` variant for component `suggestion group button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function suggestionGroupButtonRectangle(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    rectangle: {
      paddingInlineStart: theme('spacing.8'),
      paddingInlineEnd: theme('spacing.8'),
      aspectRatio: 'unset'
    }
  };
}
