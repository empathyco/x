import { StyleOptions, TailwindHelpers } from '../types';

/**
 * Default utility styles.
 *
 * @returns All the styles for each utility.
 */
export default function utilities({ theme }: Partial<TailwindHelpers>): StyleOptions {
  return {
    // TODO: replace this example styles with actual design styles
    '.border-large': {
      borderStyle: 'solid',
      borderWidth: theme('borderWidth.4'),
      borderColor: theme('colors.neutral.100')
    }
  };
}
