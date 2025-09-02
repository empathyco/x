import type { AiQuestion } from '@empathyco/x-types'
import type { AiActionContext, AiXStoreModule } from '../types'
import { XPlugin } from '../../../../plugins'

type AnswerChunk =
  | { responseText: string }
  | { suggestionText: string }
  | { queries: { query: string; categories: string[] }[] }
  | { taggings: AiQuestion['tagging'][] }
/**
 * Default implementation for the {@link AiActions.fetchAiSuggestions}.
 *
 * @param _ - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param request - The AI request to make.
 * @returns The AI response.
 *
 * @public
 */
export const fetchAiSuggestions: AiXStoreModule['actions']['fetchAiSuggestions'] = async (
  { commit },
  request,
) => {
  if (!request) {
    return null
  }
  return (
    XPlugin.adapter
      /*.aiSuggestions({
        query: 'toner',
        extraParams: {
          lang: 'es',
          env: 'staging',
          instance: 'mymotivemarketplace',
          filters: { store: 'chupatintas-s-l', city: 'oviedo' },
        },
      })*/
      .aiSuggestions(request)
      .then(({ body, status }) => {
        if (status !== 200) {
          return null
        }
        if (body) {
          const reader = body.getReader()
          readAnswer(reader, commit)
        }
      })
  )
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
          if (line.startsWith('data:')) {
            data = JSON.parse(line.slice(5).trim()) as AnswerChunk
            if ('responseText' in data) {
              commit('setResponseText', data.responseText)
            }
            if ('suggestionText' in data) {
              commit('setSuggestionText', data.suggestionText)
            }
            if ('queries' in data) {
              commit('setQueries', data.queries)
            }
            if ('taggings' in data) {
              commit('setTaggings', data.taggings)
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
}
