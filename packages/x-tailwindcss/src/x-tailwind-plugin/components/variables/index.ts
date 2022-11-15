import { TailwindHelpers } from '../../../types';

/**
 * Returns the CSS global variables to be used across the components.
 *
 * --ON and --OFF variables are available for feature state switching.
 *
 * @example
 * - Define a CSS variable for the feature flag with a default value (--ON or --OFF).
 *  `--myFeature: var(--OFF);`
 *
 * - Two possible usages:
 *
 *  1. Use the feature flag using var() function providing a fallback as second argument.
 *  `background: var(--myFeature, red);`: Fallback value won't be applied if `--myFeature` is off.
 *
 *  2. Use the feature flag using var() function followed by a fallback value.
 *  `background: var(--myFeature) red;`: Fallback value will be applied if `--myFeature` is off.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-unused-vars
export function variables(helpers: TailwindHelpers) {
  return {
    ':root': {
      '--ON': 'initial',
      '--OFF': ' '
    }
  };
}
