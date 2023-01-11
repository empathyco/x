/**
 * Returns the `lighter` variant for component `suggestion group button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function suggestionGroupButtonLighter() {
  return {
    lighter: {
      '&:hover': {
        transform: 'none'
      }
    }
  };
}
