import { TailwindHelpers } from '../../../../types';

/**
 * Util to return paddings for each size for variants with horizontal padding.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the util.
 */
// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-unused-vars
export function alignIconWithBaseline(helpers: TailwindHelpers) {
  return {
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
