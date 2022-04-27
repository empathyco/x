import { TailwindHelpers } from '../types';

/**
 * Default dynamic component styles.
 *
 * @param root0
 * @param root0.theme
 * @returns All the styles for each component and the values they are going to be generated with.
 *
 * @public
 */
export default function dynamicComponents({ theme }: Partial<TailwindHelpers>) {
  return {
    // TODO: replace this example styles with actual design styles
    'dynamic-button-gap': {
      styles: (value: any) => ({
        display: 'flex',
        alignItems: 'baseline',
        alignContent: 'center',
        justifyContent: 'center',
        flexFlow: 'row wrap',
        backgroundColor: theme('colors.secondary.25'),
        color: theme('colors.neutral.0'),
        height: '30px',
        gap: value,
        paddingInlineStart: '5px',
        paddingInlineEnd: '5px',
        borderRadius: theme('borderRadius.sm'),
        fontSize: theme('fontSize.base')
      }),
      values: theme('spacing')
    }
  };
}

/**
 * The return type of {@link dynamicComponents}.
 *
 * @public
 */
export type ReturnOfDynamicComponents = ReturnType<typeof dynamicComponents>;
