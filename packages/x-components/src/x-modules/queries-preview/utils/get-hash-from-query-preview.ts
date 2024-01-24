import { md5 } from 'js-md5';
import { QueryPreviewInfo, QueryPreviewItem } from '../store/index';

/**
 * Creates a query hash to store a QueryPreview, so the same query
 * with different filters can be saved more than once in the state.
 *
 * @param queryPreview - The {@link QueryPreviewItem | QueryPreviewItem} used in the request.
 * @returns A unique id that will be used as a key to store the QueryPreviewItem in the state.
 */
export const getHashFromQueryPreviewItem = (queryPreview: QueryPreviewItem): string => {
  const queryPreviewFilters = queryPreview.request.filters
    ? Object.values(queryPreview.request.filters)
        .flat()
        .map(filter => filter.id.toString())
        .join('-')
    : '';

  return md5(queryPreview.request.query.concat(queryPreviewFilters));
};

/**
 * Creates a query hash to check if a QueryPreview has already been saved in the state.
 *
 * @param queryPreviewInfo - The {@link QueryPreviewInfo | QueryPreviewInfo} of a QueryPreview.
 * @returns A unique id that will be used as a key to check the QueryPreview in the state.
 */
export const getHashFromQueryPreviewInfo = (queryPreviewInfo: QueryPreviewInfo): string => {
  const queryPreviewFilters = queryPreviewInfo.filters ? queryPreviewInfo.filters.join('-') : '';

  return md5(queryPreviewInfo.query.concat(queryPreviewFilters));
};
