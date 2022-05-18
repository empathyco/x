import { PopularSearchesRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { PlatformPopularSearchesRequest } from '../../../types/requests/popular-searches.request.model';
import { popularSearchesRequestMapper } from '../../request/popular-searches.mapper';

describe('popularSearchesRequestMapper tests', () => {
  const internalRequest: PopularSearchesRequest = {
    rows: 2,
    start: 14,
    extraParams: {
      instance: 'empathy',
      env: 'test',
      lang: 'en',
      device: 'mobile',
      scope: 'mobile'
    }
  };

  it('should map the request', () => {
    const request: PlatformPopularSearchesRequest = {
      rows: 2,
      start: 14,
      instance: 'empathy',
      env: 'test',
      lang: 'en',
      device: 'mobile',
      scope: 'mobile'
    };
    expect(popularSearchesRequestMapper(internalRequest, {})).toStrictEqual(request);
  });
});
