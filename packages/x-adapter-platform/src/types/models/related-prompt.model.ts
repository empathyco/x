import type { Dictionary } from '@empathyco/x-utils'

/**
 * Related prompt model for the `platform` API.
 *
 * @public
 */
export interface PlatformRelatedPrompt {
  nextQueries: string[]
  suggestionText: string
  suggestionImageUrl: string
  type: 'SYNTHETIC' | 'CURATED'
  tagging: PlatformRelatedPromptTagging
}

/**
 * Related prompt model for the `platform` API.
 *
 * @public
 */
export interface PlatformRelatedPromptTagging {
  toolingDisplay: string
  toolingDisplayClick: string
  nextQueries: Dictionary<PlatformRelatedPromptNextQueriesTagging>
}

/**
 * Related prompt model for the `platform` API.
 *
 * @public
 */
export interface PlatformRelatedPromptNextQueriesTagging {
  toolingDisplay: string
  toolingDisplayClick: string
  toolingDisplayAdd2Cart: string
}
