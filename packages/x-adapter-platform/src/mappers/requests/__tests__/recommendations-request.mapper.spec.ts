import { RecommendationsRequest } from '@empathyco/x-types';
import { recommendationsRequestMapper } from '../recommendations-request.mapper';

describe('recommendationsRequestMapper tests', () => {
  it('should map the request', () => {
    const internalRequest: RecommendationsRequest = {
      rows: 2,
      start: 14,
      origin: 'url:external',
      extraParams: {
        instance: 'empathy',
        env: 'test',
        lang: 'en',
        device: 'mobile',
        scope: 'mobile'
      }
    };

    expect(recommendationsRequestMapper(internalRequest, {})).toStrictEqual({
      rows: 2,
      start: 14,
      origin: 'url:external',
      extraParams: {
        instance: 'empathy',
        env: 'test',
        lang: 'en',
        device: 'mobile',
        scope: 'mobile'
      }
    });
  });
});
