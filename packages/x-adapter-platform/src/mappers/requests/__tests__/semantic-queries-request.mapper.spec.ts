import type { SemanticQueriesRequest } from '@empathyco/x-types'
import { describe, expect, it } from 'vitest'
import { semanticQueriesRequestMapper } from '../semantic-queries-request.mapper'

describe('semanticQueriesRequestMapper tests', () => {
  it('should map the request', () => {
    const internalRequest: SemanticQueriesRequest = {
      query: 'test',
      extraParams: {
        instance: 'empathy',
        lang: 'en',
      },
    }

    expect(semanticQueriesRequestMapper(internalRequest, {})).toStrictEqual({
      q: 'test',
      extraParams: {
        instance: 'empathy',
        lang: 'en',
      },
    })
  })
})
