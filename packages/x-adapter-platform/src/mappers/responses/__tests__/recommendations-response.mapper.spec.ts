import type { PlatformRecommendationsResponse } from '../../../types/responses/recommendations-response.model'

import { platformRecommendationsResponse } from '../../../__tests__/__fixtures__/recommendations.response'
import { recommendationsResponseMapper } from '../recommendations-response.mapper'

describe('recommendationsResponseMapper tests', () => {
  it('should map the response', () => {
    const response = platformRecommendationsResponse as unknown as PlatformRecommendationsResponse

    expect(recommendationsResponseMapper(response, {})).toStrictEqual({
      results: [
        {
          id: '31335-U',
          identifier: {
            value: '31335-U',
          },
          images: ['https://assets.empathy.co/images-demo/31335.jpg'],
          isWishlisted: false,
          modelName: 'Result',
          name: 'Locomotive Men Washed Blue Jeans',
          price: {
            hasDiscount: false,
            originalValue: 10,
            futureValue: 10,
            value: 10,
          },
          rating: {
            value: null,
          },
          type: 'Default',
          url: 'https://assets.empathy.co/images-demo/31335.jpg',
        },
      ],
    })
  })
})
