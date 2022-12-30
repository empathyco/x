import { TailwindHelpers } from '../../../types';

/**
 * Returns the `line` variant for component `input`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function inputLine(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    line: {
      '--border-color': 'var(--input-color-50)',
      borderWidth: 0,
      backgroundImage: 'linear-gradient(var(--border-color) ,var(--border-color))',
      backgroundPosition: 'bottom',
      backgroundSize: '100% 1px',
      backgroundRepeat: 'no-repeat',
      '&:hover': {
        backgroundSize: '100% 2px'
      },
      '&:focus': {
        backgroundSize: '100% 2px',
        color: theme('colors.neutral.90')
      },
      '&:disabled': {
        backgroundColor: theme('colors.neutral.10'),
        '--border-color': theme('colors.neutral.25')
      }
    }
  };
}
