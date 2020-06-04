import { withModule } from '../../wiring/wires.factory';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * The related tags wire factory.
 *
 * @public
 */
export const relatedTagsModule = withModule('relatedTags');

/**
 * Sets the related tags state `query`.
 *
 * @public
 */
export const setRelatedTagsQuery = relatedTagsModule.wireCommit('setQuery');

/**
 * Requests and stores the related tags.
 *
 * @public
 */
export const fetchAndSaveRelatedTags = relatedTagsModule.wireDispatchWithoutPayload(
  'fetchAndSaveRelatedTags'
);

/**
 * Sets the selected related tags.
 *
 * @public
 */
export const toggleRelatedTag = relatedTagsModule.wireDispatch('toggleRelatedTag');
/**
 * Clear the selected related tags.
 *
 * @public
 */
export const clearSelectedRelatedTags = relatedTagsModule.wireCommit('setSelectedRelatedTags', []);
/**
 * Clear the related tags query.
 *
 * @public
 */
export const clearRelatedTagsQuery = relatedTagsModule.wireCommit('setQuery', '');

/**
 * Wiring configuration for the {@link RelatedTagsXModule | related tags module}.
 *
 * @internal
 */
export const relatedTagsWiring = createWiring({
  UserAcceptedAQuery: {
    setRelatedTagsQuery
  },
  UserPickedARelatedTag: {
    toggleRelatedTag
  },
  RelatedTagsRequestChanged: {
    fetchAndSaveRelatedTags
  },
  UserClearedQuery: {
    clearRelatedTagsQuery,
    clearSelectedRelatedTags
  }
});
