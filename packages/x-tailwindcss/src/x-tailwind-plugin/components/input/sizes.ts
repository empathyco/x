import { TailwindHelpers } from '../../../types';

/**
 * Returns the `sizes` variants for component `input`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function inputSizes({ theme }: TailwindHelpers) {
  return {
    sm: {
      height: theme('x.spacing.32'),
      fontSize: theme('x.fontSize.sm'),
      '&::placeholder': {
        fontSize: theme('x.fontSize.sm')
      }
    },
    md: {
      height: theme('x.spacing.40'),
      fontSize: theme('x.fontSize.md'),
      '&::placeholder': {
        fontSize: theme('x.fontSize.md')
      }
    },
    lg: {
      height: theme('x.spacing.48'),
      fontSize: theme('x.fontSize.md'),
      '&::placeholder': {
        fontSize: theme('x.fontSize.md')
      }
    }
  };
}
