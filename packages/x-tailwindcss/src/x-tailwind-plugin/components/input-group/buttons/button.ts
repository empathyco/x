import { TailwindHelpers } from '../../../../types';

/**
 * Returns the default styles for component `input`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function inputGroupButton({ theme }: TailwindHelpers) {
  return {
    height: 'inherit',
    minHeight: 0,
    aspectRatio: '1',
    padding: '0',
    fontSize: `var(--input-group-button-font-size,${theme('fontSize.sm')})`,
    fontWeight: theme('fontWeight.regular'),
    borderWidth: theme('borderWidth.1'),
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    color: theme('colors.neutral.50'),

    '&:hover,&:focus,&:active': {
      color: theme('colors.neutral.75'),
      borderColor: 'transparent',
      backgroundColor: theme('colors.neutral.10')
    },

    '&:disabled': {
      color: theme('colors.neutral.25'),
      borderColor: theme('colors.neutral.10'),
      backgroundColor: theme('colors.neutral.10')
    }
  };
}
