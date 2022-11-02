import { TailwindHelpers } from '../../../types';

/**
 * Returns the `outlined` variant for component `suggestion`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function suggestionOutlined({ theme }: TailwindHelpers) {
  return {
    outlined: Object.assign({
      borderColor: 'var(--suggestion-color-75)',
      borderWidth: theme('borderWidth.1'),

      '&:hover': {
        borderColor: 'var(--suggestion-color-50)'
      }
    })
  };
}
