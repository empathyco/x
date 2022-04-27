import { TailwindHelpers } from '../types';

/**
 * Default dynamic utility styles.
 *
 * @param root0
 * @param root0.theme
 * @returns All the styles for each utility and the values they are going to be generated with.
 *
 * @public
 */
export default function dynamicUtilities({ theme }: Partial<TailwindHelpers>) {
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

/**
 * The return type of {@link dynamicUtilities}.
 *
 * @public
 */
export type ReturnOfDynamicUtilities = ReturnType<typeof dynamicUtilities>;
