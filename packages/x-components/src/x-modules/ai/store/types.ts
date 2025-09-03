import type {
  AiQuestion,
  AiSuggestionSearch,
  AiSuggestionsRequest,
  AiSuggestionsSearchRequest,
  AiSuggestionsSearchResponse,
  RelatedTag,
} from '@empathyco/x-types'
import type { Dictionary } from '@empathyco/x-utils'
import type {
  ConfigMutations,
  QueryMutations,
  QueryState,
  XActionContext,
  XStoreModule,
} from '../../../store'
import type { UrlParams } from '../../../types'
import type { AiConfig } from '../config.types'

/**
 * Ai module state.
 *
 * @public
 */
export interface AiState extends QueryState {
  /** The streamed field from suggestion response.*/
  responseText: string
  suggestionText: string
  queries: { query: string; categories: string[] }[]
  taggings: AiQuestion['tagging'][]

  /** Loading state for the suggestions response */
  suggestionsLoading: boolean
  /** Loading state for the suggestions search response */
  suggestionsSearchLoading: boolean

  /** The results per query retrieved by the suggestion search endpoint */
  suggestionsSearch: AiSuggestionSearch[]

  /* The config of the `AI` module. */
  config: AiConfig

  /** The extra params property of the state. */
  params: Dictionary<unknown>

  /** The list of the related tags, related to the `query` property of the state. */
  relatedTags: RelatedTag[]
}

/**
 * Ai module getters.
 *
 * @public
 */
export interface AiGetters {
  /**
   * Request object to retrieve the questions using the ai questions adapter, or null if there is
   * no valid data to conform a valid request.
   */
  request: AiSuggestionsRequest | null

  /** The combination of the query and the selected related tags. */
  query: string

  /** The combination of the suggestions stream loading and the suggestions search response loading. */
  loading: boolean
}

/**
 * Ai module mutations.
 *
 * @public
 */
export interface AiMutations extends ConfigMutations<AiState>, QueryMutations {
  /**
   * Sets the responseText from the streamed response.
   *
   * @param responseText - The new responseText.
   */
  setResponseText: (responseText: string) => void

  /**
   * Sets the suggestionText from the streamed response.
   *
   * @param suggestionText - The new suggestionText.
   */
  setSuggestionText: (suggestionText: string) => void

  /**
   * Sets the queries from the streamed response.
   *
   * @param queries - The new queries.
   */
  setQueries: (queries: { query: string; categories: string[] }[]) => Promise<void>

  /**
   * Sets the taggings from the streamed response.
   *
   * @param taggings - The new taggings.
   */
  setTaggings: (taggings: AiQuestion['tagging'][]) => void

  /**
   * Sets the loading for the suggestions response.
   *
   * @param tagging - The new tagging.
   */
  setSuggestionsLoading: (value: boolean) => void

  /**
   * Sets the loading fot the suggestions search response.
   *
   * @param tagging - The new tagging.
   */
  setSuggestionsSearchLoading: (value: boolean) => void

  /**
   * Sets the suggestions search from the suggestions search response.
   *
   * @param tagging - The new tagging.
   */
  setSuggestionsSearch: (suggestionsSearch: AiSuggestionSearch[]) => void

  /**
   * Sets the extra params of the module.
   *
   * @param params - The new extra params.
   */
  setParams: (params: Dictionary<unknown>) => void

  /**
   * Resets the ai state.
   */
  resetAiState: () => void
  /**
   * Sets the related tags of the module.
   *
   * @param relatedTags - The new related tags to save to the state.
   */
  setAiRelatedTags: (relatedTags: RelatedTag[]) => void
}

/**
 * Ai module actions.
 *
 * @public
 */
export interface AiActions {
  /**
   * Requests suggestions for the module ai.
   *
   * @param request - The ai suggestions request.
   */
  fetchAiSuggestions: (request: AiSuggestionsRequest | null) => void | null

  /**
   * Requests suggestions search for the module ai.
   *
   * @param request - The ai suggestions search request.
   */
  fetchAiSuggestionsSearch: (
    request: AiSuggestionsSearchRequest | null,
  ) => AiSuggestionsSearchResponse | null

  /**
   * Requests suggestions search for the module ai.
   *
   * @param request - The ai request.
   */
  fetchAndSaveAiSuggestionsSearch: (request: AiSuggestionsSearchRequest | null) => void

  /**
   * Checks if the URL has params on it and then updates the state with these values.
   *
   * @param urlParams - List of params from the url.
   */
  setUrlParams: (urlParams: UrlParams) => void
}

/**
 * AI type safe store module.
 *
 * @public
 */
export type AiXStoreModule = XStoreModule<AiState, AiGetters, AiMutations, AiActions>

/**
 * Alias type for actions context of the {@link AiXStoreModule}.
 *
 * @public
 */
export type AiActionContext = XActionContext<AiState, AiGetters, AiMutations, AiActions>
