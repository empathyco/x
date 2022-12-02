import { TailwindHelpers } from '../../../types';
import { suggestionSizes } from './sizes';

/**
 * Returns the default styles for component `suggestion`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function suggestionDefault(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    fontFamily: theme('fontFamily.main'),
    fontWeight: theme('fontWeight.regular'),

    display: 'grid',
    gridAutoFlow: 'column',
    justifyContent: 'center',
    alignItems: 'baseline',
    alignContent: 'center',
    flexFlow: 'row nowrap',
    boxSizing: 'border-box',
    cursor: 'pointer',
    textAlign: 'start',

    ...suggestionSizes(helpers).md,

    color: theme('colors.neutral.90'),

    '&:hover': {
      textDecoration: 'underline'
    },

    /**
     * Enable `enableIconOffset` icon alignment flag.
     *
     * Suggestions should have the icon aligned with the first text
     * line.
     *
     * As the suggestion is a flex container with the items aligned
     * to the baseline, we have to vertically move the icon.
     *
     * The `--iconVerticalOffset` variable will contain the offset which we have
     * to use to translate the icon.
     *
     */
    '& *': {
      '--enableIconOffset': 'var(--ON)',
      // To half the icon's height, we subtract half the font's x-height (1ex).
      // For some reason, we have to adjust it by subtracting one pixel additionally.
      '--iconVerticalOffset': 'calc(50% - 0.5ex - 1px)'
    }
  };
}
