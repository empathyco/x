import type { PlatformResult } from '../result.model'

/**
 * Each platform suggestion search is a query and the platform results of that query.
 * @public
 */
export interface PlatformAiSuggestionSearch {
  query: string
  results: PlatformResult[]
  numFound: number
  tagging?: { query: string }
}

export interface PlatformAiSuggestionSearchTagging {
  query: string
  add2cart: string
  click: string
  display: string
  displayClick: string
  checkout: string
}
