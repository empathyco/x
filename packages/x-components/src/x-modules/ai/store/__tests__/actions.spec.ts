import type { AiSuggestionQuery } from '@empathyco/x-types'
import type { SafeStore } from '../../../../store/__tests__/utils'
import type { AiActions, AiGetters, AiMutations, AiState } from '../types'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Store } from 'vuex'
import { getMockedAdapter, installNewXPlugin } from '../../../../__tests__/utils'
import { aiXStoreModule } from '../module'
import { resetAiStateWith } from './utils'

const createMockReader = (chunks: unknown[]) => {
  let index = 0
  return {
    read: vi.fn(async () => {
      if (index >= chunks.length) {
        return Promise.resolve({ done: true, value: undefined })
      }
      const chunk = chunks[index++]
      if (chunk instanceof Error) {
        return Promise.reject(chunk)
      }
      const encoder = new TextEncoder()
      return Promise.resolve({
        done: false,
        value: encoder.encode(chunk as string),
      })
    }),
  }
}

const adapter = getMockedAdapter({
  aiSuggestions: {
    body: { getReader: () => ({ read: async () => Promise.resolve({ done: true }) }) },
    status: 200,
  } as unknown as Response,
  aiSummarize: {
    body: { getReader: () => ({ read: async () => Promise.resolve({ done: true }) }) },
    status: 200,
  } as unknown as Response,
})

