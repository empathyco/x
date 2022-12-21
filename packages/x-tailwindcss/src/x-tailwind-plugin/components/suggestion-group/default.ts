import { TailwindHelpers } from '../../../types';
import { suggestionGroupSizes } from './sizes';
import { overridesChildren } from './utils/overrides-children';

/**
 * Returns the default styles for component `suggestion group`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function suggestionGroupDefault(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    gap: theme('spacing.16'),
    ...suggestionGroupSizes(helpers).md,

    fontFamily: theme('fontFamily.main'),
    fontWeight: theme('fontWeight.regular'),

    display: 'grid',
    gridAutoFlow: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    cursor: 'pointer',

    paddingInlineStart: 0,
    paddingInlineEnd: 0,

    color: theme('colors.neutral.90'),

    ...overridesChildren(helpers)
  };
}
