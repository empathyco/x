export { fetchSuggestions as fetchPopularSearches } from './actions/fetch-suggestions.action';
export {
  fetchAndSaveSuggestions as fetchAndSavePopularSearches,
  cancelFetchAndSaveSuggestions as cancelFetchAndSavePopularSearches
} from './actions/fetch-and-save-suggestions.action';
export * from './emitters';
export { request as popularSearchesRequest } from './getters/request';
export * from './getters/popular-searches';
export * from './module';
export * from './types';
