import { RelatedTag } from '@empathyco/x-types';
import { UrlXStoreModule } from '../types';

/**
 * Default implementation for the {@link UrlGetters.relatedTags} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the url module.
 *
 * @returns The related tags.
 *
 * @public
 */
export const relatedTags: UrlXStoreModule['getters']['relatedTags'] = ({
  params: { query, relatedTags }
}) => (relatedTags as string[]).reduce<RelatedTag[]>((acc, relatedTag) => {
  acc.push({
    tag: relatedTag,
    modelName: 'RelatedTag',
    selected: true,
    query: query as string,
    previous: ''
  });
  return acc;
}, []);
