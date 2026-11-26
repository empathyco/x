import type { SliderFilter } from '@empathyco/x-types'
import type { PlatformFacetType } from '../types/models/facet.model'

/**
 * An object of the Platform API. Only the properties that the schemas read are declared: the
 * rest of them are `unknown`.
 *
 * @public
 */
export interface PlatformSource {
  [key: string]: unknown
}

/**
 * A list of items of the Platform API response.
 *
 * @public
 */
export interface PlatformContentSource extends PlatformSource {
  content?: unknown[]
}

/**
 * A price of the result that the Platform API returns.
 *
 * @public
 */
export interface PlatformPriceSource extends PlatformSource {
  value: number
}

/**
 * The result that the Platform API returns, as the result schemas expect it.
 *
 * @public
 */
export interface PlatformResultSource extends PlatformSource {
  __id: string
  __externalId?: string
  __name?: string
  __url?: string
  __images?: string[]
  __prices?: PlatformSource & {
    current?: PlatformPriceSource
    previous?: PlatformPriceSource
    future?: PlatformPriceSource
  }
  tagging?: PlatformSource & {
    add2cart?: string
    checkout?: string
    click?: string
    displayClick?: string
    browseAdd2Cart?: string
    browseProduct?: string
    browseCheckout?: string
    displayBrowseProduct?: string
  }
}

/**
 * The banner or promoted that the Platform API returns.
 *
 * @public
 */
export interface PlatformBannerSource extends PlatformSource {
  id: string
  title?: string
  url?: string
  image_url?: string
  position?: number
  tagging?: PlatformSource & { click?: string }
}

/**
 * The redirection that the Platform API returns.
 *
 * @public
 */
export interface PlatformRedirectionSource extends PlatformSource {
  id: string
  url: string
  tagging?: PlatformSource & { click?: string }
}

/**
 * The next query that the Platform API returns.
 *
 * @public
 */
export interface PlatformNextQuerySource extends PlatformSource {
  query: string
  source?: string
}

/**
 * The related tag that the Platform API returns.
 *
 * @public
 */
export interface PlatformRelatedTagSource extends PlatformSource {
  query: string
  tag: string
  source?: string
}

/**
 * The semantic query that the Platform API returns.
 *
 * @public
 */
export interface PlatformSemanticQuerySource extends PlatformSource {
  query: string
  distance: number
}

/**
 * The stats that the Platform API returns.
 *
 * @public
 */
export interface PlatformStatsSource extends PlatformSource {
  price?: PlatformSource & { min?: number | string; max?: number | string }
}

/**
 * The suggestion that the Platform API returns.
 *
 * @public
 */
export interface PlatformSuggestionSource extends PlatformSource {
  // TODO: Remove title_raw when endpoint changes and removes it permanently
  title_raw?: string
  keywords?: string
}

/**
 * The partial result that the Platform API returns.
 *
 * @public
 */
export interface PlatformPartialResultSource extends PlatformSource {
  term: string
  numFound?: number
  content?: unknown[]
}

/**
 * The tagging of a next query of a related prompt that the Platform API returns.
 *
 * @public
 */
export interface PlatformRelatedPromptNextQueryTaggingSource extends PlatformSource {
  toolingDisplay?: string
  toolingDisplayClick?: string
  toolingDisplayAdd2Cart?: string
}

/**
 * The related prompt that the Platform API returns.
 *
 * @public
 */
export interface PlatformRelatedPromptSource extends PlatformSource {
  nextQueries?: string[]
  suggestionText: string
  suggestionImageUrl?: string
  type?: 'SYNTHETIC' | 'CURATED'
  tagging: PlatformSource & {
    toolingDisplay?: string
    toolingDisplayClick?: string
    nextQueries?: Record<string, PlatformRelatedPromptNextQueryTaggingSource>
  }
}

/**
 * The facet that the Platform API returns.
 *
 * @public
 */
export interface PlatformFacetSource extends PlatformSource {
  facet: string
  label?: string
  type?: PlatformFacetType
  values?: unknown[]
}

/**
 * The filter that the Platform API returns.
 *
 * @public
 */
export interface PlatformFilterSource extends PlatformSource {
  filter: string
  value?: string
  count?: number
}

/**
 * The hierarchical filter that the Platform API returns.
 *
 * @public
 */
export interface PlatformHierarchicalFilterSource extends PlatformFilterSource {
  children?: PlatformSource & { values?: unknown[] }
}

/**
 * The slider filter that the Platform API returns.
 *
 * @public
 */
export interface PlatformSliderFilterSource extends PlatformSource {
  min: string | number
  max: string | number
  unit?: SliderFilter['unit']
}

/**
 * Each one of the searches of the AI suggestions that the Platform API returns.
 *
 * @public
 */
export interface PlatformAiSuggestionSearchSource extends PlatformSource {
  query: string
  results?: unknown[]
  numFound?: number
}

/**
 * The AI suggestions search response that the Platform API returns.
 *
 * @public
 */
export interface PlatformAiSuggestionsSearchSource extends PlatformSource {
  items?: unknown[]
  tagging?: PlatformSource & {
    query?: string
    add2cart?: string
    click?: string
    display?: string
    displayClick?: string
    checkout?: string
  }
}

/**
 * The search response that the Platform API returns.
 *
 * @public
 */
export interface PlatformSearchResponseSource extends PlatformSource {
  catalog?: PlatformSource & {
    content?: unknown[]
    facets?: unknown[]
    numFound?: number
    spellchecked?: string
    partials?: unknown[]
    tagging?: PlatformSource & { query?: string; display?: string }
    stats?: unknown
  }
  banner?: PlatformContentSource
  promoted?: PlatformContentSource
  direct?: PlatformContentSource
}

/**
 * The browse response that the Platform API returns.
 *
 * @public
 */
export interface PlatformBrowseResponseSource extends PlatformSource {
  catalog?: PlatformSource & {
    content?: unknown[]
    facets?: unknown[]
    numFound?: number
    tagging?: PlatformSource & { browseCategory?: string; displayBrowseCategory?: string }
    stats?: unknown
  }
  banner?: PlatformContentSource
  promoted?: PlatformContentSource
}

/**
 * A response of the Platform API with a list of items in the given properties.
 *
 * @example
 * ```typescript
 * // { topTrends?: { content?: unknown[] } }
 * type Source = PlatformListResponseSource<'topTrends', 'content'>
 * ```
 * @public
 */
export type PlatformListResponseSource<
  Root extends string,
  List extends string,
> = PlatformSource & {
  [Key in Root]?: PlatformSource & { [ListKey in List]?: unknown[] }
}
