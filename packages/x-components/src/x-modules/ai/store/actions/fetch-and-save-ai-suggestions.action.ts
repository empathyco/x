import type { AiSuggestionQuery } from '@empathyco/x-types'
import type { AiActionContext, AiXStoreModule } from '../types'
import { getTaggingInfoFromUrl } from '@empathyco/x-adapter-platform'
import { XPlugin } from '../../../../plugins'

type AnswerChunk =
  | { responseText: string }
  | { suggestionText: string }
  | { queries: AiSuggestionQuery[] }
  | {
      taggings: {
        toolingDisplay: string
        toolingDisplayClick: string
      }[]
    }
/**
 * Default implementation for the {@link AiActions.fetchAndSaveAiSuggestions}.
 *
 * @param _ - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param request - The AI request to make.
 * @returns The AI response.
 *
 * @public
 */
export const fetchAndSaveAiSuggestions: AiXStoreModule['actions']['fetchAndSaveAiSuggestions'] =
  async ({ commit }, request) => {
    if (!request) {
      return
    }
    commit('setSuggestionsLoading', true)
    return XPlugin.adapter.aiSuggestions(request).then(({ body, status }) => {
      if (status !== 200) {
        return
      }
      if (body) {
        const reader = body.getReader()
        readAnswer(reader, commit)
      }
    })
  }

function readAnswer(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  commit: AiActionContext['commit'],
): void {
  reader
    .read()
    .then(({ value, done }) => {
      if (done) {
        return
      }
      const result = new TextDecoder().decode(value, { stream: true })
      const parts = result.split('\n\n')
      for (const part of parts) {
        const lines = part.split('\n')
        let data: AnswerChunk

        for (const line of lines) {
          // line.length check to avoid empty data chunks
          if (line.startsWith('data:') && line.length > 5) {
            data = JSON.parse(line.slice(5).trim()) as AnswerChunk
            if ('suggestionText' in data) {
              commit('setNoResults', false)
              commit('setSuggestionText', data.suggestionText)
            }
            if ('responseText' in data) {
              commit('setResponseText', data.responseText)
            }
            if ('queries' in data) {
              commit('setQueries', data.queries)
            }
            if ('taggings' in data) {
              const { toolingDisplay, toolingDisplayClick } = data.taggings[0]
              const tagging = {
                toolingDisplay: getTaggingInfoFromUrl(toolingDisplay),
                toolingDisplayClick: getTaggingInfoFromUrl(toolingDisplayClick),
              }

              commit('setTagging', tagging)
            }
          }
        }
      }
      readAnswer(reader, commit)
    })
    .catch((error: { code: number }) => {
      // AbortError code === 20
      if (error.code !== 20) {
        console.error(error)
      }
    })
    .finally(() => {
      commit('setSuggestionsLoading', false)
    })
}
