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
      '--border-color': `var(--input-color-50,${theme('x.x.colors.neutral.90')})`,
      borderWidth: 0,
      backgroundImage: 'linear-gradient(var(--border-color) ,var(--border-color))',
      backgroundPosition: 'bottom',
      backgroundSize: '100% 1px',
      backgroundRepeat: 'no-repeat',
      '&:hover': {
        backgroundSize: '100% 2px'
      },
      '&:focus, &:focus-within': {
        backgroundSize: '100% 2px',
        color: theme('x.colors.neutral.90'),
        // The outline can not be only bottom like a border. To simulate it on the `line`
        // variant, we use the box-shadow trick. The -0.5px value is to avoid horizontal shadow
        // in some  pixel interpolation situation with some resolutions.
        outline: 'none',
        boxShadow: `0 2px 0 -0.5px var(--input-color-25,${theme('x.colors.neutral.25')})`
      },
      // the `&[disabled]` selector is for cases where the element has not a real `disabled` state
      // like in the `input-group`.
      '&:disabled,&[disabled]': {
        backgroundColor: theme('x.colors.neutral.10'),
        '--border-color': theme('x.colors.neutral.25')
      }
    }
  };
}
