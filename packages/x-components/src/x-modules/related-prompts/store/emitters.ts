import { createStoreEmitters } from '../../../store'
import { relatedPromptsXStoreModule } from './module'

/**
 * {@link StoreEmitters} For the related-prompts module.
 *
 * @internal
 */
export const relatedPromptsStoreEmitters = createStoreEmitters(relatedPromptsXStoreModule, {
  RelatedPromptsRequestUpdated: {
    selector: (_, getters) => getters.request,
    emitWhenVisible: true,
  },
  SelectedRelatedPromptChanged: state => state.selectedPrompt,
  RelatedPromptsResponseChanged: state => state.relatedPrompts,
})
