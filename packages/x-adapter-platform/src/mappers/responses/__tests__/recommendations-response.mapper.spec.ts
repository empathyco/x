import type { PlatformRecommendationsResponse } from '../../../types/responses/recommendations-response.model'

import { platformRecommendationsResponse } from '../../../__tests__/__fixtures__/recommendations.response'
import { result } from '../../../__tests__/__fixtures__/result'
import { recommendationsResponseMapper } from '../recommendations-response.mapper'

describe('recommendationsResponseMapper tests', () => {
  it('should map the response', () => {
    const response = platformRecommendationsResponse as unknown as PlatformRecommendationsResponse

    expect(recommendationsResponseMapper(response, {})).toStrictEqual({
      results: [result],
    })
  })
})
