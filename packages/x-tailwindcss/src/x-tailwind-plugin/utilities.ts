import { TailwindHelpers } from '../types';

/**
 * Default utility styles.
 *
 * @param helpers - A set of tailwind helpers to create the utilities.
 * @returns All the styles for each utility.
 *
 * @public
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export default function utilities({ theme }: TailwindHelpers) {
  return {
    // TODO: replace this example styles with actual design styles
    '.border-large': {
      borderStyle: 'solid',
      borderWidth: theme('borderWidth.4'),
      borderColor: theme('colors.neutral.100')
    }
  };
}

/**
 * The return type of {@link utilities}.
 *
 * @public
 */
export type ReturnOfUtilities = ReturnType<typeof utilities>;
