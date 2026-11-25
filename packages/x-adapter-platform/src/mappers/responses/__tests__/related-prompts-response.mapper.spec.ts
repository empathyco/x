import type { PlatformRelatedPromptsResponse } from '../../../types/responses/related-prompts-response.model'
import { describe, expect, it } from 'vitest'
import { relatedPromptsResponseMapper } from '../related-prompts-response.mapper'

describe('relatedPromptsResponseMapper tests', () => {
  it('should map the response', () => {
    const response = {
      status: 200,
      data: {
        relatedprompts: [
          {
            suggestionText: 'Want to save space in your kitchen?',
            suggestionImageUrl: 'https://image/url.jpg',
            type: 'CURATED',
            nextQueries: ['kitchen'],
            tagging: {
              toolingDisplay: 'https://tagging/display?q=a',
              toolingDisplayClick: 'https://tagging/click?q=a',
              nextQueries: {
                kitchen: {
                  toolingDisplay: 'https://tagging/nq/display?q=b',
                  toolingDisplayClick: 'https://tagging/nq/click?q=b',
                  toolingDisplayAdd2Cart: 'https://tagging/nq/add2cart?q=b',
                },
              },
            },
          },
        ],
      },
    } as unknown as PlatformRelatedPromptsResponse

    const { relatedPrompts } = relatedPromptsResponseMapper(response, {})

    expect(relatedPrompts).toHaveLength(1)
    expect(relatedPrompts[0]).toMatchObject({
      modelName: 'RelatedPrompt',
      suggestionText: 'Want to save space in your kitchen?',
      suggestionImageUrl: 'https://image/url.jpg',
      type: 'CURATED',
      nextQueries: ['kitchen'],
    })
    expect(relatedPrompts[0].relatedPromptNextQueries).toHaveLength(1)
    expect(relatedPrompts[0].relatedPromptNextQueries![0].query).toBe('kitchen')
  })

  it('should map an empty response', () => {
    expect(relatedPromptsResponseMapper({} as PlatformRelatedPromptsResponse, {})).toStrictEqual({})
  })
})
