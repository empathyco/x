import { RelatedTagsRequest } from '@empathy/search-adapter';
import { RelatedTag } from '@empathy/search-types';
import { XStoreModule } from '../../../store';
import { StatusMutations, StatusState } from '../../../store/utils/helpers/status.helpers';
import { RelatedTagsConfig } from '../config.types';

/**
 * RelatedTags store state.
 *
 * @public
 */
export interface RelatedTagsState extends StatusState {
  /** The internal query of the module. Used to request the related tags. */
  query: string;
  /** The list of the related tags, related to the `query` property of the state. */
  relatedTags: RelatedTag[];
  /** The list of the selected related tags. */
  selectedRelatedTags: RelatedTag[];
  /** The configuration of the related tags module. */
  config: RelatedTagsConfig;
}
/**
 * RelatedTags store getters.
 *
 * @public
 */
export interface RelatedTagsGetters {
  /** The adapter request object for retrieving the related tags, or null if there is not
   * valid data to create a request. */
  request: RelatedTagsRequest | null;
  /** List that contains al the related tags, having the selected ones at the first positions
   * (if there are any), and then the unselected ones.
   */
  relatedTags: RelatedTag[];
}
/**
 * RelatedTags store mutations.
 *
 * @public
 */
export interface RelatedTagsMutations extends StatusMutations {
  /**
   * Sets the query of the module, which is used to retrieve the related tags.
   *
   * @param newQuery - The new query to save to the state.
   */
  setQuery(newQuery: string): void;
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
}
/**
 * RelatedTags store actions.
 *
 * @public
 */
export interface RelatedTagsActions {
  /**
   * Fetchs a new set of related tags and returns them.
   *
   * @returns The new set of related tags.
   */
  fetchRelatedTags(): RelatedTag[];
  /**
   * Fetchs a new set of related tags and stores them in the module state.
   */
  fetchAndSaveRelatedTags(): void;
  /**
   * Add or remove the clicked related tag from selected related tags.
   */
  toggleRelatedTag(relatedTag: RelatedTag): void;
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
