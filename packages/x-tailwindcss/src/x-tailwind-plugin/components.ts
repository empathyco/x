import { TailwindHelpers } from '../types';
import { variables } from './components/variables';
import { button } from './components/button';
import { icon } from './components/icon';
import { suggestion } from './components/suggestion';
import { highlight } from './components/highlight';

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
    ...variables(helpers),
    ...button(helpers),
    ...icon(helpers),
    ...suggestion(helpers),
    ...highlight(helpers)
  };
}

/**
 * The return type of {@link components}.
 *
 * @public
 */
export type ReturnOfComponents = ReturnType<typeof components>;
