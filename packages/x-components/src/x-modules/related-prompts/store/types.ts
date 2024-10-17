import { RelatedPrompt, RelatedPromptsRequest } from '@empathyco/x-types';
import { QueryMutations, QueryState } from '../../../store/utils/query.utils';
import { StatusMutations, StatusState } from '../../../store/utils/status-store.utils';
import { XActionContext, XStoreModule } from '../../../store';

/**
 * Related prompts module state.
 */
export interface RelatedPromptsState extends StatusState, QueryState {
  /** The list of the related-prompts, related to the `query` property of the state. */
  related_prompts_products: RelatedPrompt[];
}

/**
 * Related prompts module getters.
 */
export interface RelatedPromptsGetters {
  /**
   * Request object to retrieve the next queries using the search adapter, or null if there is
   * no valid data to conform a valid request.
   */
  request: RelatedPromptsRequest | null;
}

/**
 * Related prompts module mutations.
 */
export interface RelatedPromptsMutations extends StatusMutations, QueryMutations {
  /**
   * Sets the related prompts of the module.
   *
   * @param relatedPrompts - The new related prompts to save to the state.
   */
  setRelatedPromptsProducts(products: any[]): void;
  /**
   * Resets the related prompts state.
   */
  resetRelatedPromptsState(): void;
}

/**
 * Related prompts module actions.
 */
export interface RelatedPromptsActions {
  /**
   * Fetches the related prompts response.
   *
   * @param request - The related prompts request.
   */
  fetchRelatedPromptsResponse(request: RelatedPromptsRequest | null): any;
  /**
   * Fetches the fetch and save related prompts response.
   *
   * @param request - The related prompts request.
   */
  fetchAndSaveRelatedPromptsResponse(request: RelatedPromptsRequest | null): void;
  /**
   * Cancels / interrupt {@link RelatedPromptsActions.fetchAndSaveRelatedPromptsResponse}
   * synchronous promise.
   */
  cancelFetchAndSaveRelatedPromptsResponse(): void;
}

export type RelatedPromptsXStoreModule = XStoreModule<
  RelatedPromptsState,
  RelatedPromptsGetters,
  RelatedPromptsMutations,
  RelatedPromptsActions
>;

export type RelatedPromptsActionContext = XActionContext<
  RelatedPromptsState,
  RelatedPromptsGetters,
  RelatedPromptsMutations,
  RelatedPromptsActions
>;
