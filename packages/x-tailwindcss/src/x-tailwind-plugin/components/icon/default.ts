import { TailwindHelpers } from '../../../types';
import { iconSizes } from './sizes';

/**
 * Returns the default styles for component `icon`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function iconDefault(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: theme('fontFamily.icon'),
    width: 'auto',
    aspectRatio: '1/1',
    vectorEffect: 'non-scaling-stroke',
    flex: '0 0 auto',
    '--enableIconOffset': 'var(--OFF)',
    fontSize: 'var(--enableIconOffset) var(--fontSize)',
    transform: 'var(--enableIconOffset, translateY(var(--iconVerticalOffset,0)))',
    ...iconSizes(helpers).md
  };
}
