import type { AiQuestion, AiQuestionsRequest, RelatedTag } from '@empathyco/x-types'
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
  questionsByQuery: Record<string, { questions: AiQuestion[]; loading: boolean }>
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
  request: AiQuestionsRequest | null

  /** The combination of the query and the selected related tags. */
  query: string

  /** The current question of the ai module. */
  currentQuestion: AiQuestion | undefined

  /** The current question loading of the ai module. */
  currentQuestionLoading: boolean
}

/**
 * Ai module mutations.
 *
 * @public
 */
export interface AiMutations extends ConfigMutations<AiState>, QueryMutations {
  /**
   * Sets the extra params of the module.
   *
   * @param params - The new extra params.
   */
  setParams: (params: Dictionary<unknown>) => void
  /**
   * Set ai questions by query
   */
  setQuestionsByQuery: (params: {
    query: string
    state: { questions: AiQuestion[]; loading: boolean }
  }) => void

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
   * Requests a new set of questions for the module ai, and returns them.
   *
   * @param request - The ai request.
   */
  fetchAiQuestions: (request: AiQuestionsRequest | null) => AiQuestion[] | null
  /**
   * Requests a new set of questions and stores them in the module.
   *
   * @param request - The questions request.
   */
  fetchAndSaveAiQuestions: (request: AiQuestionsRequest | null) => void

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
