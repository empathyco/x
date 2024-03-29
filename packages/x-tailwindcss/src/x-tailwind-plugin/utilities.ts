import { TailwindHelpers } from '../types';

/**
 * Default utility styles.
 *
 * @param helpers - A set of tailwind helpers to create the utilities.
 * @returns All the styles for each utility.
 *
 * @public
 */
export default function utilities({ theme }: TailwindHelpers) {
  return {
    // TODO: replace this example styles with actual design styles
    '.border-large': {
      borderStyle: 'solid',
      borderWidth: theme('borderWidth.4'),
      borderColor: theme('colors.neutral.100')
    },
    // This is here to not include it in the bundle if it is not being used
    '.disable-icon-offset *': {
      '--enableIconOffset': 'var(--OFF)'
    }
  };
}

/**
 * The return type of {@link utilities}.
 *
 * @public
 */
export type ReturnOfUtilities = ReturnType<typeof utilities>;
