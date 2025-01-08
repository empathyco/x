import { RelatedPrompt, RelatedPromptsRequest } from '@empathyco/x-types';
import { Dictionary } from '@empathyco/x-utils';
import { QueryMutations, QueryState } from '../../../store/utils/query.utils';
import { StatusMutations, StatusState } from '../../../store/utils/status-store.utils';
import { XActionContext, XStoreModule } from '../../../store';

/**
 * Related prompts of a specific query.
 *
 * @public
 */
export interface RelatedPromptsItems {
  relatedPromptsProducts: RelatedPrompt[];
  /** The id of the selected related-prompt. */
  selectedPrompt: string;
  /** A flag to manage if related-prompts should replace the results grid. */
  replaceGrid: boolean;
}

/**
 * Related prompts module state.
 *
 * @public
 */
export interface RelatedPromptsState extends StatusState, QueryState {
  /** The list of the related-prompts, related to the `query` property of the state. */
  relatedPrompts: Dictionary<RelatedPromptsItems>;
  /** The extra params property of the state. */
  params: Dictionary<unknown>;
}

/**
 * Related prompts module getters.
 *
 * @public
 */
export interface RelatedPromptsGetters {}

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
  setParams(params: Dictionary<unknown>): void;
  /**
   * Sets the related prompts of the module.
   *
   * @param payload - An object with the new related prompts to save to the state
   * and the query of the request.
   */
  setRelatedPromptsProducts(payload: { products: RelatedPrompt[]; query: string }): void;
  /**
   * Sets the selected related prompt.
   *
   * @param payload - The new selected related prompt.
   */
  setSelectedPrompt(payload: { promptId: string; query: string }): void;
  /**
   * Resets the related prompts state.
   */
  resetRelatedPromptsState(): void;
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
  fetchRelatedPrompts(request: RelatedPromptsRequest | null): RelatedPrompt[] | null;
  /**
   * Requests a new set of related prompts and stores them in the module.
   *
   * @param query - The related prompts request.
   */
  fetchAndSaveRelatedPrompts(query: string): void;
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
>;

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
>;
