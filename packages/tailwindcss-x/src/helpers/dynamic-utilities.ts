import { DynamicStylesOptions, TailwindHelpers } from '../types';

/**
 * Default dynamic utility styles.
 *
 * @returns All the styles for each utility and the values they are going to be generated with.
 */
export default function dynamicUtilities({
  theme
}: Partial<TailwindHelpers>): DynamicStylesOptions {
  return {
    // TODO: replace this example styles with actual design styles
    'font-util': {
      styles: (value: any) => ({
        fontSize: value
      }),
      values: theme('spacing')
    }
  };
}
