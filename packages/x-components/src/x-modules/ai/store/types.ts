import type {
  AiSuggestionQuery,
  AiSuggestionSearch,
  AiSuggestionsRequest,
  AiSuggestionsSearchRequest,
  AiSuggestionTagging,
  Filter,
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
import type { QueryOrigin, QueryOriginInit, UrlParams } from '../../../types'
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
  queries: AiSuggestionQuery[]
  tagging: AiSuggestionTagging | undefined
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
  /** Flag to indicate that the AI response has no results */
  isNoResults: boolean
  /** The origin property of the request. */
  origin: QueryOrigin | null
  /**
   * The dictionary of selected filters, used to perform the AI requests.
   * The key is the facet ID, and the value the list of filters for that facet.
   */
  selectedFilters: Dictionary<Filter[]>
}

/**
 * Ai module getters.
 *
 * @public
 */
export interface AiGetters {
  /**
   * Request object to retrieve the streaming response using the ai suggestions adapter.
   */
  suggestionsRequest: AiSuggestionsRequest

  /**
   * Request object to retrieve the suggestions search based on queries or null if there is
   * no valid queries to conform a valid request.
   */
  suggestionsSearchRequest: AiSuggestionsSearchRequest | null

  /** The combination of the query and the selected related tags. */
  query: string
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
  setQueries: (queries: AiSuggestionQuery[]) => void

  /**
   * Sets the tagging from the streamed response.
   *
   * @param tagging - The new tagging.
   */
  setTagging: (tagging: AiSuggestionTagging) => void

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
  /**
   * Sets the no results flag of the module.
   *
   * @param isNoResults - The new no results value.
   */
  setIsNoResults: (isNoResults: boolean) => void
  /**
   * Sets the origin of the module.
   *
   * @param origin - The new origin.
   */
  setOrigin: (origin: QueryOrigin | undefined | null) => void
  /**
   * Sets the selected filters of the module.
   *
   * @param selectedFilters - The new selected filters to save to the state.
   */
  setSelectedFilters: (selectedFilters: Filter[]) => void
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
  fetchAndSaveAiSuggestions: (request: AiSuggestionsRequest | null) => void

  /**
   * Requests suggestions search for the module ai.
   *
   * @param request - The ai suggestions search request.
   */
  fetchAndSaveAiSuggestionsSearch: (request: AiSuggestionsSearchRequest | null) => void

  /**
   * Checks if the URL has params on it and then updates the state with these values.
   *
   * @param urlParams - List of params from the url.
   */
  setUrlParams: (urlParams: UrlParams) => void
  /**
   * Creates a {@link QueryOrigin} and saves it.
   *
   * @param originInit - The object to create the origin with.
   */
  saveOrigin: (originInit: QueryOriginInit) => void
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
