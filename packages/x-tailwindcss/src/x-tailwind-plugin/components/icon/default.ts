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

    // Disable flag by default, it can be enabled from other components.
    '--enableIconOffset': 'var(--OFF)',
    // When flag is enabled, `fontSize` won't be changed.
    fontSize: 'var(--enableIconOffset) var(--fontSize)',
    // When flag is enabled, `translateY` will be applied.
    transform: 'var(--enableIconOffset, translateY(var(--iconVerticalOffset,0)))',

    ...iconSizes(helpers).md
  };
}
