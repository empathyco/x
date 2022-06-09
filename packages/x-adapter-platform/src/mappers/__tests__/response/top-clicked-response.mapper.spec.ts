import { PlatformTopClickedResponse } from '../../../types/response.types';
import { topClickedResponseMapper } from '../../responses/top-clicked-response.mapper';
// eslint-disable-next-line max-len
import { platformTopClickedResponse } from '../../../__tests__/__fixtures__/platform-top-clicked.response';

describe('top clicked response mapper tests', () => {
  it('should map the top clicked', () => {
    const response: PlatformTopClickedResponse =
      platformTopClickedResponse as unknown as PlatformTopClickedResponse;

    expect(topClickedResponseMapper(response, {})).toStrictEqual({
      results: [
        {
          id: '31335-U',
          identifier: {
            value: '31335-U'
          },
          images: ['https://assets.empathy.co/images-demo/31335.jpg'],
          isWishlisted: false,
          modelName: 'Result',
          name: 'Locomotive Men Washed Blue Jeans',
          price: {
            hasDiscount: false,
            originalValue: 10,
            value: 10
          },
          rating: {
            value: null
          },
          type: 'Default',
          url: 'https://assets.empathy.co/images-demo/31335.jpg'
        }
      ]
    });
  });
});
