import type { CSSRuleValue, TailwindHelpers } from '../types'
import { attach } from './components/attach'
import { badge } from './components/badge'
import { button } from './components/button'
import { buttonGroup } from './components/button-group'
import { facetFilter } from './components/facet-filter'
import { highlight } from './components/highlight'
import { icon } from './components/icon'
import { input } from './components/input'
import { inputGroup } from './components/input-group'
import { layout } from './components/layout'
import { picture } from './components/picture'
import { progressBar } from './components/progress-bar'
import { scroll } from './components/scroll'
import { slidingPanel } from './components/sliding-panel'
import { suggestion } from './components/suggestion'
import { suggestionGroup } from './components/suggestion-group'
import { suggestionGroupButton } from './components/suggestion-group/button'
import { tag } from './components/tag'
import { typography } from './components/typography'

export interface CSSRuleObject {
  [selector: string]: CSSRuleValue | string | number | undefined
}

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
    ...attach(helpers),
    ...badge(helpers),
    ...button(helpers),
    ...buttonGroup(helpers),
    ...facetFilter(helpers),
    ...highlight(helpers),
    ...icon(helpers),
    ...input(helpers),
    ...inputGroup(helpers),
    ...layout(helpers),
    ...picture(helpers),
    ...progressBar(helpers),
    ...scroll(helpers),
    ...slidingPanel(helpers),
    ...suggestion(helpers),
    ...suggestionGroup(helpers),
    ...suggestionGroupButton(helpers),
    ...tag(helpers),
    ...typography(helpers),
  } as unknown as CSSRuleObject
}
