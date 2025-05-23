import type { TailwindHelpers } from '../../../../types'

/**
 * Returns the styles for component `input-group-button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function inputGroupButton({ theme }: TailwindHelpers) {
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexFlow: 'row nowrap',
    boxSizing: 'border-box',
    height: 'var(--input-group-button-height, inherit)',
    minHeight: 0,
    aspectRatio: '1',
    padding: '0',
    fontSize: `var(--input-group-button-font-size,${theme('x.fontSize.sm')})`,
    fontWeight: theme('x.fontWeight.regular'),
    borderWidth: theme('x.borderWidth.1'),
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    color: theme('x.colors.neutral.50'),

    '&:hover,&:focus,&:active': {
      color: theme('x.colors.neutral.75'),
      borderColor: 'transparent',
      backgroundColor: theme('x.colors.neutral.10'),
    },

    '&:disabled': {
      color: theme('x.colors.neutral.25'),
      borderColor: theme('x.colors.neutral.10'),
      backgroundColor: theme('x.colors.neutral.10'),
    },
  }
}
