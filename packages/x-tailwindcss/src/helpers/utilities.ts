import { TailwindHelpers } from '../types';

/**
 * Default utility styles.
 *
 * @param root0
 * @param root0.theme
 * @returns All the styles for each utility.
 *
 * @public
 */
export default function utilities({ theme }: Partial<TailwindHelpers>) {
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
