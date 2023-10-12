import { RelatedTag, RelatedTagsRequest } from '@empathyco/x-types';
import { Dictionary } from '@empathyco/x-utils';
import { XActionContext, XStoreModule } from '../../../store';
import { QueryMutations, QueryState } from '../../../store/utils/query.utils';
import { StatusMutations, StatusState } from '../../../store/utils/status-store.utils';
import { UrlParams } from '../../../types/url-params';
import { RelatedTagsConfig } from '../config.types';
import { ConfigMutations } from '../../../store/utils/config-store.utils';

/**
 * RelatedTags store state.
 *
 * @public
 */
export interface RelatedTagsState extends StatusState, QueryState {
  /** The list of the related tags, related to the `query` property of the state. */
  relatedTags: RelatedTag[];
  /** The list of the selected related tags. */
  selectedRelatedTags: RelatedTag[];
  /** The configuration of the related tags module. */
  config: RelatedTagsConfig;
  /** The extra params property of the state. */
  params: Dictionary<unknown>;
}
/**
 * RelatedTags store getters.
 *
 * @public
 */
export interface RelatedTagsGetters {
  /**
   * The adapter request object for retrieving the related tags, or null if there is not
   * valid data to create a request.
   */
  request: RelatedTagsRequest | null;
  /**
   * List that contains al the related tags, having the selected ones at the first positions
   * (if there are any), and then the unselected ones.
   */
  relatedTags: RelatedTag[];
  /** The combination of the query and the selected related tags. */
  query: string;
}
/**
 * RelatedTags store mutations.
 *
 * @public
 */
export interface RelatedTagsMutations
  extends StatusMutations,
    QueryMutations,
    ConfigMutations<RelatedTagsState> {
  /**
   * Sets the related tags of the module.
   *
   * @param relatedTags - The new related tags to save to the state.
   */
  setRelatedTags(relatedTags: RelatedTag[]): void;
  /**
   * Sets the selected related tags of the module.
   *
   * @param selectedRelatedTags - The selected related tags to save to the state.
   */
  setSelectedRelatedTags(selectedRelatedTags: RelatedTag[]): void;
  /**
   * Sets the extra params of the module.
   *
   * @param params - The new extra params.
   */
  setParams(params: Dictionary<unknown>): void;
}
/**
 * RelatedTags store actions.
 *
 * @public
 */
export interface RelatedTagsActions {
  /**
   * Cancels / interrupt {@link RelatedTagsActions.fetchAndSaveRelatedTags} synchronous promise.
   */
  cancelFetchAndSaveRelatedTags(): void;
  /**
   * Fetches a new set of related tags and returns them.
   *
   * @returns The new set of related tags.
   */
  fetchRelatedTags(request: RelatedTagsRequest | null): RelatedTag[];
  /**
   * Fetches a new set of related tags and stores them in the module state.
   */
  fetchAndSaveRelatedTags(request: RelatedTagsRequest | null): void;
  /**
   * Add or remove the clicked related tag from selected related tags.
   */
  toggleRelatedTag(relatedTag: RelatedTag): void;
  /**
   * Receives a list of params from the url, builds the entities and
   * set them in the store.
   */
  setUrlParams(urlParams: UrlParams): void;
}
/**
 * RelatedTags type safe store module.
 *
 * @public
 */
export type RelatedTagsXStoreModule = XStoreModule<
  RelatedTagsState,
  RelatedTagsGetters,
  RelatedTagsMutations,
  RelatedTagsActions
>;

/**
 * Alias type for actions context of the {@link RelatedTagsXStoreModule}.
 *
 * @public
 */
export type RelatedTagsActionContext = XActionContext<
  RelatedTagsState,
  RelatedTagsGetters,
  RelatedTagsMutations,
  RelatedTagsActions
>;
