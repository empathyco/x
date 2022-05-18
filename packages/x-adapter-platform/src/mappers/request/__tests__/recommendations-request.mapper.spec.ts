import { RecommendationsRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { PlatformRecommendationsRequest } from '../../../types/requests/recommendations-request.model';
import { recommendationsRequestMapper } from '../../request/recommendations-request.mapper';

describe('recommendationsRequestMapper tests', () => {
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

  it('should map the request', () => {
    const request: PlatformRecommendationsRequest = {
      rows: 2,
      start: 14,
      origin: 'url:external',
      instance: 'empathy',
      env: 'test',
      lang: 'en',
      device: 'mobile',
      scope: 'mobile'
    };
    expect(recommendationsRequestMapper(internalRequest, {})).toStrictEqual(request);
  });
});
