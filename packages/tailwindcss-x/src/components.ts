import { DeepPartial, TailwindHelpers } from './types';

export default function components({ theme }: TailwindHelpers): any {
  return {
    '.btn': {
      '--x-size-height': theme('spacing.32'),
      display: 'flex',
      alignItems: 'baseline',
      alignContent: 'center',
      justifyContent: 'center',
      flexFlow: 'row wrap',
      backgroundColor: theme('colors.neutral.75'),
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
        paddingInlineStart: 0,
        paddingInlineEnd: 0
      },
      '& > .icon': {
        alignSelf: 'center'
      }
    },
    '.icon': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: theme('spacing.16'),
      height: theme('spacing.16'),
      color: 'currentColor',
      fontSize: theme('spacing.8')
    }
  };
}

type VarSelector = `--${string}`;
type ChildBlockKey = `.${string}` | `&${string}`;

type ComponentsCSS = {
  [Key: ChildBlockKey]: ComponentsCSS & Partial<CSSStyleDeclaration>;
  [Key: VarSelector]: string;
};

export type ComponentsDefinition = DeepPartial<ReturnType<typeof components>> | ComponentsCSS;
