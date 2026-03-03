import type { NextQueriesRequest } from '@empathyco/x-types'
import { describe, expect, it } from 'vitest'
import { nextQueriesRequestMapper } from '../next-queries-request.mapper'

describe('nextQueriesRequestMapper tests', () => {
  it('should map the request', () => {
    const internalRequest: NextQueriesRequest = {
      query: 'chips',
      extraParams: {
        instance: 'empathy',
        env: 'test',
        lang: 'en',
        device: 'mobile',
        scope: 'mobile',
      },
    }

    expect(nextQueriesRequestMapper(internalRequest, {})).toStrictEqual({
      query: 'chips',
      extraParams: {
        instance: 'empathy',
        env: 'test',
        lang: 'en',
        device: 'mobile',
        scope: 'mobile',
      },
    })
  })
})
