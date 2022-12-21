import { TailwindHelpers } from '../../../../types';

/**
 * Returns the `layout` variant for component `suggestion group button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function suggestionGroupButtonLayout(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    layout: {
      paddingInlineStart: theme('spacing.8'),
      paddingInlineEnd: theme('spacing.8'),
      aspectRatio: 'unset'
    }
  };
}
