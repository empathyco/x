import { RelatedTag } from '@empathyco/x-types';
import { UrlXStoreModule } from '../types';

export const relatedTags: UrlXStoreModule['getters']['relatedTags'] = ({
  params: { query, relatedTags }
}) => {
  return (relatedTags as string[]).reduce<RelatedTag[]>((acc, rt) => {
    acc.push({
      tag: `${rt} ${query as string}`,
      modelName: 'RelatedTag',
      selected: true,
      query: query as string,
      previous: ''
    });
    return acc;
  }, []);
};
