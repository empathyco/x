export {
  fetchAndSaveSuggestions as fetchAndSaveQuerySuggestions,
  cancelFetchAndSaveSuggestions as cancelFetchAndSaveQuerySuggestions
} from './actions/fetch-and-save-suggestions.action';
export { fetchSuggestions as fetchQuerySuggestions } from './actions/fetch-suggestions.action';
export * from './emitters';
export { request as querySuggestionsRequest } from './getters/request.getter';
export * from './getters/normalized-query.getter';
export * from './getters/query-suggestions.getter';
export * from './module';
export * from './types';
