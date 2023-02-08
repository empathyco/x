import { TailwindHelpers } from '../../../types';

/**
 * Returns the `line` variant for component `input`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function inputLine(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    line: {
      '--border-color': `var(--input-color-50,${theme('colors.neutral.90')})`,
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
        color: theme('colors.neutral.90'),
        outline: 'none',
        boxShadow: `0 2px 0 -0.5px var(--input-color-25,${theme('colors.neutral.25')})`
      },
      '&:disabled,&[disabled]': {
        backgroundColor: theme('colors.neutral.10'),
        '--border-color': theme('colors.neutral.25')
      }
    }
  };
}
