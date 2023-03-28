import { TailwindHelpers } from '../../../types';
import { alignIconWithBaseline } from '../icon/utils/align-icon-with-baseline';
import { filterSizes } from './sizes';

/**
 * Returns the default styles for component `filter`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function filterDefault(helpers: TailwindHelpers) {
  return {
    display: 'flex',
    alignItems: 'baseline',
    textAlign: 'start',

    ...filterSizes(helpers).md,
    ...alignIconWithBaseline()
  };
}
