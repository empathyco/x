import type { RelatedPromptsRequest } from '@empathyco/x-types'
import { describe, expect, it } from 'vitest'
import { relatedPromptsRequestMapper } from '../related-prompts-request.mapper'

describe('relatedPromptsRequestMapper tests', () => {
  it('should map the request', () => {
    const request: RelatedPromptsRequest = {
      query: 'chips',
      extraParams: { instance: 'empathy', lang: 'en' },
    }

    expect(relatedPromptsRequestMapper(request, {})).toStrictEqual({
      query: 'chips',
      extraParams: { instance: 'empathy', lang: 'en' },
    })
  })

  it('should not add the properties that the request does not have', () => {
    expect(
      relatedPromptsRequestMapper({ query: 'chips' } as RelatedPromptsRequest, {}),
    ).toStrictEqual({ query: 'chips' })
  })
})
