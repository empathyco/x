import { RelatedTag } from '@empathy/search-types';
import { XStoreModule } from '../../../store';
import { RelatedTagsConfig } from '../config.types';

/**
 * RelatedTags store state.
 *
 * @public
 */
export interface RelatedTagsState {
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
export interface RelatedTagsGetters {}
/**
 * RelatedTags store mutations.
 *
 * @public
 */
export interface RelatedTagsMutations {}
/**
 * RelatedTags store actions.
 *
 * @public
 */
export interface RelatedTagsActions {}
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
