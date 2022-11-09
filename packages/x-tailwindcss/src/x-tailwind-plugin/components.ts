import { TailwindHelpers } from '../types';
import { button } from './components/button';
import { icon } from './components/icon';

/**
 * Default component styles.
 *
 * @param helpers - A set of tailwind helpers to create the components.
 * @returns All the styles for each component.
 *
 * @public
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export default function components(helpers: TailwindHelpers) {
  return {
    ...button(helpers),
    ...icon(helpers)
  };
}

/**
 * The return type of {@link components}.
 *
 * @public
 */
export type ReturnOfComponents = ReturnType<typeof components>;
