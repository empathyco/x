import { TailwindHelpers } from '../../../../types';

/**
 * Returns the default styles for component `input`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function inputGroupButtonRectangle({ theme }: TailwindHelpers) {
  return {
    paddingInlineStart: theme('spacing.16'),
    paddingInlineEnd: theme('spacing.16'),
    aspectRatio: 'auto'
  };
}
