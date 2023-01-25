import { TailwindHelpers } from '../../../types';
import { alignIconWithBaseline } from '../icon/utils/align-icon-with-baseline';
import { suggestionGroupSizes } from './sizes';

/**
 * Returns the default styles for component `suggestion group`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function suggestionGroupDefault(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    gap: theme('spacing.16'),
    ...suggestionGroupSizes(helpers).md,

    fontFamily: theme('fontFamily.main'),
    fontWeight: theme('fontWeight.regular'),

    display: 'grid',
    gridAutoFlow: 'column',
    gridTemplateColumns: 'auto [last-col]',
    gridAutoColumns: '1fr',
    justifyContent: 'flex-start',
    alignItems: 'baseline',
    alignContent: 'center',
    cursor: 'pointer',

    paddingInlineStart: 0,
    paddingInlineEnd: 0,

    color: theme('colors.neutral.90'),
    ...alignIconWithBaseline(),

    '.suggestion': {
      color: 'currentColor',
      minHeight: 'inherit',
      fontSize: 'inherit',
      fontFamily: 'inherit',
      fontWeight: 'inherit'
    },

    '& > :last-child': {
      justifySelf: 'end'
    }
  };
}
