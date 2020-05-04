import { XStoreModule } from '../../../store';

/**
 * RelatedTags store state.
 *
 * @public
 */
export interface RelatedTagsState {}
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
