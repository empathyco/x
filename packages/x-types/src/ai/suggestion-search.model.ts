import type { Result } from '../result'

/**
 * Each suggestion search is a query and the results of that query.
 * @public
 */
export interface AiSuggestionSearch {
  query: string
  results: Result[]
}
