import type { RelatedPrompt } from '@empathyco/x-types'
import type { ListItem } from '../../utils'

/**
 * Related promts group interface for the RelatedPrompts.
 */
export interface RelatedPromptsGroup extends ListItem {
  modelName: 'RelatedPromptsGroup'
  relatedPrompts: RelatedPrompt[]
}
