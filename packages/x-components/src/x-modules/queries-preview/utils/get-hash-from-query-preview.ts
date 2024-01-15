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
  let queryPreviewFilters = '';
  if (queryPreview.request.filters) {
    const queryPreviewFiltersKeys = Object.keys(queryPreview.request.filters);
    queryPreviewFiltersKeys.forEach(key => {
      queryPreview.request.filters![key].forEach(filter => {
        queryPreviewFilters = queryPreviewFilters.concat('-' + filter.id.toString());
      });
    });
  }

  return md5(queryPreview.request.query.concat(queryPreviewFilters));
};

/**
 * Creates a query hash to check if a QueryPreview has already been saved in the state.
 *
 * @param queryPreviewInfo - The {@link QueryPreviewInfo | QueryPreviewInfo} of a QueryPreview.
 * @returns A unique id that will be used as a key to check the QueryPreview in the state.
 */
export const getHashFromQueryPreviewInfo = (queryPreviewInfo: QueryPreviewInfo): string => {
  let queryPreviewFilters = '';
  if (queryPreviewInfo.filters) {
    queryPreviewInfo.filters.forEach(filter => {
      queryPreviewFilters = queryPreviewFilters.concat('-' + filter);
    });
  }

  return md5(queryPreviewInfo.query.concat(queryPreviewFilters));
};
