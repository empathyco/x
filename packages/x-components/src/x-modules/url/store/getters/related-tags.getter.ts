import { RelatedTag } from '@empathyco/x-types';
import { UrlXStoreModule } from '../types';

/**
 * Default implementation for the {@link UrlGetters.relatedTags} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the url module.
 *
 * @returns The {@link @empathyco/x-types#RelatedTag | related tags}.
 *
 * @public
 */
export const relatedTags: UrlXStoreModule['getters']['relatedTags'] = ({
  params: { query, relatedTags }
}) => {
  return (relatedTags as string[]).reduce<RelatedTag[]>((acc, relatedTag) => {
    acc.push(generateRelatedTag(relatedTag, query as string));
    return acc;
  }, []);
};

/**
 * Generates a {@link @empathyco/x-types#RelatedTag | related tags} entity from a tag and a query.
 *
 * @param relatedTag - The tag from the url.
 * @param query - The query from the url.
 *
 * @returns A {@link @empathyco/x-types#RelatedTag | related tag}.
 */
function generateRelatedTag(relatedTag: string, query: string): RelatedTag {
  return {
    tag: `${relatedTag} ${query}`,
    modelName: 'RelatedTag',
    selected: true,
    query,
    previous: ''
  };
}
