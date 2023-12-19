import { md5 } from 'js-md5';
import { QueryPreviewInfo, QueryPreviewItem } from '../store/index';

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

export const getHashFromQueryPreviewInfo = (queryPreviewInfo: QueryPreviewInfo): string => {
  let queryPreviewFilters = '';
  if (queryPreviewInfo.filters) {
    queryPreviewInfo.filters.forEach(filter => {
      queryPreviewFilters = queryPreviewFilters.concat('-' + filter);
    });
  }

  return md5(queryPreviewInfo.query.concat(queryPreviewFilters));
};
