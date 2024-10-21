import { RelatedPrompt } from '@empathyco/x-types';
import { ListItem } from '../../utils';

/**
 * Related promts group interface for the RelatedPrompts.
 */
export interface RelatedPromptsGroup extends ListItem {
  modelName: 'RelatedPromptsGroup';
  relatedPrompts: RelatedPrompt[];
}
