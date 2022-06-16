import { RecommendationsXStoreModule } from '../types';

/**
 * Default implementation for the {@link RecommendationsGetters.request} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the query
 * suggestions module.
 * @returns The recommendations request to fetch data from the API.
 *
 * @public
 */
export const request: RecommendationsXStoreModule['getters']['request'] = ({
  origin,
  config,
  params
}) => {
  return {
    rows: config.maxItemsToRequest,
    start: 0,
    origin,
    extraParams: params
  };
};
