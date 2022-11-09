import { TailwindHelpers } from '../../../types';

/* eslint-disable  @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Returns the default styles for component `icon`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function iconSharp(helpers: TailwindHelpers) {
  return {
    sharp: {
      '*': {
        strokeLinecap: 'square',
        strokeLinejoin: 'miter'
      }
    }
  };
}
