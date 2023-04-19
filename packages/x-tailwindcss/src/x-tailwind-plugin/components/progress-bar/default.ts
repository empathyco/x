import { TailwindHelpers } from '../../../types';
import { progressBarSizes } from './sizes';

/**
 * Returns the default styles for component `progress-bar`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function progressBarDefault(helpers: TailwindHelpers) {
  const { theme } = helpers;

  return {
    borderRadius: theme('borderRadius.sm'),
    display: 'inline-block',
    backgroundColor: theme('colors.neutral.25'),
    overflow: 'hidden',
    maxWidth: '320px',

    '& > &-line': {
      height: '100%',
      backgroundColor: `var(--progress-bar-color-50, ${theme('colors.neutral.90')})`,
      transformOrigin: 'left'
    },

    ...progressBarSizes(helpers).md
  };
}
