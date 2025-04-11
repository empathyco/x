export {
  cancelFetchAndSaveSuggestions as cancelFetchAndSavePopularSearches,
  fetchAndSaveSuggestions as fetchAndSavePopularSearches,
} from './actions/fetch-and-save-suggestions.action'
export { fetchSuggestions as fetchPopularSearches } from './actions/fetch-suggestions.action'
export * from './emitters'
export * from './getters/popular-searches.getter'
export { request as popularSearchesRequest } from './getters/request.getter'
export * from './module'
export * from './types'