const store: SafeStore<AiState, AiGetters, AiMutations, AiActions> = new Store(
  aiXStoreModule as any,
)
describe('testing ai module actions', () => {
  mount(
    {},
    {
      global: {
        plugins: [installNewXPlugin({ adapter, store })],
      },
    },
  )

  beforeEach(() => {
    resetAiStateWith(store)
  })

  describe('fetchAndSaveAiSuggestions', () => {
    it('should return undefined if there is no request', async () => {
      const response = await store.dispatch(
        'fetchAndSaveAiSuggestions',
        store.getters.suggestionsRequest,
      )
      expect(response).toBeUndefined()
    })

    it('should set status to loading when request starts', async () => {
      resetAiStateWith(store, { query: 'ai test' })
      expect(store.state.suggestionsStatus).toBe('initial')

      const promise = store.dispatch('fetchAndSaveAiSuggestions', store.getters.suggestionsRequest)

      // Status should be set to loading immediately
      expect(store.state.suggestionsStatus).toBe('loading')

      await promise
      await flushPromises()
    })

    it('should parse and store queries from streamed response', async () => {
      resetAiStateWith(store, { query: 'ai test' })

      const queriesData: AiSuggestionQuery[] = [
        { query: 'test query 1', categories: ['category1'] },
        { query: 'test query 2', categories: ['category2'] },
      ]

      const mockReader = createMockReader([`data: ${JSON.stringify({ queries: queriesData })}\n\n`])

      adapter.aiSuggestions.mockResolvedValueOnce({
        body: { getReader: () => mockReader },
        status: 200,
      } as unknown as Response)

      await store.dispatch('fetchAndSaveAiSuggestions', store.getters.suggestionsRequest)
      await flushPromises()

      expect(store.state.queries).toEqual(queriesData)
      expect(store.state.suggestionsStatus).toBe('success')
    })

    it('should set isNoResults to false when queries are received', async () => {
      resetAiStateWith(store, { query: 'ai test', isNoResults: true })

      const queriesData: AiSuggestionQuery[] = [{ query: 'test query', categories: [] }]

      const mockReader = createMockReader([`data: ${JSON.stringify({ queries: queriesData })}\n\n`])

      adapter.aiSuggestions.mockResolvedValueOnce({
        body: { getReader: () => mockReader },
        status: 200,
      } as unknown as Response)

      await store.dispatch('fetchAndSaveAiSuggestions', store.getters.suggestionsRequest)
      await flushPromises()

      expect(store.state.isNoResults).toBe(false)
    })

    it('should not set isNoResults to false when queries array is empty', async () => {
      resetAiStateWith(store, { query: 'ai test', isNoResults: true })

      const mockReader = createMockReader([`data: ${JSON.stringify({ queries: [] })}\n\n`])

      adapter.aiSuggestions.mockResolvedValueOnce({
        body: { getReader: () => mockReader },
        status: 200,
      } as unknown as Response)

      await store.dispatch('fetchAndSaveAiSuggestions', store.getters.suggestionsRequest)
      await flushPromises()

      expect(store.state.isNoResults).toBe(true)
    })

    it('should parse and store tagging data from streamed response', async () => {
      resetAiStateWith(store, { query: 'ai test' })

      const taggingData = {
        tagging: [
          {
            toolingDisplay: 'http://example.com?param1=value1',
            toolingDisplayClick: 'http://example.com?param2=value2',
            searchQueries: {
              query1: {
                toolingDisplay: 'http://example.com?q1=v1',
                toolingDisplayClick: 'http://example.com?q1=v2',
                toolingDisplayAdd2Cart: 'http://example.com?q1=v3',
              },
            },
          },
        ],
      }

      const mockReader = createMockReader([`data: ${JSON.stringify(taggingData)}\n\n`])

      adapter.aiSuggestions.mockResolvedValueOnce({
        body: { getReader: () => mockReader },
        status: 200,
      } as unknown as Response)

      await store.dispatch('fetchAndSaveAiSuggestions', store.getters.suggestionsRequest)
      await flushPromises()

      expect(store.state.tagging).toBeDefined()
      expect(store.state.tagging?.toolingDisplay).toBeDefined()
      expect(store.state.tagging?.toolingDisplayClick).toBeDefined()
      expect(store.state.tagging?.searchQueries).toBeDefined()
    })

    it('should handle SSE event lines correctly', async () => {
      resetAiStateWith(store, { query: 'ai test' })

      const queriesData: AiSuggestionQuery[] = [{ query: 'test query', categories: [] }]

      const mockReader = createMockReader([
        `event: message\ndata: ${JSON.stringify({ queries: queriesData })}\n\n`,
      ])

      adapter.aiSuggestions.mockResolvedValueOnce({
        body: { getReader: () => mockReader },
        status: 200,
      } as unknown as Response)

      await store.dispatch('fetchAndSaveAiSuggestions', store.getters.suggestionsRequest)
      await flushPromises()

      expect(store.state.queries).toEqual(queriesData)
    })

    it('should handle multiple chunks in one read', async () => {
      resetAiStateWith(store, { query: 'ai test' })

      const queries1: AiSuggestionQuery[] = [{ query: 'query 1', categories: [] }]
      const queries2: AiSuggestionQuery[] = [{ query: 'query 2', categories: [] }]

      const mockReader = createMockReader([
        `data: ${JSON.stringify({ queries: queries1 })}\n\ndata: ${JSON.stringify({ queries: queries2 })}\n\n`,
      ])

      adapter.aiSuggestions.mockResolvedValueOnce({
        body: { getReader: () => mockReader },
        status: 200,
      } as unknown as Response)

      await store.dispatch('fetchAndSaveAiSuggestions', store.getters.suggestionsRequest)
      await flushPromises()

      // Last chunk should win
      expect(store.state.queries).toEqual(queries2)
    })

    it('should set status to success when stream completes', async () => {
      resetAiStateWith(store, { query: 'ai test' })

      const mockReader = createMockReader([])

      adapter.aiSuggestions.mockResolvedValueOnce({
        body: { getReader: () => mockReader },
        status: 200,
      } as unknown as Response)

      await store.dispatch('fetchAndSaveAiSuggestions', store.getters.suggestionsRequest)
      await flushPromises()

      expect(store.state.suggestionsStatus).toBe('success')
    })

    it('should set status to error on error', async () => {
      resetAiStateWith(store, { query: 'ai test' })

      const error = new Error('Network error')
      // @ts-expect-error - Adding code property for test
      error.code = 500
      const mockReader = createMockReader([error])

      adapter.aiSuggestions.mockResolvedValueOnce({
        body: { getReader: () => mockReader },
        status: 200,
      } as unknown as Response)

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await store.dispatch('fetchAndSaveAiSuggestions', store.getters.suggestionsRequest)
      await flushPromises()

      expect(store.state.suggestionsStatus).toBe('error')
      expect(consoleErrorSpy).toHaveBeenCalledWith(error)

      consoleErrorSpy.mockRestore()
    })

    it('should not log abort errors (code 20)', async () => {
      resetAiStateWith(store, { query: 'ai test' })

      const abortError = new Error('Aborted')
      // @ts-expect-error - Adding code property for test
      abortError.code = 20
      const mockReader = createMockReader([abortError])

      adapter.aiSuggestions.mockResolvedValueOnce({
        body: { getReader: () => mockReader },
        status: 200,
      } as unknown as Response)

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await store.dispatch('fetchAndSaveAiSuggestions', store.getters.suggestionsRequest)
      await flushPromises()

      expect(store.state.suggestionsStatus).toBe('error')
      expect(consoleErrorSpy).not.toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })

    it('should return early if status is not 200', async () => {
      resetAiStateWith(store, { query: 'ai test' })

      adapter.aiSuggestions.mockResolvedValueOnce({
        body: null,
        status: 500,
      } as unknown as Response)

      await store.dispatch('fetchAndSaveAiSuggestions', store.getters.suggestionsRequest)
      await flushPromises()

      expect(store.state.suggestionsStatus).toBe('loading')
      expect(store.state.queries).toEqual([])
    })

    it('should return early if response has no body', async () => {
      resetAiStateWith(store, { query: 'ai test' })

      adapter.aiSuggestions.mockResolvedValueOnce({
        body: null,
        status: 200,
      } as unknown as Response)

      await store.dispatch('fetchAndSaveAiSuggestions', store.getters.suggestionsRequest)
      await flushPromises()

      expect(store.state.suggestionsStatus).toBe('loading')
      expect(store.state.queries).toEqual([])
    })

    it('should ignore empty lines and short lines', async () => {
      resetAiStateWith(store, { query: 'ai test' })

      const queriesData: AiSuggestionQuery[] = [{ query: 'test', categories: [] }]

      const mockReader = createMockReader([
        `\n\ndata: ${JSON.stringify({ queries: queriesData })}\n\n\n\n`,
      ])

      adapter.aiSuggestions.mockResolvedValueOnce({
        body: { getReader: () => mockReader },
        status: 200,
      } as unknown as Response)

      await store.dispatch('fetchAndSaveAiSuggestions', store.getters.suggestionsRequest)
      await flushPromises()

      expect(store.state.queries).toEqual(queriesData)
    })

    it('should handle data without "data:" prefix', async () => {
      resetAiStateWith(store, { query: 'ai test' })

      const queriesData: AiSuggestionQuery[] = [{ query: 'test', categories: [] }]

      const mockReader = createMockReader([`${JSON.stringify({ queries: queriesData })}\n\n`])

      adapter.aiSuggestions.mockResolvedValueOnce({
        body: { getReader: () => mockReader },
        status: 200,
      } as unknown as Response)

      await store.dispatch('fetchAndSaveAiSuggestions', store.getters.suggestionsRequest)
      await flushPromises()

      expect(store.state.queries).toEqual(queriesData)
    })
  })
})
