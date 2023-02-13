import { TailwindHelpers } from '../../../types';

/**
 * Returns the default styles for component `picture`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function pictureDefault(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    display: 'block',
    aspectRatio: theme('aspectRatio.default'),
    overflow: 'hidden',
    '&-image': {
      aspectRatio: theme('aspectRatio.default'),
      objectFit: 'contain',
      width: '100%',
      height: '100%'
    }
  };
}
