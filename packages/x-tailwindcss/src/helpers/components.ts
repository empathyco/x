import { TailwindHelpers } from '../types';

/**
 * Default component styles.
 *
 * @param root0
 * @param root0.theme
 * @returns All the styles for each component.
 *
 * @public
 */
export default function components({ theme }: Partial<TailwindHelpers>) {
  return {
    // TODO: replace this example styles with actual design styles
    '.btn': {
      '--x-size-height': theme('spacing.32'),
      display: 'flex',
      alignItems: 'baseline',
      alignContent: 'center',
      justifyContent: 'center',
      flexFlow: 'row wrap',
      backgroundColor: theme('colors.secondary.25'),
      color: theme('colors.neutral.0'),
      height: 'var(--x-size-height)',
      gap: theme('spacing.4'),
      paddingInlineStart: theme('spacing.16'),
      paddingInlineEnd: theme('spacing.16'),
      borderRadius: theme('borderRadius.sm'),
      fontSize: theme('fontSize.base'),
      '&-lg': {
        '--x-size-height': theme('spacing.48'),
        fontSize: theme('fontSize.lg')
      },
      '&-md': {
        '--x-size-height': theme('spacing.32'),
        fontSize: theme('fontSize.lg')
      },
      '&-sm': {
        '--x-size-height': theme('spacing.24'),
        fontSize: theme('fontSize.sm')
      },
      '&-square': {
        width: 'var(--x-size-height)',
        paddingInlineStart: '0',
        paddingInlineEnd: '0'
      },
      '& > .icon': {
        alignSelf: 'center'
      },
      '&:hover': {
        backgroundColor: theme('colors.secondary.50')
      }
    }
  };
}

/**
 * The return type of {@link components}.
 *
 * @public
 */
export type ReturnOfComponents = ReturnType<typeof components>;
