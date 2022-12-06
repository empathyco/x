import { TailwindHelpers } from '../../../../types';

/**
 * Util to remove horizontal padding for component `button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the util.
 */
// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-unused-vars
export function noHorizontalPadding(helpers: TailwindHelpers) {
  return {
    paddingInlineStart: '0',
    paddingInlineEnd: '0'
  };
}
