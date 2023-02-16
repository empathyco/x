import { TailwindHelpers } from '../types';
import { inputGroup } from './components/input-group';
import { variables } from './components/variables';
import { button } from './components/button';
import { icon } from './components/icon';
import { suggestion } from './components/suggestion';
import { highlight } from './components/highlight';
import { typography } from './components/typography';
import { input } from './components/input';
import { suggestionGroup } from './components/suggestion-group';
import { suggestionGroupButton } from './components/suggestion-group/button';
import { slidingPanel } from './components/sliding-panel';
import { picture } from './components/picture';
import { layout } from './components/layout';
import { scroll } from './components/scroll';

/**
 * Default component styles.
 *
 * @param helpers - A set of tailwind helpers to create the components.
 * @returns All the styles for each component.
 *
 * @public
 */
export default function components(helpers: TailwindHelpers) {
  return {
    ...variables(helpers),
    ...button(helpers),
    ...icon(helpers),
    ...suggestion(helpers),
    ...highlight(helpers),
    ...typography(helpers),
    ...input(helpers),
    ...inputGroup(helpers),
    ...typography(helpers),
    ...suggestionGroup(helpers),
    ...suggestionGroupButton(helpers),
    ...slidingPanel(helpers),
    ...picture(helpers),
    ...layout(helpers),
    ...scroll(helpers)
  };
}

/**
 * The return type of {@link components}.
 *
 * @public
 */
export type ReturnOfComponents = ReturnType<typeof components>;
