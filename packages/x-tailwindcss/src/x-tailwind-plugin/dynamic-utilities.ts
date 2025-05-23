import type { TailwindHelpers } from '../types'

/**
 * Default dynamic utility styles.
 *
 * @param helpers - A set of tailwind helpers to create the dynamic utilities.
 * @returns All the styles for each utility and the values they are going to be generated with.
 *
 * @public
 */
export default function dynamicUtilities({ theme }: TailwindHelpers) {
  return {
    // TODO: replace this example styles with actual design styles
    'font-util': {
      styles: (value: any) => ({
        fontSize: value,
      }),
      values: theme('x.spacing'),
    },
  }
}
