import { TailwindHelpers } from '../../../types';
/**
 * Returns the default styles for component `scroll`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function scrollDefault(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    overflowY: 'scroll',
    '--x-color-thumb-scroll-bar': theme('colors.neutral.25'),
    '--x-color-thumb-scroll-bar-hover': theme('colors.neutral.50'),
    '--x-color-background-scroll-bar': theme('colors.neutral.0'),

    '@media (hover: hover)': {
      '&::-webkit-scrollbar': {
        width: '17px',
        '&-thumb': {
          backgroundColor: 'var(--x-color-thumb-scroll-bar)',
          borderColor: theme('colors.neutral.0'),
          borderWidth: theme('spacing.4'),
          borderRadius: theme('spacing.24'),
          borderStyle: 'solid'
        },
        '&-track': {
          backgroundColor: 'var(--x-color-background-scroll-bar)'
        }
      },
      // Styles for Firefox
      scrollbarWidth: 'auto',
      scrollbarColor: 'var(--x-color-thumb-scroll-bar) var(--x-color-background-scroll-bar)',
      '&:hover': {
        '--x-color-thumb-scroll-bar': 'var(--x-color-thumb-scroll-bar-hover)'
      }
    }
  };
}
