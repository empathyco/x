import type { AiSuggestionQuery, AiSuggestionTagging } from '@empathyco/x-types'
import type { AiActionContext, AiXStoreModule } from '../types'
import { getTaggingInfoFromUrl } from '@empathyco/x-adapter-platform'
import { XPlugin } from '../../../../plugins'

interface TaggingData {
  tagging: {
    toolingDisplay: string
    toolingDisplayClick: string
    searchQueries: Record<
      string,
      {
        toolingDisplay: string
        toolingDisplayClick: string
        toolingDisplayAdd2Cart: string
      }
    >
  }[]
}

type AnswerData =
  | { responseText: string }
  | { suggestionText: string }
  | { queries: AiSuggestionQuery[] }
  | TaggingData

/**
 * Default implementation for the {@link AiActions.fetchAndSaveAiSuggestions}.
 *
 * @param _ - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param request - The AI request to make.
 * @returns The AI response.
 * @public
 */
export const fetchAndSaveAiSuggestions: AiXStoreModule['actions']['fetchAndSaveAiSuggestions'] =
  async ({ commit }, request) => {
    if (!request) {
      return
    }
    commit('setSuggestionsLoading', true)

    const queryWords = request.query.split(/\s+/).filter(Boolean).length

    const endpointAdapterFn =
      queryWords >= 2 ? XPlugin.adapter.aiSuggestions : XPlugin.adapter.aiSummarize

    return endpointAdapterFn(request).then(({ body, status }) => {
      if (status !== 200) {
        return
      }
      if (body) {
        const reader = body.getReader()
        readAnswer(reader, commit)
      }
    })
  }

function mapTaggingData(tangingData: TaggingData): AiSuggestionTagging {
  const { toolingDisplay, toolingDisplayClick, searchQueries } = tangingData.tagging[0]
  // TODO: Using the getTaggingInfoFromUrl util here is a temporary solution.
  // It creates a dependency with the x-adapter-platform project that should be avoided.
  return {
    toolingDisplay: getTaggingInfoFromUrl(toolingDisplay),
    toolingDisplayClick: getTaggingInfoFromUrl(toolingDisplayClick),
    searchQueries: Object.fromEntries(
      Object.entries(searchQueries).map(
        ([query, { toolingDisplay, toolingDisplayClick, toolingDisplayAdd2Cart }]) => [
          query,
          {
            toolingDisplay: getTaggingInfoFromUrl(toolingDisplay),
            toolingDisplayClick: getTaggingInfoFromUrl(toolingDisplayClick),
            toolingDisplayAdd2Cart: getTaggingInfoFromUrl(toolingDisplayAdd2Cart),
          },
        ],
      ),
    ),
  }
}

function readAnswer(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  commit: AiActionContext['commit'],
): void {
  reader
    .read()
    .then(({ value, done }) => {
      if (done) {
        commit('setSuggestionsLoading', false)
        return
      }

      const result = new TextDecoder().decode(value, { stream: true })
      const parts = result.split('\n\n')
      for (const part of parts) {
        const lines = part.split('\n')

        for (const line of lines) {
          // line.length check to avoid event lines or empty lines
          if (line.length <= 5 || line.startsWith('event:')) continue

          const raw = line.startsWith('data:') ? line.slice(5).trim() : line.trim()
          const data = JSON.parse(raw) as AnswerData

          if ('suggestionText' in data) {
            commit('setIsNoResults', false)
            commit('setSuggestionText', data.suggestionText)
          }
          if ('responseText' in data) {
            commit('setIsNoResults', false)
            commit('setResponseText', data.responseText)
          }
          if ('queries' in data) {
            commit('setQueries', data.queries)
          }
          if ('tagging' in data) {
            commit('setTagging', mapTaggingData(data))
          }
        }
      }
      readAnswer(reader, commit)
    })
    .catch((error: { code: number }) => {
      commit('setSuggestionsLoading', false)
      // AbortError code === 20
      if (error.code !== 20) {
        console.error(error)
      }
    })
}
