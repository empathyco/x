import { TailwindHelpers } from '../types';

/**
 * Default dynamic utility styles.
 *
 * @param helpers - A set of tailwind helpers to create the dynamic utilities.
 * @returns All the styles for each utility and the values they are going to be generated with.
 *
 * @public
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export default function dynamicUtilities({ theme }: TailwindHelpers) {
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
