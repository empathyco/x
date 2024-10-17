import { RelatedPrompt } from '@empathyco/x-types';
import { ListItem } from '../../utils';

/**
 * Next queries group interface for the NextQueries.
 *
 * @public
 */
export interface RelatedPromptsGroup extends ListItem {
  modelName: 'RelatedPromptsGroup';
  relatedPrompts: RelatedPrompt[];
}
