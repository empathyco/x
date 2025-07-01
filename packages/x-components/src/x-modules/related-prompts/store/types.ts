import type { RelatedPrompt, RelatedPromptsRequest, RelatedTag } from '@empathyco/x-types'
import type { Dictionary } from '@empathyco/x-utils'
import type { XActionContext, XStoreModule } from '../../../store'
import type { QueryMutations, QueryState } from '../../../store/utils/query.utils'
import type { StatusMutations, StatusState } from '../../../store/utils/status-store.utils'
import type { UrlParams } from '../../../types'

/**
 * Related prompts module state.
 *
 * @public
 */
export interface RelatedPromptsState extends StatusState, QueryState {
  /** The list of the related-prompts, related to the `query` property of the state. */
  relatedPrompts: RelatedPrompt[]
  /** The list of the filtered related-prompts, related to the `query` property of the state. */
  relatedPromptsFiltered: RelatedPrompt[]
  /** The index of the selected related-prompt. */
  selectedPrompt: number
  /** The index of the selected next query. */
  selectedQuery: number
  /** The extra params property of the state. */
  params: Dictionary<unknown>
  /** The list of the related tags, related to the `query` property of the state. */
  relatedTags: RelatedTag[]
}

/**
 * Related prompts module getters.
 *
 * @public
 */
export interface RelatedPromptsGetters {
  /**
   * Request object to retrieve the related prompts using the search adapter, or null if there is
   * no valid data to conform a valid request.
   */
  request: RelatedPromptsRequest | null
  /** The combination of the query and the selected related tags. */
  query: string
}

/**
 * Related prompts module mutations.
 *
 * @public
 */
export interface RelatedPromptsMutations extends StatusMutations, QueryMutations {
  /**
   * Sets the extra params of the module.
   *
   * @param params - The new extra params.
   */
  setParams: (params: Dictionary<unknown>) => void
  /**
   * Sets the related prompts of the module.
   *
   * @param products - The new related prompts to save to the state.
   */
  setRelatedPromptsProducts: (products: RelatedPrompt[]) => void
  /**
   * Sets the filtered related prompts of the module.
   *
   * @param products - The new related prompts to save to the state.
   */
  setFilteredRelatedPromptsProducts: (products: RelatedPrompt[]) => void
  /**
   * Sets the selected related prompt.
   *
   * @param index - The new selected related prompt.
   */
  setSelectedPrompt: (index: number) => void
  /**
   * Sets the selected next query.
   *
   * @param index - The new selected next query.
   */
  setSelectedQuery: (index: number) => void
  /**
   * Sets the related tags of the module.
   *
   * @param relatedTags - The new related tags to save to the state.
   */
  setRelatedPromptsRelatedTags: (relatedTags: RelatedTag[]) => void
  /**
   * Resets the related prompts state.
   */
  resetRelatedPromptsState: () => void
  /**
   * Resets the selected related prompt number.
   */
  resetSelectedPrompt: () => void
}

/**
 * Related prompts module actions.
 *
 * @public
 */
export interface RelatedPromptsActions {
  /**
   * Requests a new set of related prompts for the module query, and returns them.
   *
   * @param request - The related prompts request.
   */
  fetchRelatedPrompts: (request: RelatedPromptsRequest | null) => RelatedPrompt[] | null
  /**
   * Requests a new set of related prompts and stores them in the module.
   *
   * @param request - The related prompts request.
   */
  fetchAndSaveRelatedPrompts: (request: RelatedPromptsRequest | null) => void
  /**
   * Checks if the URL has params on it and then updates the state with these values.
   *
   * @param urlParams - List of params from the url.
   */
  setUrlParams: (urlParams: UrlParams) => void
  /**
   * Cancels / interrupt {@link RelatedPromptsActions.fetchAndSaveRelatedPrompts}
   * synchronous promise.
   */
  cancelFetchAndSaveRelatedPrompts: () => void
}

/**
 * Related prompts store module.
 *
 * @public
 */
export type RelatedPromptsXStoreModule = XStoreModule<
  RelatedPromptsState,
  RelatedPromptsGetters,
  RelatedPromptsMutations,
  RelatedPromptsActions
>

/**
 * Alias type for actions context of the {@link RelatedPromptsXStoreModule}.
 *
 * @public
 */
export type RelatedPromptsActionContext = XActionContext<
  RelatedPromptsState,
  RelatedPromptsGetters,
  RelatedPromptsMutations,
  RelatedPromptsActions
>
