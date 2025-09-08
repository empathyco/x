import type { PlatformResult } from '../result.model'

/**
 * Each platform suggestion search is a query and the platform results of that query.
 * @public
 */
export interface PlatformAiSuggestionSearch {
  query: string
  results: PlatformResult[]
  numFound: number
}
