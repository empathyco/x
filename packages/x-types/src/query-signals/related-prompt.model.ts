import type { NamedModel } from '../named-model.model'
import type { TaggingRequest } from '../request/index'

/**
 * Represents a related prompt.
 *
 * @public
 */
export interface RelatedPrompt extends NamedModel<'RelatedPrompt'> {
  /** The next queries related to the prompt. */
  relatedPromptNextQueries?: RelatedPromptNextQuery[]
  /** The queries of the next queries related to the prompt. */
  nextQueries: string[]
  /** The prompt. */
  suggestionText: string
  /** The prompt image */
  suggestionImageUrl?: string
  /** The type of the prompt. */
  type: string
  /** The tooling display tagging of the prompt. */
  toolingDisplayTagging?: TaggingRequest
  /** Related prompt tagging. */
  tagging?: {
    toolingDisplayTagging?: TaggingRequest
    toolingDisplayClickTagging?: TaggingRequest
    nextQueriesTagging?: RelatedPromptNextQuery[]
  }
}

/**
 * Represents a related prompt nextQuery.
 *
 * @public
 */
export interface RelatedPromptNextQuery {
  /** The query of the next query. */
  query: string
  /** The tooling display tagging of the next query. */
  toolingDisplayTagging: TaggingRequest
  /** The tooling display click tagging of the next query. */
  toolingDisplayClickTagging: TaggingRequest
  /** The tooling display add2cart tagging of the next query. */
  toolingDisplayAdd2CartTagging: TaggingRequest
}
